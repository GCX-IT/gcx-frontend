<template>
  <div class="file-upload">
    <!-- Upload Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        {{ title || 'Select File' }}
      </h3>
      <button
        @click.stop="openUploadModal"
        @mousedown.stop
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
      >
        <i class="pi pi-upload"></i>
        <span>Upload New</span>
      </button>
    </div>

    <!-- Search and Filter -->
    <div v-if="displayFiles.length > 0" class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search files..."
        class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
      />
    </div>

    <!-- No Files Message -->
    <div v-if="displayFiles.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <i class="pi pi-file text-4xl mb-2"></i>
      <p>No files available for this publication.</p>
      <p class="text-sm">Click "Upload New" to add a file.</p>
    </div>

    <!-- Compact Files Grid (3 files max) -->
    <div v-if="displayFiles.length > 0" class="grid grid-cols-3 gap-4 mb-4">
      <div
        v-for="(file, index) in displayFiles"
        :key="file.id || file.url"
        @click="selectFile(file)"
        class="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg cursor-pointer"
        :class="[
          selectedFile?.url === file.url
            ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
            : 'border-slate-200 hover:border-green-300 hover:ring-1 hover:ring-green-100',
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'
        ]"
      >
        <!-- File Container -->
        <div class="aspect-square relative bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <div class="text-center p-4">
            <i :class="[getFileIcon(file.type), getFileIconColor(file.type)]" class="text-4xl mb-2"></i>
            <p class="text-xs font-medium truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              {{ getFileName(file.name || file.url) }}
            </p>
          </div>
          
          <!-- Selection Indicator -->
          <div
            v-if="selectedFile?.url === file.url"
            class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg"
          >
            <i class="pi pi-check text-white text-sm"></i>
          </div>

          <!-- Action Buttons Overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div class="flex space-x-2">
              <button
                @click.stop="downloadFile(file)"
                class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                title="Download"
              >
                <i class="pi pi-download text-sm"></i>
              </button>
              <button
                @click.stop="deleteFile(file)"
                class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                title="Delete"
              >
                <i class="pi pi-trash text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- File Info -->
        <div class="p-2">
          <p class="text-xs truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ getFileName(file.name || file.url) }}
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ formatFileSize(file.size) }}
          </p>
        </div>
      </div>
    </div>

    <!-- View All Button -->
    <div v-if="filteredFiles.length > 3" class="text-center mb-4">
      <button
        @click.stop="openFullGallery"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
      >
        <i class="pi pi-folder-open"></i>
        <span>View All Files ({{ filteredFiles.length }})</span>
      </button>
    </div>

    <!-- Selected File Preview -->
    <div v-if="selectedFile && selectedFile.url" class="mt-4 p-4 rounded-lg border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'">
      <h4 class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Selected File:</h4>
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
          <i :class="[getFileIcon(selectedFile.type), getFileIconColor(selectedFile.type)]" class="text-2xl"></i>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ getFileName(selectedFile.name || selectedFile.url) }}
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            {{ formatFileSize(selectedFile.size) }}
          </p>
          <p class="text-xs text-green-600 mt-1">
            ✓ File selected and ready to use
          </p>
        </div>
        <button
          @click="confirmSelection"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Confirm Selection
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click="closeUploadModal"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Upload New File
          </h3>
          <button
            @click="closeUploadModal"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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
            :accept="acceptedTypes"
            @change="handleFileSelect"
            class="hidden"
          />
          
          <div class="space-y-4">
            <i class="pi pi-cloud-upload text-4xl" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"></i>
            <div>
              <p class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Drop files here or click to browse
              </p>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                {{ acceptedTypesText }}
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

    <!-- Full Files Modal -->
    <div
      v-if="showFullGallery"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      @click="closeFullGallery"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                All Files
              </h3>
              <p class="text-slate-600 dark:text-slate-400 mt-1">
                Select a file from the gallery
              </p>
            </div>
            <button
              @click="closeFullGallery"
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <i class="pi pi-times text-xl text-slate-500 dark:text-slate-400"></i>
            </button>
          </div>
          
          <!-- Search in Full Gallery -->
          <div class="mt-4">
            <input
              v-model="fullGallerySearch"
              type="text"
              placeholder="Search files..."
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
            />
          </div>
        </div>

        <!-- Full Files Grid -->
        <div class="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div
              v-for="(file, index) in fullGalleryFiles"
              :key="file.id || file.url"
              @click="selectFileFromFullGallery(file)"
              class="relative group rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-lg cursor-pointer"
              :class="[
                selectedFile?.url === file.url
                  ? 'border-green-500 ring-2 ring-green-200 shadow-lg'
                  : 'border-slate-200 hover:border-green-300 hover:ring-1 hover:ring-green-100',
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'
              ]"
            >
              <!-- File Container -->
              <div class="aspect-square relative bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <div class="text-center p-4">
                  <i :class="[getFileIcon(file.type), getFileIconColor(file.type)]" class="text-4xl mb-2"></i>
                  <p class="text-xs font-medium truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    {{ getFileName(file.name || file.url) }}
                  </p>
                </div>
                
                <!-- Selection Indicator -->
                <div
                  v-if="selectedFile?.url === file.url"
                  class="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10 shadow-lg"
                >
                  <i class="pi pi-check text-white text-sm"></i>
                </div>

                <!-- Action Buttons Overlay -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div class="flex space-x-2">
                    <button
                      @click.stop="downloadFile(file)"
                      class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                      title="Download"
                    >
                      <i class="pi pi-download text-sm"></i>
                    </button>
                    <button
                      @click.stop="deleteFile(file)"
                      class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                      title="Delete"
                    >
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- File Info -->
              <div class="p-2">
                <p class="text-xs truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ getFileName(file.name || file.url) }}
                </p>
                <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State for Full Gallery -->
          <div v-if="fullGalleryFiles.length === 0" class="text-center py-12">
            <i class="pi pi-folder text-4xl text-slate-400 mb-4"></i>
            <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No files found</h3>
            <p class="text-slate-500 dark:text-slate-400">Try adjusting your search or upload some files.</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div class="flex justify-between items-center">
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ fullGalleryFiles.length }} file{{ fullGalleryFiles.length !== 1 ? 's' : '' }} found
            </div>
            <div class="flex space-x-3">
              <button
                @click="closeFullGallery"
                class="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="confirmSelectionFromFullGallery"
                :disabled="!selectedFile"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <i class="pi pi-check"></i>
                <span>Select File</span>
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

