<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { CalendarIcon, MapPinIcon, ClockIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { isDarkMode } from '../../utils/darkMode'
import { DataCache, CACHE_DURATIONS } from '../../utils/dataCache'
import eventService, { type Event } from '../../services/eventService'

const router = useRouter()
const activeTab = ref('upcoming')
const { t } = useI18n()

// State
const upcomingEvents = ref<Event[]>([])
const pastEvents = ref<Event[]>([])
const loading = ref(true)

// Fetch events from API
const fetchEvents = async (skipCache = false) => {
  try {
    loading.value = true
    
    // Check cache first for upcoming events - events rarely change (unless skipped)
    if (!skipCache) {
      const cachedUpcoming = DataCache.get<Event[]>('gcx_events_upcoming')
      const cachedPast = DataCache.get<Event[]>('gcx_events_past')
      
      if (cachedUpcoming && cachedPast) {
        upcomingEvents.value = cachedUpcoming
        pastEvents.value = cachedPast
        loading.value = false
        return
      }
    }
    
    // Fetch only 3 upcoming and 3 past events
    const upcoming = await eventService.getUpcomingEvents(3)
    const past = await eventService.getPastEvents(3)
    
    upcomingEvents.value = upcoming
    pastEvents.value = past
    
    // Cache for 24 hours (events rarely change)
    DataCache.set('gcx_events_upcoming', upcoming, CACHE_DURATIONS.TWENTY_FOUR_HOURS)
    DataCache.set('gcx_events_past', past, CACHE_DURATIONS.TWENTY_FOUR_HOURS)
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    loading.value = false
  }
}

const refreshEvents = async () => {
  DataCache.clear('gcx_events_upcoming')
  DataCache.clear('gcx_events_past')
  await fetchEvents(true)
}

const getCurrentEvents = () => {
  return activeTab.value === 'upcoming' ? upcomingEvents.value : pastEvents.value
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const navigateToEvent = (event: Event) => {
  router.push(`/media/archives/${event.slug}`)
}

const viewAllEvents = () => {
  router.push('/media/archives')
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <section class="py-24 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
    <div class="max-w-[1600px] mx-auto px-8">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-4 mb-6">
          <h2 class="text-5xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Upcoming Events</h2>
          <button
            @click="refreshEvents"
            :disabled="loading"
            title="Refresh events"
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
        <p class="text-xl max-w-3xl mx-auto transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Join us for exciting events and educational opportunities</p>
      </div>
      
      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-12">
        <div class="flex rounded-2xl border-2 overflow-hidden" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
          <button
            @click="activeTab = 'upcoming'"
            class="px-8 py-4 text-lg font-semibold transition-all duration-300"
            :class="activeTab === 'upcoming' 
              ? 'bg-yellow-500 text-black' 
              : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')"
          >
            Upcoming Events
          </button>
          <button
            @click="activeTab = 'past'"
            class="px-8 py-4 text-lg font-semibold transition-all duration-300"
            :class="activeTab === 'past' 
              ? 'bg-yellow-500 text-black' 
              : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')"
          >
            Past Events
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading events...</p>
      </div>

      <!-- No Events State -->
      <div v-else-if="getCurrentEvents().length === 0" class="text-center py-12">
        <i class="pi pi-calendar text-4xl mb-4" :class="isDarkMode ? 'text-slate-500' : 'text-gray-400'"></i>
        <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          {{ activeTab === 'upcoming' ? 'No upcoming events at the moment' : 'No past events to display' }}
        </p>
      </div>

      <!-- Events Grid -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <div 
          v-for="event in getCurrentEvents()" 
          :key="event.id"
          @click="navigateToEvent(event)"
          class="group relative overflow-hidden rounded-3xl shadow-2xl border transition-all duration-500 hover:shadow-3xl cursor-pointer"
          :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'"
        >
          <!-- Event Image -->
          <div class="w-full h-64 overflow-hidden">
            <img 
              :src="event.image || '/Picture3.png'" 
              :alt="event.title" 
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'"
            />
          </div>
          
          <!-- Category Badge -->
          <div class="absolute top-6 left-6">
            <span class="px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg bg-yellow-500">
              {{ event.type }}
            </span>
          </div>
          
          <!-- Status Badge -->
          <div class="absolute top-6 right-6">
            <span class="px-3 py-2 rounded-lg text-xs font-medium text-white shadow-lg capitalize" :class="{
              'bg-green-500': event.status === 'upcoming',
              'bg-slate-500': event.status === 'completed'
            }">
              {{ event.status }}
            </span>
          </div>
          
          <!-- Event Content -->
          <div class="p-8">
            <!-- Event Title -->
            <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ event.title }}
            </h3>
            
            <!-- Event Description -->
            <p class="text-base mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              {{ event.description }}
            </p>
            
            <!-- Event Details -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <CalendarIcon class="w-4 h-4 mr-3 text-yellow-500" />
                {{ formatDate(event.date) }}
              </div>
              <div v-if="event.time" class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <ClockIcon class="w-4 h-4 mr-3 text-yellow-500" />
                {{ event.time }}
              </div>
              <div class="flex items-center text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <MapPinIcon class="w-4 h-4 mr-3 text-yellow-500" />
                {{ event.venue ? `${event.location} - ${event.venue}` : event.location }}
              </div>
            </div>
            
            <!-- CTA Button -->
            <button 
              @click.stop="navigateToEvent(event)"
              class="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              :class="event.status === 'completed' ? 'bg-slate-500 hover:bg-slate-400 text-white' : ''"
            >
              <span>{{ event.status === 'upcoming' ? 'Register Now' : 'View Details' }}</span>
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- View All Events Button -->
      <div class="text-center mt-16">
        <button 
          @click="viewAllEvents"
          class="bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 text-lg"
        >
          View All Events →
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.5s ease-in-out;
}

/* Image hover effect only */
.group:hover img {
  transform: scale(1.1);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .lg:grid-cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .py-24 {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  
  .mb-16 {
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
  
  .gap-8 {
    gap: 1.5rem;
  }
}
</style>
