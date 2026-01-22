import { ref, computed } from 'vue'
import axios from '../plugins/axios'

interface PageContent {
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
  created_at?: string
  updated_at?: string
}

interface HomepageSection {
  id: string
  name: string
  title: string
  description: string
  content: any
  is_active: boolean
  sort_order: number
}

interface Setting {
  key: string
  value: string
  type: string
  group: string
  label: string
  description: string
  is_public: boolean
}

export const usePageContent = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get page content with fallback to static content
  const getPageContent = async (slug: string, fallbackContent?: any): Promise<any> => {
    loading.value = true
    error.value = null

    try {
      // Try to fetch from CMS API
      const response = await axios.get(`/api/pages/${slug}`)
      loading.value = false
      return response.data.page
    } catch (err: any) {
      console.warn(`Failed to fetch page ${slug} from CMS:`, err)
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return fallbackContent || null
    }
  }

  // Get homepage section content (using settings for now)
  const getHomepageSection = async (sectionId: string, fallbackContent?: any): Promise<any> => {
    loading.value = true
    error.value = null

    try {
      // For now, we'll use settings to store homepage section data
      // Each section will be stored as a setting with key like "homepage_hero", "homepage_why_join", etc.
      const response = await axios.get(`/api/settings/${sectionId}`)
      loading.value = false
      
      // Parse the JSON content from the setting value
      const settingData = response.data.setting
      if (settingData && settingData.value) {
        try {
          return JSON.parse(settingData.value)
        } catch {
          return { content: settingData.value }
        }
      }
      return null
    } catch (err: any) {
      // Silently handle CMS errors - these are non-critical
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return fallbackContent || null
    }
  }

  // Get site settings
  const getSiteSettings = async (group?: string): Promise<Record<string, string>> => {
    loading.value = true
    error.value = null

    try {
      const url = group ? `/api/settings/group/${group}` : '/api/settings'
      const response = await axios.get(url)
      loading.value = false
      
      // Convert array to object for easier access
      const settingsObject: Record<string, string> = {}
      const settings = response.data.settings || []
      settings.forEach((setting: Setting) => {
        settingsObject[setting.key] = setting.value
      })
      
      return settingsObject
    } catch (err: any) {
      // Silently handle CMS errors - these are non-critical
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return {}
    }
  }

  // Get menu items
  const getMenuItems = async (location: string): Promise<any[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get(`/api/menus/location/${location}`)
      loading.value = false
      return response.data.menu?.items || []
    } catch (err: any) {
      console.warn(`Failed to fetch menu ${location} from CMS:`, err)
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return []
    }
  }

  // Get all pages for navigation
  const getPages = async (): Promise<PageContent[]> => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get('/api/pages?status=published')
      loading.value = false
      return response.data.pages || []
    } catch (err: any) {
      console.warn('Failed to fetch pages from CMS:', err)
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return []
    }
  }

  // Create or update page content
  const savePageContent = async (pageData: Partial<PageContent>): Promise<PageContent | null> => {
    loading.value = true
    error.value = null

    try {
      let response
      if (pageData.id) {
        response = await axios.put(`/api/pages/id/${pageData.id}`, pageData)
      } else {
        response = await axios.post('/api/pages', pageData)
      }
      
      loading.value = false
      return response.data.page
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return null
    }
  }

  // Save homepage section (using settings)
  const saveHomepageSection = async (sectionId: string, content: any): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Store homepage section data as a setting
      const settingData = {
        key: sectionId,
        value: JSON.stringify(content),
        type: 'json',
        group: 'homepage',
        label: `Homepage ${sectionId.replace('_', ' ')}`,
        description: `Homepage section data for ${sectionId}`,
        is_public: true,
        sort_order: 0
      }

      // Try to update existing setting first
      try {
        await axios.put(`/api/settings/${sectionId}`, settingData)
      } catch (err: any) {
        // If setting doesn't exist, create it
        if (err.response?.status === 404) {
          await axios.post('/api/settings', settingData)
        } else {
          throw err
        }
      }
      
      loading.value = false
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return false
    }
  }

  // Save site settings
  const saveSiteSettings = async (settings: Record<string, string>): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      // Convert settings object to array format for batch update
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        type: 'text',
        group: 'general',
        label: key.replace(/_/g, ' '),
        description: `Setting for ${key}`,
        is_public: true,
        sort_order: 0
      }))

      await axios.put('/api/settings/batch', settingsArray)
      loading.value = false
      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message || 'Unknown error'
      loading.value = false
      return false
    }
  }

  // Computed properties
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)
  const errorMessage = computed(() => error.value)

  return {
    // State
    loading: isLoading,
    error: hasError,
    errorMessage,
    
    // Methods
    getPageContent,
    getHomepageSection,
    getSiteSettings,
    getMenuItems,
    getPages,
    savePageContent,
    saveHomepageSection,
    saveSiteSettings
  }
}