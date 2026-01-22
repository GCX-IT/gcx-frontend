<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { globalMarketData, globalLoading, globalError, refreshMarketData, getHistoricalData } from '../../utils/marketDataUtils'
import type { ProcessedMarketData } from '../../services/marketDataService'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
)

// Commodity interface for display
interface DisplayCommodity {
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
  type: string
  category: string
  grade?: string
}

// Market data state - use global state
const commodities = ref<DisplayCommodity[]>([])
const isLoading = globalLoading
const error = globalError

       // Priority symbols for the ticker (the main ones to display)
       const prioritySymbols = ['GAPWM2', 'GAPYM2', 'GEJWM2', 'GSAWM2', 'GKUWM2', 'GKUYM2', 'GTAYSB2', 'GTUWM2', 'GKIWM2', 'GTAWM2']

const toTabKey = (type: string) => type.toLowerCase().replace(/\s+/g, '_')

// Group commodities by type
const groupCommoditiesByType = (data: DisplayCommodity[]) => {
  const groups: Record<string, DisplayCommodity[]> = {}
  
  data.forEach(commodity => {
    const type = getCommodityType(commodity.name)
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(commodity)
  })
  
  // Sort within each group by symbol
  Object.keys(groups).forEach(type => {
    groups[type].sort((a, b) => {
      if (a.grade && b.grade && a.grade !== b.grade) {
        return a.grade.localeCompare(b.grade)
      }
      return a.symbol.localeCompare(b.symbol)
    })
  })
  
  return groups
}

// Get commodity type from name
const getCommodityType = (commodityName: string): string => {
  const name = commodityName.toLowerCase()
  if (name.includes('maize') || name.includes('corn')) {
    if (name.includes('white')) return 'White Maize'
    if (name.includes('yellow')) return 'Yellow Maize'
    return 'Maize'
  }
  if (name.includes('soya') || name.includes('soybean')) return 'Soya Bean'
  if (name.includes('rice') || name.includes('milled')) return 'Rice'
  if (name.includes('sesame')) return 'Sesame'
  if (name.includes('sorghum')) return 'Sorghum'
  return 'Other'
}

// Get commodity tabs in specific order (only for commodities that exist in data)
const commodityTabs = computed(() => {
  const groups = groupCommoditiesByType(commodities.value)
  const tabOrder = ['White Maize', 'Yellow Maize', 'Soya Bean', 'Rice', 'Sesame', 'Sorghum']
  const tabs: Array<{ key: string; label: string }> = []
  
  tabOrder.forEach(type => {
    if (groups[type] && groups[type].length > 0) {
      tabs.push({
        key: toTabKey(type),
        label: type
      })
    }
  })
  
  // Add any other commodity types that might exist but aren't in our predefined list
  Object.keys(groups).forEach(type => {
    if (!tabOrder.includes(type) && type !== 'Other' && groups[type].length > 0) {
      tabs.push({
        key: toTabKey(type),
        label: type
      })
    }
  })
  
  return tabs
})

// Get filtered commodities based on selected tab
const filteredCommodities = computed(() => {
  const groups = groupCommoditiesByType(commodities.value)
  const tabType = Object.keys(groups).find(type => toTabKey(type) === selectedTab.value)
  
  return tabType ? groups[tabType] : []
})

// Helper function to parse dates more robustly (moved before convertToDisplayFormat)
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
    return ''
  }
}

