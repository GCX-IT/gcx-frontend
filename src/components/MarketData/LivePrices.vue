<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { marketDataService, type ProcessedMarketData } from '../../services/marketDataService'

interface Commodity {
  symbol: string
  name: string
  openingPrice: number
  closingPrice: number
  priceChange: number
  changePercent: number
  high: number
  low: number
  volume: string
  lastUpdate: string
  trend: 'up' | 'down' | 'neutral'
  avatar: string
  color: string
  deliveryCentre?: string
  grade?: string
}

const { t } = useI18n()

const commodityPrices = ref<Commodity[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const lastUpdated = ref<string>('')

const selectedCommodity = ref<Commodity | null>(null)
const searchTerm = ref('')
const isUpdating = ref(false)

const filteredPrices = computed(() => {
  if (!searchTerm.value) return commodityPrices.value
  return commodityPrices.value.filter(item => 
    item.symbol.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const selectCommodity = (commodity: Commodity) => {
  selectedCommodity.value = commodity
}

const getPriceChangeClass = (change: number) => {
  if (change > 0) return 'text-green-500 bg-green-500/10 border-green-500/20'
  if (change < 0) return 'text-red-500 bg-red-500/10 border-red-500/20'
  return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
}

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') return '↗'
  if (trend === 'down') return '↘'
  return '→'
}

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') return 'text-green-500'
  if (trend === 'down') return 'text-red-500'
  return 'text-slate-500'
}

// Helper function to get commodity avatar and color
const getCommodityAvatar = (commodityName: string): { avatar: string; color: string } => {
  const name = commodityName.toLowerCase()
  if (name.includes('maize')) return { avatar: '🌽', color: 'bg-yellow-500' }
  if (name.includes('soya') || name.includes('soybean')) return { avatar: '🫘', color: 'bg-green-500' }
  if (name.includes('rice')) return { avatar: '🍚', color: 'bg-blue-500' }
  if (name.includes('sesame')) return { avatar: '⚪', color: 'bg-slate-400' }
  if (name.includes('sorghum')) return { avatar: '🌾', color: 'bg-amber-500' }
  return { avatar: '📊', color: 'bg-gray-500' }
}

// Convert Firebase data to our Commodity interface
const convertToCommodity = (data: ProcessedMarketData): Commodity => {
  const openingPrice = parseFloat(data.OpeningPrice) || 0
  const closingPrice = parseFloat(data.ClosingPrice) || 0
  const priceChange = parseFloat(data.PriceChange) || 0
  const changePercent = openingPrice > 0 ? (priceChange / openingPrice) * 100 : 0
  const trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral'
  
  const { avatar, color } = getCommodityAvatar(data.Commodity)
      
      return {
    symbol: data.Symbol,
    name: data.Commodity,
    openingPrice,
    closingPrice,
    priceChange,
    changePercent,
    high: parseFloat(data.HighPrice) || 0,
    low: parseFloat(data.LowPrice) || 0,
    volume: 'N/A', // Volume not available in current Firebase data
    lastUpdate: data.LastTradeDate,
    trend,
    avatar,
    color,
    deliveryCentre: data.DeliveryCentre,
    grade: data.Grade
  }
}

// Load market data from Firebase
const loadMarketData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const [data, statistics] = await Promise.all([
      marketDataService.getCombinedMarketData(),
      marketDataService.getMarketStatistics()
    ])
    
    commodityPrices.value = data.map(convertToCommodity)
    lastUpdated.value = statistics.lastUpdated
    
    console.log(`✅ Loaded ${data.length} commodities from Firebase`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load market data'
    console.error('❌ Market data loading error:', err)
  } finally {
    loading.value = false
  }
}

// Refresh data
const refreshData = async () => {
  await loadMarketData()
}

// Load data on mount and set up auto-refresh
onMounted(async () => {
  await loadMarketData()
  
  // Auto-refresh every 5 minutes
  setInterval(async () => {
    if (!loading.value) {
      await refreshData()
    }
  }, 5 * 60 * 1000)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section with Live Indicator -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-center gap-3">
        <div>
          <h2 class="text-2xl lg:text-3xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Live Commodity Prices
          </h2>
          <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            Real-time prices for GCX traded commodities (GHC per Metric Tonne)
          </p>
          <p v-if="lastUpdated" class="text-xs mt-1" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">
            Last updated: {{ new Date(lastUpdated).toLocaleString('en-GH') }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-medium text-green-500">LIVE</span>
        </div>
      </div>
      
      <!-- Search Bar and Refresh Button -->
      <div class="flex items-center gap-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="p-3 rounded-xl border transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-50'"
        >
          <svg 
            class="w-5 h-5" 
            :class="[
              isDarkMode ? 'text-slate-300' : 'text-slate-600',
              { 'animate-spin': loading }
            ]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
        
      <div class="relative w-full lg:w-80">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search commodities..."
          class="w-full px-4 py-3 pl-10 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
        />
        <svg class="absolute left-3 top-3 w-4 h-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !commodityPrices.length" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="p-4 rounded-xl border animate-pulse" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
          <div class="flex items-center justify-between">
            <div>
              <div class="h-4 bg-slate-300 rounded w-20 mb-2"></div>
              <div class="h-8 bg-slate-300 rounded w-24"></div>
            </div>
            <div class="w-12 h-12 bg-slate-300 rounded-xl"></div>
          </div>
        </div>
      </div>
      <div class="text-center py-12">
        <div class="inline-flex items-center gap-2">
          <svg class="animate-spin w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading market data...</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : ''">
        <div class="flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2" :class="isDarkMode ? 'text-red-400' : ''">Failed to load market data</h3>
        <p class="text-red-600 mb-4" :class="isDarkMode ? 'text-red-300' : ''">{{ error }}</p>
        <button @click="refreshData" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Market Summary Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-200'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Contracts</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ commodityPrices.length }}</div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-200'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Active Contracts</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ commodityPrices.length }}</div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-200'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Market Status</div>
            <div class="text-2xl font-bold text-green-500">OPEN</div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-200'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Last Update</div>
            <div class="text-sm font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ lastUpdated ? new Date(lastUpdated).toLocaleTimeString('en-GH') : 'N/A' }}
            </div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Table -->
    <div v-if="!loading && !error && commodityPrices.length" class="overflow-x-auto">
      <div class="rounded-xl border overflow-hidden shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <table class="w-full">
          <thead>
            <tr :class="isDarkMode ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700' : 'bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200'">
              <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Symbol</th>
              <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Commodity</th>
              <th class="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Grade</th>
              <th class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Centre</th>
              <th class="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Opening</th>
              <th class="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Closing</th>
              <th class="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Change</th>
              <th class="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">High</th>
              <th class="px-4 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Low</th>
              <th class="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredPrices"
              :key="item.symbol"
              @click="selectCommodity(item)"
              class="cursor-pointer transition-all duration-200 border-b group"
              :class="[
                isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-200',
                loading ? 'animate-pulse' : ''
              ]"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <!-- Commodity Avatar -->
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg" :class="item.color">
                    {{ item.avatar }}
                  </div>
                  <!-- Symbol -->
                  <span class="font-mono font-bold text-sm bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    {{ item.symbol }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ item.name }}
                </span>
              </td>
              <td class="px-4 py-4 text-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" :class="isDarkMode ? 'bg-blue-900/20 text-blue-400' : ''">
                  {{ item.grade || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-4">
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  {{ item.deliveryCentre || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="text-sm font-mono" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  GHC {{ item.openingPrice.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="text-sm font-mono font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  GHC {{ item.closingPrice.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <span 
                    class="text-sm font-mono font-bold px-2 py-1 rounded-lg border"
                    :class="getPriceChangeClass(item.priceChange)"
                  >
                    {{ item.priceChange >= 0 ? '+' : '' }}{{ item.priceChange.toFixed(2) }}
                  </span>
                  <span 
                    class="text-xs font-semibold"
                    :class="item.priceChange >= 0 ? 'text-green-500' : 'text-red-500'"
                  >
                    ({{ item.changePercent.toFixed(2) }}%)
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="text-sm font-mono" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  GHC {{ item.high.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-4 text-right">
                <span class="text-sm font-mono" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  GHC {{ item.low.toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-4 text-center">
                <span 
                  class="text-lg font-bold"
                  :class="getTrendColor(item.trend)"
                >
                  {{ getTrendIcon(item.trend) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Selected Commodity Details -->
    <div v-if="selectedCommodity" class="mt-6">
      <div class="rounded-xl p-6 border shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <!-- Commodity Avatar -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg" :class="selectedCommodity.color">
              {{ selectedCommodity.avatar }}
            </div>
            <div>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ selectedCommodity.symbol }} - {{ selectedCommodity.name }}
              </h3>
              <span 
                class="text-lg font-bold"
                :class="getTrendColor(selectedCommodity.trend)"
              >
                {{ getTrendIcon(selectedCommodity.trend) }}
              </span>
            </div>
          </div>
          <button 
            @click="selectedCommodity = null"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Current Price</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              GHC {{ selectedCommodity.closingPrice.toLocaleString() }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Daily Change</div>
            <div class="text-2xl font-bold" :class="selectedCommodity.priceChange >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ selectedCommodity.priceChange >= 0 ? '+' : '' }}{{ selectedCommodity.priceChange.toFixed(2) }}
            </div>
            <div class="text-xs mt-1" :class="selectedCommodity.priceChange >= 0 ? 'text-green-500' : 'text-red-500'">
              ({{ selectedCommodity.changePercent.toFixed(2) }}%)
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Grade</div>
            <div class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ selectedCommodity.grade || 'N/A' }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Delivery Centre</div>
            <div class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ selectedCommodity.deliveryCentre || 'N/A' }}
            </div>
          </div>
        </div>
        
        <!-- Additional Details -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">High Price</div>
            <div class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              GHC {{ selectedCommodity.high.toLocaleString() }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Low Price</div>
            <div class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              GHC {{ selectedCommodity.low.toLocaleString() }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Last Trade</div>
            <div class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ selectedCommodity.lastUpdate }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
