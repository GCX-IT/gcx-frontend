<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { marketDataService, type ProcessedMarketData } from '../../services/marketDataService'

interface Commodity {
  symbol: string
  name: string
  price: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  deliveryCentre?: string
  grade?: string
  lastTradeDate?: string
}

interface MarketCategory {
  category: string
  commodities: Commodity[]
}

const { t } = useI18n()

const marketData = ref<MarketCategory[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const lastUpdated = ref<string>('')

const selectedCategory = ref('all')
const searchTerm = ref('')
const isUpdating = ref(false)
const selectedCommodity = ref<Commodity | null>(null)

// Market statistics
const marketStats = computed(() => {
  const allCommodities = marketData.value.flatMap(cat => cat.commodities)
  const avgPrice = allCommodities.length > 0 
    ? allCommodities.reduce((sum, item) => sum + item.price, 0) / allCommodities.length 
    : 0
  const totalChange = allCommodities.reduce((sum, item) => sum + item.change, 0)
  
  return {
    avgPrice: avgPrice.toFixed(2),
    totalContracts: allCommodities.length,
    totalCommodities: allCommodities.length,
    totalChange: totalChange.toFixed(2)
  }
})

// All commodities in a single array
const allCommodities = computed(() => {
  let commodities = marketData.value.flatMap(cat => cat.commodities)
  
  // Filter by category if selected
  if (selectedCategory.value !== 'all') {
    commodities = commodities.filter(item => 
      getCommodityCategory(item.name) === selectedCategory.value
    )
  }
  
  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    commodities = commodities.filter(item => 
      item.symbol.toLowerCase().includes(term) ||
      item.name.toLowerCase().includes(term) ||
      item.deliveryCentre?.toLowerCase().includes(term)
    )
  }
  
  return commodities.sort((a, b) => a.symbol.localeCompare(b.symbol))
})

