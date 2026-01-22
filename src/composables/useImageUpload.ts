import { ref } from 'vue'

interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}

export const useImageUpload = () => {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  // Upload image to backend
  const uploadImage = async (file: File): Promise<UploadResponse> => {
    uploading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      return { success: true, url: result.url }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      uploading.value = false
    }
  }

  // Get image URL from public folder (for static images)
  const getStaticImageUrl = (imagePath: string): string => {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    return `/uploads/images/${cleanPath}`
  }

  // Copy static image to CMS (simulate by creating a reference)
  const migrateStaticImage = async (imagePath: string): Promise<UploadResponse> => {
    try {
      // For now, we'll just return the static image path
      // In a real implementation, you might want to copy the file to the uploads directory
      const staticUrl = getStaticImageUrl(imagePath)
      
      return { 
        success: true, 
        url: staticUrl 
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Image migration failed'
      return { success: false, error: errorMessage }
    }
  }

  // Extract images from HTML content
  const extractImagesFromContent = (content: string): string[] => {
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
    const images: string[] = []
    let match

    while ((match = imgRegex.exec(content)) !== null) {
      const src = match[1]
      // Only include images from the public folder
      if (src.startsWith('/') && !src.startsWith('/uploads/')) {
        images.push(src)
      }
    }

    return images
  }

  // Replace image URLs in content
  const replaceImageUrls = (content: string, imageMap: Map<string, string>): string => {
    let updatedContent = content

    imageMap.forEach((newUrl, oldUrl) => {
      const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
      updatedContent = updatedContent.replace(regex, newUrl)
    })

    return updatedContent
  }

  return {
    uploading,
    error,
    uploadImage,
    getStaticImageUrl,
    migrateStaticImage,
    extractImagesFromContent,
    replaceImageUrls
  }
}
