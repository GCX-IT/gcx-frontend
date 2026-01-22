<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ExclamationTriangleIcon, NewspaperIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '../../composables/useI18n'
import axios from '../../plugins/axios'
import { DataCache, CACHE_KEYS, CACHE_DURATIONS } from '../../utils/dataCache'

const { t } = useI18n()

// News items interface
interface NewsItem {
  id: number
  title: string
  content: string
  source: string
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

// Reactive data
const newsItems = ref<NewsItem[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const isPaused = ref(false)

// Computed properties
const breakingNews = computed(() => {
  return newsItems.value.filter(item => item.is_breaking)
})

const hasBreakingNews = computed(() => {
  return breakingNews.value.length > 0
})

// Create duplicated news items for seamless scrolling
const duplicatedNewsItems = computed(() => {
  if (newsItems.value.length === 0) return []
  // Duplicate the array to create seamless loop
  return [...newsItems.value, ...newsItems.value]
})

// Methods
const fetchNewsItems = async (skipCache = false) => {
  try {
    isLoading.value = true
    error.value = null
    
    // Check cache first - news updates every 30 minutes (unless skipped)
    if (!skipCache) {
      const cached = DataCache.get<NewsItem[]>(CACHE_KEYS.NEWS_ITEMS)
      if (cached) {
        newsItems.value = cached
        isLoading.value = false
        return
      }
    }
    
    const { data } = await axios.get('/api/news', { params: { limit: 20 } })
    if (data?.success && data?.data) {
      newsItems.value = data.data
      // Cache for 30 minutes
      DataCache.set(CACHE_KEYS.NEWS_ITEMS, newsItems.value, CACHE_DURATIONS.THIRTY_MINUTES)
    } else {
      throw new Error(data?.error || 'Failed to fetch news')
    }
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load news'
  } finally {
    isLoading.value = false
  }
}

const refreshNews = async () => {
  DataCache.clear(CACHE_KEYS.NEWS_ITEMS)
  return fetchNewsItems(true)
}

const fetchBreakingNews = async () => {
  try {
    const { data } = await axios.get('/api/news/breaking')
    if (data?.success && data?.data) {
      // Merge breaking news with existing news, avoiding duplicates
      const existingIds = new Set(newsItems.value.map(item => item.id))
      const newBreakingNews = data.data.filter((item: NewsItem) => !existingIds.has(item.id))
      newsItems.value = [...newBreakingNews, ...newsItems.value]
    }
  } catch (err) {
    console.error('Error fetching breaking news:', err)
  }
}

const pauseTicker = () => {
  isPaused.value = true
}

const resumeTicker = () => {
  isPaused.value = false
}

const getCategoryColor = (category?: string) => {
  const colors: Record<string, string> = {
    'market': 'text-green-400 bg-green-500/20',
    'announcement': 'text-blue-400 bg-blue-500/20',
    'event': 'text-purple-400 bg-purple-500/20',
    'partnership': 'text-yellow-400 bg-yellow-500/20',
    'regulation': 'text-red-400 bg-red-500/20',
    'technology': 'text-cyan-400 bg-cyan-500/20'
  }
  return colors[category || 'default'] || 'text-gray-400 bg-gray-500/20'
}

const handleNewsClick = (newsItem: NewsItem) => {
  if (newsItem.source_url) {
    window.open(newsItem.source_url, '_blank', 'noopener,noreferrer')
  }
}

// Lifecycle
onMounted(() => {
  fetchNewsItems()
  
  // Fetch breaking news every 30 seconds
  const breakingNewsInterval = setInterval(fetchBreakingNews, 30000)
  
  // Refresh all news every 5 minutes
  const newsRefreshInterval = setInterval(fetchNewsItems, 300000)
  
  onUnmounted(() => {
    clearInterval(breakingNewsInterval)
    clearInterval(newsRefreshInterval)
  })
})
</script>

<template>
  <div class="relative w-full overflow-hidden">
    <!-- News Ticker Container -->
    <div 
      class="relative bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-yellow-500/30"
      @mouseenter="pauseTicker"
      @mouseleave="resumeTicker"
    >
      <!-- News Content -->
      <div class="flex items-center py-2 md:py-3 px-2 md:px-4">
        <!-- News Icon -->
        <div class="flex-shrink-0 mr-2 md:mr-4">
          <div class="w-6 h-6 md:w-8 md:h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <NewspaperIcon class="h-4 w-4 md:h-5 md:w-5 text-black" />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center space-x-4 flex-1">
          <div class="animate-pulse flex items-center space-x-4">
            <div class="h-4 bg-gray-600 rounded w-48"></div>
            <div class="h-4 bg-gray-600 rounded w-32"></div>
            <div class="h-4 bg-gray-600 rounded w-24"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center space-x-4 flex-1 text-red-400">
          <span class="text-sm">Unable to load news</span>
        </div>

        <!-- Scrolling News Items -->
        <div v-else-if="newsItems.length > 0" class="flex-1 overflow-hidden">
          <div 
            class="flex items-center py-1 px-2 md:px-4 space-x-4 md:space-x-6 news-ticker-scroll"
            :class="{ 'news-ticker-paused': isPaused }"
            @mouseenter="pauseTicker"
            @mouseleave="resumeTicker"
          >
            <!-- First set of news items -->
            <div 
              v-for="(item, index) in newsItems" 
              :key="`first-${item.id}-${index}`"
              class="flex items-center space-x-2 md:space-x-4 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              @click="handleNewsClick(item)"
            >
              <!-- Breaking News Badge -->
              <div 
                v-if="item.is_breaking"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse"
              >
                BREAKING
              </div>

              <!-- Category Badge -->
              <div 
                v-if="item.category"
                :class="getCategoryColor(item.category)"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full"
              >
                {{ item.category.toUpperCase() }}
              </div>

              <!-- Full News Content -->
              <div class="flex-shrink-0 flex items-center space-x-2 md:space-x-3">
                <span class="text-white font-semibold text-xs md:text-base whitespace-nowrap">
                  <strong>{{ item.title }}</strong>
                  <span v-if="item.content" class="text-gray-200 ml-2 md:ml-3 text-xs md:text-base">
                    - {{ item.content }}
                  </span>
                </span>
              </div>

              <!-- Divider -->
              <div class="flex-shrink-0 text-yellow-500 text-xl md:text-3xl font-bold">•</div>
            </div>

            <!-- Duplicate set for seamless loop -->
            <div 
              v-for="(item, index) in newsItems" 
              :key="`duplicate-${item.id}-${index}`"
              class="flex items-center space-x-2 md:space-x-4 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              @click="handleNewsClick(item)"
            >
              <!-- Breaking News Badge -->
              <div 
                v-if="item.is_breaking"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse"
              >
                BREAKING
              </div>

              <!-- Category Badge -->
              <div 
                v-if="item.category"
                :class="getCategoryColor(item.category)"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full"
              >
                {{ item.category.toUpperCase() }}
              </div>

              <!-- Full News Content -->
              <div class="flex-shrink-0 flex items-center space-x-2 md:space-x-3">
                <span class="text-white font-semibold text-xs md:text-base whitespace-nowrap">
                  <strong>{{ item.title }}</strong>
                  <span v-if="item.content" class="text-gray-200 ml-2 md:ml-3 text-xs md:text-base">
                    - {{ item.content }}
                  </span>
                </span>
              </div>

              <!-- Divider -->
              <div class="flex-shrink-0 text-yellow-500 text-xl md:text-3xl font-bold">•</div>
            </div>

            <!-- Third set for even more seamless loop -->
            <div 
              v-for="(item, index) in newsItems" 
              :key="`triplicate-${item.id}-${index}`"
              class="flex items-center space-x-2 md:space-x-4 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              @click="handleNewsClick(item)"
            >
              <!-- Breaking News Badge -->
              <div 
                v-if="item.is_breaking"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full animate-pulse"
              >
                BREAKING
              </div>

              <!-- Category Badge -->
              <div 
                v-if="item.category"
                :class="getCategoryColor(item.category)"
                class="flex-shrink-0 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full"
              >
                {{ item.category.toUpperCase() }}
              </div>

              <!-- Full News Content -->
              <div class="flex-shrink-0 flex items-center space-x-2 md:space-x-3">
                <span class="text-white font-semibold text-xs md:text-base whitespace-nowrap">
                  <strong>{{ item.title }}</strong>
                  <span v-if="item.content" class="text-gray-200 ml-2 md:ml-3 text-xs md:text-base">
                    - {{ item.content }}
                  </span>
                </span>
              </div>

              <!-- Divider -->
              <div class="flex-shrink-0 text-yellow-500 text-xl md:text-3xl font-bold">•</div>
            </div>
          </div>
        </div>

        <!-- No News State -->
        <div v-else class="flex items-center space-x-4 flex-1 text-gray-400">
          <span class="text-sm">No news available</span>
        </div>

        <!-- Refresh Button -->
        <button
          @click="refreshNews"
          :disabled="isLoading"
          title="Refresh news"
          class="flex-shrink-0 ml-4 p-2 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            class="w-5 h-5 text-yellow-500 transition-transform duration-300" 
            :class="{ 'animate-spin': isLoading }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* News ticker scrolling animation - same as market data ticker */
@keyframes news-ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

.news-ticker-scroll {
  animation: news-ticker-scroll 60s linear infinite;
  width: max-content;
}

.news-ticker-paused {
  animation-play-state: paused;
}

/* Breaking news animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover effects */
.cursor-pointer:hover {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

/* TV ticker styling */
.text-white {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* Ensure text doesn't break */
.whitespace-nowrap {
  white-space: nowrap;
}

/* Smooth scrolling container */
.flex {
  will-change: transform;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .space-x-6 {
    column-gap: 0.75rem;
  }
  
  .space-x-4 {
    column-gap: 0.5rem;
  }
  
  .news-ticker-scroll {
    animation-duration: 45s;
  }
}

/* Ensure ticker doesn't get cut off vertically */
.flex-1 {
  min-height: 24px;
}
</style>
