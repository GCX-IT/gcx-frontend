import axios from '../plugins/axios'

export interface SearchResult {
  id: string
  title: string
  content: string
  type: 'page' | 'news' | 'commodity' | 'blog' | 'member'
  url: string
  excerpt?: string
  publishedAt?: string
  category?: string
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  took: number
}

class SearchService {
  /**
   * Search across all content types
   */
  async search(query: string, limit: number = 20): Promise<SearchResponse> {
    // Use fallback search since we don't have a unified search API yet
    return this.fallbackSearch(query, limit)
  }

  /**
   * Search specific content type
   */
  async searchByType(query: string, type: string, limit: number = 20): Promise<SearchResponse> {
    // Use fallback search with specific type filter
    return this.fallbackSearch(query, limit, type)
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string): Promise<string[]> {
    try {
      const response = await axios.get('/api/search/suggestions', {
        params: { q: query }
      })
      return response.data.suggestions
    } catch (error) {
      console.error('Suggestions error:', error)
      return []
    }
  }

  /**
   * Fallback client-side search when API is not available
   */
  private async fallbackSearch(query: string, limit: number = 20, type?: string): Promise<SearchResponse> {
    const results: SearchResult[] = []
    const searchTerm = query.toLowerCase()
    

    try {
      // Search news items
      if (!type || type === 'news') {
        try {
          const newsResponse = await axios.get('/api/news', {
            params: { limit: 50 }
          })
          const newsResults = newsResponse.data.news?.filter((item: any) => 
            item.title?.toLowerCase().includes(searchTerm) ||
            item.content?.toLowerCase().includes(searchTerm)
          ).slice(0, 10).map((item: any) => ({
            id: `news-${item.id}`,
            title: item.title,
            content: item.content,
            type: 'news' as const,
            url: `/news/${item.id}`,
            excerpt: item.content?.substring(0, 150) + '...',
            publishedAt: item.published_at,
            category: item.category
          }))
          results.push(...newsResults)
        } catch (error) {
          console.log('News search failed, using static data')
        }
      }

      // Search commodities - use the existing commodities service
      if (!type || type === 'commodity') {
        try {
          // Try to get commodities from the existing service
          const { commoditiesService } = await import('./commoditiesService')
          const commoditiesData = await commoditiesService.getCombinedCommodityData()
          
          const commodityResults = commoditiesData.filter((item: any) =>
            item.name?.toLowerCase().includes(searchTerm) ||
            item.description?.toLowerCase().includes(searchTerm) ||
            item.category?.toLowerCase().includes(searchTerm)
          ).slice(0, 5).map((item: any) => ({
            id: `commodity-${item.id || item.name}`,
            title: item.name,
            content: item.description,
            type: 'commodity' as const,
            url: `/commodities#${item.name.toLowerCase().replace(/\s+/g, '')}`,
            excerpt: item.description?.substring(0, 150) + '...',
            category: item.category
          }))
          results.push(...commodityResults)
        } catch (error) {
          console.log('Commodities search failed, using static data')
          
          // Static commodity data as fallback
          const staticCommodities = [
            { name: 'White Maize', description: 'High quality white maize for trading', category: 'Grains' },
            { name: 'Yellow Maize', description: 'Premium yellow maize commodity', category: 'Grains' },
            { name: 'Soya Bean', description: 'Soya bean trading and specifications', category: 'Oilseeds' },
            { name: 'Sesame', description: 'Sesame seed commodity trading', category: 'Oilseeds' },
            { name: 'Rice', description: 'Rice commodity market data', category: 'Grains' },
            { name: 'Sorghum', description: 'Sorghum trading information', category: 'Grains' }
          ]
          
          const commodityResults = staticCommodities.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
          ).map(item => ({
            id: `commodity-${item.name}`,
            title: item.name,
            content: item.description,
            type: 'commodity' as const,
            url: `/commodities#${item.name.toLowerCase().replace(/\s+/g, '')}`,
            excerpt: item.description.substring(0, 150) + '...',
            category: item.category
          }))
          results.push(...commodityResults)
        }
      }

      // Search blog posts
      if (!type || type === 'blog') {
        try {
          const blogResponse = await axios.get('/api/blog/posts', {
            params: { limit: 50 }
          })
          const blogResults = blogResponse.data.posts?.filter((item: any) =>
            item.title?.toLowerCase().includes(searchTerm) ||
            item.content?.toLowerCase().includes(searchTerm)
          ).slice(0, 10).map((item: any) => ({
            id: `blog-${item.id}`,
            title: item.title,
            content: item.content,
            type: 'blog' as const,
            url: `/blog/${item.slug}`,
            excerpt: item.excerpt || item.content?.substring(0, 150) + '...',
            publishedAt: item.published_at,
            category: item.category
          }))
          results.push(...blogResults)
        } catch (error) {
          console.log('Blog search failed, using static data')
        }
      }

      // Add static page results
      if (!type || type === 'page') {
        const staticPages = [
          { title: 'About GCX', content: 'Learn about Ghana Commodity Exchange mission and vision', url: '/about' },
          { title: 'Market Data', content: 'Access real-time market data and commodity prices', url: '/market-data' },
          { title: 'Membership', content: 'Join GCX as a member and access trading platform', url: '/membership' },
          { title: 'Commodities', content: 'Trading commodities and specifications for maize, rice, sesame', url: '/commodities' },
          { title: 'Resources', content: 'Publications, documents, and research papers', url: '/resources' },
          { title: 'Contact', content: 'Get in touch with GCX team and offices', url: '/contact' },
          { title: 'Trading Services', content: 'Commodity trading and market access services', url: '/services#trading' },
          { title: 'Risk Management', content: 'Comprehensive risk management solutions', url: '/services#risk' },
          { title: 'Settlement Services', content: 'Secure and efficient trade settlement', url: '/services#settlement' }
        ]

        const pageResults = staticPages.filter(page =>
          page.title.toLowerCase().includes(searchTerm) ||
          page.content.toLowerCase().includes(searchTerm)
        ).map(page => ({
          id: `page-${page.url}`,
          title: page.title,
          content: page.content,
          type: 'page' as const,
          url: page.url,
          excerpt: page.content
        }))
        results.push(...pageResults)
      }

    } catch (error) {
      console.error('Fallback search error:', error)
    }

    
    return {
      results: results.slice(0, limit),
      total: results.length,
      query,
      took: 0
    }
  }
}

export default new SearchService()
