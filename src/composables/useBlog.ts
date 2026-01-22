import { ref, computed } from 'vue'
import { blogAPI } from '../services/api'
import type { BlogPost, CreatePostRequest, UpdatePostRequest } from '../types/cms'
import { DataCache, CACHE_KEYS, CACHE_DURATIONS } from '../utils/dataCache'

const posts = ref<BlogPost[]>([])
const currentPost = ref<BlogPost | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useBlog() {
  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Get all posts for CMS
  const fetchPosts = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await blogAPI.getAllPosts()
      posts.value = response.data
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch posts'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Get public posts for website
  const fetchPublicPosts = async (skipCache = false) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Check cache first (unless explicitly skipped)
      if (!skipCache) {
        const cached = DataCache.get<BlogPost[]>(CACHE_KEYS.BLOG_POSTS)
        if (cached) {
          posts.value = cached
          isLoading.value = false
          return { success: true, fromCache: true }
        }
      }
      
      const response = await blogAPI.getPublicPosts(skipCache)
      
      // Handle different response structures
      if (response.data) {
        posts.value = Array.isArray(response.data) ? response.data : [response.data]
      } else if (Array.isArray(response)) {
        posts.value = response
      } else {
        posts.value = []
      }
      
      // Cache for 12 hours (blog rarely changes)
      DataCache.set(CACHE_KEYS.BLOG_POSTS, posts.value, CACHE_DURATIONS.TWELVE_HOURS)
      
      return { success: true }
    } catch (err: any) {
      console.error('Blog API Error:', err)
      
      // If it's an auth error, silently fail (blog is optional)
      if (err.response?.status === 401) {
        console.warn('Blog endpoint requires authentication. Blog section will not be displayed.')
        posts.value = []
        return { success: false, error: 'Blog endpoint requires authentication' }
      }
      
      const message = err.response?.data?.error || 'Failed to fetch posts'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Refresh blog posts (clear cache and fetch fresh data)
  const refreshBlogPosts = async () => {
    DataCache.clear(CACHE_KEYS.BLOG_POSTS)
    return fetchPublicPosts(true) // Skip cache
  }

  // Get single post
  const fetchPost = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await blogAPI.getPost(id)
      currentPost.value = response.data
      
      return { success: true, data: response.data }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch post'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Get public post by slug
  const fetchPublicPost = async (slug: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await blogAPI.getPublicPost(slug)
      currentPost.value = response.data
      
      return { success: true, data: response.data }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch post'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Create post
  const createPost = async (data: CreatePostRequest) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await blogAPI.createPost(data)
      posts.value.unshift(response.data)
      
      return { success: true, data: response.data }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create post'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Update post
  const updatePost = async (id: number, data: UpdatePostRequest) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await blogAPI.updatePost(id, data)
      
      // Update in posts array
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = response.data
      }
      
      // Update current post if it's the same
      if (currentPost.value?.id === id) {
        currentPost.value = response.data
      }
      
      return { success: true, data: response.data }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update post'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Delete post
  const deletePost = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null
      
      await blogAPI.deletePost(id)
      
      // Remove from posts array
      posts.value = posts.value.filter(p => p.id !== id)
      
      // Clear current post if it's the same
      if (currentPost.value?.id === id) {
        currentPost.value = null
      }
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete post'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Computed properties
  const publishedPosts = computed(() => 
    posts.value.filter(post => post.status === 'published')
  )
  
  const draftPosts = computed(() => 
    posts.value.filter(post => post.status === 'draft')
  )
  
  const privatePosts = computed(() => 
    posts.value.filter(post => post.status === 'private')
  )

  return {
    // State
    posts: computed(() => posts.value),
    currentPost: computed(() => currentPost.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed
    publishedPosts,
    draftPosts,
    privatePosts,
    
    // Actions
    fetchPosts,
    fetchPublicPosts,
    fetchPost,
    fetchPublicPost,
    createPost,
    updatePost,
    deletePost,
    clearError,
    refreshBlogPosts,
  }
}