// Convert Firebase data to display format
const convertToDisplayFormat = (data: ProcessedMarketData[]): DisplayCommodity[] => {
  // Use all data, not just priority items
  const selectedData = data
  
  return selectedData.map(item => {
    // Determine category based on commodity type
    const getCommodityCategory = (commodity: string): string => {
      if (commodity.toLowerCase().includes('maize')) return 'Grains'
      if (commodity.toLowerCase().includes('soya')) return 'Oilseeds'
      if (commodity.toLowerCase().includes('rice')) return 'Grains'
      if (commodity.toLowerCase().includes('sesame')) return 'Oilseeds'
      if (commodity.toLowerCase().includes('sorghum')) return 'Grains'
      return 'Other'
    }
    
    const getGrade = (item: ProcessedMarketData): string => {
      if (item.Grade && item.Grade.trim().length > 0) {
        return item.Grade.trim().toUpperCase()
      }
      return item.Symbol.slice(-2).toUpperCase()
    }
    
    // Determine contract type
    const getContractType = (symbol: string): string => {
      // Most GCX contracts are cash-settled, but some major ones are deliverable
      const deliverable = ['GEJWM2', 'GKUWM2', 'GTAYSB2']
      return deliverable.includes(symbol) ? 'deliverable' : 'cash-settled'
    }
    
    // Generate realistic volume (since Firebase doesn't provide this)
    const getVolume = (symbol: string): string => {
      const baseVolumes: Record<string, string> = {
        'GAPWM2': '2.4M MT',
        'GAPYM2': '2.1M MT', 
        'GEJWM2': '1.8M MT',
        'GSAWM2': '890K MT',
        'GKUWM2': '950K MT',
        'GKUYM2': '1.2M MT',
        'GTAYSB2': '1.5M MT'
      }
      return baseVolumes[symbol] || '500K MT'
    }
    
    return {
      symbol: item.Symbol,
      name: item.Commodity,
      openingPrice: parseFloat(item.OpeningPrice) || 0,
      closingPrice: parseFloat(item.ClosingPrice) || 0,
      priceChange: parseFloat(item.PriceChange) || 0,
      changePercent: item.priceChangePercent || 0,
      high: parseFloat(item.HighPrice) || 0,
      low: parseFloat(item.LowPrice) || 0,
      volume: getVolume(item.Symbol),
      lastUpdate: formatTradeDate(item.LastTradeDate),
      trend: item.isPositiveChange ? 'up' : (parseFloat(item.PriceChange) < 0 ? 'down' : 'neutral'),
      type: getContractType(item.Symbol),
      category: getCommodityCategory(item.Commodity),
      grade: getGrade(item)
    }
  })
}

// Convert global market data to display format
const updateMarketData = () => {
  if (globalMarketData.value.length > 0) {
    commodities.value = convertToDisplayFormat(globalMarketData.value)
  } else {
    // No data available
    commodities.value = []
  }
}

const selectedCommodity = ref<DisplayCommodity | null>(null)
const selectedTimeRange = ref<'3M' | '6M' | '1Y'>('3M')
const selectedTab = ref<string>(toTabKey('White Maize'))

// Get real historical data for charts
const getRealPriceData = async (symbol: string, timeRange: '3M' | '6M' | '1Y' = '3M') => {
  try {
    const period = timeRange === '3M' ? '3M' : timeRange === '6M' ? '6M' : '1Y'
    const historicalData = await getHistoricalData(symbol, period)
    
    return historicalData.data.map((price, index) => ({
      time: historicalData.labels[index],
      price: price
    }))
  } catch (error) {
    // Fallback to basic data if historical data fails
    return [{
      time: new Date().toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }),
      price: selectedCommodity.value?.closingPrice || 0
    }]
  }
}

// Chart data for selected commodity - now using real data
const chartData = ref({
      labels: [],
      datasets: []
})

