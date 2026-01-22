<template>
  <div class="image-gallery">
    <!-- Gallery Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">
        {{ title || 'Select Image' }}
      </h3>
      <button
        @click="showUploadModal = true"
        class="px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2"
        :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
      >
        <i class="pi pi-upload"></i>
        <span>Upload New</span>
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search images..."
        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
        :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
      />
    </div>

    <!-- Compact Gallery Grid (3 images max) -->
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div
        v-for="(image, index) in displayImages"
        :key="image.id || image.url"
        @click="selectImage(image)"
        class="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg cursor-pointer"
        :class="[
          selectedImage?.url === image.url
            ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
            : 'border-slate-200 hover:border-green-300 hover:ring-1 hover:ring-green-100',
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'
        ]"
      >
        <!-- Image Container -->
        <div class="aspect-square relative bg-slate-100 dark:bg-slate-700">
          <img
            :src="image.url"
            :alt="image.alt || 'Gallery image'"
            :data-image-index="index"
            class="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
            @error="handleImageError"
            @load="handleImageLoad"
            loading="lazy"
            title="Click to select this image"
          />
          
          <!-- Loading placeholder -->
          <div v-if="!image.loaded" class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
            <div class="text-center">
              <i class="pi pi-spin pi-spinner text-2xl text-slate-400 mb-2"></i>
              <p class="text-xs text-slate-500">Loading...</p>
            </div>
          </div>
          
          <!-- Error placeholder -->
          <div v-if="image.error" class="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
            <div class="text-center">
              <i class="pi pi-image text-2xl text-red-400 mb-2"></i>
              <p class="text-xs text-red-500">Failed to load</p>
            </div>
          </div>
          
          <!-- Selection Indicator -->
          <div
            v-if="selectedImage?.url === image.url"
            class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg"
          >
            <i class="pi pi-check text-white text-sm"></i>
          </div>

          <!-- Action Buttons Overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex space-x-2">
              <button
                @click.stop="viewImage(image)"
                class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                title="View"
              >
                <i class="pi pi-eye text-sm"></i>
              </button>
              <button
                @click.stop="downloadImage(image)"
                class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                title="Download"
              >
                <i class="pi pi-download text-sm"></i>
              </button>
              <button
                @click.stop="deleteImage(image)"
                class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                title="Delete"
              >
                <i class="pi pi-trash text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Image Info -->
        <div class="p-2">
          <p class="text-xs truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ getImageName(image.name || image.url) }}
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ formatFileSize(image.size) }}
          </p>
        </div>
      </div>
    </div>

    <!-- View All Button -->
    <div v-if="filteredImages.length > 3" class="text-center mb-4">
      <button
        @click.stop="openFullGallery"
        class="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
        :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-green-100 hover:bg-green-200 text-green-700'"
      >
        <i class="pi pi-images"></i>
        <span>View All Images ({{ filteredImages.length }})</span>
      </button>
    </div>


    <!-- Selected Image Preview -->
    <div v-if="selectedImage" class="mt-4 p-4 rounded-lg border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-green-50 border-green-200'">
      <h4 class="text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">Selected Image:</h4>
      <div class="flex items-center space-x-4">
        <img
          :src="selectedImage.url"
          :alt="selectedImage.alt"
          class="w-16 h-16 object-cover rounded-lg"
        />
        <div class="flex-1">
          <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ getImageName(selectedImage.name || selectedImage.url) }}
          </p>
          <p class="text-xs transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ formatFileSize(selectedImage.size) }}
          </p>
          <p class="text-xs text-green-600 mt-1">
            ✓ Image selected and ready to use
          </p>
        </div>
        <button
          @click="confirmSelection"
          class="px-4 py-2 text-white rounded-lg transition-colors"
          :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
        >
          Confirm Selection
        </button>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div
      v-if="showImageViewer"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
      @click="closeImageViewer"
    >
      <div class="relative max-w-4xl max-h-[90vh] w-full" @click.stop>
        <!-- Close Button -->
        <button
          @click="closeImageViewer"
          class="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
        
        <!-- Image Container -->
        <div class="relative bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-2xl">
          <img
            :src="viewingImage?.url"
            :alt="viewingImage?.alt || 'Gallery image'"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
          
          <!-- Image Info -->
          <div class="p-4 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ getImageName(viewingImage?.name || viewingImage?.url || '') }}
                </h3>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ formatFileSize(viewingImage?.size) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="downloadImage(viewingImage!)"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <i class="pi pi-download"></i>
                  <span>Download</span>
                </button>
                <button
                  @click="selectImage(viewingImage!)"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <i class="pi pi-check"></i>
                  <span>Select</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click="closeUploadModal"
    >
      <div
        class="shadow-2xl max-w-md w-full p-6 transition-colors duration-300"
        :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-green-200'"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">
            Upload New Image
          </h3>
          <button
            @click="closeUploadModal"
            class="transition-colors duration-300"
            :class="isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-green-400 hover:text-green-600'"
          >
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>

        <!-- Upload Area -->
        <div
          @drop="handleDrop"
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
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="space-y-4">
            <i class="pi pi-cloud-upload text-4xl" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"></i>
            <div>
              <p class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Drop images here or click to browse
              </p>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                Supports JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
            <button
              @click="fileInput?.click()"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Choose Files
            </button>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="mt-4">
          <div class="flex items-center space-x-2 mb-2">
            <i class="pi pi-spin pi-spinner text-blue-600"></i>
            <span class="text-sm" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Uploading...</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress + '%' }"
            ></div>
          </div>
        </div>

        <!-- Upload Error -->
        <div v-if="uploadError" class="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p class="text-sm text-red-700 dark:text-red-300">{{ uploadError }}</p>
        </div>
      </div>
    </div>

    <!-- Full Gallery Modal -->
    <div
      v-if="showFullGallery"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
      @click="closeFullGallery"
    >
      <div
        class="shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300"
        :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-green-200'"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6 border-b transition-colors duration-300" :class="isDarkMode ? 'border-slate-700' : 'border-green-200'">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">
                All Images
              </h3>
              <p class="mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-700'">
                Select an image from the gallery
              </p>
            </div>
            <button
              @click="closeFullGallery"
              class="p-2 rounded-lg transition-colors"
              :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-green-50'"
            >
              <i class="pi pi-times text-xl transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-500'"></i>
            </button>
          </div>
          
          <!-- Search in Full Gallery -->
          <div class="mt-4">
            <input
              v-model="fullGallerySearch"
              type="text"
              placeholder="Search images..."
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
            />
          </div>
        </div>

        <!-- Full Gallery Grid -->
        <div class="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="(image, index) in fullGalleryImages"
              :key="image.id || image.url"
              @click="selectImageFromFullGallery(image)"
              class="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg cursor-pointer"
              :class="[
                selectedImage?.url === image.url
                  ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
                  : 'border-slate-200 hover:border-green-300 hover:ring-1 hover:ring-green-100',
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'
              ]"
            >
              <!-- Image Container -->
              <div class="aspect-square relative bg-slate-100 dark:bg-slate-700">
                <img
                  :src="image.url"
                  :alt="image.alt || 'Gallery image'"
                  :data-image-index="index"
                  class="w-full h-full object-cover transition-opacity duration-200 hover:opacity-80"
                  @error="handleImageError"
                  @load="handleImageLoad"
                  loading="lazy"
                  title="Click to select this image"
                />
                
                <!-- Loading placeholder -->
                <div v-if="!image.loaded" class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <div class="text-center">
                    <i class="pi pi-spin pi-spinner text-2xl text-slate-400 mb-2"></i>
                    <p class="text-xs text-slate-500">Loading...</p>
                  </div>
                </div>
                
                <!-- Error placeholder -->
                <div v-if="image.error" class="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                  <div class="text-center">
                    <i class="pi pi-image text-2xl text-red-400 mb-2"></i>
                    <p class="text-xs text-red-500">Failed to load</p>
                  </div>
                </div>
                
                <!-- Selection Indicator -->
                <div
                  v-if="selectedImage?.url === image.url"
                  class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg"
                >
                  <i class="pi pi-check text-white text-sm"></i>
                </div>

                <!-- Action Buttons Overlay -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div class="flex space-x-2">
                    <button
                      @click.stop="viewImage(image)"
                      class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                      title="View"
                    >
                      <i class="pi pi-eye text-sm"></i>
                    </button>
                    <button
                      @click.stop="downloadImage(image)"
                      class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                      title="Download"
                    >
                      <i class="pi pi-download text-sm"></i>
                    </button>
                    <button
                      @click.stop="deleteImage(image)"
                      class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                      title="Delete"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Image Info -->
              <div class="p-2">
                <p class="text-xs truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ getImageName(image.name || image.url) }}
                </p>
                <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ formatFileSize(image.size) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State for Full Gallery -->
          <div v-if="fullGalleryImages.length === 0" class="text-center py-12">
            <i class="pi pi-images text-4xl transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-400'"></i>
            <h3 class="text-lg font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No images found</h3>
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Try adjusting your search or upload some images.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t transition-colors duration-300" :class="isDarkMode ? 'border-slate-700 bg-slate-700/50' : 'border-green-200 bg-green-50/50'">
          <div class="flex justify-between items-center">
            <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-600'">
              {{ fullGalleryImages.length }} image{{ fullGalleryImages.length !== 1 ? 's' : '' }} found
            </div>
            <div class="flex space-x-3">
              <button
                @click="closeFullGallery"
                class="px-4 py-2 border rounded-lg transition-colors"
                :class="isDarkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-700' : 'text-green-700 border-green-300 hover:bg-green-50'"
              >
                Cancel
              </button>
              <button
                @click="confirmSelectionFromFullGallery"
                :disabled="!selectedImage"
                class="px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:bg-slate-400"
                :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
              >
                <i class="pi pi-check"></i>
                <span>Select Image</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import axios from '../../plugins/axios'
