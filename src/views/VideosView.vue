<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import * as videoService from '../services/videoService'
import type { VideoLibrary, LibraryVideo } from '../services/videoService'

const { t } = useI18n()

// Video state
const videoLibraries = ref<VideoLibrary[]>([])
const allVideos = ref<any[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedVideo = ref<any>(null)
const isModalOpen = ref(false)

// Categories (dynamic from API)
const categories = computed(() => {
  const cats = ['All', ...new Set(videoLibraries.value.map(lib => lib.category))]
  return cats
})

// Filtered videos
const filteredVideos = computed(() => {
  let filtered = allVideos.value

  if (searchQuery.value) {
    filtered = filtered.filter(video =>
      video.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value && selectedCategory.value !== 'All') {
    filtered = filtered.filter(video => video.category === selectedCategory.value)
  }

  return filtered
})

const closeVideoModal = () => {
  selectedVideo.value = null
  isModalOpen.value = false
  document.body.style.overflow = 'auto'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatViews = (views) => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toString()
}

// Load videos
const fetchVideos = async () => {
  isLoading.value = true
  try {
    // Fetch all video libraries
    videoLibraries.value = await videoService.getVideoLibraries()
    
    // Flatten all videos from all libraries
    const videos: any[] = []
    for (const library of videoLibraries.value) {
      if (library.videos && library.videos.length > 0) {
        library.videos.forEach(video => {
          videos.push({
            id: video.id,
            title: video.title,
            description: video.description || '',
            thumbnail: video.thumbnail_url || '/trading.jpg',
            videoUrl: video.video_url,
            duration: video.duration || 'N/A',
            category: library.category,
            publishedAt: video.created_at,
            views: video.view_count || 0
          })
        })
      }
    }
    
    allVideos.value = videos
  } catch (error) {
    console.error('Error fetching videos:', error)
    allVideos.value = []
  } finally {
    isLoading.value = false
  }
}

const openVideoModal = async (video: any) => {
  selectedVideo.value = video
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
  
  // Track video view
  try {
    await videoService.trackVideoView(video.id)
  } catch (error) {
    console.error('Error tracking video view:', error)
  }
}

onMounted(() => {
  fetchVideos()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img src="/Picture3.png" alt="Videos Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-br from-green-900/80 via-slate-800/70 to-emerald-900/90"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <div class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Video Library
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
          GCX Videos
        </h1>
        <p class="text-xl lg:text-2xl max-w-4xl mx-auto text-white/80 mb-12 leading-relaxed">
          Educational content, market insights, and success stories from Ghana Commodity Exchange
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">{{ allVideos.length }}+</div>
            <div class="text-white/70 text-sm">Videos Available</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">{{ Math.max(0, categories.length - 1) }}</div>
            <div class="text-white/70 text-sm">Categories</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">HD</div>
            <div class="text-white/70 text-sm">Quality Content</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filters -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative max-w-2xl mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search videos..."
              class="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 shadow-lg"
              :class="isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-200 bg-white text-slate-900'"
            />
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            class="px-6 py-3 font-semibold rounded-xl transition-all duration-300"
            :class="selectedCategory === category || (selectedCategory === '' && category === 'All')
              ? 'bg-green-500 text-white shadow-lg' 
              : isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- Videos Grid -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p class="mt-4 text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading videos...</p>
        </div>

        <!-- Videos Grid -->
        <div v-else-if="filteredVideos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="video in filteredVideos"
            :key="video.id"
            @click="openVideoModal(video)"
            class="group cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border transform hover:-translate-y-2"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
          >
            <!-- Video Thumbnail -->
            <div class="relative overflow-hidden">
              <img 
                :src="video.thumbnail"
                :alt="video.title"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                @error="(e) => (e.target as HTMLImageElement).src = '/trading.jpg'"
              />
              <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
              
              <!-- Play Button -->
              <div class="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Duration Badge -->
              <div class="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
                {{ video.duration }}
              </div>
              
              <!-- Category Badge -->
              <div class="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {{ video.category }}
              </div>
            </div>

            <!-- Video Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors line-clamp-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ video.title }}
              </h3>
              
              <p class="text-sm leading-relaxed mb-4 line-clamp-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ video.description }}
              </p>
              
              <!-- Video Meta -->
              <div class="flex items-center justify-between text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <span>{{ formatDate(video.publishedAt) }}</span>
                <span>{{ formatViews(video.views) }} views</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No videos found</h3>
          <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Try adjusting your search or filter criteria.</p>
        </div>
      </div>
    </section>

    <!-- Video Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        @click="closeVideoModal"
      ></div>
      
      <!-- Modal Content -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div 
          class="relative rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="closeVideoModal"
            class="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
            :class="isDarkMode ? 'bg-slate-800/90 hover:bg-slate-700 text-white' : 'bg-white/90 hover:bg-white text-slate-900'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Video Player -->
          <div class="aspect-video w-full">
            <iframe
              v-if="selectedVideo"
              :src="selectedVideo.videoUrl"
              :title="selectedVideo.title"
              class="w-full h-full rounded-t-2xl"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          
          <!-- Video Details -->
          <div class="p-8">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h2 class="text-2xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ selectedVideo?.title }}
                </h2>
                <div class="flex items-center gap-4 text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  <span>{{ formatDate(selectedVideo?.publishedAt || '') }}</span>
                  <span>{{ formatViews(selectedVideo?.views || 0) }} views</span>
                  <span class="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-full">
                    {{ selectedVideo?.category }}
                  </span>
                </div>
              </div>
            </div>
            
            <p class="text-lg leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              {{ selectedVideo?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
