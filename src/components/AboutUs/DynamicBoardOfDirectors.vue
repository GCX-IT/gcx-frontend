<template>
  <div class="space-y-20">
    <!-- Clean Header Section -->
    <div class="text-center">
      <div class="flex items-center justify-center gap-4 mb-6">
        <h2 class="text-5xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ getContent('board_title', 'Board of Directors') }}
        </h2>
        <button
          @click="refreshBoardMembers"
          :disabled="loading"
          title="Refresh board members"
          class="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg 
            class="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-transform duration-300" 
            :class="{ 'animate-spin': loading }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div class="w-24 h-0.5 bg-yellow-500 rounded-full mx-auto mb-8"></div>
      <p class="text-lg transition-colors duration-300 max-w-3xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
        {{ getContent('board_subtitle', 'Governance and strategic oversight by experienced industry leaders') }}
      </p>
    </div>

    <!-- Professional Board Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div 
        v-for="member in sortedBoardMembers" 
        :key="member.id"
        class="group relative bg-white dark:bg-slate-800 rounded-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-0 cursor-pointer backdrop-blur-sm"
        @click="openProfile(member)"
      >
        <!-- Clean Image Container -->
        <div class="relative h-64 overflow-hidden">
          <img 
            :src="member.image || '/placeholder-avatar.jpg'" 
            :alt="member.name"
            class="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            @error="handleImageError"
          />
          <!-- Elegant Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Clean Content -->
        <div class="p-5">
          <h3 class="text-lg font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
            {{ member.name }}
          </h3>
          <p class="text-sm font-medium mb-3 text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors duration-300">
            {{ member.title }}
          </p>
          
          <!-- Minimal Social Links -->
          <div class="flex gap-2">
            <a 
              v-if="member.linkedin_url && member.linkedin_url !== '#'"
              :href="member.linkedin_url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              v-if="member.twitter_url && member.twitter_url !== '#'"
              :href="member.twitter_url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a 
              v-if="member.facebook_url && member.facebook_url !== '#'"
              :href="member.facebook_url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              v-if="member.instagram_url && member.instagram_url !== '#'"
              :href="member.instagram_url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Slider -->
    <ProfileSlider 
      :is-open="showProfile" 
      :member="selectedMember" 
      @close="closeProfile" 
    />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center space-x-2">
        <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
        <span class="text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading board members...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-12">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <i class="pi pi-exclamation-triangle text-3xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Board Members</h3>
        <p class="text-red-600 dark:text-red-300">{{ error }}</p>
        <button
          @click="loadBoardMembers"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { usePageContentEditor } from '../../composables/usePageContentEditor'
import axios from '../../plugins/axios'
import ProfileSlider from '../Common/ProfileSlider.vue'
import { DataCache, CACHE_KEYS, CACHE_DURATIONS } from '../../utils/dataCache'

interface BoardMember {
  id: number
  name: string
  title: string
  description: string
  image?: string
  type: 'board' | 'executive' | 'functional'
  order_index?: number
  // Social Media Handles
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  created_at?: string
  updated_at?: string
}

// State
const boardMembers = ref<BoardMember[]>([])
const loading = ref(false)
const error = ref('')
const selectedMember = ref<BoardMember | null>(null)
const showProfile = ref(false)

// Get content from CMS
const { getContent } = usePageContentEditor('about')

// Sort board members: Chairman first, then CEO, then by order_index
const sortBoardMembers = (members: BoardMember[]): BoardMember[] => {
  if (!members || members.length === 0) return members
  
  return [...members].sort((a, b) => {
    const aTitle = a.title.toLowerCase().trim()
    const bTitle = b.title.toLowerCase().trim()
    
    // Check for Chairman - must check this first
    const aIsChairman = aTitle.includes('chairman') || aTitle.includes('board chairman')
    const bIsChairman = bTitle.includes('chairman') || bTitle.includes('board chairman')
    
    // Check for CEO (but not Deputy CEO)
    const aIsCEO = (aTitle.includes('chief executive officer') || aTitle.includes('ceo')) && !aTitle.includes('deputy')
    const bIsCEO = (bTitle.includes('chief executive officer') || bTitle.includes('ceo')) && !bTitle.includes('deputy')
    
    // Priority 1: Chairman always comes first
    if (aIsChairman && !bIsChairman) {
      return -1 // a (Chairman) comes before b
    }
    if (!aIsChairman && bIsChairman) {
      return 1 // b (Chairman) comes before a
    }
    
    // Priority 2: CEO comes second (only if neither is Chairman)
    if (!aIsChairman && !bIsChairman) {
      if (aIsCEO && !bIsCEO) {
        return -1 // a (CEO) comes before b
      }
      if (!aIsCEO && bIsCEO) {
        return 1 // b (CEO) comes before a
      }
    }
    
    // Priority 3: Then by order_index
    const aOrder = a.order_index || 999
    const bOrder = b.order_index || 999
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    
    // Priority 4: Finally by name
    return a.name.localeCompare(b.name)
  })
}

// Computed property for sorted board members
const sortedBoardMembers = computed(() => {
  return sortBoardMembers(boardMembers.value)
})

// Methods
const loadBoardMembers = async (skipCache = false) => {
  loading.value = true
  error.value = ''
  
  try {
    // Check cache first - board members rarely change (unless skipped)
    if (!skipCache) {
      const cacheKey = 'gcx_team_members_board'
      const cached = DataCache.get<BoardMember[]>(cacheKey)
      if (cached) {
        boardMembers.value = sortBoardMembers(cached)
        loading.value = false
        return
      }
    }
    
    // Add timeout to prevent hanging requests
    const response = await axios.get('/api/team-members?type=board', {
      timeout: 10000 // 10 second timeout
    })
    
    // Backend returns { success: true, data: [...] }
    const apiData = response.data.data || []
    
    // Always sort the data on frontend to ensure correct order (Chairman first, then CEO)
    const sortedData = sortBoardMembers(apiData)
    
    // Debug: Log the sorting result
    console.log('🔍 Board Members Sorting:', {
      before: apiData.map(m => ({ name: m.name, title: m.title })),
      after: sortedData.map(m => ({ name: m.name, title: m.title }))
    })
    
    boardMembers.value = sortedData
    // Cache for 24 hours (board rarely changes) - cache the sorted version
    DataCache.set('gcx_team_members_board', sortedData, CACHE_DURATIONS.TWENTY_FOUR_HOURS)
  } catch (err: any) {
    console.error('Failed to load board members:', err)
    error.value = err.response?.data?.error || err.message || 'Failed to load board members'
    boardMembers.value = [] // Set empty array on error
  } finally {
    loading.value = false
  }
}

const refreshBoardMembers = async () => {
  DataCache.clear('gcx_team_members_board')
  await loadBoardMembers(true)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-avatar.jpg'
}


const openProfile = (member: BoardMember) => {
  selectedMember.value = member
  showProfile.value = true
}

const closeProfile = () => {
  showProfile.value = false
  selectedMember.value = null
}

// Lifecycle
onMounted(() => {
  loadBoardMembers()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
