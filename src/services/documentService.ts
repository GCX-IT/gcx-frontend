import axios from '../plugins/axios'

export interface DocumentUploadResponse {
  success: boolean
  message?: string
  url?: string
  filename?: string
  type?: string
  size?: number
  error?: string
}

class DocumentService {
  /**
   * Upload a document file (PDF, DOC, DOCX, etc.)
   */
  async uploadDocument(file: File, folder: string = 'contracts'): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await axios.post<DocumentUploadResponse>('/api/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('✅ Document uploaded successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ Error uploading document:', error)
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to upload document'
      }
    }
  }

  /**
   * Get all documents (not implemented yet)
   */
  async getDocuments(): Promise<DocumentUploadResponse> {
    console.warn('⚠️ getDocuments not implemented yet')
    return {
      success: false,
      error: 'Document listing not implemented yet'
    }
  }

  /**
   * Delete a document (not implemented yet)
   */
  async deleteDocument(documentId: string): Promise<DocumentUploadResponse> {
    console.warn('⚠️ deleteDocument not implemented yet')
    return {
      success: false,
      error: 'Document deletion not implemented yet'
    }
  }

  /**
   * Download a document
   */
  downloadDocument(url: string, filename: string): void {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export singleton instance
export const documentService = new DocumentService()
export default documentService
