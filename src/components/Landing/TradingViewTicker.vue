<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { useTickerVisibility } from '../../composables/useTickerVisibility'
import { globalMarketData, globalLoading, globalError, refreshMarketData } from '../../utils/marketDataUtils'
import type { ProcessedMarketData } from '../../services/marketDataService'

interface TickerCommodity {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  avatar: string
  color: string
  lastTradeDate: string
}

// Real GCX commodity data with custom avatars
const { t } = useI18n()

const commodities = ref<TickerCommodity[]>([])

// Use global state
const isLoading = globalLoading
const error = globalError

// Commodity avatar mapping
const commodityAvatars: Record<string, { avatar: string; color: string }> = {
  'White Maize': { avatar: '🌽', color: 'bg-yellow-500' },
  'Yellow Maize': { avatar: '🌽', color: 'bg-yellow-400' },
  'Yellow Soya Bean': { avatar: '🫘', color: 'bg-green-500' },
  'White Soya Bean': { avatar: '🫘', color: 'bg-green-400' },
  'Aromatic Straight Millled Rice': { avatar: '🍚', color: 'bg-blue-500' },
  'White Sesame Seed': { avatar: '⚪', color: 'bg-slate-400' },
  'Sorghum': { avatar: '🌾', color: 'bg-amber-500' }
}

// Default avatar for unmapped commodities
const getDefaultAvatar = (commodity: string): { avatar: string; color: string } => {
  if (commodity.toLowerCase().includes('maize')) return { avatar: '🌽', color: 'bg-yellow-500' }
  if (commodity.toLowerCase().includes('soya')) return { avatar: '🫘', color: 'bg-green-500' }
  if (commodity.toLowerCase().includes('rice')) return { avatar: '🍚', color: 'bg-blue-500' }
  if (commodity.toLowerCase().includes('sesame')) return { avatar: '⚪', color: 'bg-slate-400' }
  if (commodity.toLowerCase().includes('sorghum')) return { avatar: '🌾', color: 'bg-amber-500' }
  return { avatar: '📦', color: 'bg-gray-500' }
}

// Convert Firebase data to ticker format
const convertToTickerFormat = (data: ProcessedMarketData[]): TickerCommodity[] => {
  // Get the most recent and actively traded commodities
  const prioritySymbols = ['GAPWM2', 'GAPYM2', 'GEJWM2', 'GSAWM2', 'GKUWM2', 'GKUYM2', 'GTAYSB2', 'GWAYSB2']
  
  // Filter and prioritize the data
  const priorityData = data.filter(item => prioritySymbols.includes(item.Symbol))
  const remainingData = data.filter(item => !prioritySymbols.includes(item.Symbol))
  
  // Combine priority items first, then fill with remaining
  const selectedData = [...priorityData, ...remainingData].slice(0, 8)
  
  return selectedData.map(item => {
    const avatarInfo = commodityAvatars[item.Commodity] || getDefaultAvatar(item.Commodity)
    
    // Format the last trade date for this commodity
    const formattedDate = formatTradeDate(item.LastTradeDate)
    
    return {
      symbol: item.Symbol,
      name: item.Commodity,
      price: parseFloat(item.ClosingPrice) || 0,
      change: parseFloat(item.PriceChange) || 0,
      changePercent: item.priceChangePercent || 0,
      volume: formatVolume(item.Symbol),
      avatar: avatarInfo.avatar,
      color: avatarInfo.color,
      lastTradeDate: formattedDate
    }
  })
}

// Format volume (simplified since Firebase doesn't provide volume data)
const formatVolume = (symbol: string): string => {
  const baseVolumes: Record<string, string> = {
    'GAPWM2': '2.4M MT',
    'GAPYM2': '1.8M MT', 
    'GEJWM2': '3.1M MT',
    'GSAWM2': '890K MT',
    'GKUWM2': '1.2M MT',
    'GKUYM2': '950K MT',
    'GTAYSB2': '1.5M MT',
    'GWAYSB2': '1.1M MT'
  }
  
  return baseVolumes[symbol] || '500K MT'
}

// Helper function to parse dates more robustly
const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === '') return null
  
  // Try parsing as ISO string first
  let date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    return date
  }
  
  // Try different formats
  const dateStr = String(dateString).trim()
  
  // Try YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    date = new Date(dateStr)
    if (!isNaN(date.getTime())) return date
  }
  
  // Try DD/MM/YYYY or MM/DD/YYYY
  if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}/)) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      // Try MM/DD/YYYY first
      date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`)
      if (!isNaN(date.getTime())) return date
      // Try DD/MM/YYYY
      date = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`)
      if (!isNaN(date.getTime())) return date
    }
  }
  
  // Try DD-MM-YYYY or MM-DD-YYYY
  if (dateStr.match(/^\d{1,2}-\d{1,2}-\d{4}/)) {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      // Try MM-DD-YYYY first
      date = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`)
      if (!isNaN(date.getTime())) return date
      // Try DD-MM-YYYY
      date = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`)
      if (!isNaN(date.getTime())) return date
    }
  }
  
  return null
}

