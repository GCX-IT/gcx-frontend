<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { useBlog } from '../../composables/useBlog'
import { useMedia } from '../../composables/useMedia'
import { slugify, formatDate } from '../../utils/cms'
import { getImageUrl } from '../../utils/imageUrl'
import type { BlogPost, CreatePostRequest } from '../../types/cms'
import ImageGallery from './ImageGallery.vue'
import Editor from '@tinymce/tinymce-vue'

interface Props {
  post?: BlogPost | null
  isEditing?: boolean
}

interface Emits {
  (e: 'save', post: BlogPost): void
  (e: 'cancel'): void
  (e: 'delete', postId: number): void
}

const { t } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  post: null,
  isEditing: false
})

const emit = defineEmits<Emits>()

const { createPost, updatePost, deletePost, isLoading, error } = useBlog()
const { uploadFile, files, fetchFiles } = useMedia()

// Form data
const formData = reactive({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featured_image: '',
  tags: [] as string[],
  status: 'draft' as 'draft' | 'published' | 'private',
  // SEO metadata
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_title: '',
  og_description: '',
  og_image: '',
  canonical_url: '',
  publish_date: '',
  author_notes: ''
})

// UI state
const activeTab = ref('content')
const tagInput = ref('')
const showImageLibrary = ref(false)
const showPreview = ref(false)
const autoSlug = ref(true)
const isUploading = ref(false)
const wordCount = computed(() => {
  const text = formData.content.replace(/<[^>]*>/g, '')
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
})

// TinyMCE editor reference
const editorRef = ref<any>(null)
const editorContent = ref('')
const tinymceApiKey = import.meta.env.VITE_TINYMCE_API_KEY || ''


// Image upload from computer
const imageInput = ref<HTMLInputElement>()
const uploadImageFromComputer = () => {
  imageInput.value?.click()
}

// Handle editor image upload - TinyMCE handles this via images_upload_handler
// This function is kept for compatibility but TinyMCE will use its own handler
const handleEditorImageUpload = async (event: Event) => {
  // TinyMCE handles image uploads via the images_upload_handler in config
  // This is kept for any custom image upload buttons if needed
}

// Smart compression function that maintains quality while reducing size
const smartCompress = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      let { width, height } = img
      
      // Smart sizing based on image dimensions
      let maxWidth = 1200 // Higher quality baseline
      let quality = 0.85 // Start with high quality
      
      // Adjust based on original size
      if (width > 2000 || height > 2000) {
        maxWidth = 1000
        quality = 0.8
      } else if (width > 1500 || height > 1500) {
        maxWidth = 800
        quality = 0.8
      } else if (width <= 800 && height <= 600) {
        maxWidth = width // Don't upscale small images
        quality = 0.9 // Higher quality for small images
      }
      
      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Use high-quality rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Try different quality levels until size is acceptable
      const tryCompress = (currentQuality: number) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            
            // If still too large and quality can be reduced, try again
            if (blob.size > 800 * 1024 && currentQuality > 0.3) { // 800KB threshold
              tryCompress(currentQuality - 0.1)
            } else {
              resolve(compressedFile)
            }
          } else {
            resolve(file)
          }
        }, file.type, currentQuality)
      }
      
      tryCompress(quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}



// Get content from TinyMCE editor
const getEditorContent = () => {
  return editorContent.value || formData.content
}

// Set content in TinyMCE editor
const setEditorContent = (content: string) => {
  editorContent.value = content
  formData.content = content
}

// TinyMCE configuration
const editorConfig = computed(() => {
  const config: any = {
    height: 600,
    menubar: false,
    toolbar_mode: 'sliding',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | removeformat | help | link image | code',
    content_style: isDarkMode.value 
      ? 'body { font-family: Inter, sans-serif; font-size: 16px; background-color: #1e293b; color: #f1f5f9; }'
      : 'body { font-family: Inter, sans-serif; font-size: 16px; background-color: #ffffff; color: #1f2937; }',
    skin: isDarkMode.value ? 'oxide-dark' : 'oxide',
    content_css: isDarkMode.value ? 'dark' : 'default',
    branding: false,
    promotion: false,
    automatic_uploads: true,
    file_picker_types: 'image',
    // Force CDN usage - don't set base_url, let the wrapper handle it with API key
    base_url: undefined,
    suffix: '.min',
    images_upload_handler: async (blobInfo: any, progress: (percent: number) => void) => {
      try {
        isUploading.value = true
        progress(0)
        
        // Convert blob to file
        const file = new File([blobInfo.blob()], blobInfo.filename(), { type: blobInfo.blob().type })
        
        progress(50)
        
        // Upload to server (S3)
        const result = await uploadFile(file)
        if (result.success && result.data) {
          progress(100)
          return result.data.url
        }
        throw new Error('Upload failed')
      } catch (error) {
        console.error('Image upload error:', error)
        throw error
      } finally {
        isUploading.value = false
      }
    },
    setup: (editor: any) => {
      editorRef.value = editor
      editor.on('init', () => {
        console.log('✅ TinyMCE initialized successfully')
        if (formData.content) {
          editor.setContent(formData.content)
          editorContent.value = formData.content
        }
      })
      editor.on('change keyup input', () => {
        editorContent.value = editor.getContent()
        formData.content = editor.getContent()
      })
    },
    init_instance_callback: (editor: any) => {
      console.log('TinyMCE instance ready:', editor)
    }
  }
  
  return config
})

