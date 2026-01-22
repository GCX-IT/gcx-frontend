<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import BlogHero from '../components/Blog/BlogHero.vue'
import RecentPosts from '../components/Blog/RecentPosts.vue'
import BlogFilters from '../components/Blog/BlogFilters.vue'
import BlogPostsGrid from '../components/Blog/BlogPostsGrid.vue'
import { useBlog } from '../composables/useBlog'
import { getImageUrl } from '../utils/imageUrl'
import Footer from '../components/Footer.vue'

const { posts, fetchPublicPosts, refreshBlogPosts, isLoading } = useBlog()

// Blog posts from API - no more mock data!
const blogPosts = ref([])
const { t } = useI18n()

const searchQuery = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const postsPerPage = 6

// Filter posts based on search and tags
const filteredPosts = computed(() => {
  let posts = blogPosts.value

  if (searchQuery.value) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedTag.value) {
    posts = posts.filter(post => post.tags.includes(selectedTag.value))
  }

  return posts
})

// Get all unique tags
const allTags = computed(() => {
  const tags = new Set<string>()
  blogPosts.value.forEach(post => {
    post.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedTag.value = ''
  currentPage.value = 1
}

// Manual refresh function - clears cache and fetches fresh data
const refreshPosts = async () => {
  // Clear browser HTTP cache
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map(name => caches.delete(name)))
    } catch (error) {
      console.warn('Could not clear browser cache:', error)
    }
  }
  
  // Clear application localStorage cache
  const { DataCache, CACHE_KEYS } = await import('../utils/dataCache')
  DataCache.clear(CACHE_KEYS.BLOG_POSTS)
  DataCache.clearAll() // Clear all GCX caches for good measure
  
  // Clear local state
  blogPosts.value = []
  
  // Force reload with cache bypass
  await loadPosts(true) // Skip cache on refresh
}

// Load posts function
const loadPosts = async (skipCache = false) => {
  try {
    const result = skipCache ? await refreshBlogPosts() : await fetchPublicPosts()
    
    if (posts.value && posts.value.length > 0) {
      // Transform API posts to match frontend structure
      const transformedPosts = posts.value.map(post => {
        // Handle null/undefined tags
        let postTags: string[] = []
        if (post.tags) {
          if (typeof post.tags === 'string') {
            try {
              postTags = JSON.parse(post.tags)
            } catch {
              postTags = (post.tags as string).split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          } else if (Array.isArray(post.tags)) {
            postTags = post.tags
          }
        }
        
        // Generate excerpt if not provided
        let excerpt = post.excerpt
        if (!excerpt && post.content) {
          excerpt = post.content.replace(/<[^>]*>/g, ' ').trim().substring(0, 160)
          if (excerpt.length === 160) excerpt += '...'
        }
        
        // Handle featured image - use getImageUrl to properly handle S3 URLs
        const featuredImage = post.featured_image ? getImageUrl(post.featured_image) : '/trading.jpg'
        
        // Handle date formatting
        let postDate
        try {
          const dateToUse = post.published_at || post.created_at
          postDate = new Date(dateToUse).toISOString().split('T')[0]
        } catch {
          postDate = new Date().toISOString().split('T')[0]
        }
        
        // Handle author - could be string or object
        let authorName = 'GCX Team'
        if (post.author) {
          if (typeof post.author === 'string') {
            authorName = post.author
          } else if (typeof post.author === 'object' && post.author.name) {
            authorName = post.author.name
          }
        }
        
        return {
          id: post.id,
          title: post.title || 'Untitled Post',
          excerpt: excerpt || 'No excerpt available',
          author: authorName,
          date: postDate,
          image: featuredImage,
          tags: postTags,
          featured: false, // You can add featured logic later
          slug: post.slug || post.id.toString()
        }
      })
      
      blogPosts.value = transformedPosts
    } else {
      blogPosts.value = []
    }
  } catch (error) {
    console.error('Failed to fetch posts from API:', error)
    blogPosts.value = []
  }
}

// Load blog posts on component mount
onMounted(loadPosts)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section with Subscription -->
    <BlogHero />
    
    <!-- Recent Blog Posts -->
    <RecentPosts :posts="filteredPosts" />
    
    <!-- All Blog Posts -->
    <section class="py-24 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
      <div class="max-w-[1600px] mx-auto px-4">
        <!-- Search and Filters -->
        <BlogFilters
          v-model:search-query="searchQuery"
          v-model:selected-tag="selectedTag"
          :all-tags="allTags"
          @clear-filters="clearFilters"
        />

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              All Blog Posts
            </h2>
            <p class="text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              Discover insights, updates, and stories from GCX
            </p>
          </div>
          <button 
            @click="refreshPosts"
            :disabled="isLoading"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg 
              class="w-5 h-5 transition-transform duration-300" 
              :class="isLoading ? 'animate-spin' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isLoading ? 'Refreshing...' : 'Refresh Posts' }}
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-6"></div>
          <p class="text-xl font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            Loading blog posts...
          </p>
          <p class="text-sm mt-2" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">
            Fetching the latest content
          </p>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!isLoading && blogPosts.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-100'">
            <svg class="w-12 h-12" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            No Blog Posts Yet
          </h3>
          <p class="text-lg mb-6" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            Create your first blog post in the CMS to see it here!
          </p>
          <router-link
            to="/cms/posts"
            class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to CMS
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>
        
        <!-- Posts Grid with Pagination -->
        <BlogPostsGrid
          v-else
          :posts="filteredPosts"
          v-model:current-page="currentPage"
          :posts-per-page="postsPerPage"
        />
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #eab308;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ca8a04;
}
</style>