// Format a single trade date
const formatTradeDate = (dateString: string): string => {
  try {
    if (!dateString || dateString.trim() === '') {
      return ''
    }
    
    const date = parseDate(dateString)
    if (!date) {
      return ''
    }
    
    // Format as "DD MMM YYYY"
    return date.toLocaleDateString('en-GH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting trade date:', error)
    return ''
  }
}

// Convert global market data to ticker format
const updateTickerData = () => {
  if (globalMarketData.value.length > 0) {
    commodities.value = convertToTickerFormat(globalMarketData.value)
  } else {
    // No data available
    commodities.value = []
  }
}

// Manual refresh function
const refreshData = async () => {
  await refreshMarketData()
  updateTickerData()
}

// Watch for changes in global market data
watch(globalMarketData, () => {
  updateTickerData()
}, { immediate: true })

const isPaused = ref(false)
const { isTickerVisible: isVisible } = useTickerVisibility()

// Pause scrolling on hover
const pauseScrolling = () => {
  isPaused.value = true
}

// Resume scrolling
const resumeScrolling = () => {
  isPaused.value = false
}

// Get change color class
const getChangeColor = (change: number) => {
  if (isDarkMode.value) {
    if (change > 0) return 'text-green-400 bg-green-900/30'
    if (change < 0) return 'text-red-400 bg-red-900/30'
    return 'text-slate-400 bg-slate-800/30'
  } else {
    if (change > 0) return 'text-green-700 bg-green-50'
    if (change < 0) return 'text-red-700 bg-red-50'
    return 'text-slate-600 bg-slate-100'
  }
}

// Get change icon
const getChangeIcon = (change: number) => {
  if (change > 0) return '↗'
  if (change < 0) return '↘'
  return '→'
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(price)
}

// Lifecycle hooks
onMounted(() => {
  updateTickerData()
})
</script>