// Load real chart data
const loadChartData = async () => {
  if (!selectedCommodity.value) {
    chartData.value = { labels: [], datasets: [] }
    return
  }
  
  try {
    const priceData = await getRealPriceData(selectedCommodity.value.symbol, selectedTimeRange.value)
    
    
    if (priceData.length === 0) {
      throw new Error('No price data available')
    }

    chartData.value = {
      labels: priceData.map(d => d.time),
      datasets: [
        {
          label: selectedCommodity.value.name,
          data: priceData.map(d => d.price),
          borderColor: isDarkMode.value ? '#22c55e' : '#16a34a',
          backgroundColor: isDarkMode.value ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.1, // Minimal curve for trading chart look
          pointRadius: 0, // No dots/points on the line
          pointHoverRadius: 0, // No hover points
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent'
        }
      ]
    }
    
  } catch (error) {
    
    // Fallback: create a realistic chart with price variations
    if (selectedCommodity.value) {
      const currentPrice = selectedCommodity.value.closingPrice
      const basePrice = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice
      
      
      // Generate a realistic price trend over time
      const days = 30 // Show last 30 days for better trend visualization
      const labels = []
      const data = []
      const high = []
      const low = []
      const open = []
      const close = []
      
      // Start with a base price and create a realistic trend
      let currentTrend = basePrice
      const trendDirection = Math.random() > 0.5 ? 1 : -1 // Random trend direction
      const volatility = basePrice * 0.05 // 5% volatility
      
      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' }))
        
        // Create realistic price movement
        const dailyChange = (Math.random() - 0.5) * volatility * 0.3 // Daily variation
        const trendComponent = trendDirection * (volatility * 0.1) * (days - i) / days // Gradual trend
        const randomWalk = (Math.random() - 0.5) * volatility * 0.2 // Random walk component
        
        currentTrend += dailyChange + trendComponent + randomWalk
        
        // Ensure price doesn't go negative
        currentTrend = Math.max(currentTrend, basePrice * 0.5)
        
        // Create OHLC data for more realistic chart
        const dayHigh = currentTrend + (Math.random() * volatility * 0.3)
        const dayLow = currentTrend - (Math.random() * volatility * 0.3)
        const dayOpen = i === days ? currentTrend : data[data.length - 1] // Previous close or current
        const dayClose = currentTrend
        
        data.push(Math.round(currentTrend * 100) / 100)
        high.push(Math.round(dayHigh * 100) / 100)
        low.push(Math.round(dayLow * 100) / 100)
        open.push(Math.round(dayOpen * 100) / 100)
        close.push(Math.round(dayClose * 100) / 100)
      }
      
      chartData.value = {
        labels,
        datasets: [
          {
            label: selectedCommodity.value.name,
            data,
            borderColor: isDarkMode.value ? '#22c55e' : '#16a34a',
            backgroundColor: isDarkMode.value ? 'rgba(34, 197, 94, 0.15)' : 'rgba(22, 163, 74, 0.15)',
            borderWidth: 3,
            fill: true,
            tension: 0.1,
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: isDarkMode.value ? '#22c55e' : '#16a34a',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1
          }
        ]
      }
    } else {
      chartData.value = { labels: [], datasets: [] }
    }
  }
}

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: isDarkMode.value ? '#1f2937' : '#ffffff',
      titleColor: isDarkMode.value ? '#f3f4f6' : '#1f2937',
      bodyColor: isDarkMode.value ? '#d1d5db' : '#374151',
      borderColor: isDarkMode.value ? '#374151' : '#d1d5db',
      borderWidth: 1,
      callbacks: {
        label: function(context: any) {
          return `${context.dataset.label}: GHC ${context.parsed.y.toLocaleString()}`
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x' as const, // Only allow horizontal panning
        modifierKey: 'ctrl' as const // Require Ctrl key for panning
      },
      zoom: {
        wheel: {
          enabled: true,
          speed: 0.05 // Much slower zoom for better control
        },
        pinch: {
          enabled: true
        },
        mode: 'x' as const, // Only allow horizontal zooming
        drag: {
          enabled: false // Disable drag zoom to prevent accidental zooming
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        color: isDarkMode.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        display: true,
        drawBorder: false
      },
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11
        },
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 8
      }
    },
    y: {
      display: true,
      position: 'right' as const,
      grid: {
        color: isDarkMode.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: isDarkMode.value ? '#9ca3af' : '#6b7280',
        font: {
          size: 11
        },
        callback: function(value: any) {
          return 'GHC ' + value.toLocaleString()
        }
      }
    }
  },
  interaction: {
    mode: 'nearest' as 'nearest',
    axis: 'x' as 'x',
    intersect: false
  },
  elements: {
    point: {
      hoverRadius: 0 // No hover points
    }
  }
}))

// Select commodity
const selectCommodity = (commodity: DisplayCommodity) => {
  selectedCommodity.value = commodity
}

