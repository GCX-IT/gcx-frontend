import { ref, reactive } from 'vue'
import { apiFetch } from '@/utils/api'
import axios from '../plugins/axios'

export function usePageContentEditor(pageId: string) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pageContent = reactive<Record<string, any>>({})

  // Load page content from CMS (try both settings and pages API)
  const loadPageContent = async () => {
    loading.value = true
    error.value = null

    try {
      // First try to get from pages API using slug
      try {
        const response = await axios.get(`/api/pages/${pageId}`)
        
        if (response.data.page && response.data.page.content) {
          const content = JSON.parse(response.data.page.content)
          Object.assign(pageContent, content)
          return
        } else {
        }
      } catch (pagesError) {
      }

      // Fallback to settings API
      try {
        const response = await axios.get(`/api/settings/${pageId}_content`)
        
        if (response.data.setting && response.data.setting.value) {
          const content = JSON.parse(response.data.setting.value)
          Object.assign(pageContent, content)
        } else {
        }
      } catch (settingsError) {
      }
    } catch (err: any) {
      // Don't set error for missing content - just use static fallbacks
    } finally {
      loading.value = false
    }
  }

  // Save page content to CMS
  const savePageContent = async (content: Record<string, any>) => {
    loading.value = true
    error.value = null

    try {
      
      // Try to save to pages API first
      try {
        const response = await axios.get(`/api/pages/${pageId}`)
        
        if (response.data.page) {
          // Update existing page
          const pageData = {
            ...response.data.page,
            content: JSON.stringify(content)
          }
          await axios.put(`/api/pages/id/${response.data.page.id}`, pageData)
          return
        }
      } catch (pagesError) {
        
        // Create new page
        const pageData = {
          title: pageId.charAt(0).toUpperCase() + pageId.slice(1),
          slug: pageId,
          content: JSON.stringify(content),
          excerpt: `Content for ${pageId} page`,
          template: 'default',
          status: 'published',
          meta_title: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} - GCX`,
          meta_description: `Content for ${pageId} page`,
          meta_keywords: pageId,
          sort_order: 0
        }
        
        await axios.post('/api/pages', pageData)
        return
      }

      // Fallback to settings API
      const settingData = {
        key: `${pageId}_content`,
        value: JSON.stringify(content),
        type: 'json',
        group: 'pages',
        label: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page Content`,
        description: `Content for ${pageId} page`,
        is_public: true,
        sort_order: 0
      }

      
      try {
        await axios.put(`/api/settings/${pageId}_content`, settingData)
      } catch (err: any) {
        if (err.response?.status === 404) {
          await axios.post('/api/settings', settingData)
        } else {
          console.error(`❌ Settings API error:`, err.response?.data || err.message)
          throw err
        }
      }
      
    } catch (err: any) {
      console.error(`❌ Failed to save CMS content for ${pageId} page:`, err)
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get content with fallback
  const getContent = (key: string, fallback: string = '') => {
    return pageContent[key] || fallback
  }

  // Get image with fallback
  const getImage = (key: string, fallback: string = '') => {
    return pageContent[key] || fallback
  }

  // Update content locally
  const updateContent = (key: string, value: any) => {
    pageContent[key] = value
  }

  // Get all content
  const getAllContent = () => {
    return { ...pageContent }
  }

  return {
    loading,
    error,
    pageContent,
    loadPageContent,
    savePageContent,
    getContent,
    getImage,
    updateContent,
    getAllContent
  }
}