interface FileItem {
  id?: string
  url: string
  name?: string
  type?: string
  size?: number
  loaded?: boolean
  error?: boolean
}

interface Props {
  title?: string
  currentFile?: string
  folder?: string
  acceptedTypes?: string
  acceptedTypesText?: string
}

interface Emits {
  (e: 'fileSelected', file: FileItem): void
  (e: 'fileUploaded', file: FileItem): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Select File',
  currentFile: '',
  folder: 'documents',
  acceptedTypes: '.pdf,.doc,.docx,.txt',
  acceptedTypesText: 'PDF, DOC, DOCX, TXT up to 10MB'
})

const emit = defineEmits<Emits>()

// State
const files = ref<FileItem[]>([])
const selectedFile = ref<FileItem | null>(null)
const searchQuery = ref('')
const showUploadModal = ref(false)
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const showFullGallery = ref(false)
const fullGallerySearch = ref('')

// Computed
const filteredFiles = computed(() => {
  if (!searchQuery.value) return files.value
  
  return files.value.filter(file => {
    const name = file.name || file.url.split('/').pop() || ''
    return name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

const displayFiles = computed(() => {
  return filteredFiles.value.slice(0, 3)
})

const fullGalleryFiles = computed(() => {
  if (!fullGallerySearch.value) return filteredFiles.value
  
  return filteredFiles.value.filter(file => {
    const name = file.name || file.url.split('/').pop() || ''
    return name.toLowerCase().includes(fullGallerySearch.value.toLowerCase())
  })
})

// Methods
const loadFiles = async () => {
  // Always start with empty array
  files.value = []
  
  // Only show the current file if it exists and is not empty
  if (props.currentFile && 
      props.currentFile.trim() !== '' && 
      props.currentFile !== 'null' && 
      props.currentFile !== 'undefined' &&
      props.currentFile.includes('/')) {
    
    const fileName = props.currentFile.split('/').pop() || ''
    // Only add if it's a real file path with extension
    if (fileName.includes('.')) {
      files.value = [{
        id: fileName,
        url: props.currentFile,
        name: fileName,
        type: 'application/pdf',
        size: 0,
        loaded: false,
        error: false
      }]
    }
  }
}

const openUploadModal = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  // Add a small delay to prevent immediate closing
  setTimeout(() => {
    showUploadModal.value = true
  }, 10)
}

const openFullGallery = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  showFullGallery.value = true
}

const closeFullGallery = () => {
  showFullGallery.value = false
}

const selectFile = (file: FileItem) => {
  selectedFile.value = file
  // Automatically emit selection for better UX
  emit('fileSelected', file)
}

const selectFileFromFullGallery = (file: FileItem) => {
  selectedFile.value = file
  // Don't emit yet, wait for confirmation
}

const confirmSelectionFromFullGallery = () => {
  if (selectedFile.value) {
    emit('fileSelected', selectedFile.value)
    showFullGallery.value = false
  }
}

const confirmSelection = () => {
  if (selectedFile.value) {
    emit('fileSelected', selectedFile.value)
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

const uploadFiles = async (fileList: File[]) => {
  if (fileList.length === 0) return
  
  uploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  
  try {
    for (const file of fileList) {
      // Validate file type
      const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
      const acceptedExts = props.acceptedTypes.split(',').map(ext => ext.replace('.', '').toLowerCase())
      
      if (!acceptedExts.includes(fileExt)) {
        throw new Error(`${file.name} is not an accepted file type`)
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        throw new Error(`${file.name} is too large (max 10MB)`)
      }
      
      const formData = new FormData()
      formData.append('document', file)
      formData.append('type', props.folder)
      
      const response = await axios.post('/api/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        }
      })
      
      if (response.data.success) {
        const newFile: FileItem = {
          id: response.data.filename,
          url: response.data.url,
          name: response.data.filename,
          type: response.data.type,
          size: response.data.size,
          loaded: false,
          error: false
        }
        
        files.value.unshift(newFile)
        emit('fileUploaded', newFile)
        
        // Auto-select the newly uploaded file
        selectedFile.value = newFile
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

const getFileName = (filename: string) => {
  const name = filename.split('/').pop() || filename
  return name.length > 20 ? name.substring(0, 20) + '...' : name
}

const getFileIcon = (type?: string) => {
  if (!type) return 'pi pi-file'
  
  if (type.includes('pdf')) return 'pi pi-file-pdf'
  if (type.includes('word') || type.includes('document')) return 'pi pi-file-word'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'pi pi-file-excel'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'pi pi-file-powerpoint'
  if (type.includes('text')) return 'pi pi-file-text'
  if (type.includes('image')) return 'pi pi-image'
  
  return 'pi pi-file'
}

const getFileIconColor = (type?: string) => {
  if (!type) return 'text-slate-500'
  
  if (type.includes('pdf')) return 'text-red-500'
  if (type.includes('word') || type.includes('document')) return 'text-blue-500'
  if (type.includes('excel') || type.includes('spreadsheet')) return 'text-green-500'
  if (type.includes('powerpoint') || type.includes('presentation')) return 'text-orange-500'
  if (type.includes('text')) return 'text-slate-500'
  if (type.includes('image')) return 'text-purple-500'
  
  return 'text-slate-500'
}

const downloadFile = (file: FileItem) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name || file.url.split('/').pop() || 'file'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const deleteFile = async (file: FileItem) => {
  if (confirm(`Are you sure you want to delete "${file.name || file.url.split('/').pop()}"?`)) {
    try {
      // Remove from the list
      const fileIndex = files.value.findIndex(f => f.id === file.id)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }
      
      if (selectedFile.value?.id === file.id) {
        selectedFile.value = null
        // Emit empty file to clear the publication's file
        emit('fileSelected', { url: '', name: '' })
      }
      
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file. Please try again.')
    }
  }
}

// Watch for changes in currentFile
watch(() => props.currentFile, () => {
  loadFiles()
  if (props.currentFile) {
    const currentFile = files.value.find(f => f.url === props.currentFile)
    if (currentFile) {
      selectedFile.value = currentFile
    } else {
      selectedFile.value = null
    }
  } else {
    selectedFile.value = null
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.file-upload {
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
