/**
 * File Service
 * Handles downloading and viewing files from S3 via backend API
 */

/**
 * Download a file from S3
 * @param s3Key - The S3 key/path of the file (e.g., 'cms/filename.jpg')
 * @param filename - Optional custom filename for download
 */
export async function downloadFile(s3Key: string, filename?: string): Promise<void> {
  try {
    const params = new URLSearchParams()
    params.append('key', s3Key)
    params.append('action', 'download')

    const response = await fetch(`/api/files/download?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to download file: HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || s3Key.split('/').pop() || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up object URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

/**
 * View a file in a new tab (for images, PDFs, etc.)
 * @param s3Key - The S3 key/path of the file
 */
export async function viewFile(s3Key: string): Promise<void> {
  try {
    const params = new URLSearchParams()
    params.append('key', s3Key)
    params.append('action', 'view')

    const response = await fetch(`/api/files/download?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to view file: HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    
    // Clean up object URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  } catch (error) {
    console.error('Error viewing file:', error)
    throw error
  }
}

/**
 * Get a file preview as a Blob
 * @param s3Key - The S3 key/path of the file
 * @returns Promise<Blob> - The file content as a blob
 */
export async function getFileBlob(s3Key: string): Promise<Blob> {
  try {
    const params = new URLSearchParams()
    params.append('key', s3Key)
    params.append('action', 'view')

    const response = await fetch(`/api/files/download?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: HTTP ${response.status}`)
    }

    return await response.blob()
  } catch (error) {
    console.error('Error fetching file blob:', error)
    throw error
  }
}

/**
 * Create a preview URL for a file (for img src, video src, etc.)
 * @param s3Key - The S3 key/path of the file
 * @returns Promise<string> - Object URL that can be used in src attributes
 */
export async function getFilePreviewUrl(s3Key: string): Promise<string> {
  try {
    const blob = await getFileBlob(s3Key)
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error creating preview URL:', error)
    throw error
  }
}

export default {
  downloadFile,
  viewFile,
  getFileBlob,
  getFilePreviewUrl,
}
