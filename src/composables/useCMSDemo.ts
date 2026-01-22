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

// Demo data
const demoPages: Page[] = [
  {
    id: 1,
    title: 'Ghana Commodity Exchange - Home',
    slug: 'home',
    content: '<h1>Welcome to GCX</h1><p>This is a demo page created through the CMS.</p><img src="/trading dashboard.jpg" alt="Trading Platform" />',
    excerpt: 'Ghana\'s premier commodity exchange connecting markets and empowering traders.',
    template: 'default',
    status: 'published',
    meta_title: 'Ghana Commodity Exchange - Home',
    meta_description: 'Ghana\'s premier commodity exchange connecting markets, empowering traders.',
    meta_keywords: 'Ghana, commodity exchange, trading, agriculture',
    sort_order: 0,
    author: { name: 'Admin User' },
    created_at: '2025-01-03T10:00:00Z',
    updated_at: '2025-01-03T10:00:00Z',
    published_at: '2025-01-03T10:00:00Z'
  },
  {
    id: 2,
    title: 'About GCX',
    slug: 'about',
    content: '<h1>About Ghana Commodity Exchange</h1><p>Learn about our mission and vision.</p><img src="/crop.jpg" alt="Agricultural Trading" />',
    excerpt: 'Learn about Ghana Commodity Exchange, our mission, vision, and leadership team.',
    template: 'default',
    status: 'published',
    meta_title: 'About GCX - Ghana Commodity Exchange',
    meta_description: 'Learn about Ghana Commodity Exchange, our mission, vision, and leadership team.',
    meta_keywords: 'about, GCX, Ghana commodity exchange, mission, vision',
    sort_order: 1,
    author: { name: 'Admin User' },
    created_at: '2025-01-03T10:00:00Z',
    updated_at: '2025-01-03T10:00:00Z',
    published_at: '2025-01-03T10:00:00Z'
  },
  {
    id: 3,
    title: 'Our Services',
    slug: 'services',
    content: '<h1>Our Services</h1><p>Comprehensive trading solutions for agricultural commodities.</p><img src="/maize.jpg" alt="Agricultural Services" />',
    excerpt: 'Discover our comprehensive services including trade facilitation, price discovery, and quality control.',
    template: 'default',
    status: 'draft',
    meta_title: 'Our Services - GCX',
    meta_description: 'Comprehensive trading solutions for agricultural commodities.',
    meta_keywords: 'services, trading, price discovery, storage, quality control',
    sort_order: 2,
    author: { name: 'Admin User' },
    created_at: '2025-01-03T10:00:00Z',
    updated_at: '2025-01-03T10:00:00Z'
  }
]

export const useCMSDemo = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pages = ref<Page[]>([...demoPages])

  // Pages API (Demo Mode)
  const pagesAPI = {
    // Get all pages
    async getAll(filters?: any) {
      loading.value = true
      error.value = null
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        let filteredPages = [...pages.value]
        
        // Apply filters
        if (filters?.status && filters.status !== 'all') {
          filteredPages = filteredPages.filter(page => page.status === filters.status)
        }
        
        if (filters?.search) {
          const search = filters.search.toLowerCase()
          filteredPages = filteredPages.filter(page => 
            page.title.toLowerCase().includes(search) ||
            page.slug.toLowerCase().includes(search) ||
            page.content.toLowerCase().includes(search)
          )
        }
        
        // Apply sorting
        if (filters?.order_by) {
          filteredPages.sort((a, b) => {
            const aValue = (a as any)[filters.order_by]
            const bValue = (b as any)[filters.order_by]
            
            if (filters.order_dir === 'asc') {
              return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
              return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
          })
        }
        
        return filteredPages
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
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const page = pages.value.find(p => p.id === id)
        if (!page) {
          throw new Error('Page not found')
        }
        
        return page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Get page by slug
    async getBySlug(slug: string) {
      loading.value = true
      error.value = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const page = pages.value.find(p => p.slug === slug && p.status === 'published')
        if (!page) {
          throw new Error('Published page not found')
        }
        
        return page
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Create page
    async create(pageData: Omit<Page, 'id'>) {
      loading.value = true
      error.value = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const newPage: Page = {
          ...pageData,
          id: Math.max(...pages.value.map(p => p.id || 0)) + 1,
          author: { name: 'Current User' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: pageData.status === 'published' ? new Date().toISOString() : undefined
        }
        
        pages.value.push(newPage)
        return newPage
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to create page'
        throw err
      } finally {
        loading.value = false
      }
    },

    // Update page
    async update(id: number, pageData: Partial<Page>) {
      loading.value = true
      error.value = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const pageIndex = pages.value.findIndex(p => p.id === id)
        if (pageIndex === -1) {
          throw new Error('Page not found')
        }
        
        const updatedPage = {
          ...pages.value[pageIndex],
          ...pageData,
          updated_at: new Date().toISOString()
        }
        
        pages.value[pageIndex] = updatedPage
        return updatedPage
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
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const pageIndex = pages.value.findIndex(p => p.id === id)
        if (pageIndex === -1) {
          throw new Error('Page not found')
        }
        
        pages.value.splice(pageIndex, 1)
        return true
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to delete page'
        throw err
      } finally {
        loading.value = false
      }
    }
  }

  return {
    loading,
    error,
    pages: pagesAPI
  }
}