<template>
  <div 
    class="fixed left-0 right-0 z-[60] transition-all duration-500 ease-in-out shadow-lg" 
    :class="[
      isVisible ? 'top-0' : '-top-14',
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-b border-slate-700/50' 
        : 'bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200/50'
    ]"
  >
    <!-- Custom Commodity Ticker -->
    <div class="relative overflow-hidden h-14 md:h-14">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center h-full px-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span class="text-xs" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            Loading market data...
          </span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center h-full px-4">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span class="text-xs" :class="isDarkMode ? 'text-red-300' : 'text-red-600'">
            {{ error }}
          </span>
        </div>
      </div>

      <!-- Ticker Container -->
      <div 
        v-else-if="commodities.length > 0"
        class="flex items-center py-1.5 px-4 space-x-3 md:space-x-4 ticker-scroll h-full"
        :class="{ 'ticker-paused': isPaused }"
        @mouseenter="pauseScrolling"
        @mouseleave="resumeScrolling"
      >
        <!-- Commodities -->
        <div 
          v-for="commodity in commodities" 
          :key="commodity.symbol"
          class="flex items-center space-x-1.5 md:space-x-2 flex-shrink-0 group cursor-pointer transition-all duration-200 rounded-md px-2 py-1 border backdrop-blur-sm"
          :class="isDarkMode 
            ? 'hover:bg-slate-800/80 border-slate-700/50 bg-slate-900/50' 
            : 'hover:bg-slate-50/80 border-slate-200/50 bg-white/50'"
        >
          <!-- Commodity Avatar -->
          <div class="w-5 h-5 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20" :class="commodity.color">
            {{ commodity.avatar }}
          </div>
          
          <!-- Commodity Info -->
          <div class="flex flex-col min-w-[100px]">
            <div class="flex items-center space-x-1 mb-0.5">
              <span class="font-bold text-[10px] md:text-xs leading-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ commodity.name }}
              </span>
              <span class="text-[9px] font-mono hidden md:inline px-1 py-0.5 rounded bg-slate-200/50" :class="isDarkMode ? 'text-slate-300 bg-slate-800/50' : 'text-slate-600'">
                {{ commodity.symbol }}
              </span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-xs md:text-sm" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ formatPrice(commodity.price) }}
              </span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" :class="getChangeColor(commodity.change)">
                <span>{{ getChangeIcon(commodity.change) }}</span>
                <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
              </span>
            </div>
            <div v-if="commodity.lastTradeDate" class="text-[8px] mt-0.5 font-medium leading-tight whitespace-nowrap flex items-center gap-0.5" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
              <span class="w-1 h-1 rounded-full animate-pulse" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></span>
              <span class="text-[8px]">As at</span>
              <span class="font-semibold text-[8px]">{{ commodity.lastTradeDate }}</span>
            </div>
          </div>
        </div>

        <!-- Duplicate set for seamless loop -->
        <div 
          v-for="commodity in commodities" 
          :key="`duplicate-${commodity.symbol}`"
          class="flex items-center space-x-1.5 md:space-x-2 flex-shrink-0 group cursor-pointer transition-all duration-200 rounded-md px-2 py-1 border backdrop-blur-sm"
          :class="isDarkMode 
            ? 'hover:bg-slate-800/80 border-slate-700/50 bg-slate-900/50' 
            : 'hover:bg-slate-50/80 border-slate-200/50 bg-white/50'"
        >
          <!-- Commodity Avatar -->
          <div class="w-5 h-5 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20" :class="commodity.color">
            {{ commodity.avatar }}
          </div>
          
          <!-- Commodity Info -->
          <div class="flex flex-col min-w-[100px]">
            <div class="flex items-center space-x-1 mb-0.5">
              <span class="font-bold text-[10px] md:text-xs leading-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ commodity.name }}
              </span>
              <span class="text-[9px] font-mono hidden md:inline px-1 py-0.5 rounded bg-slate-200/50" :class="isDarkMode ? 'text-slate-300 bg-slate-800/50' : 'text-slate-600'">
                {{ commodity.symbol }}
              </span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-xs md:text-sm" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ formatPrice(commodity.price) }}
              </span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" :class="getChangeColor(commodity.change)">
                <span>{{ getChangeIcon(commodity.change) }}</span>
                <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
              </span>
            </div>
            <div v-if="commodity.lastTradeDate" class="text-[8px] mt-0.5 font-medium leading-tight whitespace-nowrap flex items-center gap-0.5" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
              <span class="w-1 h-1 rounded-full animate-pulse" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></span>
              <span class="text-[8px]">As at</span>
              <span class="font-semibold text-[8px]">{{ commodity.lastTradeDate }}</span>
            </div>
          </div>
        </div>

        <!-- Third set for even more seamless loop -->
        <div 
          v-for="commodity in commodities" 
          :key="`triplicate-${commodity.symbol}`"
          class="flex items-center space-x-1.5 md:space-x-2 flex-shrink-0 group cursor-pointer transition-all duration-200 rounded-md px-2 py-1 border backdrop-blur-sm"
          :class="isDarkMode 
            ? 'hover:bg-slate-800/80 border-slate-700/50 bg-slate-900/50' 
            : 'hover:bg-slate-50/80 border-slate-200/50 bg-white/50'"
        >
          <!-- Commodity Avatar -->
          <div class="w-5 h-5 md:w-5 md:h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-1 ring-white/20" :class="commodity.color">
            {{ commodity.avatar }}
          </div>
          
          <!-- Commodity Info -->
          <div class="flex flex-col min-w-[100px]">
            <div class="flex items-center space-x-1 mb-0.5">
              <span class="font-bold text-[10px] md:text-xs leading-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ commodity.name }}
              </span>
              <span class="text-[9px] font-mono hidden md:inline px-1 py-0.5 rounded bg-slate-200/50" :class="isDarkMode ? 'text-slate-300 bg-slate-800/50' : 'text-slate-600'">
                {{ commodity.symbol }}
              </span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-xs md:text-sm" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ formatPrice(commodity.price) }}
              </span>
              <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5" :class="getChangeColor(commodity.change)">
                <span>{{ getChangeIcon(commodity.change) }}</span>
                <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
              </span>
            </div>
            <div v-if="commodity.lastTradeDate" class="text-[8px] mt-0.5 font-medium leading-tight whitespace-nowrap flex items-center gap-0.5" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
              <span class="w-1 h-1 rounded-full animate-pulse" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></span>
              <span class="text-[8px]">As at</span>
              <span class="font-semibold text-[8px]">{{ commodity.lastTradeDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div class="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
        <button 
          @click="refreshData"
          :disabled="isLoading"
          class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 hover:scale-110"
          :class="isLoading 
            ? 'bg-blue-500 animate-pulse' 
            : (isDarkMode 
              ? 'bg-green-600 hover:bg-green-500' 
              : 'bg-green-500 hover:bg-green-600')"
          :title="isLoading ? 'Refreshing...' : 'Refresh data'"
        >
          <svg 
            v-if="!isLoading"
            class="w-3 h-3 text-white" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
          </svg>
          <div v-else class="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ticker scrolling animation */
@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

.ticker-scroll {
  animation: ticker-scroll 30s linear infinite;
  width: max-content;
}

/* Smooth hover effects */
.group:hover {
  transform: translateY(-1px);
}

/* Enhanced shadow on hover */
.group:hover .shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.ticker-paused {
  animation-play-state: paused;
}

/* Live indicator animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .space-x-6 {
    column-gap: 1rem;
  }
  
  .space-x-2 {
    column-gap: 0.5rem;
  }
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Smooth transitions */
.group {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced ring effect on avatars */
.ring-2 {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}
</style>
