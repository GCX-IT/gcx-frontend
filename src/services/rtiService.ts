import axios from '../plugins/axios'

export interface RTIRequest {
  id: number
  request_id: string
  full_name: string
  email: string
  phone: string
  address?: string
  organization?: string
  request_type: string
  subject: string
  description: string
  preferred_format: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'completed'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to?: string
  response_text?: string
  response_file?: string
  response_date?: string
  responded_by?: string
  reviewed_at?: string
  reviewed_by?: string
  completed_at?: string
  notes?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface CreateRTIRequest {
  full_name: string
  email: string
  phone: string
  address?: string
  organization?: string
  request_type: string
  subject: string
  description: string
  preferred_format: string
}

export interface RTIResponse {
  response_text: string
  response_file?: string
  responded_by: string
}

class RTIService {
  // Public endpoint
  async submitRequest(request: CreateRTIRequest): Promise<RTIRequest> {
    try {
      const response = await axios.post('/api/rti/request', request)
      return response.data.data
    } catch (error) {
      console.error('Error submitting RTI request:', error)
      throw error
    }
  }

  // CMS endpoints (require authentication)
  async getAllRequests(token: string, params?: {
    status?: string
    priority?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<{ data: RTIRequest[]; pagination: any }> {
    try {
      const response = await axios.get('/api/cms/rti/requests', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      return response.data
    } catch (error) {
      console.error('Error fetching RTI requests:', error)
      throw error
    }
  }

  async getRequest(token: string, id: number): Promise<RTIRequest> {
    try {
      const response = await axios.get(`/api/cms/rti/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching RTI request:', error)
      throw error
    }
  }

  async updateRequest(token: string, id: number, updates: Partial<RTIRequest>): Promise<RTIRequest> {
    try {
      const response = await axios.put(`/api/cms/rti/requests/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating RTI request:', error)
      throw error
    }
  }

  async respondToRequest(token: string, id: number, response: RTIResponse): Promise<RTIRequest> {
    try {
      const res = await axios.post(`/api/cms/rti/requests/${id}/respond`, response, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.data.data
    } catch (error) {
      console.error('Error responding to RTI request:', error)
      throw error
    }
  }

  async updateStatus(token: string, id: number, status: string, reviewerName?: string, rejectionReason?: string): Promise<RTIRequest> {
    try {
      const response = await axios.put(`/api/cms/rti/requests/${id}/status`, {
        status,
        reviewer_name: reviewerName,
        rejection_reason: rejectionReason
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating RTI request status:', error)
      throw error
    }
  }

  async deleteRequest(token: string, id: number): Promise<void> {
    try {
      await axios.delete(`/api/cms/rti/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error deleting RTI request:', error)
      throw error
    }
  }

  async getStats(token: string): Promise<any> {
    try {
      const response = await axios.get('/api/cms/rti/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching RTI stats:', error)
      throw error
    }
  }

  // RTI Documents
  async getDocuments(category?: string): Promise<RTIDocument[]> {
    try {
      const params = category ? { category } : {}
      const response = await axios.get('/api/rti/documents', { params })
      return response.data.data
    } catch (error) {
      console.error('Error fetching RTI documents:', error)
      throw error
    }
  }

  async getAllDocuments(token: string): Promise<RTIDocument[]> {
    try {
      const response = await axios.get('/api/cms/rti/documents', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error fetching all RTI documents:', error)
      throw error
    }
  }

  async createDocument(token: string, document: Partial<RTIDocument>): Promise<RTIDocument> {
    try {
      const response = await axios.post('/api/cms/rti/documents', document, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error creating RTI document:', error)
      throw error
    }
  }

  async updateDocument(token: string, id: number, document: Partial<RTIDocument>): Promise<RTIDocument> {
    try {
      const response = await axios.put(`/api/cms/rti/documents/${id}`, document, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      console.error('Error updating RTI document:', error)
      throw error
    }
  }

  async deleteDocument(token: string, id: number): Promise<void> {
    try {
      await axios.delete(`/api/cms/rti/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error deleting RTI document:', error)
      throw error
    }
  }

  async trackDownload(id: number): Promise<void> {
    try {
      await axios.post(`/api/rti/documents/${id}/download`)
    } catch (error) {
      console.error('Error tracking download:', error)
    }
  }
}

export interface RTIDocument {
  id: number
  title: string
  description?: string
  category: string
  file_path: string
  file_name?: string
  file_size?: number
  icon: string
  download_count: number
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default new RTIService()
