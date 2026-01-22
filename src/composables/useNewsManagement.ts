import { ref } from 'vue'
import { newsService, type NewsItem, type CreateNewsItemRequest, type UpdateNewsItemRequest } from '../services/newsService'

const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

export function useNewsManagement() {
  const createNewsItem = async (data: CreateNewsItemRequest): Promise<NewsItem> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.createNewsItem(data)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to create news item')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to create news item'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const updateNewsItem = async (data: UpdateNewsItemRequest): Promise<NewsItem> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.updateNewsItem(data.id, data)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to update news item')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to update news item'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteNewsItem = async (id: number): Promise<void> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.deleteNewsItem(id)
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete news item')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to delete news item'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const publishNewsItem = async (id: number): Promise<void> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.publishNewsItem(id)
      if (!response.success) {
        throw new Error(response.error || 'Failed to publish news item')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to publish news item'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const archiveNewsItem = async (id: number): Promise<void> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.archiveNewsItem(id)
      if (!response.success) {
        throw new Error(response.error || 'Failed to archive news item')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to archive news item'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const setBreakingNews = async (id: number, isBreaking: boolean): Promise<void> => {
    try {
      isSubmitting.value = true
      submitError.value = null
      
      const response = await newsService.setBreakingNews(id, isBreaking)
      if (!response.success) {
        throw new Error(response.error || 'Failed to update breaking news status')
      }
    } catch (error) {
      submitError.value = error instanceof Error ? error.message : 'Failed to update breaking news status'
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isSubmitting,
    submitError,
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
    publishNewsItem,
    archiveNewsItem,
    setBreakingNews
  }
}