// Watch for dark mode changes and update editor
watch(isDarkMode, () => {
  if (editorRef.value) {
    // TinyMCE will automatically update via the computed config
    editorRef.value.getBody().style.backgroundColor = isDarkMode.value ? '#1e293b' : '#ffffff'
    editorRef.value.getBody().style.color = isDarkMode.value ? '#f1f5f9' : '#1f2937'
  }
})

// Initialize form data


onMounted(async () => {
  // Fetch media files for the library
  try {
    await fetchFiles()
  } catch (error) {
    // Media endpoint might not exist - that's okay, continue
    console.warn('Media files endpoint not available:', error)
  }
  
  if (props.post && props.isEditing) {
    Object.assign(formData, {
      title: props.post.title,
      slug: props.post.slug,
      content: props.post.content,
      excerpt: props.post.excerpt,
      featured_image: props.post.featured_image || '',
      tags: Array.isArray(props.post.tags) ? props.post.tags : [],
      status: props.post.status,
      meta_title: (props.post as any).meta_title || '',
      meta_description: (props.post as any).meta_description || '',
      meta_keywords: (props.post as any).meta_keywords || '',
      og_title: (props.post as any).og_title || '',
      og_description: (props.post as any).og_description || '',
      og_image: (props.post as any).og_image || '',
      canonical_url: (props.post as any).canonical_url || '',
      publish_date: props.post.published_at ? new Date(props.post.published_at).toISOString().slice(0, 16) : '',
      author_notes: (props.post as any).author_notes || ''
    })
    
    // Set content in TinyMCE editor
    editorContent.value = props.post.content
    formData.content = props.post.content
    // Update editor when it's ready (use nextTick to ensure editor is initialized)
    setTimeout(() => {
      if (editorRef.value) {
        editorRef.value.setContent(props.post.content)
      }
    }, 100)
    
    autoSlug.value = false
  }
})

// Auto-generate slug from title
const onTitleChange = () => {
  if (autoSlug.value && formData.title) {
    formData.slug = slugify(formData.title)
  }
  
  // Auto-generate meta title if empty
  if (!formData.meta_title) {
    formData.meta_title = formData.title
  }
}

// Add tag
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    tagInput.value = ''
  }
}

// Remove tag
const removeTag = (index: number) => {
  formData.tags.splice(index, 1)
}

// Handle image selection from ImageGallery
// ImageGallery component handles uploads to S3 automatically via /api/media endpoint
const handleImageSelected = (image: { url: string; id?: string; name?: string }) => {
  formData.featured_image = image.url
  showImageLibrary.value = false
}

