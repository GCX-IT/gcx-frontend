<template>
  <div class="media-library-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="modal-content bg-white rounded-lg shadow-xl w-11/12 max-w-6xl h-5/6 flex flex-col">
      <!-- Header -->
      <div class="modal-header p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900">Media Library</h2>
        <div class="flex items-center gap-4">
          <button @click="uploadFile" class="btn-primary">
            <i class="pi pi-upload"></i> Upload New
          </button>
          <button @click="$emit('close')" class="btn-secondary">
            <i class="pi pi-times"></i> Close
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="modal-tabs border-b border-gray-200">
        <div class="flex">
          <button 
            @click="activeTab = 'library'"
            class="tab-button"
            :class="{ 'active': activeTab === 'library' }"
          >
            <i class="pi pi-images"></i> Library
          </button>
          <button 
            @click="activeTab = 'upload'"
            class="tab-button"
            :class="{ 'active': activeTab === 'upload' }"
          >
            <i class="pi pi-upload"></i> Upload
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="modal-body flex-1 overflow-hidden">
        <!-- Library Tab -->
        <div v-if="activeTab === 'library'" class="h-full flex flex-col">
          <!-- Search and Filters -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search media..."
                  class="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <select v-model="selectedType" class="p-2 border border-gray-300 rounded-md">
                <option value="">All Types</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
              </select>
            </div>
          </div>
          
          <!-- Media Grid -->
          <div class="flex-1 overflow-y-auto p-4">
            <div v-if="loading" class="text-center py-8">
              <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
              <p class="text-gray-500 mt-2">Loading media...</p>
            </div>
            
            <div v-else-if="filteredMedia.length === 0" class="text-center py-8">
              <i class="pi pi-images text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">No media found</p>
            </div>
            
            <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div 
                v-for="media in filteredMedia" 
                :key="media.id"
                class="media-item cursor-pointer rounded-lg border-2 transition-all"
                :class="{
                  'border-blue-500 bg-blue-50': selectedMedia?.id === media.id,
                  'border-gray-200 hover:border-gray-300': selectedMedia?.id !== media.id
                }"
                @click="selectMedia(media)"
              >
                <!-- Image Preview -->
                <div v-if="media.type === 'image'" class="aspect-square rounded-t-lg overflow-hidden">
                  <img 
                    :src="media.url" 
                    :alt="media.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                
                <!-- Document Preview -->
                <div v-else-if="media.type === 'document'" class="aspect-square rounded-t-lg bg-gray-100 flex items-center justify-center">
                  <i class="pi pi-file text-3xl text-gray-400"></i>
                </div>
                
                <!-- Video Preview -->
                <div v-else-if="media.type === 'video'" class="aspect-square rounded-t-lg bg-gray-100 flex items-center justify-center">
                  <i class="pi pi-video text-3xl text-gray-400"></i>
                </div>
                
                <!-- Media Info -->
                <div class="p-2">
                  <p class="text-xs font-medium text-gray-900 truncate">{{ media.name }}</p>
                  <p class="text-xs text-gray-500">{{ formatFileSize(media.size) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Upload Tab -->
        <div v-else-if="activeTab === 'upload'" class="h-full p-6">
          <div class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input 
              ref="fileInput"
              type="file" 
              multiple 
              accept="image/*,video/*,.pdf,.doc,.docx"
              @change="handleFileUpload"
              class="hidden"
            />
            
            <div v-if="!uploading" @click="$refs.fileInput.click()" class="cursor-pointer">
              <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4"></i>
              <p class="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
              <p class="text-sm text-gray-500">Supports images, videos, and documents</p>
            </div>
            
            <div v-else class="upload-progress">
              <i class="pi pi-spinner pi-spin text-2xl text-blue-500 mb-2"></i>
              <p class="text-gray-700">Uploading files...</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer p-6 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ selectedMedia ? `Selected: ${selectedMedia.name}` : 'No media selected' }}
        </div>
        <div class="flex items-center gap-2">
          <button @click="$emit('close')" class="btn-secondary">Cancel</button>
          <button 
            @click="confirmSelection" 
            :disabled="!selectedMedia"
            class="btn-primary"
          >
            Use Selected
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiFetch } from '@/utils/api'

const emit = defineEmits<{
  close: []
  select: [media: any]
}>()

// State
const activeTab = ref('library')
const loading = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const searchQuery = ref('')
const selectedType = ref('')
const selectedMedia = ref<any>(null)
const mediaItems = ref<any[]>([])

// Computed
const filteredMedia = computed(() => {
  let filtered = mediaItems.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(media => 
      media.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(media => media.type === selectedType.value)
  }
  
  return filtered
})

// Methods
const loadMedia = async () => {
  loading.value = true
  try {
    const response = await apiFetch('/api/media')
    if (response.ok) {
      const data = await response.json()
      mediaItems.value = data.media || []
    }
  } catch (error) {
    console.error('Failed to load media:', error)
  } finally {
    loading.value = false
  }
}

const selectMedia = (media: any) => {
  selectedMedia.value = media
}

const confirmSelection = () => {
  if (selectedMedia.value) {
    emit('select', selectedMedia.value)
  }
}

const uploadFile = () => {
  activeTab.value = 'upload'
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (!files || files.length === 0) return
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiFetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        mediaItems.value.unshift(result.media)
      }
      
      uploadProgress.value = ((i + 1) / files.length) * 100
    }
    
    // Switch back to library tab
    activeTab.value = 'library'
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed. Please try again.')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  loadMedia()
})
</script>

<style scoped>
.media-library-modal {
  backdrop-filter: blur(4px);
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.tab-button {
  @apply px-4 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors;
}

.tab-button.active {
  @apply text-blue-600 border-blue-600;
}

.media-item {
  transition: all 0.2s ease;
}

.media-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors;
}
</style>
