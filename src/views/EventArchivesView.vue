<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import eventService, { type Event } from '../services/eventService'

const router = useRouter()

// Event data
const events = ref<Event[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Filter states
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedYear = ref('All')
const selectedStatus = ref('All')

// Available filters
const categories = ['All', 'Conference', 'Summit', 'Workshop', 'Forum', 'Program', 'Meeting']
const years = computed(() => {
  const eventYears = events.value.map(event => new Date(event.date).getFullYear())
  const uniqueYears = [...new Set(eventYears)].sort((a, b) => b - a)
  return ['All', ...uniqueYears.map(String)]
})
const statuses = ['All', 'Upcoming', 'Completed']

// Computed properties
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                         event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = selectedCategory.value === 'All' || event.category === selectedCategory.value
    const matchesYear = selectedYear.value === 'All' || new Date(event.date).getFullYear().toString() === selectedYear.value
    const matchesStatus = selectedStatus.value === 'All' || 
                         (selectedStatus.value === 'Upcoming' && event.status === 'upcoming') ||
                         (selectedStatus.value === 'Completed' && event.status === 'completed')
    
    return matchesSearch && matchesCategory && matchesYear && matchesStatus
  })
})

const upcomingEvents = computed(() => filteredEvents.value.filter(event => event.status === 'upcoming'))
const pastEvents = computed(() => filteredEvents.value.filter(event => event.status === 'completed'))

const totalAttendees = computed(() => {
  return events.value.reduce((total, event) => total + event.attendees, 0)
})

// Functions
const viewEventDetails = (eventSlug: string) => {
  router.push(`/media/archives/${eventSlug}`)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Fetch events on mount
const fetchEvents = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await eventService.getEvents({ limit: 100 })
    events.value = data
  } catch (err: any) {
    console.error('Failed to fetch events:', err)
    error.value = 'Failed to load events. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

const getStatusColor = (status: string) => {
  return status === 'upcoming' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getTypeColor = (type: string) => {
  const colors = {
    'Conference': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Summit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Workshop': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Forum': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Program': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Meeting': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img src="/Picture3.png" alt="Event Archives Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-800/70 to-green-900/90"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight">
          Event Archives
        </h1>
        <p class="text-xl lg:text-2xl max-w-4xl mx-auto text-white/80 mb-12 leading-relaxed">
          Explore our historical events, conferences, and programs that have shaped Ghana's commodity trading landscape
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">{{ events.length }}+</div>
            <div class="text-white/70 text-sm">Events Archived</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">{{ categories.length - 1 }}</div>
            <div class="text-white/70 text-sm">Event Categories</div>
          </div>
          <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-3xl font-bold text-white mb-2">{{ totalAttendees.toLocaleString() }}+</div>
            <div class="text-white/70 text-sm">Total Attendees</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
          <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading events...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Error Loading Events</h3>
          <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'" class="mb-4">{{ error }}</p>
          <button 
            @click="fetchEvents"
            class="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Search and Filters -->
        <div v-else>
        <div class="mb-12">
          <div class="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            <!-- Search Bar -->
            <div class="w-full lg:w-96">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search events..."
                  class="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-slate-900 placeholder-gray-500'"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-wrap gap-4">
              <select
                v-model="selectedCategory"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
              >
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>

              <select
                v-model="selectedYear"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
              >
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>

              <select
                v-model="selectedStatus"
                class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
              >
                <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div v-if="upcomingEvents.length > 0" class="mb-16">
          <h2 class="text-3xl font-bold mb-8" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Upcoming Events
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="event in upcomingEvents"
              :key="event.id"
              class="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'"
              @click="viewEventDetails(event.slug)"
            >
              <div class="relative">
                <img :src="event.image" :alt="event.title" class="w-full h-48 object-cover" />
                <div class="absolute top-4 left-4 flex gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusColor(event.status)">
                    {{ event.status }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getTypeColor(event.type)">
                    {{ event.type }}
                  </span>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ event.title }}
                </h3>
                <div class="flex items-center text-sm mb-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </div>
                <div class="flex items-center text-sm mb-3" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </div>
                <p class="text-sm mb-4 line-clamp-3" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  {{ event.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-500' : 'text-gray-500'">
                    {{ event.attendees }} attendees
                  </span>
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    {{ event.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Events -->
        <div>
          <h2 class="text-3xl font-bold mb-8" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Past Events
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="event in pastEvents"
              :key="event.id"
              class="rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'"
              @click="viewEventDetails(event.slug)"
            >
              <div class="relative">
                <img :src="event.image" :alt="event.title" class="w-full h-48 object-cover" />
                <div class="absolute top-4 left-4 flex gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getStatusColor(event.status)">
                    {{ event.status }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="getTypeColor(event.type)">
                    {{ event.type }}
                  </span>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ event.title }}
                </h3>
                <div class="flex items-center text-sm mb-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(event.date) }}
                </div>
                <div class="flex items-center text-sm mb-3" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ event.location }}
                </div>
                <p class="text-sm mb-4 line-clamp-3" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                  {{ event.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-500' : 'text-gray-500'">
                    {{ event.attendees }} attendees
                  </span>
                  <button class="text-sm font-semibold hover:underline" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
