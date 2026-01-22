<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import searchService, { type SearchResult, type SearchResponse } from '../services/searchService'
import { MagnifyingGlassIcon, ClockIcon, DocumentTextIcon, NewspaperIcon, CubeIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// State
const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const totalResults = ref(0)
const searchTime = ref(0)
const selectedType = ref<string>('all')

// Search types
const searchTypes = [
  { value: 'all', label: 'All', icon: MagnifyingGlassIcon },
  { value: 'page', label: 'Pages', icon: DocumentTextIcon },
  { value: 'news', label: 'News', icon: NewspaperIcon },
  { value: 'commodity', label: 'Commodities', icon: CubeIcon },
  { value: 'blog', label: 'Blog', icon: DocumentTextIcon },
  { value: 'member', label: 'Members', icon: UserGroupIcon }
]

// Computed
const hasResults = computed(() => searchResults.value.length > 0)
const noResults = computed(() => !isLoading.value && searchQuery.value && searchResults.value.length === 0)

// Methods
const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  error.value = null

  try {
    const startTime = Date.now()
    const response: SearchResponse = selectedType.value === 'all' 
      ? await searchService.search(searchQuery.value)
      : await searchService.searchByType(searchQuery.value, selectedType.value)
    
    searchResults.value = response.results
    totalResults.value = response.total
    searchTime.value = Date.now() - startTime
  } catch (err) {
    error.value = 'Search failed. Please try again.'
    console.error('Search error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    performSearch()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  totalResults.value = 0
  error.value = null
}

const getTypeIcon = (type: string) => {
  const typeConfig = searchTypes.find(t => t.value === type)
  return typeConfig?.icon || DocumentTextIcon
}

const getTypeColor = (type: string) => {
  const colors = {
    page: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    news: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    commodity: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    blog: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    member: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watch for route changes
watch(() => route.query.q, (newQuery) => {
  if (newQuery && typeof newQuery === 'string') {
    searchQuery.value = newQuery
    performSearch()
  }
}, { immediate: true })

// Watch for type changes
watch(selectedType, () => {
  if (searchQuery.value.trim()) {
    performSearch()
  }
})

onMounted(() => {
  const query = route.query.q
  if (query && typeof query === 'string') {
    searchQuery.value = query
    performSearch()
  }
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Search Header -->
    <section class="py-12 lg:py-16" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-3xl lg:text-4xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Search Results
        </h1>
        
        <!-- Search Input -->
        <div class="relative max-w-2xl mx-auto mb-8">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Search GCX website..."
              class="w-full pl-12 pr-4 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-lg transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600' : 'bg-white text-slate-900 placeholder-slate-500 border-slate-300'"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Search Button -->
          <button
            @click="handleSearch"
            :disabled="!searchQuery.trim() || isLoading"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <!-- Search Type Filters -->
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <button
            v-for="type in searchTypes"
            :key="type.value"
            @click="selectedType = type.value"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            :class="selectedType === type.value
              ? 'bg-yellow-500 text-black shadow-lg'
              : isDarkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'"
          >
            <component :is="type.icon" class="h-4 w-4" />
            {{ type.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Search Results -->
    <section class="py-8">
      <div class="max-w-4xl mx-auto px-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-flex items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span class="text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Searching...
            </span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Search Error
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
            <button 
              @click="performSearch"
              class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="noResults" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              No Results Found
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find anything matching "{{ searchQuery }}". Try different keywords or check your spelling.
            </p>
          </div>
        </div>

        <!-- Results -->
        <div v-else-if="hasResults">
          <!-- Results Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ totalResults }} result{{ totalResults !== 1 ? 's' : '' }} for "{{ searchQuery }}"
              </h2>
              <p class="text-sm text-gray-500" v-if="searchTime > 0">
                Found in {{ searchTime }}ms
              </p>
            </div>
          </div>

          <!-- Results List -->
          <div class="space-y-4">
            <div
              v-for="result in searchResults"
              :key="result.id"
              class="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-gray-200 hover:bg-gray-50'"
              @click="router.push(result.url)"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <component :is="getTypeIcon(result.type)" class="h-5 w-5 text-gray-400" />
                  <span 
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getTypeColor(result.type)"
                  >
                    {{ result.type.toUpperCase() }}
                  </span>
                  <span v-if="result.category" class="text-sm text-gray-500">
                    {{ result.category }}
                  </span>
                </div>
                <span v-if="result.publishedAt" class="text-sm text-gray-500 flex items-center gap-1">
                  <ClockIcon class="h-4 w-4" />
                  {{ formatDate(result.publishedAt) }}
                </span>
              </div>

              <h3 class="text-xl font-semibold mb-2 text-yellow-600 hover:text-yellow-700 transition-colors">
                {{ result.title }}
              </h3>

              <p v-if="result.excerpt" class="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                {{ result.excerpt }}
              </p>

              <div class="text-sm text-gray-500">
                {{ result.url }}
              </div>
            </div>
          </div>
        </div>

        <!-- Initial State -->
        <div v-else class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Search GCX Website
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Enter a search term to find pages, news, commodities, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
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