// Handle multiple image uploads for library
const handleLibraryImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  try {
    isUploading.value = true
    
    // Upload files one by one
    for (const file of Array.from(files)) {
      // Check file size and type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        continue
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`)
        continue
      }
      
      await uploadFile(file)
    }
    
    // Refresh the files list
    await fetchFiles()
    
  } catch (error) {
    console.error('Failed to upload images:', error)
    alert('Failed to upload some images. Please try again.')
  } finally {
    isUploading.value = false
    // Clear the input
    if (target) target.value = ''
  }
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.warn('Failed to load image:', img.src)
  // You could add a placeholder image here
  // img.src = '/path/to/placeholder.png'
}

// Save post
const savePost = async () => {
  try {
    // Get content from TinyMCE editor - ensure we get the latest content
    if (editorRef.value) {
      const contentFromEditor = editorRef.value.getContent()
      formData.content = contentFromEditor || formData.content
      editorContent.value = contentFromEditor
    } else if (editorContent.value) {
      formData.content = editorContent.value
    }
    
    // Ensure we have content before saving
    if (!formData.content || formData.content.trim() === '') {
      alert('Please add some content to your post before saving.')
      return
    }
    
    // Auto-generate excerpt if empty
    if (!formData.excerpt && formData.content) {
      const textContent = formData.content.replace(/<[^>]*>/g, ' ').trim()
      formData.excerpt = textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '')
    }

    const postData: CreatePostRequest = {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      featured_image: formData.featured_image || undefined,
      tags: formData.tags,
      status: formData.status
    }

    let result
    if (props.isEditing && props.post) {
      result = await updatePost(props.post.id, { ...postData, id: props.post.id })
    } else {
      result = await createPost(postData)
    }

    if (result.success && result.data) {
      emit('save', result.data)
    } else if (result.error) {
      alert(`Failed to save post: ${result.error}`)
    }
  } catch (err: any) {
    console.error('Failed to save post:', err)
    alert(`Failed to save post: ${err.message || 'Unknown error'}`)
  }
}

// Delete post
const handleDelete = async () => {
  if (!props.post || !confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
    return
  }

  try {
    const result = await deletePost(props.post.id)
    if (result.success) {
      emit('delete', props.post.id)
    }
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

// Preview post
const previewPost = () => {
  // Auto-generate excerpt if empty for preview
  if (!formData.excerpt && formData.content) {
    const textContent = formData.content.replace(/<[^>]*>/g, ' ').trim()
    formData.excerpt = textContent.substring(0, 160) + (textContent.length > 160 ? '...' : '')
  }
  showPreview.value = true
}
</script>

<template>
  <div class="min-h-screen bg-gray-50" :class="{ 'dark bg-slate-900': isDarkMode }">
    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200 shadow-lg" :class="{ 'dark:bg-slate-800 dark:border-slate-700': isDarkMode }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-8">
          <div>
            <h1 class="text-4xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ isEditing ? 'Edit Post' : 'Create New Post' }}
            </h1>
            <p class="mt-3 text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              {{ isEditing ? 'Update your blog post' : 'Create a new blog post for your website' }}
            </p>
          </div>
          
          <div class="flex space-x-4">
            <button
              @click="emit('cancel')"
              class="px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              :class="isDarkMode 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-md'"
            >
              Cancel
            </button>
            
            <button
              @click="previewPost"
              class="px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              :class="isDarkMode 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 shadow-md'"
            >
              Preview
            </button>
            
            <button
              v-if="isEditing"
              @click="handleDelete"
              class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Delete
            </button>
            
            <button
              @click="savePost"
              :disabled="isLoading || !formData.title"
              class="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            >
              {{ isLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Save Post' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-2 p-2 rounded-2xl shadow-md" :class="isDarkMode ? 'bg-slate-800' : 'bg-gray-100'">
        <button
          @click="activeTab = 'content'"
          class="py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
          :class="activeTab === 'content'
            ? (isDarkMode ? 'bg-slate-700 text-green-400 shadow-lg' : 'bg-white text-green-600 shadow-lg')
            : (isDarkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200')"
        >
          Content
        </button>
        <button
          @click="activeTab = 'seo'"
          class="py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
          :class="activeTab === 'seo'
            ? (isDarkMode ? 'bg-slate-700 text-green-400 shadow-lg' : 'bg-white text-green-600 shadow-lg')
            : (isDarkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200')"
        >
          SEO & Meta
        </button>
        <button
          @click="activeTab = 'settings'"
          class="py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105"
          :class="activeTab === 'settings'
            ? (isDarkMode ? 'bg-slate-700 text-green-400 shadow-lg' : 'bg-white text-green-600 shadow-lg')
            : (isDarkMode ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200')"
        >
          Settings
        </button>
      </nav>
    </div>

    <!-- Content Tab -->
    <div v-if="activeTab === 'content'" class="rounded-2xl shadow-xl p-8 space-y-8 border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      <!-- Title & Slug Section -->
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Post Details
          </h3>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label class="block text-base font-semibold mb-3" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Post Title *
            </label>
            <input
              v-model="formData.title"
              @input="onTitleChange"
              type="text"
              required
              class="w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 shadow-sm"
              :class="isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 hover:border-slate-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400 hover:shadow-md'"
              placeholder="Enter post title"
            />
          </div>
          
          <div>
            <label class="block text-base font-semibold mb-3" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              URL Slug
              <button
                @click="autoSlug = !autoSlug"
                class="ml-3 text-sm px-3 py-1 rounded-lg transition-colors shadow-sm"
                :class="autoSlug 
                  ? (isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800 border border-green-200') 
                  : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600 border border-gray-200')"
              >
                {{ autoSlug ? 'Auto' : 'Manual' }}
              </button>
            </label>
            <input
              v-model="formData.slug"
              type="text"
              :disabled="autoSlug"
              class="w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 shadow-sm"
              :class="[
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 hover:border-slate-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400 hover:shadow-md',
                autoSlug ? 'opacity-50 cursor-not-allowed' : ''
              ]"
              placeholder="post-url-slug"
            />
            <p class="mt-3 text-base font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              URL: <span class="text-green-600 font-semibold">/blog/{{ formData.slug || 'post-slug' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Featured Image Section -->
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Featured Image
          </h3>
        </div>
        
        <div v-if="formData.featured_image" class="mb-4">
          <div class="relative w-48 h-32 rounded-lg overflow-hidden border" :class="isDarkMode ? 'border-slate-600' : 'border-slate-200'">
            <img :src="formData.featured_image" alt="Featured image" class="w-full h-full object-cover" />
            <button
              @click="formData.featured_image = ''"
              class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              title="Remove featured image"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Button to open Image Gallery -->
        <button
          @click="showImageLibrary = true"
          class="px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2"
          :class="isDarkMode 
            ? 'border-slate-600 hover:bg-slate-700 text-white' 
            : 'border-slate-300 hover:bg-slate-50 text-slate-700'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formData.featured_image ? 'Change Featured Image' : 'Choose Featured Image' }}</span>
        </button>
      </div>

      <!-- Content Editor -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Content *
          <span class="ml-2 text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ wordCount }} words
          </span>
        </label>
        
        <!-- TinyMCE Editor -->
        <div class="border-2 rounded-xl overflow-hidden shadow-lg" :class="isDarkMode ? 'border-slate-600' : 'border-gray-300'">
          <Editor
            v-model="editorContent"
            :init="editorConfig"
            :key="`editor-${isDarkMode ? 'dark' : 'light'}-${activeTab}`"
            :disabled="false"
            :api-key="tinymceApiKey"
          />
        </div>
      </div>

      <!-- Excerpt -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Excerpt
          <span class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            (Auto-generated if empty)
          </span>
        </label>
        <textarea
          v-model="formData.excerpt"
          rows="3"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          :class="isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-white' 
            : 'bg-white border-slate-300 text-slate-900'"
          placeholder="Brief description of the post (max 160 characters recommended)"
        ></textarea>
        <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
          {{ formData.excerpt.length }}/160 characters
        </p>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Tags
        </label>
        
        <div class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="(tag, index) in formData.tags"
            :key="index"
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
          >
            {{ tag }}
            <button
              @click="removeTag(index)"
              class="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            >
              ×
            </button>
          </span>
        </div>
        
        <div class="flex">
          <input
            v-model="tagInput"
            type="text"
            class="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
            placeholder="Add a tag"
            @keypress.enter.prevent="addTag"
          />
          <button
            @click="addTag"
            class="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- SEO Tab -->
    <div v-if="activeTab === 'seo'" class="rounded-2xl shadow-xl p-8 space-y-8 border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Meta Title -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Meta Title
          </label>
          <input
            v-model="formData.meta_title"
            type="text"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
            placeholder="SEO title for search engines"
          />
          <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ formData.meta_title.length }}/60 characters
          </p>
        </div>

        <!-- Meta Keywords -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Meta Keywords
          </label>
          <input
            v-model="formData.meta_keywords"
            type="text"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
      </div>

      <!-- Meta Description -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Meta Description
        </label>
        <textarea
          v-model="formData.meta_description"
          rows="3"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          :class="isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-white' 
            : 'bg-white border-slate-300 text-slate-900'"
          placeholder="Meta description for search engines"
        ></textarea>
        <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
          {{ formData.meta_description.length }}/160 characters
        </p>
      </div>

      <!-- Open Graph -->
      <div class="border-t pt-6" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
        <h3 class="text-lg font-medium mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Open Graph (Social Media)
        </h3>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              OG Title
            </label>
            <input
              v-model="formData.og_title"
              type="text"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'"
              placeholder="Title for social media sharing"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              OG Image URL
            </label>
            <input
              v-model="formData.og_image"
              type="text"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              :class="isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-slate-300 text-slate-900'"
              placeholder="Image URL for social media"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            OG Description
          </label>
          <textarea
            v-model="formData.og_description"
            rows="2"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
            placeholder="Description for social media sharing"
          ></textarea>
        </div>
      </div>

      <!-- Canonical URL -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Canonical URL
        </label>
        <input
          v-model="formData.canonical_url"
          type="url"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          :class="isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-white' 
            : 'bg-white border-slate-300 text-slate-900'"
          placeholder="https://gcx.com.gh/blog/your-post-slug"
        />
      </div>
    </div>

    <!-- Settings Tab -->
    <div v-if="activeTab === 'settings'" class="rounded-2xl shadow-xl p-8 space-y-8 border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Publication Status -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Publication Status
          </label>
          <select
            v-model="formData.status"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
          </select>
          <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Draft: Only visible to authors • Published: Live on website • Private: Only visible to you
          </p>
        </div>

        <!-- Publish Date -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Publish Date
          </label>
          <input
            v-model="formData.publish_date"
            type="datetime-local"
            class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'"
          />
          <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Leave empty for immediate publishing
          </p>
        </div>
      </div>

      <!-- Author Notes -->
      <div>
        <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Author Notes
          <span class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            (Internal notes, not visible to readers)
          </span>
        </label>
        <textarea
          v-model="formData.author_notes"
          rows="3"
          class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          :class="isDarkMode 
            ? 'bg-slate-700 border-slate-600 text-white' 
            : 'bg-white border-slate-300 text-slate-900'"
          placeholder="Internal notes about this post..."
        ></textarea>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border transform hover:scale-[1.01] transition-all duration-300" 
           :class="isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-gray-200'">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              Preview Post
            </h3>
            <button
              @click="showPreview = false"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Preview Content -->
          <div class="space-y-6">
            <!-- Featured Image -->
            <div v-if="formData.featured_image" class="w-full h-64 rounded-lg overflow-hidden">
              <img :src="formData.featured_image" :alt="formData.title" class="w-full h-full object-cover" />
            </div>
            
            <!-- Title -->
            <h1 class="text-3xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ formData.title || 'Untitled Post' }}
            </h1>
            
            <!-- Meta Info -->
            <div class="flex items-center space-x-4 text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              <span>{{ new Date().toLocaleDateString() }}</span>
              <span>•</span>
              <span>{{ wordCount }} words</span>
              <span>•</span>
              <span class="px-2 py-1 rounded text-xs font-medium" 
                    :class="formData.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ formData.status.charAt(0).toUpperCase() + formData.status.slice(1) }}
              </span>
            </div>
            
            <!-- Excerpt -->
            <div v-if="formData.excerpt" class="text-lg italic" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              {{ formData.excerpt }}
            </div>
            
            <!-- Content -->
            <div class="prose max-w-none" :class="isDarkMode ? 'prose-invert' : ''" v-html="formData.content"></div>
            
            <!-- Tags -->
            <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2">
              <span
                v-for="tag in formData.tags"
                :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Image Library Modal -->
    <div v-if="showImageLibrary" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="rounded-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border transform transition-all duration-300" 
           :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Select Featured Image
            </h3>
            <button
              @click="showImageLibrary = false"
              class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Image Gallery Component -->
          <ImageGallery
            title="Select or Upload Featured Image"
            :current-image="formData.featured_image"
            folder="cms"
            @image-selected="handleImageSelected"
          />
        </div>
      </div>
    </div>

    <!-- Hidden file input for editor image upload -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      @change="handleEditorImageUpload"
      class="hidden"
    />
    </div>
  </div>
</template>

<style scoped>
/* TinyMCE editor styling */
:deep(.tox-tinymce) {
  border-radius: 0.5rem;
}

:deep(.tox .tox-edit-area__iframe) {
  background-color: transparent !important;
}

/* Dark mode support for TinyMCE */
.dark :deep(.tox-tinymce) {
  border-color: #475569;
}

.dark :deep(.tox .tox-toolbar),
.dark :deep(.tox .tox-toolbar__overflow),
.dark :deep(.tox .tox-toolbar__primary) {
  background-color: #1e293b;
  border-color: #475569;
}

.dark :deep(.tox .tox-edit-area__iframe) {
  background-color: #1e293b;
}

/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Enhanced hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Smooth transitions for all interactive elements */
button, input, textarea, select {
  transition: all 0.2s ease-in-out;
}

/* Better focus states */
input:focus, textarea:focus, select:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
}

/* Loading state animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

</style>
