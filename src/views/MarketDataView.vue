<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import { marketDataService } from '../services/marketDataService'
import MarketOverview from '../components/MarketData/MarketOverview.vue'
import SubscriptionModal from '../components/SubscriptionModal.vue'

import Footer from '../components/Footer.vue'

const route = useRoute()
const { t } = useI18n()
const router = useRouter()

const isSubscriptionModalOpen = ref(false)

const tabs = [
  { label: 'Market Overview', key: 'overview', description: 'Comprehensive market analysis and statistics' },
]

const activeTab = ref('overview')

// Market statistics from Firebase
const marketStats = ref({
  totalSymbols: 0,
  totalCommodities: 0,
  totalDeliveryCentres: 0,
  lastUpdated: ''
})

// Market status based on time
const marketStatus = computed(() => {
  const now = new Date()
  
  // Convert to GMT+0 (Accra/London time)
  const utcHour = now.getUTCHours()
  const utcDay = now.getUTCDay() // 0 = Sunday, 6 = Saturday
  
  // Market hours: Monday-Friday (1-5), 8 AM - 3 PM GMT+0
  const isWeekday = utcDay >= 1 && utcDay <= 5
  const isMarketHours = utcHour >= 8 && utcHour < 15 // 8 AM to 3 PM (15:00)
  
  return isWeekday && isMarketHours ? 'OPEN' : 'CLOSED'
})

// Load market statistics
const loadMarketStats = async () => {
  try {
    const statistics = await marketDataService.getMarketStatistics()
    marketStats.value = statistics
  } catch (error) {
    console.error('Failed to load market statistics:', error)
  }
}

// Set active tab from route hash
const setActiveFromHash = () => {
  const hash = route.hash.replace('#', '')
  if (hash && tabs.find(tab => tab.key === hash)) {
    activeTab.value = hash
  }
}

const go = async (key: string) => {
  activeTab.value = key
  router.replace({ hash: `#${key}` })
  await Promise.resolve()
  const el = document.getElementById(`md-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(async () => {
  setActiveFromHash()
  await loadMarketStats()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section -->
    <section class="relative py-14 lg:py-20 overflow-hidden">
      <div class="absolute inset-0">
        <img src="/trading dashboard.jpg" alt="{{ t('navigation.menu.marketData') }}" class="w-full h-full object-cover" />
        <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/50' : 'bg-black/25'"></div>
      </div>
      <div class="relative max-w-[1600px] mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-5xl font-extrabold mb-3 text-white">{{ t('navigation.menu.marketData') }}</h1>
        <p class="text-lg max-w-3xl mx-auto mb-8" :class="isDarkMode ? 'text-slate-300' : 'text-white'">
          Real-time commodity trading data and market analysis for Ghana's agricultural exchange.
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
          <div class="p-4 rounded-xl border backdrop-blur-sm" :class="isDarkMode ? 'border-slate-600 bg-slate-800/80' : 'border-slate-200 bg-white/80'">
            <div class="text-2xl font-bold text-green-500">{{ marketStats.totalSymbols }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Active Contracts</div>
          </div>
          <div class="p-4 rounded-xl border backdrop-blur-sm" :class="isDarkMode ? 'border-slate-600 bg-slate-800/80' : 'border-slate-200 bg-white/80'">
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ marketStats.totalDeliveryCentres }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Delivery Centres</div>
          </div>
          <div class="p-4 rounded-xl border backdrop-blur-sm" :class="isDarkMode ? 'border-slate-600 bg-slate-800/80' : 'border-slate-200 bg-white/80'">
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ marketStats.totalCommodities }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Commodity Types</div>
          </div>
          <div class="p-4 rounded-xl border backdrop-blur-sm" :class="isDarkMode ? 'border-slate-600 bg-slate-800/80' : 'border-slate-200 bg-white/80'">
            <div class="flex items-center gap-2 justify-center mb-1">
              <div 
                class="w-3 h-3 rounded-full"
                :class="marketStatus === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
              ></div>
              <div 
                class="text-2xl font-bold"
                :class="marketStatus === 'OPEN' ? 'text-green-500' : 'text-red-500'"
              >
                {{ marketStatus }}
              </div>
            </div>
            <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Market Status</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tab Navigation -->
    <section class="py-8 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-[1600px] mx-auto px-4">
        <div class="flex flex-wrap justify-center items-center gap-2 lg:gap-4">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="go(tab.key)"
            class="group relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300"
            :class="activeTab === tab.key 
              ? (isDarkMode ? 'bg-yellow-500 text-black shadow-lg' : 'bg-yellow-500 text-white shadow-lg')
              : (isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')"
          >
            {{ tab.label }}
            <!-- Tooltip -->
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                 :class="isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-800 text-white'">
              {{ tab.description }}
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                   :class="isDarkMode ? 'border-t-slate-700' : 'border-t-slate-800'"></div>
            </div>
          </button>
          
          <!-- Unlock Premium Button -->
          <button 
            @click="isSubscriptionModalOpen = true"
            class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            Unlock Premium
          </button>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <section class="relative py-12 overflow-hidden">
      <!-- Background layer -->
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <img src="/trading dashboard.jpg" alt="Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/30' : 'bg-white/60'"></div>
      </div>
      
      <div class="max-w-[1600px] mx-auto px-4">

        <!-- Market Overview Tab -->
        <div v-if="activeTab === 'overview'" id="md-overview" class="space-y-8">
          <MarketOverview />
        </div>


      </div>
    </section>

    <Footer />
    
    <!-- Subscription Modal -->
    <SubscriptionModal 
      :isOpen="isSubscriptionModalOpen" 
      @close="isSubscriptionModalOpen = false" 
    />
  </div>
</template>
