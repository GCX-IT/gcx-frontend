<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import { usePublications } from '../composables/usePublications'
import { useCareers } from '../composables/useCareers'
import { useCommodities } from '../composables/useCommodities'
import PublicationSlider from '../components/Common/PublicationSlider.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const { t } = useI18n()
const router = useRouter()

// Active tab (only publications now)
const activeTab = ref('research')

// Slider state
const selectedPublication = ref(null)
const isSliderOpen = ref(false)

// Publications tabs
const publicationsTabs = [
  { key: 'research', label: 'Research Papers', hash: '#research' },
  { key: 'annual', label: 'Annual Reports', hash: '#annual' },
  { key: 'policy', label: 'Policy Documents', hash: '#policy' }
]

// Careers tabs
const careersTabs = [
  { key: 'openings', label: 'Job Openings', hash: '#openings' },
  { key: 'internship', label: 'Internship', hash: '#internship' },
  { key: 'functional', label: 'Job Functional Areas', hash: '#functional' }
]

// Commodities tabs
const commoditiesTabs = [
  { key: 'maize', label: 'Maize', hash: '#maize' },
  { key: 'soybean', label: 'Soya Bean', hash: '#soybean' },
  { key: 'sorghum', label: 'Sorghum', hash: '#sorghum' },
  { key: 'sesame', label: 'Sesame', hash: '#sesame' },
  { key: 'rice', label: 'Rice', hash: '#rice' }
]

// Use composables
const {
  publications,
  loading: publicationsLoading,
  error: publicationsError,
  fetchPublications,
  searchPublications,
  filterByCategory: filterPublicationsByCategory
} = usePublications()

const {
  careers,
  loading: careersLoading,
  error: careersError,
  fetchCareers,
  searchCareers,
  filterByCategory: filterCareersByCategory
} = useCareers()

const {
  commodities,
  loading: commoditiesLoading,
  error: commoditiesError,
  fetchCommodities
} = useCommodities()

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('')

// Computed properties
const currentData = computed(() => {
  switch (activeTab.value) {
    case 'research':
    case 'annual':
    case 'policy':
      return publications.value
    case 'openings':
    case 'internship':
    case 'functional':
      return careers.value
    case 'maize':
    case 'soybean':
    case 'sorghum':
    case 'sesame':
    case 'rice':
      return commodities.value
    default:
      return []
  }
})

const filteredData = computed(() => {
  let data = currentData.value

  // Filter by active tab (for publications)
  if (activeTab.value === 'research' || activeTab.value === 'annual' || activeTab.value === 'policy') {
    const categoryMap = {
      'research': 'Research Papers',
      'annual': 'Annual Reports',
      'policy': 'Policy Documents'
    }
    const category = categoryMap[activeTab.value]
    if (category) {
      data = data.filter(item => item.category === category)
    }
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    data = data.filter(item => 
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.author?.toLowerCase().includes(query)
    )
  }

  // Filter by selected category (from dropdown)
  if (selectedCategory.value) {
    data = data.filter(item => item.category === selectedCategory.value)
  }

  return data
})

const isLoading = computed(() => {
  switch (activeTab.value) {
    case 'research':
    case 'annual':
    case 'policy':
  return publicationsLoading.value
    case 'openings':
    case 'internship':
    case 'functional':
      return careersLoading.value
    case 'maize':
    case 'soybean':
    case 'sorghum':
    case 'sesame':
    case 'rice':
      return commoditiesLoading.value
    default:
      return false
  }
})

const error = computed(() => {
  switch (activeTab.value) {
    case 'research':
    case 'annual':
    case 'policy':
  return publicationsError.value
    case 'openings':
    case 'internship':
    case 'functional':
      return careersError.value
    case 'maize':
    case 'soybean':
    case 'sorghum':
    case 'sesame':
    case 'rice':
      return commoditiesError.value
    default:
      return null
  }
})