// Filtered data (for backward compatibility)
const filteredData = computed(() => {
  let data = marketData.value
  
  if (selectedCategory.value !== 'all') {
    data = data.filter(cat => cat.category === selectedCategory.value)
  }
  
  if (searchTerm.value) {
    data = data.map(cat => ({
      ...cat,
      commodities: cat.commodities.filter(item => 
        item.symbol.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    })).filter(cat => cat.commodities.length > 0)
  }
  
  return data
})



const getChangeClass = (change: number) => {
  if (isDarkMode.value) {
    if (change > 0) return 'text-green-400 bg-green-900/30 border-green-700/30'
    if (change < 0) return 'text-red-400 bg-red-900/30 border-red-700/30'
    return 'text-slate-400 bg-slate-800/30 border-slate-700/30'
  } else {
    if (change > 0) return 'text-green-700 bg-green-50 border-green-200'
    if (change < 0) return 'text-red-700 bg-red-50 border-red-200'
    return 'text-slate-600 bg-slate-100 border-slate-200'
  }
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

const selectCommodity = (commodity: Commodity) => {
  selectedCommodity.value = commodity
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

// Convert Firebase data to our Commodity interface
const convertToCommodity = (data: ProcessedMarketData): Commodity => {
  const price = parseFloat(data.ClosingPrice) || 0
  const priceChange = parseFloat(data.PriceChange) || 0
  const trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral'
        
  return {
    symbol: data.Symbol,
    name: data.Commodity,
    price,
    change: priceChange,
    trend,
    deliveryCentre: data.DeliveryCentre || 'Standard',
    grade: data.Grade || 'Grade A',
    lastTradeDate: formatTradeDate(data.LastTradeDate)
  }
}

// Helper function to determine commodity category
const getCommodityCategory = (commodityName: string | undefined): string => {
  if (!commodityName) return 'Other'
  
  const name = commodityName.toLowerCase()
  
  // Check for specific commodity types
  if (name.includes('maize')) return 'Maize'
  if (name.includes('soya') || name.includes('soybean')) return 'Soya Bean'
  if (name.includes('rice')) return 'Rice'
  if (name.includes('sesame')) return 'Sesame Seed'
  if (name.includes('sorghum')) return 'Sorghum'
  
  // Default to the commodity name itself
  return commodityName
}

// Group commodities by category
const groupCommoditiesByCategory = (commodities: Commodity[]): MarketCategory[] => {
  const grouped = commodities.reduce((acc, commodity) => {
    // Add safety check for undefined name
    if (!commodity || !commodity.name) {
      console.warn('Skipping commodity with undefined name:', commodity)
      return acc
    }
    
    const category = getCommodityCategory(commodity.name)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(commodity)
    return acc
  }, {} as Record<string, Commodity[]>)
  
  // Sort categories and commodities
  const sortedEntries = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
  
  return sortedEntries.map(([category, commodities]) => ({
    category,
    commodities: commodities.sort((a, b) => a.symbol.localeCompare(b.symbol))
  }))
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
    
    const commodities = data.map(convertToCommodity)
    marketData.value = groupCommoditiesByCategory(commodities)
    lastUpdated.value = new Date().toLocaleString()
    
    console.log(`✅ Loaded ${commodities.length} commodities for market overview`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load market data'
    console.error('❌ Market overview loading error:', err)
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
    <!-- Loading State -->
    <div v-if="loading && !marketData.length" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="p-6 rounded-xl border animate-pulse" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
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
          <span class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading market overview...</span>
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
        <h3 class="text-lg font-medium text-red-800 mb-2" :class="isDarkMode ? 'text-red-400' : ''">Failed to load market overview</h3>
        <p class="text-red-600 mb-4" :class="isDarkMode ? 'text-red-300' : ''">{{ error }}</p>
        <button @click="refreshData" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>
    </div>

    <!-- Market Summary Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-6 rounded-xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02]" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Contracts</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ marketStats.totalCommodities }}
            </div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02]" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Average Price</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              GHC {{ marketStats.avgPrice }}
            </div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02]" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Contracts</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ marketStats.totalContracts }}
            </div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02]" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Market Status</div>
            <div class="text-2xl font-bold text-green-500">OPEN</div>
          </div>
          <div class="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
            <div class="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div v-if="!loading && !error" class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 rounded-xl border backdrop-blur-sm" :class="isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white/50'">
      <div class="flex items-center gap-4">
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          class="px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
        >
          <option value="all">All Categories</option>
          <option v-for="category in marketData" :key="category.category" :value="category.category">
            {{ category.category }}
          </option>
        </select>
        
        <!-- Refresh Button -->
        <button
          @click="refreshData"
          :disabled="loading"
          class="p-3 rounded-xl border transition-all duration-200 hover:shadow-lg disabled:opacity-50 hover:scale-105"
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
      </div>

      <!-- Search -->
      <div class="relative w-full lg:w-80">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search commodities..."
          class="w-full px-4 py-3 pl-10 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
        />
        <svg class="absolute left-3 top-3 w-4 h-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Unified Commodity Table -->
    <div v-if="!loading && !error && allCommodities.length" class="rounded-xl border overflow-hidden shadow-xl" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <div class="px-6 py-5 border-b" :class="isDarkMode ? 'border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900' : 'border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50'">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                All Commodities
              </h3>
              <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                {{ allCommodities.length }} active contracts across {{ marketData.length }} commodity categories
              </p>
            </div>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" :class="isDarkMode ? 'bg-green-900/20 border border-green-700/30' : 'bg-green-50 border border-green-200'">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span class="text-xs font-semibold" :class="isDarkMode ? 'text-green-400' : 'text-green-700'">Live Data</span>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr :class="isDarkMode ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700' : 'bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200'">
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Symbol</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Commodity</th>
              <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Grade</th>
              <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Delivery Centre</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Price (GHC)</th>
                <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Change</th>
                <th class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Trend</th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Last Trade Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
              v-for="item in allCommodities"
                :key="item.symbol"
              @click="selectCommodity(item)"
              class="cursor-pointer border-b transition-all duration-200 group hover:shadow-sm"
                        :class="[
              isDarkMode ? 'border-slate-700/50 hover:bg-slate-700/50' : 'border-slate-200/50 hover:bg-slate-50',
                loading ? 'animate-pulse' : ''
            ]"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-sm">
                      {{ item.symbol.slice(0, 2) }}
                    </div>
                    <span class="font-mono font-bold text-sm bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {{ item.symbol }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ item.name }}
                  </span>
                </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold shadow-sm border" :class="isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-700/30' : 'bg-blue-50 text-blue-700 border-blue-200'">
                  {{ item.grade || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5">
                  <svg class="w-4 h-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    {{ item.deliveryCentre || 'N/A' }}
                  </span>
                </div>
              </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-mono font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  GHC {{ item.price.toLocaleString() }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <span 
                      class="text-xs font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-sm"
                      :class="getChangeClass(item.change)"
                    >
                      {{ item.change >= 0 ? '+' : '' }}{{ item.change.toFixed(2) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span 
                    class="text-xl font-bold"
                    :class="getTrendColor(item.trend)"
                  >
                    {{ getTrendIcon(item.trend) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="item.lastTradeDate" class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full animate-pulse shadow-sm" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></span>
                    <span class="text-xs font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                      {{ item.lastTradeDate }}
                    </span>
                  </div>
                  <span v-else class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">N/A</span>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>


    <!-- Selected Commodity Details -->
    <div v-if="selectedCommodity" class="mt-6">
      <div class="rounded-xl p-6 border shadow-xl transition-all duration-200 hover:shadow-2xl" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div>
              <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ selectedCommodity.symbol }} - {{ selectedCommodity.name }}
              </h3>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                {{ selectedCommodity.deliveryCentre || 'Various Centres' }} • Grade {{ selectedCommodity.grade || 'N/A' }}
              </p>
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
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Current Price</div>
            <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              GHC {{ selectedCommodity.price.toLocaleString() }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Price Change</div>
            <div class="text-2xl font-bold" :class="selectedCommodity.change >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ selectedCommodity.change >= 0 ? '+' : '' }}{{ selectedCommodity.change.toFixed(2) }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Grade</div>
            <div class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ selectedCommodity.grade || 'N/A' }}
            </div>
          </div>
          <div class="text-center p-4 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-105" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
            <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Delivery Centre</div>
            <div class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ selectedCommodity.deliveryCentre || 'N/A' }}
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

/* Smooth table row transitions */
tbody tr {
  transition: all 0.2s ease-in-out;
}

/* Enhanced hover effects */
.group:hover {
  transform: translateY(-1px);
}

/* Custom scrollbar for table */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}
</style>
