import { ref, computed } from 'vue'
import { mediaAPI } from '../services/api'
import type { MediaFile } from '../types/cms'

const files = ref<MediaFile[]>([])
const isLoading = ref(false)
const uploadProgress = ref(0)
const error = ref<string | null>(null)

export function useMedia() {
  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Fetch all media files
  const fetchFiles = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await mediaAPI.getFiles()
      files.value = response.data
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch files'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Upload file
  const uploadFile = async (file: File) => {
    try {
      isLoading.value = true
      uploadProgress.value = 0
      error.value = null
      
      const response = await mediaAPI.uploadFile(file)
      files.value.unshift(response.data.data)
      
      return { success: true, data: response.data.data }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to upload file'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
      uploadProgress.value = 0
    }
  }

  // Upload multiple files
  const uploadFiles = async (fileList: FileList | File[]) => {
    const results = []
    const uploadedFiles = []
    
    for (const file of fileList) {
      const result = await uploadFile(file)
      results.push(result)
      if (result.success && result.data) {
        uploadedFiles.push(result.data)
      }
    }
    
    return {
      success: results.every(r => r.success),
      uploaded: uploadedFiles,
      errors: results.filter(r => !r.success).map(r => r.error)
    }
  }

  // Delete file
  const deleteFile = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      await mediaAPI.deleteFile(id)
      files.value = files.value.filter(f => f.id !== id)
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete file'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Helper functions
  const getFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImage = (file: MediaFile): boolean => {
    return file.mime_type.startsWith('image/')
  }

  const isVideo = (file: MediaFile): boolean => {
    return file.mime_type.startsWith('video/')
  }

  const isPDF = (file: MediaFile): boolean => {
    return file.mime_type === 'application/pdf'
  }

  // Computed properties
  const images = computed(() => 
    files.value.filter(file => isImage(file))
  )
  
  const videos = computed(() => 
    files.value.filter(file => isVideo(file))
  )
  
  const documents = computed(() => 
    files.value.filter(file => !isImage(file) && !isVideo(file))
  )

  return {
    // State
    files: computed(() => files.value),
    isLoading: computed(() => isLoading.value),
    uploadProgress: computed(() => uploadProgress.value),
    error: computed(() => error.value),
    
    // Computed
    images,
    videos,
    documents,
    
    // Actions
    fetchFiles,
    uploadFile,
    uploadFiles,
    deleteFile,
    clearError,
    
    // Helpers
    getFileSize,
    isImage,
    isVideo,
    isPDF,
  }
}