// Image mapping for different categories with fallback
const getItemImage = (item) => {
  // Priority 1: Use the actual image from backend if it exists
  if (item.image_path && item.image_path.trim() !== '') {
    return item.image_path
  }
  
  // Priority 2: Check for other possible image fields from backend
  if (item.image && item.image.trim() !== '') {
    return item.image
  }
  
  if (item.image_url && item.image_url.trim() !== '') {
    return item.image_url
  }
  
  if (item.cover_image && item.cover_image.trim() !== '') {
    return item.cover_image
  }
  
  if (item.thumbnail && item.thumbnail.trim() !== '') {
    return item.thumbnail
  }
  
  // Priority 3: Fallback images based on category using actual images from public folder
  const fallbackImages = {
    'Research Papers': '/trading dashboard.jpg',
    'Annual Reports': '/crop.jpg', 
    'Policy Documents': '/trading.jpg',
    'Job Openings': '/black man in the farm.jpg',
    'Internship': '/Picture3.png',
    'Job Functional Areas': '/hero section/hero section.jpg',
    'Maize': '/maize.jpg',
    'Soya Bean': '/commodities/soya.jpg',
    'Sorghum': '/sorghum.jpg',
    'Sesame': '/commodities/seasame.jpg',
    'Rice': '/commodities/rice.jpg',
    default: '/logo_black.png'
  }
  
  return fallbackImages[item.category] || fallbackImages.default
}

// Handle image loading errors
const handleImageError = (event) => {
  const img = event.target
  // If it's already the logo, don't try again to avoid infinite loop
  if (img.src.includes('logo_black.png') || img.src.includes('data:image/svg+xml')) {
    return
  }
  
  // Use the GCX logo as final fallback
  img.src = '/logo_black.png'
}

// Get category badge class for cards using Ghana colors
const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'Research Papers':
      return 'bg-gradient-to-r from-red-600 to-red-500'
    case 'Annual Reports':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400'
    case 'Policy Documents':
      return 'bg-gradient-to-r from-green-600 to-green-500'
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500'
  }
}

// Get count of publications by category
const getCategoryCount = (category) => {
  if (!publications.value || !Array.isArray(publications.value)) {
    return 0
  }
  return publications.value.filter(pub => pub.category === category).length
}


// Slider functions
const openSlider = (publication) => {
  selectedPublication.value = publication
  isSliderOpen.value = true
}

const closeSlider = () => {
  selectedPublication.value = null
  isSliderOpen.value = false
}

// Navigation functions (simplified for publications only)
const navigateToTab = async (tab: string) => {
  activeTab.value = tab
  router.replace({ path: '/resources', hash: tab })
  
  // Clear search and category filters when switching tabs
  searchQuery.value = ''
  selectedCategory.value = ''
  
  // Fetch data based on tab
  switch (tab) {
    case 'research':
    case 'annual':
    case 'policy':
      await fetchPublications()
      break
    case 'openings':
    case 'internship':
    case 'functional':
      await fetchCareers()
      break
    case 'maize':
    case 'soybean':
    case 'sorghum':
    case 'sesame':
    case 'rice':
      await fetchCommodities()
      break
  }
}

// Search function
const handleSearch = () => {
  if (activeTab.value === 'research' || activeTab.value === 'annual' || activeTab.value === 'policy') {
    searchPublications(searchQuery.value)
  } else if (activeTab.value === 'openings' || activeTab.value === 'internship' || activeTab.value === 'functional') {
    searchCareers(searchQuery.value)
  }
}

// Filter function
const handleFilter = () => {
  if (activeTab.value === 'research' || activeTab.value === 'annual' || activeTab.value === 'policy') {
    filterPublicationsByCategory(selectedCategory.value)
  } else if (activeTab.value === 'openings' || activeTab.value === 'internship' || activeTab.value === 'functional') {
    filterCareersByCategory(selectedCategory.value)
  }
}

