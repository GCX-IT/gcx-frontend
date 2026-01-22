<template>
  <div class="space-y-20">
    <!-- Clean Header Section -->
    <div class="text-center">
      <div class="flex items-center justify-center gap-4 mb-6">
        <h2 class="text-5xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ getContent('functional_heads_title', 'Functional Heads') }}
        </h2>
        <button
          @click="refreshFunctionalMembers"
          :disabled="loading"
          title="Refresh functional heads"
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
        {{ getContent('functional_heads_subtitle', 'Our functional leaders ensure operational excellence across all departments.') }}
      </p>
    </div>

    <!-- Professional Functional Heads Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <div 
        v-for="member in functionalMembers" 
        :key="member.id"
        class="group relative bg-white dark:bg-slate-800 rounded-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-0 cursor-pointer backdrop-blur-sm"
        @click="openProfile(member)"
      >
        <!-- Clean Image Container -->
        <div class="relative h-56 overflow-hidden">
          <img 
            :src="member.image ? (member.image.startsWith('/uploads') ? getImageUrl(member.image) : member.image) : '/logo_black.png'" 
            :alt="member.name"
            class="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
            @error="handleImageError"
          />
          <!-- Elegant Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Clean Content -->
        <div class="p-4">
          <h3 class="text-lg font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300">
            {{ member.name }}
          </h3>
          <p class="text-sm font-medium mb-3 text-yellow-600 dark:text-yellow-400 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors duration-300">
            {{ member.title }}
          </p>
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
        <span class="text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading functional heads...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-12">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <i class="pi pi-exclamation-triangle text-3xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Functional Heads</h3>
        <p class="text-red-600 dark:text-red-300">{{ error }}</p>
        <button
          @click="loadFunctionalMembers"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { usePageContentEditor } from '../../composables/usePageContentEditor'
import { getImageUrl } from '../../utils/imageUrl'
import axios from '../../plugins/axios'
import ProfileSlider from '../Common/ProfileSlider.vue'
import { DataCache, CACHE_KEYS, CACHE_DURATIONS } from '../../utils/dataCache'

interface FunctionalMember {
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
const functionalMembers = ref<FunctionalMember[]>([])
const loading = ref(false)
const error = ref('')
const selectedMember = ref<FunctionalMember | null>(null)
const showProfile = ref(false)

// Get content from CMS
const { getContent } = usePageContentEditor('about')

// Methods
const loadFunctionalMembers = async (skipCache = false) => {
  loading.value = true
  error.value = ''
  
  try {
    // Check cache first - team members rarely change (unless skipped)
    if (!skipCache) {
      const cacheKey = 'gcx_team_members_functional'
      const cached = DataCache.get<FunctionalMember[]>(cacheKey)
      if (cached) {
        functionalMembers.value = cached
        loading.value = false
        return
      }
    }
    
    // Add timeout to prevent hanging requests
    const response = await axios.get('/api/team-members?type=functional', {
      timeout: 10000 // 10 second timeout
    })
    
    console.log('Functional members response:', response.data)
    // Backend returns { success: true, data: [...] }
    const apiData = response.data.data || []
    
    // Sort alphabetically by department/title
    const sortedData = apiData.sort((a: FunctionalMember, b: FunctionalMember) => {
      return a.title.localeCompare(b.title)
    })
    
    functionalMembers.value = sortedData
    // Cache for 24 hours (team rarely changes)
    DataCache.set('gcx_team_members_functional', sortedData, CACHE_DURATIONS.TWENTY_FOUR_HOURS)
    
    // If no data, show a message
    if (!apiData || apiData.length === 0) {
      console.log('No functional members found in database')
    }
  } catch (err: any) {
    console.error('Failed to load functional members:', err)
    error.value = err.response?.data?.error || err.message || 'Failed to load functional members'
    functionalMembers.value = [] // Set empty array on error
  } finally {
    loading.value = false
  }
}

const refreshFunctionalMembers = async () => {
  DataCache.clear('gcx_team_members_functional')
  await loadFunctionalMembers(true)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/logo_black.png'
}


const openProfile = (member: FunctionalMember) => {
  selectedMember.value = member
  showProfile.value = true
}

const closeProfile = () => {
  showProfile.value = false
  selectedMember.value = null
}

// Lifecycle
onMounted(() => {
  loadFunctionalMembers()
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