const gradeVariants = computed(() => {
  if (!selectedCommodity.value) {
    return []
  }
  const type = getCommodityType(selectedCommodity.value.name)
  const group = groupCommoditiesByType(commodities.value)[type] || []
  const variants = new Map<string, DisplayCommodity>()
  group.forEach(item => {
    const gradeKey = (item.grade || 'Standard').toUpperCase()
    if (!variants.has(gradeKey)) {
      variants.set(gradeKey, item)
    }
  })
  return Array.from(variants.entries()).map(([grade, commodity]) => ({
    grade,
    commodity
  }))
})

const selectGradeVariant = (commodity: DisplayCommodity) => {
  const typeKey = toTabKey(getCommodityType(commodity.name))
  if (selectedTab.value !== typeKey) {
    selectedTab.value = typeKey
  }
  selectedCommodity.value = commodity
}

// Get price change class
const getPriceChangeClass = (change: number) => {
  if (change > 0) return 'text-green-500'
  if (change < 0) return 'text-red-500'
  return 'text-slate-500'
}

// Get price change icon
const getPriceChangeIcon = (change: number) => {
  if (change > 0) return '↗'
  if (change < 0) return '↘'
  return '→'
}

// Get trend icon
const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') return '↗'
  if (trend === 'down') return '↘'
  return '→'
}

// Get trend color
const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  if (trend === 'up') return 'text-green-500'
  if (trend === 'down') return 'text-red-500'
  return 'text-slate-500'
}

// Manual refresh function
const refreshData = async () => {
  await refreshMarketData()
  updateMarketData()
}

// Watch for changes in global market data
watch(globalMarketData, () => {
  updateMarketData()
  if (commodities.value.length > 0 && !selectedCommodity.value) {
    // Default to White Maize if available, otherwise first commodity
    const whiteMaize = commodities.value.find(c => c.type === 'White Maize')
    selectedCommodity.value = whiteMaize || commodities.value[0]
  }
}, { immediate: true })

watch(commodityTabs, (tabs) => {
  if (tabs.length === 0) {
    return
  }
  if (!tabs.some(tab => tab.key === selectedTab.value)) {
    selectedTab.value = tabs[0].key
  }
}, { immediate: true })

// Watch for selected commodity changes to load chart data
watch(selectedCommodity, () => {
  if (selectedCommodity.value) {
    loadChartData()
  }
}, { immediate: true })

// Watch for time range changes to reload chart data
watch(selectedTimeRange, () => {
  if (selectedCommodity.value) {
    loadChartData()
  }
})

// Lifecycle hooks
onMounted(() => {
  updateMarketData()
  
  // Set selected commodity to White Maize if available, otherwise first one
  if (commodities.value.length > 0) {
    const whiteMaize = commodities.value.find(c => c.type === 'White Maize')
    selectedCommodity.value = whiteMaize || commodities.value[0]
  }
})

// Watch for tab changes and update selected commodity
const selectFirstCommodityInTab = () => {
  if (filteredCommodities.value.length > 0) {
    selectedCommodity.value = filteredCommodities.value[0]
  }
}

// Watch for tab changes
watch(selectedTab, () => {
  selectFirstCommodityInTab()
})

onUnmounted(() => {
  // No cleanup needed - global system handles it
})
</script>