// Download function
const downloadFile = (item) => {
  if (item.file_path) {
    const link = document.createElement('a')
    link.href = item.file_path
    link.download = item.file_name || `${item.title}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Initialize based on route hash
onMounted(async () => {
  const hash = route.hash.replace('#', '')
  if (hash && ['research', 'annual', 'policy', 'openings', 'internship', 'functional', 'maize', 'soybean', 'sorghum', 'sesame', 'rice'].includes(hash)) {
    activeTab.value = hash
  }
  
  await fetchPublications()
})

// Watch for route changes
watch(() => route.hash, async (newHash) => {
  const hash = newHash.replace('#', '')
  if (hash && ['research', 'annual', 'policy', 'openings', 'internship', 'functional', 'maize', 'soybean', 'sorghum', 'sesame', 'rice'].includes(hash)) {
    await navigateToTab(hash)
  }
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'">
    <!-- Hero Section -->
    <section class="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img src="/crop.jpg" alt="Ghana Agriculture" class="w-full h-full object-cover" />
        </div>
        
        <!-- Ghana Flag Stripes -->
        <div class="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <div class="absolute top-2 left-0 w-full h-2 bg-yellow-500"></div>
        <div class="absolute top-4 left-0 w-full h-2 bg-green-600"></div>
        
        <!-- Pattern Overlay -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute inset-0" style="background-image: url('data:image/svg+xml;utf8,<svg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;><circle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/></g></g></svg>');"></div>
        </div>
      
      <div class="relative max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Resources
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Access our comprehensive library of publications, career opportunities, and commodity information.
        </p>
        
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getCategoryCount('Research Papers') }}</div>
            <div class="text-white/90">Research Papers</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getCategoryCount('Annual Reports') }}</div>
            <div class="text-white/90">Annual Reports</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getCategoryCount('Policy Documents') }}</div>
            <div class="text-white/90">Policy Documents</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <section class="py-8 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center items-center gap-2 lg:gap-4">
          <button
            v-for="tab in publicationsTabs"
            :key="tab.key"
            @click="navigateToTab(tab.key)"
            class="group relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300"
            :class="activeTab === tab.key 
              ? (isDarkMode ? 'bg-yellow-500 text-black shadow-lg' : 'bg-yellow-500 text-white shadow-lg')
              : (isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')"
          >
            {{ tab.label }}
            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                 :class="isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-white'">
              {{ tab.label }}
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                   :class="isDarkMode ? 'border-t-slate-700' : 'border-t-slate-800'"></div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gray-50'">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              @input="handleSearch"
              type="text"
              placeholder="Search publications..."
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
            />
          </div>
          <div class="md:w-64">
            <select
              v-model="selectedCategory"
              @change="handleFilter"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
            >
              <option value="">All Categories</option>
              <option value="Research Papers">Research Papers</option>
              <option value="Annual Reports">Annual Reports</option>
              <option value="Policy Documents">Policy Documents</option>
            </select>
          </div>
        </div>

          <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Loading resources...</p>
          </div>

          <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <div class="border rounded-lg p-6 max-w-md mx-auto transition-colors duration-300" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ error }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredData.length === 0" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="text-6xl mb-4">📚</div>
            <h3 class="text-xl font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">No resources found</h3>
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Try adjusting your search or filter criteria.</p>
            </div>
          </div>

        <!-- Resource Cards Grid -->
        <div v-else-if="filteredData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
            v-for="item in filteredData"
              :key="item.id"
            @click="openSlider(item)"
            class="group rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border cursor-pointer transform hover:-translate-y-2"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
            >
            <!-- Card Image -->
            <div class="relative h-56 overflow-hidden">
              <img 
                :src="getItemImage(item)" 
                :alt="item.title"
                @error="handleImageError"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div class="absolute top-4 left-4">
                <span class="px-3 py-1 text-white text-sm font-semibold rounded-full shadow-lg"
                      :class="getCategoryBadgeClass(item.category)">
                    {{ item.category }}
                  </span>
              </div>
              </div>

            <!-- Card Content -->
              <div class="p-6">
              <h3 class="text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ item.title }}
                </h3>
              <p class="mb-4 line-clamp-3 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ item.description }}
              </p>
              
              <!-- Meta Information -->
              <div class="flex items-center justify-between text-sm mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                <span class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">{{ item.author }}</span>
                <span v-if="item.publication_date" class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">{{ new Date(item.publication_date).toLocaleDateString() }}</span>
              </div>

              <!-- File Info -->
              <div class="flex items-center">
                <div class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{{ item.file_size ? (item.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A' }}</span>
                </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Publication Slider -->
    <PublicationSlider
      :is-open="isSliderOpen"
      :publication="selectedPublication"
      @close="closeSlider"
    />
    
    <Footer />
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
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