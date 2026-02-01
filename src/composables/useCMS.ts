import { ref } from 'vue'

interface Page {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  template: string
  status: 'draft' | 'published' | 'private' | 'archived'
  featured_image?: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  parent_id?: number
  sort_order: number
  author?: {
    name: string
  }
  created_at?: string
  updated_at?: string
  published_at?: string
}

interface Setting {
  id?: number
  key: string
  value: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'json' | 'email' | 'url'
  group: string
  label: string
  description: string
  is_public: boolean
  sort_order: number
}

interface Menu {
  id?: number
  name: string
  location: string
  is_active: boolean
  items?: MenuItem[]
}

interface MenuItem {
  id?: number
  menu_id: number
  label: string
  url: string
  target: string
  icon_class: string
  parent_id?: number
  sort_order: number
  is_active: boolean
  children?: MenuItem[]
}

export const useCMS = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // API Base URL (set VITE_API_BASE to your backend URL in development to bypass proxy)
  const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) ? String(import.meta.env.VITE_API_BASE) : '/api'

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  // Helper function to handle API responses
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      // Check if response is HTML (likely a 404 or server error page)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`Backend server not available (${response.status})`)
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }
    return response.json()
  }

  // Pages API
  const pages = {
    // Get all pages
    async getAll(filters?: {
      status?: string
      author_id?: string
      parent_id?: string
      search?: string
      order_by?: string
      order_dir?: string
    }) {
      loading.value = true
      error.value = null
      
      try {
        const params = new URLSearchParams()
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
          })
        }
        
        const url = `${API_BASE}/pages${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url, {
          headers: getAuthHeaders()
        })
        
        const data = await handleResponse(response)
        return data.pages
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch pages'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get page by ID
    async getById(id: number) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/pages/${id}`, {
          headers: getAuthHeaders()
        })
        
        const data = await handleResponse(response)
        return data.page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get page by slug (public)
    async getBySlug(slug: string) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/pages/${slug}`)
        
        const data = await handleResponse(response)
        return data.page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Create page
    async create(page: Omit<Page, 'id'>) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/pages`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(page)
        })
        
        const data = await handleResponse(response)
        return data.page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to create page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Update page
    async update(id: number, page: Partial<Page>) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/pages/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(page)
        })
        
        const data = await handleResponse(response)
        return data.page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to update page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Delete page
    async delete(id: number) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/pages/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
        
        await handleResponse(response)
        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to delete page'
        throw err
      } finally {
        loading.value = false
      }
    }
  }

  // Settings API
  const settings = {
    // Get all settings
    async getAll(filters?: {
      group?: string
      is_public?: string
    }) {
      loading.value = true
      error.value = null
      
      try {
        const params = new URLSearchParams()
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
          })
        }
        
        const url = `${API_BASE}/settings${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url, {
          headers: getAuthHeaders()
        })
        
        const data = await handleResponse(response)
        return data.settings
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch settings'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get settings by group
    async getByGroup(group: string) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/settings/group/${group}`, {
          headers: getAuthHeaders()
        })
        
        const data = await handleResponse(response)
        return data.settings
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch settings'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get public settings
    async getPublic() {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/settings/public`)
        
        const data = await handleResponse(response)
        return data.settings
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch public settings'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Update settings batch
    async updateBatch(settings: Setting[]) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/settings/batch`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(settings)
        })
        
        await handleResponse(response)
        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to update settings'
        throw err
      } finally {
        loading.value = false
      }
    }
  }

  // Menus API
  const menus = {
    // Get all menus
    async getAll(filters?: {
      location?: string
      is_active?: string
    }) {
      loading.value = true
      error.value = null
      
      try {
        const params = new URLSearchParams()
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
          })
        }
        
        const url = `${API_BASE}/menus${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url, {
          headers: getAuthHeaders()
        })
        
        const data = await handleResponse(response)
        return data.menus
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch menus'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get menu by location (public)
    async getByLocation(location: string) {
      loading.value = true
      error.value = null
      
      try {
        const response = await fetch(`${API_BASE}/menus/location/${location}`)
        
        const data = await handleResponse(response)
        return data.menu
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch menu'
        throw err
      } finally {
        loading.value = false
      }
    }
  }

  return {
    loading,
    error,
    pages,
    settings,
    menus
  }
}
