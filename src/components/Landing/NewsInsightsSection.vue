<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronRightIcon, CalendarIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { isDarkMode } from '../../utils/darkMode'
import { blogAPI } from '../../services/api'
import type { BlogPost } from '../../types/cms'
import { useRouter } from 'vue-router'
import { getImageUrl } from '../../utils/imageUrl'

const router = useRouter()

// Local state
const blogPosts = ref<BlogPost[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await blogAPI.getPublicPosts(false)
    
    if (response.data) {
      blogPosts.value = Array.isArray(response.data) ? response.data : [response.data]
    } else if (Array.isArray(response)) {
      blogPosts.value = response
    } else {
      blogPosts.value = []
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load blog posts'
    blogPosts.value = []
  } finally {
    isLoading.value = false
  }
})

const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return 'Recently'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

const retryFetch = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await blogAPI.getPublicPosts(true)
    if (response.data) {
      blogPosts.value = Array.isArray(response.data) ? response.data : [response.data]
    } else if (Array.isArray(response)) {
      blogPosts.value = response
    } else {
      blogPosts.value = []
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load blog posts'
    blogPosts.value = []
  } finally {
    isLoading.value = false
  }
}

const refreshNews = async () => {
  await retryFetch()
}

const displayNewsItems = computed(() => {
  if (!blogPosts.value || blogPosts.value.length === 0) {
    return []
  }
  
  const itemsToShow = Math.min(blogPosts.value.length, 3)
  
  return blogPosts.value.slice(0, itemsToShow).map((post) => {
    let excerpt = post.excerpt
    if (!excerpt && post.content) {
      excerpt = post.content.replace(/<[^>]*>/g, ' ').trim().substring(0, 200) + (post.content.length > 200 ? '...' : '')
    }
    if (!excerpt) excerpt = 'No excerpt available'
    
    const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at)
    const formattedDate = publishedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    const timeAgo = formatTimeAgo(post.published_at || post.created_at)
    const category = 'Announcement'
    const color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' = 'blue'
    
    let author = 'GCX Team'
    if (post.author) {
      if (typeof post.author === 'string') {
        author = post.author
      } else if (typeof post.author === 'object' && (post.author as any).name) {
        author = (post.author as any).name
      }
    }
    
    let image = '/trading.jpg'
    if (post.featured_image) {
      image = getImageUrl(post.featured_image)
    }
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title || 'Untitled Post',
      category,
      excerpt,
      image,
      time: timeAgo,
      date: formattedDate,
      author,
      color
    }
  })
})

const goToNews = (item: any) => {
  if (item.slug) {
    router.push(`/blog/${item.slug}`)
  } else {
    router.push(`/blog`)
  }
}
</script>

<template>
  <section class="py-24 transition-colors duration-300" :class="isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'">
    <div class="max-w-[1600px] mx-auto px-8">
      <!-- Section Header -->
      <div class="text-center mb-20">
        <div class="flex items-center justify-center gap-4 mb-6">
          <h2 class="text-5xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Latest News & Insights</h2>
          <button
            @click="refreshNews"
            :disabled="isLoading"
            title="Refresh news"
            class="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              class="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-transform duration-300" 
              :class="{ 'animate-spin': isLoading }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <p class="text-xl max-w-3xl mx-auto transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Stay informed with the latest developments from GCX</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="grid lg:grid-cols-3 gap-12">
        <div 
          v-for="i in 3" 
          :key="i"
          class="rounded-3xl shadow-2xl overflow-hidden animate-pulse"
          :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
        >
          <div class="h-80 bg-slate-700"></div>
          <div class="p-8 space-y-4">
            <div class="h-4 bg-slate-700 rounded w-3/4"></div>
            <div class="h-6 bg-slate-700 rounded w-full"></div>
            <div class="h-4 bg-slate-700 rounded w-full"></div>
            <div class="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-lg mb-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          {{ error }}
        </p>
        <button 
          @click="retryFetch"
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all"
        >
          Retry
        </button>
      </div>
      
      <!-- News Cards Grid -->
      <div v-else-if="displayNewsItems.length > 0" :class="[
        'grid gap-12',
        displayNewsItems.length === 1 ? 'lg:grid-cols-1 max-w-2xl mx-auto' :
        displayNewsItems.length === 2 ? 'lg:grid-cols-2' :
        'lg:grid-cols-3'
      ]">
        <div 
          v-for="item in displayNewsItems" 
          :key="item.id"
          class="group rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 cursor-pointer"
          :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
          @click="goToNews(item)"
        >
          <!-- Image Section -->
          <div class="relative h-80 overflow-hidden">
            <img 
              :src="item.image" 
              :alt="item.title" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              @error="(e) => {
                ;(e.target as HTMLImageElement).src = '/trading.jpg'
              }"
            />
            <!-- Category Badge -->
            <div class="absolute top-6 left-6">
              <span class="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg" :class="{
                'bg-red-500': item.color === 'red',
                'bg-yellow-500': item.color === 'yellow',
                'bg-green-500': item.color === 'green'
              }">
                {{ item.category }}
              </span>
            </div>
            <!-- Time Badge -->
            <div class="absolute top-6 right-6">
              <span class="px-3 py-2 rounded-lg text-xs font-medium text-white bg-black/50 backdrop-blur-sm">
                {{ item.time }}
              </span>
            </div>
          </div>
          
          <!-- Content Section -->
          <div class="p-8">
            <div class="space-y-6">
              <!-- Meta Information -->
              <div class="flex items-center gap-4 text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <CalendarIcon class="w-4 h-4" />
                  <span>{{ item.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <ClockIcon class="w-4 h-4" />
                  <span>{{ item.time }}</span>
                </div>
              </div>
              
              <!-- Title -->
              <h3 class="text-2xl font-bold leading-tight transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ item.title }}
              </h3>
              
              <!-- Excerpt -->
              <p class="text-base leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ item.excerpt }}
              </p>
              
              <!-- Author -->
              <div class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                By {{ item.author }}
              </div>
              
              <!-- CTA Button -->
              <button 
                @click.stop="goToNews(item)"
                class="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg text-base"
              >
                Read Full Article
                <ChevronRightIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-100'">
          <svg class="w-8 h-8" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          No Blog Posts Available
        </h3>
        <p class="text-base mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Publish blog posts in the CMS to see them here.
        </p>
      </div>
      
      <!-- View All News Button -->
      <div v-if="!isLoading && displayNewsItems.length > 0" class="text-center mt-16">
        <button 
          @click="router.push('/blog')"
          class="bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 text-lg"
        >
          View All News & Insights ?
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions for news changes */
.transition-all {
  transition: all 0.5s ease-in-out;
}

/* Only image hover effect - no card movement */
.group:hover img {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg:grid-cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .gap-12 {
    gap: 2rem;
  }
  
  .py-24 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  
  .mb-20 {
    margin-bottom: 3rem;
  }
  
  .mt-16 {
    margin-top: 3rem;
  }
}

@media (max-width: 768px) {
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .gap-12 {
    gap: 1.5rem;
  }
}
</style>
