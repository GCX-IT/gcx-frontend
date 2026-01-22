<template>
  <div class="page-content-editor">
    <!-- Header -->
    <div class="editor-header bg-white border-b border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
          <p class="text-gray-600">Edit text and images for this page</p>
        </div>
        <div class="flex items-center gap-4">
          <button @click="previewMode = !previewMode" class="btn-secondary">
            <i class="pi pi-eye"></i> {{ previewMode ? 'Edit Mode' : 'Preview Mode' }}
          </button>
          <button @click="saveContent" :disabled="saving" class="btn-success">
            <i class="pi pi-save"></i> {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="editor-content flex h-screen">
      <!-- Sidebar - Content Sections -->
      <div class="editor-sidebar w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h3 class="font-semibold mb-4">Page Sections</h3>
          
          <!-- Section List -->
          <div class="space-y-2">
            <div 
              v-for="(section, index) in pageSections" 
              :key="section.id"
              class="section-item cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              :class="{ 'border-blue-500 bg-blue-50': activeSection === section.id }"
              @click="activeSection = section.id"
            >
              <div class="flex items-center gap-2">
                <i :class="section.icon" class="text-gray-600"></i>
                <span class="font-medium text-sm">{{ section.name }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ section.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Editor Area -->
      <div class="editor-main flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-6">
          
          <!-- Preview Mode -->
          <div v-if="previewMode" class="preview-mode">
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 class="text-lg font-semibold text-blue-900 mb-2">Preview Mode</h3>
              <p class="text-blue-700">This is how your content will look on the website:</p>
            </div>
            
            <!-- Hero Section Preview -->
            <div v-if="currentSection?.id === 'hero'" class="preview-section">
              <div class="relative min-h-[300px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden mb-4">
                <img 
                  v-if="pageContent.hero_image"
                  :src="pageContent.hero_image" 
                  :alt="pageContent.hero_title"
                  class="w-full h-full object-cover opacity-60"
                />
                <div class="absolute inset-0 bg-black bg-opacity-40"></div>
                <div class="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div>
                    <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ pageContent.hero_title || 'Your Hero Title' }}</h1>
                    <p class="text-lg mb-6">{{ pageContent.hero_subtitle || 'Your hero subtitle' }}</p>
                    <button v-if="pageContent.hero_button_text" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
                      {{ pageContent.hero_button_text }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- About Section Preview -->
            <div v-else-if="currentSection?.id === 'about'" class="preview-section">
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-4">{{ pageContent.about_title || 'About Title' }}</h2>
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-gray-700 mb-4">{{ pageContent.about_description || 'About description...' }}</p>
                    <div class="space-y-4">
                      <div>
                        <h3 class="font-semibold text-lg">{{ pageContent.mission_title || 'Mission Title' }}</h3>
                        <p class="text-gray-600">{{ pageContent.mission_description || 'Mission description...' }}</p>
                      </div>
                      <div>
                        <h3 class="font-semibold text-lg">{{ pageContent.vision_title || 'Vision Title' }}</h3>
                        <p class="text-gray-600">{{ pageContent.vision_description || 'Vision description...' }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="pageContent.about_image">
                    <img :src="pageContent.about_image" :alt="pageContent.about_title" class="w-full h-64 object-cover rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Team Section Preview -->
            <div v-else-if="currentSection?.id === 'team'" class="preview-section">
              <div class="bg-white border border-gray-200 rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-6">{{ pageContent.team_title || 'Our Team' }}</h2>
                <div class="flex items-center gap-6">
                  <div v-if="pageContent.ceo_image" class="flex-shrink-0">
                    <img :src="pageContent.ceo_image" :alt="pageContent.ceo_name" class="w-24 h-24 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold">{{ pageContent.ceo_name || 'CEO Name' }}</h3>
                    <p class="text-gray-600 mb-2">{{ pageContent.ceo_title || 'CEO Title' }}</p>
                    <p class="text-gray-700">{{ pageContent.ceo_bio || 'CEO biography...' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div v-else>
          <!-- Section Editor -->
          <div v-if="currentSection" class="section-editor">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900 mb-2">{{ currentSection.name }}</h2>
              <p class="text-gray-600">{{ currentSection.description }}</p>
            </div>

            <!-- Text Fields -->
            <div v-if="currentSection.fields" class="space-y-6">
              <div v-for="field in currentSection.fields" :key="field.key" class="field-editor">
                <!-- Text Field -->
                <div v-if="field.type === 'text'" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                  </label>
                  <input 
                    v-model="pageContent[field.key]"
                    type="text" 
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="field.placeholder"
                  />
                </div>

                <!-- Textarea Field -->
                <div v-else-if="field.type === 'textarea'" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                  </label>
                  <textarea 
                    v-model="pageContent[field.key]"
                    :rows="field.rows || 4"
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="field.placeholder"
                  ></textarea>
                </div>

                <!-- Rich Text Field -->
                <div v-else-if="field.type === 'richtext'" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                  </label>
                  <div class="border border-gray-300 rounded-md">
                    <div class="rich-text-toolbar p-2 border-b border-gray-200 bg-gray-50 flex gap-1">
                      <button @click="formatText(field.key, 'bold')" class="toolbar-btn" title="Bold">
                        <i class="pi pi-bold"></i>
                      </button>
                      <button @click="formatText(field.key, 'italic')" class="toolbar-btn" title="Italic">
                        <i class="pi pi-italic"></i>
                      </button>
                      <button @click="formatText(field.key, 'underline')" class="toolbar-btn" title="Underline">
                        <i class="pi pi-underline"></i>
                      </button>
                    </div>
                    <textarea 
                      v-model="pageContent[field.key]"
                      :rows="field.rows || 6"
                      class="w-full p-3 border-0 focus:ring-0 resize-none"
                      :placeholder="field.placeholder"
                    ></textarea>
                  </div>
                </div>

                <!-- Image Field -->
                <div v-else-if="field.type === 'image'" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                  </label>
                  
                  <!-- Image Preview -->
                  <div v-if="pageContent[field.key]" class="image-preview mb-3">
                    <img 
                      :src="pageContent[field.key]" 
                      :alt="field.label"
                      class="max-w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  <!-- No Image State -->
                  <div v-else class="no-image-placeholder mb-3">
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <i class="pi pi-image text-2xl text-gray-400 mb-2"></i>
                      <p class="text-gray-500 text-sm">No image selected</p>
                    </div>
                  </div>
                  
                  <div class="flex gap-2">
                    <button @click="openMediaLibrary(field.key)" class="btn-primary">
                      <i class="pi pi-image"></i> Choose Image
                    </button>
                    <button 
                      v-if="pageContent[field.key]"
                      @click="pageContent[field.key] = ''" 
                      class="btn-secondary"
                    >
                      <i class="pi pi-times"></i> Remove
                    </button>
                  </div>
                </div>

                <!-- Multiple Images Field -->
                <div v-else-if="field.type === 'images'" class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ field.label }}
                  </label>
                  
                  <!-- Images Grid -->
                  <div v-if="pageContent[field.key] && pageContent[field.key].length > 0" class="images-grid mb-3">
                    <div class="grid grid-cols-3 gap-3">
                      <div 
                        v-for="(image, index) in pageContent[field.key]" 
                        :key="index"
                        class="relative group"
                      >
                        <img 
                          :src="image" 
                          :alt="`${field.label} ${index + 1}`"
                          class="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button 
                          @click="removeImage(field.key, index)"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <i class="pi pi-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button @click="openMediaLibrary(field.key, true)" class="btn-primary">
                    <i class="pi pi-plus"></i> Add Images
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Section Selected -->
          <div v-else class="text-center py-12 text-gray-500">
            <i class="pi pi-file-edit text-4xl mb-4"></i>
            <p class="text-lg">Select a section to edit</p>
            <p class="text-sm">Choose a section from the sidebar to start editing</p>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Library Modal -->
    <MediaLibraryModal 
      v-if="showMediaLibrary"
      @close="showMediaLibrary = false"
      @select="selectImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiFetch } from '@/utils/api'
import MediaLibraryModal from './MediaLibraryModal.vue'

const route = useRoute()

// State
const previewMode = ref(false)
const saving = ref(false)
const activeSection = ref('')
const showMediaLibrary = ref(false)
const currentImageField = ref('')
const isMultipleImages = ref(false)

// Page Content
const pageContent = reactive<Record<string, any>>({})

// Page Configuration
const pageTitle = ref('Page Content Editor')
const pageSections = ref([
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Main banner and introduction',
    icon: 'pi pi-star',
    fields: [
      { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'Enter hero title' },
      { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Enter hero subtitle' },
      { key: 'hero_image', label: 'Hero Background Image', type: 'image' },
      { key: 'hero_button_text', label: 'Button Text', type: 'text', placeholder: 'Get Started' },
      { key: 'hero_button_link', label: 'Button Link', type: 'text', placeholder: '/contact' }
    ]
  },
  {
    id: 'about',
    name: 'About Section',
    description: 'About us content',
    icon: 'pi pi-info-circle',
    fields: [
      { key: 'about_title', label: 'About Title', type: 'text', placeholder: 'About GCX' },
      { key: 'about_description', label: 'About Description', type: 'richtext', placeholder: 'Enter about description' },
      { key: 'about_image', label: 'About Image', type: 'image' },
      { key: 'mission_title', label: 'Mission Title', type: 'text', placeholder: 'Our Mission' },
      { key: 'mission_description', label: 'Mission Description', type: 'textarea', placeholder: 'Enter mission description' },
      { key: 'vision_title', label: 'Vision Title', type: 'text', placeholder: 'Our Vision' },
      { key: 'vision_description', label: 'Vision Description', type: 'textarea', placeholder: 'Enter vision description' }
    ]
  },
  {
    id: 'services',
    name: 'Services Section',
    description: 'Services and features',
    icon: 'pi pi-cog',
    fields: [
      { key: 'services_title', label: 'Services Title', type: 'text', placeholder: 'Our Services' },
      { key: 'services_subtitle', label: 'Services Subtitle', type: 'textarea', placeholder: 'Enter services subtitle' },
      { key: 'service_1_title', label: 'Service 1 Title', type: 'text', placeholder: 'Service 1' },
      { key: 'service_1_description', label: 'Service 1 Description', type: 'textarea', placeholder: 'Service 1 description' },
      { key: 'service_1_image', label: 'Service 1 Image', type: 'image' },
      { key: 'service_2_title', label: 'Service 2 Title', type: 'text', placeholder: 'Service 2' },
      { key: 'service_2_description', label: 'Service 2 Description', type: 'textarea', placeholder: 'Service 2 description' },
      { key: 'service_2_image', label: 'Service 2 Image', type: 'image' }
    ]
  },
  {
    id: 'team',
    name: 'Team Section',
    description: 'Team members and leadership',
    icon: 'pi pi-users',
    fields: [
      { key: 'team_title', label: 'Team Title', type: 'text', placeholder: 'Our Team' },
      { key: 'ceo_name', label: 'CEO Name', type: 'text', placeholder: 'CEO Name' },
      { key: 'ceo_title', label: 'CEO Title', type: 'text', placeholder: 'Chief Executive Officer' },
      { key: 'ceo_image', label: 'CEO Image', type: 'image' },
      { key: 'ceo_bio', label: 'CEO Bio', type: 'textarea', placeholder: 'CEO biography' }
    ]
  }
])

// Computed
const currentSection = computed(() => {
  return pageSections.value.find(section => section.id === activeSection.value)
})

// Methods
const openMediaLibrary = (fieldKey: string, multiple = false) => {
  currentImageField.value = fieldKey
  isMultipleImages.value = multiple
  showMediaLibrary.value = true
}

const selectImage = (image: any) => {
  if (isMultipleImages.value) {
    if (!pageContent[currentImageField.value]) {
      pageContent[currentImageField.value] = []
    }
    pageContent[currentImageField.value].push(image.url)
  } else {
    pageContent[currentImageField.value] = image.url
  }
  showMediaLibrary.value = false
}

const removeImage = (fieldKey: string, index: number) => {
  if (pageContent[fieldKey] && Array.isArray(pageContent[fieldKey])) {
    pageContent[fieldKey].splice(index, 1)
  }
}

const formatText = (fieldKey: string, format: string) => {
  // Simple text formatting (in a real app, you'd use a proper rich text editor)
  const textarea = document.querySelector(`textarea`) as HTMLTextAreaElement
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  if (selectedText) {
    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
    }
    
    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
    pageContent[fieldKey] = newContent
  }
}

const saveContent = async () => {
  saving.value = true
  try {
    const pageId = route.params.id || 'about' // Default to about page
    
    const response = await apiFetch(`/api/settings/${pageId}_content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      },
      body: JSON.stringify({
        key: `${pageId}_content`,
        value: JSON.stringify(pageContent),
        type: 'json',
        group: 'page_content',
        label: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page Content`,
        description: `Content for ${pageId} page`,
        is_public: true,
        sort_order: 0
      })
    })
    
    if (!response.ok) {
      // Try to create if it doesn't exist
      const createResponse = await apiFetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({
          key: `${pageId}_content`,
          value: JSON.stringify(pageContent),
          type: 'json',
          group: 'page_content',
          label: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page Content`,
          description: `Content for ${pageId} page`,
          is_public: true,
          sort_order: 0
        })
      })
      
      if (!createResponse.ok) {
        throw new Error('Failed to save content')
      }
    }
    
    console.log('✅ Page content saved successfully')
    alert('Content saved successfully!')
  } catch (error) {
    console.error('❌ Failed to save content:', error)
    alert('Failed to save content. Please try again.')
  } finally {
    saving.value = false
  }
}

const loadContent = async () => {
  const pageId = route.params.id || 'about'
  pageTitle.value = `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page Editor`
  
  try {
    const response = await apiFetch(`/api/settings/${pageId}_content`)
    if (response.ok) {
      const result = await response.json()
      if (result.setting && result.setting.value) {
        const content = JSON.parse(result.setting.value)
        Object.assign(pageContent, content)
      }
    }
  } catch (error) {
    console.log('No existing content found, loading default content')
    loadDefaultContent()
  }
  
  // Set first section as active
  if (pageSections.value.length > 0) {
    activeSection.value = pageSections.value[0].id
  }
}

// Load default content based on page type
const loadDefaultContent = () => {
  const pageId = route.params.id || 'about'
  const defaultContent = getDefaultContentForPage(pageId)
  Object.assign(pageContent, defaultContent)
}

// Get default content for different pages
const getDefaultContentForPage = (pageId: string) => {
  const defaults = {
    about: {
      hero_title: 'What is GCX',
      hero_subtitle: 'A regulated market that links buyers and sellers of commodities to trade by Rules, while we assure the market quantity and quality, timely delivery and settlement.',
      hero_image: '/trading dashboard.jpg',
      hero_button_text: 'Explore Platform',
      hero_button_link: '/services',
      about_title: 'About GCX',
      about_description: 'The Ghana Commodity Exchange is a private company limited by shares, structured as a Public-Private Partnership, with the Government of Ghana currently the sole shareholder. The Exchange aims to establish linkages between agricultural and commodity producers and buyers, secure competitive prices for their products, assure the market quantity and quality, and settle trade promptly.',
      about_image: '/crop.jpg',
      mission_title: 'Our Mission',
      mission_description: 'To link Ghanaian smallholder farmers to agricultural and financial markets in Ghana and across the West Africa Region to ensure Ghana farmers secure competitive prices for their commodities.',
      vision_title: 'Our Vision',
      vision_description: 'To be the leading commodity exchange in West Africa, providing transparent and efficient trading platforms for agricultural commodities.',
      ceo_name: 'Mr. Robert Dowuona Owoo',
      ceo_title: 'Acting Chief Executive Officer',
      ceo_image: '/Mr. Robert Dowuona Owoo.jpeg',
      ceo_bio: 'Ghana Commodity Exchange\'s Management team is led by Mr. Robert Dowuona Owoo, the Acting Chief Executive Officer.'
    },
    services: {
      hero_title: 'Our Services',
      hero_subtitle: 'Comprehensive trading solutions for agricultural commodities',
      hero_image: '/trading.jpg',
      services_title: 'Our Core Services',
      services_subtitle: 'Ghana Commodity Exchange provides comprehensive trading solutions for agricultural commodities',
      service_1_title: 'Regulated Trading',
      service_1_description: 'National and regional market linking buyers and sellers under established rules with transparent pricing and secure settlement.',
      service_1_image: '/trading.jpg',
      service_2_title: 'Price Discovery',
      service_2_description: 'Transparent price discovery mechanism ensuring competitive pricing for commodities through real-time market data.',
      service_2_image: '/marketdatainfo.jpg'
    }
  }
  return defaults[pageId] || {}
}

// Lifecycle
onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.page-content-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-content {
  flex: 1;
  overflow: hidden;
}

.section-item {
  transition: all 0.2s ease;
}

.section-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field-editor {
  @apply bg-white p-4 rounded-lg border border-gray-200;
}

.toolbar-btn {
  @apply w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors;
}

.rich-text-toolbar {
  @apply flex gap-1;
}
</style>
