<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import { useCareers } from '../composables/useCareers'
import Footer from '../components/Footer.vue'
import CareerSlider from '../components/Common/CareerSlider.vue'

const { t } = useI18n()

// Career composable
const {
  careers,
  loading: careersLoading,
  error: careersError,
  fetchCareers,
  searchCareers,
  filterByCategory: filterCareersByCategory,
  filterByStatus: filterCareersByStatus,
  filterByDepartment: filterCareersByDepartment,
  clearFilters: clearCareersFilters
} = useCareers()

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')
const selectedCareer = ref(null)
const isSliderOpen = ref(false)

// Career categories
const careerCategories = [
  'Job Openings',
  'Internship'
]

// Departments
const departments = [
  'Trading Operations',
  'Technology',
  'Market Research', 
  'Finance',
  'Human Resources',
  'Operations',
  'Legal & Compliance'
]

// Filtered careers
const filteredCareers = computed(() => {
  let filtered = careers.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(career => 
      career.title?.toLowerCase().includes(query) ||
      career.description?.toLowerCase().includes(query) ||
      career.department?.toLowerCase().includes(query) ||
      career.location?.toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(career => career.category === selectedCategory.value)
  }
  
  // Filter by department
  if (selectedDepartment.value) {
    filtered = filtered.filter(career => career.department === selectedDepartment.value)
  }
  
  // Filter by status
  if (selectedStatus.value) {
    filtered = filtered.filter(career => career.status === selectedStatus.value)
  }
  
  return filtered
})

// Methods
const handleSearch = () => {
  searchCareers(searchQuery.value)
}

const handleCategoryFilter = () => {
  filterCareersByCategory(selectedCategory.value)
}

const handleDepartmentFilter = () => {
  filterCareersByDepartment(selectedDepartment.value)
}

const handleStatusFilter = () => {
  filterCareersByStatus(selectedStatus.value)
}

const clearAllFilters = async () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedDepartment.value = ''
  selectedStatus.value = ''
  await clearCareersFilters()
}

const openSlider = (career) => {
  selectedCareer.value = career
  isSliderOpen.value = true
}

const closeSlider = () => {
  selectedCareer.value = null
  isSliderOpen.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Job Openings':
      return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
    case 'Internship':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
    case 'Job Functional Areas':
      return 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
  }
}

// Get count of careers by category
const getCategoryCount = (category: string) => {
  if (!careers.value || !Array.isArray(careers.value)) {
    return 0
  }
  return careers.value.filter(career => career.category === category).length
}

// Get count of unique departments
const getDepartmentCount = () => {
  if (!careers.value || !Array.isArray(careers.value)) {
    return 0
  }
  const uniqueDepartments = new Set(careers.value.map(career => career.department).filter(Boolean))
  return uniqueDepartments.size
}

// Lifecycle
onMounted(() => {
  fetchCareers()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'">
    <!-- Hero Section -->
    <section class="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0">
          <img src="/black man in the farm.jpg" alt="Ghana Agriculture Careers" class="w-full h-full object-cover" />
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
          Careers
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Join our team and be part of Ghana's leading commodity exchange platform.
        </p>
        
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getCategoryCount('Job Openings') }}</div>
            <div class="text-white/90">Job Openings</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getCategoryCount('Internship') }}</div>
            <div class="text-white/90">Internships</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-4xl font-bold text-yellow-400 mb-2">{{ getDepartmentCount() }}</div>
            <div class="text-white/90">Departments</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gray-50'">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
              <input
                v-model="searchQuery"
              @input="handleSearch"
                type="text"
              placeholder="Search careers..."
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
            />
          </div>
            <div>
              <select
                v-model="selectedCategory"
              @change="handleCategoryFilter"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
              >
                <option value="">All Categories</option>
                <option v-for="category in careerCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="selectedDepartment"
              @change="handleDepartmentFilter"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
              >
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept" :value="dept">
                  {{ dept }}
                </option>
              </select>
            </div>
            <div>
              <select
                v-model="selectedStatus"
              @change="handleStatusFilter"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'border-gray-600 bg-slate-700 text-white' : 'border-gray-300 bg-white text-gray-900'"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="On Hold">On Hold</option>
              </select>
          </div>
            </div>

        <div class="flex justify-center mb-8">
              <button
                @click="clearAllFilters"
            class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
            Clear All Filters
              </button>
            </div>

        <!-- Loading State -->
        <div v-if="careersLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Loading careers...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="careersError" class="text-center py-12">
          <div class="border rounded-lg p-6 max-w-md mx-auto transition-colors duration-300" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ careersError }}</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredCareers.length === 0" class="text-center py-12">
          <div class="max-w-md mx-auto">
            <div class="text-6xl mb-4">💼</div>
            <h3 class="text-xl font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">No careers found</h3>
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Try adjusting your search or filter criteria.</p>
          </div>
        </div>

        <!-- Jobs Grid -->
        <div v-else-if="filteredCareers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="job in filteredCareers"
            :key="job.id"
            @click="openSlider(job)"
            class="group cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border transform hover:-translate-y-2"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
          >
            <!-- Job Header -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="job.image_path || '/trading dashboard.jpg'"
                :alt="job.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4">
                <span 
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                  :class="getCategoryColor(job.category)"
                >
                  {{ job.category }}
                </span>
              </div>
              <div class="absolute top-4 right-4">
                <span 
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                  :class="getStatusColor(job.status)"
                >
                  {{ job.status }}
                </span>
              </div>
            </div>

            <!-- Job Content -->
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2 line-clamp-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ job.title }}
              </h3>
              <p class="mb-4 line-clamp-3 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
                {{ job.description }}
              </p>
              
              <!-- Job Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{{ job.department }}</span>
                </div>
                <div class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ job.location }}</span>
                </div>
                <div v-if="job.salary_range" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span>{{ job.salary_range }}</span>
              </div>
                <div v-if="job.application_deadline" class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
                  <span>Apply by {{ formatDate(job.application_deadline) }}</span>
                  </div>
                </div>
                
                <!-- Apply Button -->
              <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                View Details
                </button>
                </div>
              </div>
            </div>
          </div>
    </section>

    <!-- Career Slider -->
    <CareerSlider
      :is-open="isSliderOpen"
      :career="selectedCareer"
      @close="closeSlider"
    />

    <!-- Footer -->
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