import { getImageUrl } from '../../utils/imageUrl'

interface ImageItem {
  id?: string
  url: string
  name?: string
  alt?: string
  size?: number
  type?: string
  loaded?: boolean
  error?: boolean
}

interface Props {
  title?: string
  currentImage?: string
  folder?: string
}

interface Emits {
  (e: 'imageSelected', image: ImageItem): void
  (e: 'imageUploaded', image: ImageItem): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Select Image',
  currentImage: '',
  folder: 'images'
})

const emit = defineEmits<Emits>()

// State
const images = ref<ImageItem[]>([])
const selectedImage = ref<ImageItem | null>(null)
const searchQuery = ref('')
const showUploadModal = ref(false)
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const showImageViewer = ref(false)
const viewingImage = ref<ImageItem | null>(null)
const showFullGallery = ref(false)
const fullGallerySearch = ref('')

// Computed
const filteredImages = computed(() => {
  if (!searchQuery.value) return images.value
  
  return images.value.filter(image => {
    const name = image.name || image.url.split('/').pop() || ''
    return name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const displayImages = computed(() => {
  return filteredImages.value.slice(0, 3)
})

const fullGalleryImages = computed(() => {
  if (!fullGallerySearch.value) return filteredImages.value
  
  return filteredImages.value.filter(image => {
    const name = image.name || image.url.split('/').pop() || ''
    return name.toLowerCase().includes(fullGallerySearch.value.toLowerCase())
  })
})

// Methods
const loadImages = async () => {
  try {
    const response = await axios.get('/api/media')
    
    if (response.data.success && response.data.data) {
      images.value = response.data.data.map((item: any) => {
        // Use the getImageUrl utility to properly construct URLs for Heroku backend
        const imageUrl = getImageUrl(item.URL || item.url)
        
        
        return {
          id: item.ID || item.id,
          url: imageUrl,
          name: item.Name || item.name || item.filename,
          alt: item.alt_text || item.Name || item.name || item.filename,
          size: item.Size || item.size,
          type: item.Type || item.type || item.mime_type,
          loaded: false,
          error: false
        }
      })
    } else {
      // Add some sample images for testing
      images.value = [
        {
          id: '1',
          url: getImageUrl('/uploads/images/1755526687_qqqqqqqq.png'),
          name: '1755526687_qqqqqqqq.png',
          alt: 'Sample image 1',
          size: 2200000,
          type: 'image/png',
          loaded: false,
          error: false
        },
        {
          id: '2', 
          url: getImageUrl('/uploads/images/1755527015_66666666.png'),
          name: '1755527015_66666666.png',
          alt: 'Sample image 2',
          size: 2100000,
          type: 'image/png',
          loaded: false,
          error: false
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load images:', error)
    // Add fallback images
    images.value = [
      {
        id: 'fallback1',
        url: '/uploads/images/1755526687_qqqqqqqq.png',
        name: '1755526687_qqqqqqqq.png',
        alt: 'Fallback image 1',
        size: 2200000,
        type: 'image/png',
        loaded: false,
        error: false
      }
    ]
  }
}

const openFullGallery = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  showFullGallery.value = true
}

const selectImage = (image: ImageItem) => {
  selectedImage.value = image
  // Automatically emit selection for better UX
  emit('imageSelected', image)
}

const selectImageFromFullGallery = (image: ImageItem) => {
  selectedImage.value = image
  // Don't emit yet, wait for confirmation
}

const confirmSelectionFromFullGallery = () => {
  if (selectedImage.value) {
    emit('imageSelected', selectedImage.value)
    showFullGallery.value = false
  }
}

const closeFullGallery = () => {
  showFullGallery.value = false
}

const confirmSelection = () => {
  if (selectedImage.value) {
    emit('imageSelected', selectedImage.value)
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    uploadFiles(Array.from(files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFiles(Array.from(files))
  }
}

const uploadFiles = async (files: File[]) => {
  if (files.length === 0) return
  
  uploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  
  try {
    for (const file of files) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} is not an image file`)
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error(`${file.name} is too large (max 10MB)`)
      }
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', props.folder)
      
      const response = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        }
      })
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const uploadedItem = response.data.data[0] // Get first item from array
        const newImage: ImageItem = {
          id: uploadedItem.ID || uploadedItem.id,
          url: getImageUrl(uploadedItem.URL || uploadedItem.url),
          name: uploadedItem.Name || uploadedItem.name || uploadedItem.filename,
          alt: uploadedItem.alt_text || uploadedItem.Name || uploadedItem.name || uploadedItem.filename,
          size: uploadedItem.Size || uploadedItem.size,
          type: uploadedItem.Type || uploadedItem.type || uploadedItem.mime_type,
          loaded: true, // Set as loaded since upload was successful
          error: false
        }
        
        images.value.unshift(newImage)
        emit('imageUploaded', newImage)
        
        // Auto-select the newly uploaded image
        selectedImage.value = newImage
      }
    }
    
    showUploadModal.value = false
  } catch (error: any) {
    uploadError.value = error.response?.data?.error || error.message || 'Upload failed'
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const imageUrl = img.src
  const imageIndex = parseInt(img.dataset.imageIndex || '0')
  
  
  // Update the error state using the data attribute index
  if (imageIndex >= 0 && imageIndex < images.value.length) {
    images.value[imageIndex].error = true
    images.value[imageIndex].loaded = false
  }
}

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  const imageUrl = img.src
  const imageIndex = parseInt(img.dataset.imageIndex || '0')
  
  
  // Update the loaded state using the data attribute index
  if (imageIndex >= 0 && imageIndex < images.value.length) {
    images.value[imageIndex].loaded = true
    images.value[imageIndex].error = false
  } else {
  }
}

const closeUploadModal = () => {
  showUploadModal.value = false
  uploadError.value = ''
  uploadProgress.value = 0
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return ''
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Helper functions for UI
const getImageName = (filename: string) => {
  const name = filename.split('/').pop() || filename
  return name.length > 20 ? name.substring(0, 20) + '...' : name
}

// Action functions
const viewImage = (image: ImageItem) => {
  viewingImage.value = image
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
  viewingImage.value = null
}

const downloadImage = (image: ImageItem) => {
  // Create download link
  const link = document.createElement('a')
  link.href = image.url
  link.download = image.name || image.url.split('/').pop() || 'image'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const deleteImage = async (image: ImageItem) => {
  if (confirm(`Are you sure you want to delete "${image.name || image.url.split('/').pop()}"?`)) {
    try {
      
      // Call the delete API - URL encode the image ID to handle special characters like #
      await axios.delete(`/api/media/${encodeURIComponent(image.id)}`)
      
      // Remove the image from the local array immediately for better UX
      const imageIndex = images.value.findIndex(img => img.id === image.id)
      if (imageIndex !== -1) {
        images.value.splice(imageIndex, 1)
      }
      
      // If this was the selected image, clear the selection
      if (selectedImage.value?.id === image.id) {
        selectedImage.value = null
      }
      
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }
}


// Keyboard support for image viewer
const handleKeydown = (event: KeyboardEvent) => {
  if (showImageViewer.value && event.key === 'Escape') {
    closeImageViewer()
  }
}

// Lifecycle
onMounted(() => {
  loadImages()
  
  // Set current image as selected if provided
  if (props.currentImage) {
    const currentImg = images.value.find(img => img.url === props.currentImage)
    if (currentImg) {
      selectedImage.value = currentImg
    }
  }

  // Add keyboard support for image viewer
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.image-gallery {
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
