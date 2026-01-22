<template>
  <div class="image-manager">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        Image Manager
      </h2>
      <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
        Manage and organize your website images
      </p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-slate-200 dark:border-slate-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
          ]"
        >
          <i :class="tab.icon" class="mr-2"></i>
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Gallery Tab -->
    <div v-if="activeTab === 'gallery'" class="space-y-6">
      <ImageGallery
        title="All Images"
        :current-image="selectedImageUrl"
        @image-selected="handleImageSelected"
        @image-uploaded="handleImageUploaded"
      />
    </div>

    <!-- Upload Tab -->
    <div v-if="activeTab === 'upload'" class="space-y-6">
      <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Bulk Upload Images
        </h3>
        
        <!-- Upload Area -->
        <div
          @drop="handleBulkDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
          :class="[
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-600',
            isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
          ]"
        >
          <input
            ref="bulkFileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleBulkFileSelect"
            class="hidden"
          />
          
          <div class="space-y-4">
            <i class="pi pi-cloud-upload text-4xl" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"></i>
            <div>
              <p class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Drop multiple images here or click to browse
              </p>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                Supports JPG, PNG, GIF, WebP (Max 10MB each)
              </p>
            </div>
            <button
              @click="$refs.bulkFileInput.click()"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Choose Multiple Files
            </button>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="bulkUploading" class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Uploading {{ currentUploadIndex + 1 }} of {{ totalUploads }}
            </span>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
              {{ Math.round(bulkUploadProgress) }}%
            </span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: bulkUploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Upload Results -->
        <div v-if="uploadResults.length > 0" class="mt-6">
          <h4 class="text-sm font-medium mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Upload Results
          </h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="result in uploadResults"
              :key="result.filename"
              class="flex items-center justify-between p-2 rounded"
              :class="result.success ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'"
            >
              <div class="flex items-center space-x-2">
                <i :class="result.success ? 'pi pi-check text-green-600' : 'pi pi-times text-red-600'"></i>
                <span class="text-sm" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ result.filename }}
                </span>
              </div>
              <span class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                {{ result.success ? 'Success' : result.error }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Organize Tab -->
    <div v-if="activeTab === 'organize'" class="space-y-6">
      <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Organize Images
        </h3>
        
        <!-- Folder Management -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="folder in folders"
            :key="folder.name"
            class="p-4 border rounded-lg cursor-pointer transition-colors"
            :class="[
              selectedFolder === folder.name
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
              isDarkMode ? 'bg-slate-700' : 'bg-white'
            ]"
            @click="selectedFolder = folder.name"
          >
            <div class="flex items-center space-x-3">
              <i class="pi pi-folder text-2xl" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"></i>
              <div>
                <p class="font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ folder.name }}
                </p>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ folder.count }} images
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Folder Images -->
        <div v-if="selectedFolder" class="mt-6">
          <h4 class="text-sm font-medium mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Images in {{ selectedFolder }}
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div
              v-for="image in getFolderImages(selectedFolder)"
              :key="image.id"
              class="relative group cursor-pointer rounded-lg overflow-hidden border"
              :class="isDarkMode ? 'border-slate-600' : 'border-slate-200'"
            >
              <img
                :src="image.url"
                :alt="image.alt"
                class="w-full h-20 object-cover"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="deleteImage(image)"
                    class="p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import ImageGallery from './ImageGallery.vue'
import axios from '../../plugins/axios'

interface ImageItem {
  id: string
  url: string
  name: string
  alt?: string
  size?: number
  type?: string
  folder?: string
}

interface UploadResult {
  filename: string
  success: boolean
  error?: string
}

interface Folder {
  name: string
  count: number
}

// State
const activeTab = ref('gallery')
const selectedImageUrl = ref('')
const isDragOver = ref(false)
const bulkUploading = ref(false)
const currentUploadIndex = ref(0)
const totalUploads = ref(0)
const bulkUploadProgress = ref(0)
const uploadResults = ref<UploadResult[]>([])
const selectedFolder = ref('')
const folders = ref<Folder[]>([
  { name: 'images', count: 0 },
  { name: 'Functional Heads', count: 0 },
  { name: 'Board of directors', count: 0 },
  { name: 'Donors', count: 0 },
  { name: 'Partners', count: 0 },
  { name: 'Service', count: 0 },
  { name: 'hero section', count: 0 }
])
const allImages = ref<ImageItem[]>([])

// Computed
const tabs = [
  { id: 'gallery', name: 'Gallery', icon: 'pi pi-images' },
  { id: 'upload', name: 'Upload', icon: 'pi pi-upload' },
  { id: 'organize', name: 'Organize', icon: 'pi pi-folder' }
]

// Methods
const handleImageSelected = (image: ImageItem) => {
  selectedImageUrl.value = image.url
}

const handleImageUploaded = (image: ImageItem) => {
  allImages.value.unshift(image)
  updateFolderCounts()
}

const handleBulkFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    uploadBulkFiles(Array.from(files))
  }
}

const handleBulkDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadBulkFiles(Array.from(files))
  }
}

const uploadBulkFiles = async (files: File[]) => {
  if (files.length === 0) return
  
  bulkUploading.value = true
  uploadResults.value = []
  currentUploadIndex.value = 0
  totalUploads.value = files.length
  bulkUploadProgress.value = 0
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      currentUploadIndex.value = i
      
      try {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Not an image file')
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error('File too large (max 10MB)')
        }
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'images')
        
        const response = await axios.post('/api/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (response.data.success) {
          const newImage: ImageItem = {
            id: response.data.data.id,
            url: response.data.data.url,
            name: response.data.data.filename,
            alt: response.data.data.alt_text,
            size: response.data.data.size,
            type: response.data.data.mime_type,
            folder: 'images'
          }
          
          allImages.value.unshift(newImage)
          
          uploadResults.value.push({
            filename: file.name,
            success: true
          })
        } else {
          throw new Error(response.data.error || 'Upload failed')
        }
      } catch (error: any) {
        uploadResults.value.push({
          filename: file.name,
          success: false,
          error: error.message || 'Upload failed'
        })
      }
      
      // Update progress
      bulkUploadProgress.value = ((i + 1) / files.length) * 100
    }
    
    updateFolderCounts()
  } finally {
    bulkUploading.value = false
    currentUploadIndex.value = 0
    totalUploads.value = 0
    bulkUploadProgress.value = 0
  }
}

const getFolderImages = (folderName: string) => {
  return allImages.value.filter(img => 
    img.folder === folderName || 
    img.url.includes(folderName.replace(' ', '%20'))
  )
}

const updateFolderCounts = () => {
  folders.value.forEach(folder => {
    folder.count = getFolderImages(folder.name).length
  })
}

const deleteImage = async (image: ImageItem) => {
  if (!confirm('Are you sure you want to delete this image?')) return
  
  try {
    await axios.delete(`/api/media/${image.id}`)
    allImages.value = allImages.value.filter(img => img.id !== image.id)
    updateFolderCounts()
  } catch (error) {
    console.error('Failed to delete image:', error)
  }
}

const loadAllImages = async () => {
  try {
    const response = await axios.get('/api/media')
    if (response.data.success) {
      allImages.value = response.data.data.map((item: any) => ({
        id: item.id,
        url: item.url,
        name: item.filename,
        alt: item.alt_text,
        size: item.size,
        type: item.mime_type,
        folder: item.folder || 'images'
      }))
      updateFolderCounts()
    }
  } catch (error) {
    console.error('Failed to load images:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadAllImages()
})
</script>

<style scoped>
.image-manager {
  @apply w-full;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-700 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-500 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-400;
}
</style>
