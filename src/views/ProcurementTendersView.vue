<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isDarkMode } from '../utils/darkMode'
import { useI18n } from '../composables/useI18n'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Footer from '../components/Footer.vue'

const { t } = useI18n()

// Filter and search
const searchQuery = ref('')
const selectedStatus = ref('all') // all, open, closed

// Tenders data - Will be fetched from CMS
const tenders = ref<any[]>([])

// Filtered tenders
const filteredTenders = computed(() => {
  return tenders.value.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         tender.category.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || tender.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status: string) => {
  return status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const getStatusLabel = (status: string) => {
  return status === 'open' ? 'Open' : 'Closed'
}

// TODO: Fetch tenders from CMS API on component mount
onMounted(() => {
  // This will be replaced with actual API call to CMS
  // const response = await fetch('/api/tenders')
  // tenders.value = await response.json()
})
</script>

<template>
  <div :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'" class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-12 md:py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-white'">
            Procurement Tenders
          </h1>
          <p class="text-lg" :class="isDarkMode ? 'text-slate-300' : 'text-white/90'">
            Post and browse commodity procurement tenders from GCX members
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Controls Section -->
      <div class="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Search and Filter -->
        <div class="flex-1 flex gap-4 w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tenders by title or commodity..."
            class="flex-1 px-4 py-2 rounded-lg border transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
          />
          <select
            v-model="selectedStatus"
            class="px-4 py-2 rounded-lg border transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <!-- Tenders Grid -->
      <div v-if="filteredTenders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tender in filteredTenders"
          :key="tender.id"
          class="rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border"
          :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-xl font-bold flex-1" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ tender.title }}
            </h3>
            <span :class="['px-3 py-1 rounded-full text-sm font-semibold', getStatusColor(tender.status)]">
              {{ getStatusLabel(tender.status) }}
            </span>
          </div>

          <!-- Category Badge -->
          <div class="mb-3">
            <span class="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              {{ tender.category }}
            </span>
          </div>

          <!-- Description -->
          <p class="mb-4 line-clamp-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ tender.description }}
          </p>

          <!-- Details Grid -->
          <div class="space-y-3 mb-4 pb-4 border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Quantity</p>
              <p class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ tender.quantity }}</p>
            </div>
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Price</p>
              <p class="font-semibold text-green-600 dark:text-green-400">{{ tender.price }}</p>
            </div>
            <div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Deadline</p>
              <p class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ new Date(tender.deadline).toLocaleDateString() }}</p>
            </div>
            <div v-if="tender.specifications">
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Specifications</p>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ tender.specifications }}</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            <p>Posted by: {{ tender.producer }}</p>
            <p>Posted on: {{ new Date(tender.posted_date).toLocaleDateString() }}</p>
          </div>

          <!-- Action Button -->
          <button class="mt-4 w-full py-2 rounded-lg font-semibold transition-all" :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'">
            View Details
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <ExclamationTriangleIcon class="w-16 h-16 mx-auto mb-4 opacity-40" :class="isDarkMode ? 'text-slate-400' : 'text-slate-400'" />
        <p class="text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          No tenders found matching your criteria
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div>
      <Footer />
    </div>
  </div>
</template>
