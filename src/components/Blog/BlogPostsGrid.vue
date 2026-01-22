<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  image: string
  tags: string[]
  featured: boolean
  slug?: string
}

interface Props {
  posts: BlogPost[]
  currentPage: number
  postsPerPage: number
}

interface Emits {
  (e: 'update:currentPage', value: number): void
}

const props = defineProps<Props>()
const { t } = useI18n()
const emit = defineEmits<Emits>()

// Get paginated posts
const paginatedPosts = computed(() => {
  const startIndex = (props.currentPage - 1) * props.postsPerPage
  return props.posts.slice(startIndex, startIndex + props.postsPerPage)
})

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(props.posts.length / props.postsPerPage)
})

// Get page numbers to display (professional pagination for many pages)
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  const pages: (number | string)[] = []
  
  if (total <= 9) {
    // Show all pages if 9 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Calculate range around current page
    let start = Math.max(2, current - 2)
    let end = Math.min(total - 1, current + 2)
    
    // Adjust if we're near the start
    if (current <= 4) {
      end = Math.min(6, total - 1)
      start = 2
    }
    
    // Adjust if we're near the end
    if (current >= total - 3) {
      start = Math.max(2, total - 5)
      end = total - 1
    }
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...')
    }
    
    // Add pages in range
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis before last page if needed
    if (end < total - 1) {
      pages.push('...')
    }
    
    // Always show last page
    pages.push(total)
  }
  
  return pages
})

// Pagination functions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
    // Scroll to top of posts grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Page input for direct navigation
const pageInput = ref('')
const jumpToPage = () => {
  const page = parseInt(pageInput.value)
  if (page >= 1 && page <= totalPages.value) {
    goToPage(page)
    pageInput.value = ''
  }
}
</script>

<template>
  <div>
        <!-- Enhanced Posts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <router-link
            v-for="post in paginatedPosts"
            :key="post.id"
            :to="`/blog/${post.slug || post.id}`"
            class="group cursor-pointer transition-all duration-500 hover:shadow-2xl rounded-2xl overflow-hidden block border transform hover:-translate-y-2"
            :class="isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700' : 'bg-white hover:bg-slate-50 border-gray-200'"
          >
            <!-- Enhanced Image Container -->
            <div class="relative overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                @error="(e) => (e.target as HTMLImageElement).src = '/trading.jpg'"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Read Time Badge -->
              <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-semibold px-3 py-1 rounded-full">
                {{ Math.ceil(post.excerpt.length / 200) }} min read
              </div>
              
              <!-- Category Badge -->
              <div v-if="post.tags.length > 0" class="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {{ post.tags[0] }}
              </div>
            </div>

            <!-- Enhanced Content -->
            <div class="p-6">
              <!-- Author and Date -->
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ typeof post.author === 'string' ? post.author.charAt(0) : ((post.author as any)?.name || 'G').charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    {{ typeof post.author === 'string' ? post.author : ((post.author as any)?.name || 'GCX Team') }}
                  </p>
                  <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                    {{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                  </p>
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold mb-3 group-hover:text-yellow-500 transition-colors leading-tight line-clamp-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ post.title }}
              </h3>
              
              <!-- Excerpt -->
              <p class="mb-4 leading-relaxed line-clamp-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ post.excerpt }}
              </p>
              
              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in post.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 rounded-full text-xs font-medium border"
                  :class="isDarkMode ? 'bg-slate-700/50 text-slate-300 border-slate-600' : 'bg-slate-50 text-slate-700 border-slate-200'"
                >
                  {{ tag }}
                </span>
                <span v-if="post.tags.length > 3" class="px-2 py-1 rounded-full text-xs font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  +{{ post.tags.length - 3 }} more
                </span>
              </div>
              
              <!-- Enhanced Read More -->
              <div class="flex items-center justify-between pt-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
                <span class="text-yellow-500 font-semibold group-hover:text-yellow-600 transition-colors flex items-center gap-2">
                  Read Article
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                
                <!-- Social Preview -->
                <div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg class="w-4 h-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <svg class="w-4 h-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>
        </div>

    <!-- Enhanced Pagination -->
    <div v-if="totalPages > 0" class="mt-12 pt-8 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Posts Info -->
        <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Showing 
          <span class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ ((currentPage - 1) * postsPerPage) + 1 }}
          </span>
          to 
          <span class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ Math.min(currentPage * postsPerPage, posts.length) }}
          </span>
          of 
          <span class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ posts.length }}
          </span>
          posts
        </div>
        
        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex items-center gap-2 flex-wrap justify-center">
          <!-- First Page Button (show if not on first few pages) -->
          <button
            v-if="currentPage > 3 && totalPages > 7"
            @click="goToPage(1)"
            class="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
            :class="isDarkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
            title="First page"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">First</span>
          </button>
          
          <!-- Previous Button -->
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            :class="isDarkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">Previous</span>
            <span class="sm:hidden">Prev</span>
          </button>
          
          <!-- Page Numbers -->
          <div class="flex items-center gap-1 flex-wrap justify-center">
            <button
              v-for="(page, index) in pageNumbers"
              :key="`page-${index}`"
              @click="typeof page === 'number' ? goToPage(page) : null"
              :disabled="typeof page === 'string'"
              class="min-w-[40px] h-10 px-3 rounded-lg transition-all duration-200 font-medium disabled:cursor-default"
              :class="typeof page === 'number' && page === currentPage
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105' 
                : typeof page === 'number'
                  ? (isDarkMode 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 hover:scale-105' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 hover:scale-105')
                  : (isDarkMode ? 'text-slate-500 cursor-default' : 'text-slate-400 cursor-default')"
            >
              {{ page }}
            </button>
          </div>
          
          <!-- Page Jump Input (show for 10+ pages) -->
          <div v-if="totalPages >= 10" class="flex items-center gap-2">
            <span class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Go to:</span>
            <input
              v-model="pageInput"
              @keyup.enter="jumpToPage"
              type="number"
              :min="1"
              :max="totalPages"
              :placeholder="currentPage.toString()"
              class="w-16 h-10 px-2 text-center rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              :class="isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
            />
            <button
              @click="jumpToPage"
              class="px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm"
              :class="isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
            >
              Go
            </button>
          </div>
          
          <!-- Next Button -->
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            :class="isDarkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
          >
            <span class="hidden sm:inline">Next</span>
            <span class="sm:hidden">Next</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Last Page Button (show if not on last few pages) -->
          <button
            v-if="currentPage < totalPages - 2 && totalPages > 7"
            @click="goToPage(totalPages)"
            class="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 font-medium"
            :class="isDarkMode 
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'"
            title="Last page"
          >
            <span class="hidden sm:inline">Last</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- Single Page Indicator -->
        <div v-else class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Page 1 of 1
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
</style>
