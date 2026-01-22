import { ref, computed, onMounted, onUnmounted } from 'vue'
import { newsService, type NewsItem, type NewsFilters } from '../services/newsService'

export function useNews() {
  const newsItems = ref<NewsItem[]>([])
  const breakingNews = ref<NewsItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Computed properties
  const activeNewsItems = computed(() => {
    return newsItems.value.filter(item => newsService.isNewsActive(item))
  })

  const hasBreakingNews = computed(() => {
    return breakingNews.value.length > 0
  })

  const newsByCategory = computed(() => {
    const categories: Record<string, NewsItem[]> = {}
    newsItems.value.forEach(item => {
      const category = item.category || 'uncategorized'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(item)
    })
    return categories
  })

  // Methods
  const fetchNewsItems = async (filters: NewsFilters = {}) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await newsService.getNewsItems({
        limit: filters.limit || 20,
        ...filters
      })

      if (response.success) {
        newsItems.value = response.data
        lastUpdated.value = new Date()
      } else {
        throw new Error('Failed to fetch news items')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load news'
      console.error('Error fetching news items:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchBreakingNews = async () => {
    try {
      const response = await newsService.getBreakingNews()
      if (response.success) {
        breakingNews.value = response.data
      }
    } catch (err) {
      console.error('Error fetching breaking news:', err)
    }
  }

  const refreshNews = async () => {
    await Promise.all([
      fetchNewsItems(),
      fetchBreakingNews()
    ])
  }

  const getNewsItemById = (id: number): NewsItem | undefined => {
    return newsItems.value.find(item => item.id === id)
  }

  const getNewsByCategory = (category: string): NewsItem[] => {
    return newsItems.value.filter(item => item.category === category)
  }

  const getNewsBySource = (source: string): NewsItem[] => {
    return newsItems.value.filter(item => item.source === source)
  }

  const formatNewsTime = (dateString: string): string => {
    return newsService.formatTimeAgo(dateString)
  }

  const getCategoryColor = (category?: string): string => {
    return newsService.getCategoryColor(category)
  }

  const getSourceDisplayName = (source: string, sourceName?: string): string => {
    return newsService.getSourceDisplayName(source, sourceName)
  }

  // Auto-refresh functionality
  let refreshInterval: number | null = null

  const startAutoRefresh = (intervalMs: number = 300000) => { // Default 5 minutes
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    refreshInterval = setInterval(async () => {
      await refreshNews()
    }, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Lifecycle hooks
  onMounted(async () => {
    await refreshNews()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    // State
    newsItems: computed(() => newsItems.value),
    breakingNews: computed(() => breakingNews.value),
    activeNewsItems,
    hasBreakingNews,
    newsByCategory,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    lastUpdated: computed(() => lastUpdated.value),

    // Methods
    fetchNewsItems,
    fetchBreakingNews,
    refreshNews,
    getNewsItemById,
    getNewsByCategory,
    getNewsBySource,
    formatNewsTime,
    getCategoryColor,
    getSourceDisplayName,
    startAutoRefresh,
    stopAutoRefresh
  }
}

export function useNewsTicker() {
  const { newsItems, isLoading, error, fetchNewsItems } = useNews()
  const currentIndex = ref(0)
  const isPaused = ref(false)
  const tickerInterval = ref<number | null>(null)

  const currentNewsItem = computed(() => {
    return newsItems.value[currentIndex.value] || null
  })

  const nextNewsItem = () => {
    if (isPaused.value || newsItems.value.length === 0) return
    currentIndex.value = (currentIndex.value + 1) % newsItems.value.length
  }

  const prevNewsItem = () => {
    if (isPaused.value || newsItems.value.length === 0) return
    currentIndex.value = currentIndex.value === 0 
      ? newsItems.value.length - 1 
      : currentIndex.value - 1
  }

  const pauseTicker = () => {
    isPaused.value = true
    if (tickerInterval.value) {
      clearInterval(tickerInterval.value)
      tickerInterval.value = null
    }
  }

  const resumeTicker = () => {
    isPaused.value = false
    startTicker()
  }

  const startTicker = (intervalMs: number = 8000) => { // Default 8 seconds per item
    if (tickerInterval.value) {
      clearInterval(tickerInterval.value)
    }
    
    tickerInterval.value = setInterval(() => {
      nextNewsItem()
    }, intervalMs)
  }

  const stopTicker = () => {
    if (tickerInterval.value) {
      clearInterval(tickerInterval.value)
      tickerInterval.value = null
    }
  }

  const goToNewsItem = (index: number) => {
    if (index >= 0 && index < newsItems.value.length) {
      currentIndex.value = index
    }
  }

  // Calculate animation duration based on text length
  const getAnimationDuration = (newsItem: NewsItem | null): number => {
    if (!newsItem) return 8
    
    const textLength = newsItem.title.length
    const baseDuration = 8 // Base 8 seconds
    const additionalTime = Math.max(0, (textLength - 50) * 0.05) // 0.05s per character over 50
    
    return Math.min(15, baseDuration + additionalTime) // Max 15 seconds
  }

  const animationDuration = computed(() => {
    return getAnimationDuration(currentNewsItem.value)
  })

  onMounted(async () => {
    await fetchNewsItems({ limit: 20 })
    if (newsItems.value.length > 0) {
      startTicker()
    }
  })

  onUnmounted(() => {
    stopTicker()
  })

  return {
    // State
    currentNewsItem,
    currentIndex: computed(() => currentIndex.value),
    isPaused: computed(() => isPaused.value),
    animationDuration,
    isLoading,
    error,

    // Methods
    nextNewsItem,
    prevNewsItem,
    pauseTicker,
    resumeTicker,
    startTicker,
    stopTicker,
    goToNewsItem,
    getAnimationDuration
  }
}

export function useNewsManagement() {
  const { refreshNews } = useNews()
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)

  const createNewsItem = async (data: any) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.createNewsItem(data)
      if (response.success) {
        await refreshNews()
        return response.data
      } else {
        throw new Error('Failed to create news item')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to create news item'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const updateNewsItem = async (data: any) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.updateNewsItem(data)
      if (response.success) {
        await refreshNews()
        return response.data
      } else {
        throw new Error('Failed to update news item')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to update news item'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteNewsItem = async (id: number) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.deleteNewsItem(id)
      if (response.success) {
        await refreshNews()
        return true
      } else {
        throw new Error('Failed to delete news item')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to delete news item'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const publishNewsItem = async (id: number) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.publishNewsItem(id)
      if (response.success) {
        await refreshNews()
        return response.data
      } else {
        throw new Error('Failed to publish news item')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to publish news item'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const archiveNewsItem = async (id: number) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.archiveNewsItem(id)
      if (response.success) {
        await refreshNews()
        return response.data
      } else {
        throw new Error('Failed to archive news item')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to archive news item'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  const setBreakingNews = async (id: number, isBreaking: boolean) => {
    try {
      isSubmitting.value = true
      submitError.value = null

      const response = await newsService.setBreakingNews(id, isBreaking)
      if (response.success) {
        await refreshNews()
        return response.data
      } else {
        throw new Error('Failed to update breaking news status')
      }
    } catch (err) {
      submitError.value = err instanceof Error ? err.message : 'Failed to update breaking news status'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting: computed(() => isSubmitting.value),
    submitError: computed(() => submitError.value),
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
    publishNewsItem,
    archiveNewsItem,
    setBreakingNews
  }
}