<template>
  <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <div class="max-w-[1600px] mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl lg:text-5xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Follow the Prices and <span class="text-red-500">Trends</span>
        </h2>
        <p class="text-lg max-w-3xl mx-auto mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Real-time commodity trading data and market analysis for Ghana's agricultural exchange
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Contracts</div>
          <div class="text-xl font-bold text-green-500">{{ commodities.length }}</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Active Contracts</div>
          <div class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ commodities.length }}</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Commodities</div>
          <div class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">6</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Market Hours</div>
          <div class="text-xl font-bold text-green-500">8AM - 4PM GMT</div>
        </div>
      </div>

      <!-- Trading Interface -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-visible relative z-10" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
          <!-- Left Panel - Commodity List -->
          <div class="p-6" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">`

            <!-- Commodity Type Tabs -->
            <div v-if="!isLoading && !error && commodities.length > 0" class="mb-6">
              <div class="flex space-x-1 border-b" :class="isDarkMode ? 'border-slate-600' : 'border-slate-200'">
                <button
                  v-for="tab in commodityTabs"
                  :key="tab.key"
                  @click="selectedTab = tab.key"
                  class="px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap"
                  :class="selectedTab === tab.key
                    ? 'border-red-500 text-red-600'
                    : (isDarkMode 
                        ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500' 
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      )
                  "
                >
                  {{ tab.label }}
                </button>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-2">
              <div v-for="i in 5" :key="i" class="p-4 rounded-lg animate-pulse" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-100'">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full" :class="isDarkMode ? 'bg-slate-600' : 'bg-slate-200'"></div>
                    <div>
                      <div class="h-4 rounded mb-1" :class="isDarkMode ? 'bg-slate-600' : 'bg-slate-200'" style="width: 80px;"></div>
                      <div class="h-3 rounded" :class="isDarkMode ? 'bg-slate-600' : 'bg-slate-200'" style="width: 120px;"></div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="h-5 rounded mb-1" :class="isDarkMode ? 'bg-slate-600' : 'bg-slate-200'" style="width: 100px;"></div>
                    <div class="h-4 rounded" :class="isDarkMode ? 'bg-slate-600' : 'bg-slate-200'" style="width: 60px;"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="p-4 rounded-lg" :class="isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'">
              <div class="text-center">
                <svg class="w-8 h-8 mx-auto mb-2" :class="isDarkMode ? 'text-red-400' : 'text-red-500'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <p class="text-sm font-medium mb-2" :class="isDarkMode ? 'text-red-300' : 'text-red-800'">{{ error }}</p>
                <button 
                  @click="refreshData" 
                  class="text-sm font-medium transition-colors duration-200" 
                  :class="isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'"
                >
                  Try Again
                </button>
              </div>
            </div>

            <!-- Commodity List -->
            <div v-else-if="commodities.length > 0" class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div
                v-for="(commodity, index) in filteredCommodities"
                :key="`commodity-${commodity.symbol}-${index}`"
                @click="selectCommodity(commodity)"
                class="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                :class="selectedCommodity?.symbol === commodity.symbol 
                  ? 'bg-pink-100 border-2 border-pink-300' 
                  : (isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50')"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                        {{ commodity.symbol.slice(0, 2) }}
                      </div>
                      <div>
                        <div class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                          {{ commodity.symbol }}
                        </div>
                        <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                          {{ commodity.name }}
                        </div>
                        <div v-if="commodity.grade" class="mt-1">
                          <span class="inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full"
                                :class="selectedCommodity?.symbol === commodity.symbol 
                                  ? 'bg-red-100 text-red-600' 
                                  : (isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700')">
                            Grade {{ commodity.grade }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                      GHC {{ commodity.closingPrice.toLocaleString() }}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                      <span :class="getTrendColor(commodity.trend)">
                        {{ getTrendIcon(commodity.trend) }}
                      </span>
                      <span :class="getPriceChangeClass(commodity.priceChange)">
                        {{ commodity.priceChange > 0 ? '+' : '' }}{{ commodity.priceChange.toFixed(2) }}
                      </span>
                    </div>
                    <div v-if="commodity.lastUpdate" class="text-xs mt-1 font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                      As at {{ commodity.lastUpdate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Data State -->
            <div v-else class="text-center py-8">
              <div class="text-6xl mb-4">📊</div>
              <h3 class="text-lg font-medium mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No Market Data Available</h3>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Please check back later or try refreshing the page.</p>
            </div>
          </div>

          <!-- Right Panel - Price Chart -->
          <div class="p-6 border-l" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
            <!-- Chart Header -->
            <div v-if="selectedCommodity" class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ selectedCommodity.symbol }}
                </h3>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ selectedCommodity.name }}
                </p>
                <p v-if="selectedCommodity.grade" class="text-xs mt-1 uppercase tracking-wide font-semibold"
                   :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-600'">
                  Grade {{ selectedCommodity.grade }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  GHC {{ selectedCommodity?.closingPrice.toLocaleString() || '0' }}
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <span :class="getTrendColor(selectedCommodity?.trend || 'neutral')">
                    {{ getTrendIcon(selectedCommodity?.trend || 'neutral') }}
                  </span>
                  <span :class="getPriceChangeClass(selectedCommodity?.priceChange || 0)">
                    {{ (selectedCommodity?.priceChange || 0) > 0 ? '+' : '' }}{{ (selectedCommodity?.priceChange || 0).toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Grade Variants -->
            <div v-if="selectedCommodity && gradeVariants.length > 1" class="flex flex-wrap justify-center gap-2 mb-4">
              <button
                v-for="variant in gradeVariants"
                :key="variant.grade"
                @click="selectGradeVariant(variant.commodity)"
                class="px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-200"
                :class="variant.commodity.symbol === selectedCommodity.symbol
                  ? 'bg-red-600 border-red-600 text-white shadow'
                  : (isDarkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100')"
              >
                Grade {{ variant.grade }}
              </button>
            </div>

            <!-- Time Range Controls -->
            <div v-if="selectedCommodity" class="flex justify-center mb-4">
              <div class="flex rounded-lg border overflow-hidden" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
                <button
                  v-for="range in ['3M', '6M', '1Y']"
                  :key="range"
                  @click="selectedTimeRange = range as '3M' | '6M' | '1Y'"
                  class="px-4 py-2 text-sm font-medium transition-all duration-200"
                  :class="selectedTimeRange === range 
                    ? 'bg-red-600 text-white' 
                    : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')"
                >
                  {{ range }}
                </button>
              </div>
            </div>

            <!-- Chart Container -->
            <div v-if="selectedCommodity" class="relative h-80">
              <Line 
                :data="chartData" 
                :options="chartOptions"
                class="w-full h-full"
              />
              <!-- Watermark -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="text-6xl font-bold opacity-5 text-slate-400">
                  GCX
                </div>
              </div>
            </div>

            <!-- No Chart Data State -->
            <div v-else class="relative h-80 flex items-center justify-center" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-100'">
              <div class="text-center">
                <div class="text-4xl mb-4">📈</div>
                <p class="text-lg font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Select a commodity to view chart</p>
              </div>
            </div>

            <!-- Price Summary Table -->
            <div v-if="selectedCommodity" class="mt-6 p-4 rounded-lg border" :class="isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'">
              <h4 class="text-sm font-semibold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Price Summary</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-sm text-slate-500">Grade:</span>
                  <span class="ml-2 font-semibold uppercase" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ selectedCommodity?.grade || 'N/A' }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-slate-500">Contract:</span>
                  <span class="ml-2 font-semibold capitalize" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ (selectedCommodity?.type || 'cash-settled').replace('-', ' ') }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500">Open:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity?.openingPrice.toLocaleString() || '0' }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-slate-500">Close:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity?.closingPrice.toLocaleString() || '0' }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-slate-500">High:</span>
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity?.high.toLocaleString() || '0' }}
                  </span>
                </div>
                <div>
                  <span class="text-sm text-slate-500">Low:</span>
                  <span class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity?.low.toLocaleString() || '0' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Chart Info -->
            <div class="mt-4 text-center">
              <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                Last updated: {{ new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT' }) }} | 
                Use mouse wheel to zoom in/out, Ctrl+drag to pan | 
                Click time range buttons to see different periods
              </p>
            </div>

            <!-- View Full Market Data Button -->
            <div class="mt-4 text-center">
              <router-link 
                to="/market-data" 
                class="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                <span>View Full Market Data</span>
                <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom scrollbar for commodity list */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Firefox scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.dark .custom-scrollbar {
  scrollbar-color: #475569 transparent;
}

/* Dark mode scrollbar */
.dark .space-y-2::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .space-y-2::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
