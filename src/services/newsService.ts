import axios from '../plugins/axios'

export interface NewsItem {
  id: number
  title: string
  content: string
  source: 'gcx' | 'partner' | 'external' | 'api' | 'firebase'
  source_name?: string
  source_url?: string
  category?: string
  priority: number
  is_breaking: boolean
  published_at: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface NewsCategory {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NewsResponse {
  success: boolean
  data: NewsItem[]
  count: number
}

export interface NewsCategoryResponse {
  success: boolean
  data: NewsCategory[]
}

export interface NewsItemResponse {
  success: boolean
  data: NewsItem
}

export interface NewsPaginationResponse {
  success: boolean
  data: NewsItem[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface CreateNewsItemRequest {
  title: string
  content: string
  source?: 'gcx' | 'partner' | 'external' | 'api' | 'firebase'
  source_name?: string
  source_url?: string
  category?: string
  priority?: number
  is_breaking?: boolean
  status?: 'draft' | 'published' | 'archived'
  expires_at?: string
}

export interface UpdateNewsItemRequest extends Partial<CreateNewsItemRequest> {
  id: number
}

export interface CreateNewsCategoryRequest {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface UpdateNewsCategoryRequest extends Partial<CreateNewsCategoryRequest> {
  id: number
}

export interface NewsFilters {
  limit?: number
  source?: string
  category?: string
  breaking?: boolean
  status?: string
  page?: number
}

class NewsService {
  private baseUrl = '/api/news'

  // Public endpoints (no authentication required)
  
  /**
   * Get active news items for the ticker
   */
  async getNewsItems(filters: NewsFilters = {}): Promise<NewsResponse> {
    const params = new URLSearchParams()
    
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.source) params.append('source', filters.source)
    if (filters.category) params.append('category', filters.category)
    if (filters.breaking !== undefined) params.append('breaking', filters.breaking.toString())
    
    const response = await axios.get(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  /**
   * Get breaking news items only
   */
  async getBreakingNews(limit: number = 10): Promise<NewsResponse> {
    const response = await axios.get(`${this.baseUrl}/breaking?limit=${limit}`)
    return response.data
  }

  /**
   * Get a single news item by ID
   */
  async getNewsItem(id: number): Promise<NewsItemResponse> {
    const response = await axios.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  /**
   * Get all news categories
   */
  async getNewsCategories(): Promise<NewsCategoryResponse> {
    const response = await axios.get('/api/news-categories')
    return response.data
  }

  // Protected endpoints (authentication required)

  /**
   * Get all news items for CMS management
   */
  async getAllNewsItems(filters: NewsFilters = {}): Promise<NewsPaginationResponse> {
    const params = new URLSearchParams()
    
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.status) params.append('status', filters.status)
    if (filters.source) params.append('source', filters.source)
    if (filters.category) params.append('category', filters.category)
    if (filters.breaking !== undefined) params.append('breaking', filters.breaking.toString())
    
    const response = await axios.get(`/api/cms/news?${params.toString()}`)
    return response.data
  }

  /**
   * Create a new news item
   */
  async createNewsItem(data: CreateNewsItemRequest): Promise<NewsItemResponse> {
    const response = await axios.post('/api/cms/news', data)
    return response.data
  }

  /**
   * Update an existing news item
   */
  async updateNewsItem(data: UpdateNewsItemRequest): Promise<NewsItemResponse> {
    const { id, ...updateData } = data
    const response = await axios.put(`/api/cms/news/${id}`, updateData)
    return response.data
  }

  /**
   * Delete a news item
   */
  async deleteNewsItem(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`/api/cms/news/${id}`)
    return response.data
  }

  /**
   * Publish a news item
   */
  async publishNewsItem(id: number): Promise<NewsItemResponse> {
    const response = await axios.post(`/api/cms/news/${id}/publish`)
    return response.data
  }

  /**
   * Archive a news item
   */
  async archiveNewsItem(id: number): Promise<NewsItemResponse> {
    const response = await axios.post(`/api/cms/news/${id}/archive`)
    return response.data
  }

  /**
   * Set breaking news status
   */
  async setBreakingNews(id: number, isBreaking: boolean): Promise<NewsItemResponse> {
    const response = await axios.put(`/api/cms/news/${id}/breaking`, {
      is_breaking: isBreaking
    })
    return response.data
  }

  /**
   * Create a news category
   */
  async createNewsCategory(data: CreateNewsCategoryRequest): Promise<{ success: boolean; data: NewsCategory }> {
    const response = await axios.post('/api/cms/news-categories', data)
    return response.data
  }

  /**
   * Update a news category
   */
  async updateNewsCategory(data: UpdateNewsCategoryRequest): Promise<{ success: boolean; data: NewsCategory }> {
    const { id, ...updateData } = data
    const response = await axios.put(`/api/cms/news-categories/${id}`, updateData)
    return response.data
  }

  /**
   * Delete a news category
   */
  async deleteNewsCategory(id: number): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`/api/cms/news-categories/${id}`)
    return response.data
  }

  // Utility methods

  /**
   * Format time ago string
   */
  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 604800)}w ago`
  }

  /**
   * Get category color classes
   */
  getCategoryColor(category?: string): string {
    const colors: Record<string, string> = {
      'market': 'text-green-400 bg-green-500/20 border-green-500/30',
      'announcement': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      'event': 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      'partnership': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      'regulation': 'text-red-400 bg-red-500/20 border-red-500/30',
      'technology': 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
      'default': 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
    return colors[category || 'default'] || colors.default
  }

  /**
   * Get source display name
   */
  getSourceDisplayName(source: string, sourceName?: string): string {
    if (sourceName) return sourceName
    
    const sourceNames: Record<string, string> = {
      'gcx': 'GCX',
      'partner': 'Partner',
      'external': 'External Source',
      'api': 'API Feed',
      'firebase': 'Firebase'
    }
    
    return sourceNames[source] || source
  }

  /**
   * Check if news item is expired
   */
  isNewsExpired(newsItem: NewsItem): boolean {
    if (!newsItem.expires_at) return false
    return new Date(newsItem.expires_at) < new Date()
  }

  /**
   * Check if news item is published and active
   */
  isNewsActive(newsItem: NewsItem): boolean {
    const isPublished = newsItem.published_at && new Date(newsItem.published_at) <= new Date()
    const isNotExpired = !this.isNewsExpired(newsItem)
    return isPublished && isNotExpired
  }
}

// Export singleton instance
export const newsService = new NewsService()
export default newsService
