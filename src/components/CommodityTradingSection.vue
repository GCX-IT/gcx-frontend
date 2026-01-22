<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isDarkMode } from '../utils/darkMode'
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

// Professional GCX commodity data with realistic price variations
const commodities = ref<Array<{
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
}>>([
  {
    symbol: 'GAPWM2',
    name: 'White Maize',
    openingPrice: 1850.00,
    closingPrice: 1880.00,
    priceChange: 30.00,
    changePercent: 1.62,
    high: 1895.00,
    low: 1840.00,
    volume: '2.4M MT',
    lastUpdate: '14:30 GMT',
    trend: 'up',
    type: 'cash-settled',
    category: 'Grains'
  },
  {
    symbol: 'GAPYM2',
    name: 'Yellow Maize',
    openingPrice: 1180.00,
    closingPrice: 1200.00,
    priceChange: 20.00,
    changePercent: 1.69,
    high: 1215.00,
    low: 1175.00,
    volume: '2.1M MT',
    lastUpdate: '14:30 GMT',
    trend: 'up',
    type: 'cash-settled',
    category: 'Grains'
  },
  {
    symbol: 'GEJWM2',
    name: 'Soya Bean',
    openingPrice: 3980.00,
    closingPrice: 4030.00,
    priceChange: 50.00,
    changePercent: 1.26,
    high: 4050.00,
    low: 3960.00,
    volume: '1.8M MT',
    lastUpdate: '14:30 GMT',
    trend: 'up',
    type: 'deliverable',
    category: 'Oilseeds'
  },
  {
    symbol: 'GSAWM2',
    name: 'Sorghum',
    openingPrice: 4720.00,
    closingPrice: 4745.00,
    priceChange: 25.00,
    changePercent: 0.53,
    high: 4760.00,
    low: 4700.00,
    volume: '890K MT',
    lastUpdate: '14:30 GMT',
    trend: 'up',
    type: 'cash-settled',
    category: 'Grains'
  },
  {
    symbol: 'GKUWM2',
    name: 'Sesame',
    openingPrice: 4600.00,
    closingPrice: 4645.00,
    priceChange: 45.00,
    changePercent: 0.98,
    high: 4660.00,
    low: 4580.00,
    volume: '950K MT',
    lastUpdate: '14:30 GMT',
    trend: 'up',
    type: 'deliverable',
    category: 'Oilseeds'
  }
])

const selectedCommodity = ref<typeof commodities.value[0]>(commodities.value[0])
const selectedTimeRange = ref<'3M' | '6M' | '1Y'>('3M')

// Generate professional trading chart data with realistic price movements
const generatePriceData = (basePrice: number, timeRange: '3M' | '6M' | '1Y' = '3M') => {
  const data = []
  let currentPrice = basePrice
  
  // Determine number of data points based on time range
  let dataPoints: number
  
  switch (timeRange) {
    case '3M':
      dataPoints = 90 // 90 days
      break
    case '6M':
      dataPoints = 180 // 180 days
      break
    case '1Y':
      dataPoints = 365 // 365 days
      break
    default:
      dataPoints = 90
  }
  
  // Generate realistic trading patterns with proper volatility
  for (let i = dataPoints; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Create professional time labels with better spacing
    let timeLabel: string
    if (timeRange === '3M' || timeRange === '6M') {
      // Show key dates: 1st, 15th, and last day of month for better readability
      const day = date.getDate()
      if (day === 1 || day === 15 || day === new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) {
        timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else {
        timeLabel = '' // Empty label for other days to reduce clutter
      }
    } else {
      timeLabel = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }
    
    // Create realistic price movements that look like real trading
    const volatility = basePrice * 0.025 // 2.5% daily volatility for realistic movement
    const trend = basePrice * 0.0003 * (dataPoints - i) // Subtle upward trend
    
    // Generate realistic price changes with market patterns
    let priceChange = 0
    
    // Create market cycles and patterns
    const cycle = Math.sin(i * 0.1) * 0.5 // Natural market cycles
    const randomFactor = (Math.random() - 0.5) * 2 // Random market noise
    
    // Combine factors for realistic movement
    priceChange = (cycle + randomFactor) * volatility
    
    // Add trend and ensure realistic price range
    currentPrice = Math.max(currentPrice + priceChange + trend, basePrice * 0.75)
    currentPrice = Math.min(currentPrice, basePrice * 1.35) // Cap at 35% above base
    
    data.push({
      time: timeLabel,
      price: currentPrice
    })
  }
  
  return data
}

// Chart data for selected commodity
const chartData = computed(() => {
  const priceData = generatePriceData(selectedCommodity.value.closingPrice, selectedTimeRange.value)
  
  return {
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
})

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
const selectCommodity = (commodity: typeof commodities.value[0]) => {
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

// Simulate professional real-time market updates
onMounted(() => {
  setInterval(() => {
    commodities.value = commodities.value.map(item => {
      // Create realistic price movements (0.1% to 0.5% changes)
      const changePercent = (Math.random() - 0.5) * 0.8 // -0.4% to +0.4%
      const change = (item.closingPrice * changePercent) / 100
      const newPrice = item.closingPrice + change
      
      // Update high/low based on new price
      const newHigh = Math.max(item.high, newPrice)
      const newLow = Math.min(item.low, newPrice)
      
      return {
        ...item,
        closingPrice: newPrice,
        priceChange: change,
        changePercent: changePercent,
        high: newHigh,
        low: newLow,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
      }
    })
  }, 15000) // Update every 15 seconds for more realistic trading
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
        <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Real-time commodity trading data and market analysis for Ghana's agricultural exchange
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Volume</div>
          <div class="text-xl font-bold text-green-500">₵2.4B</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Active Contracts</div>
          <div class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">5</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Commodities</div>
          <div class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">5</div>
        </div>
        <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
          <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Market Status</div>
          <div class="text-xl font-bold text-green-500">OPEN</div>
        </div>
      </div>

      <!-- Trading Interface -->
      <div class="bg-white rounded-2xl shadow-2xl overflow-hidden" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
        <!-- Trading Tabs -->
        <div class="flex border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
          <div class="flex-1 px-6 py-4 text-sm font-semibold text-center capitalize bg-green-500 text-white">
            Buy
          </div>
          <div class="flex-1 px-6 py-4 text-sm font-semibold text-center capitalize bg-slate-100" :class="isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">
            Sell
          </div>
          <div class="flex-1 px-6 py-4 text-sm font-semibold text-center capitalize bg-slate-100" :class="isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'">
            Trade
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <!-- Left Panel - Commodity List -->
          <div class="p-6" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
            <!-- Sub-tabs -->
            <div class="flex rounded-lg border overflow-hidden mb-6" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
              <button
                v-for="subTab in ['cash-settled', 'deliverable']"
                :key="subTab"
                class="flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 capitalize"
                :class="subTab === 'cash-settled' 
                  ? 'bg-black text-white' 
                  : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100')"
              >
                {{ subTab.replace('-', ' ') }}
              </button>
            </div>

            <!-- Commodity List -->
            <div class="space-y-2">
              <div
                v-for="commodity in commodities"
                :key="commodity.symbol"
                @click="selectCommodity(commodity)"
                class="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                :class="selectedCommodity.symbol === commodity.symbol 
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Price Chart -->
          <div class="p-6 border-l" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
            <!-- Chart Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ selectedCommodity.symbol }}
                </h3>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ selectedCommodity.name }}
                </p>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  GHC {{ selectedCommodity.closingPrice.toLocaleString() }}
                </div>
                <div class="flex items-center gap-1 text-sm">
                  <span :class="getTrendColor(selectedCommodity.trend)">
                    {{ getTrendIcon(selectedCommodity.trend) }}
                  </span>
                  <span :class="getPriceChangeClass(selectedCommodity.priceChange)">
                    {{ selectedCommodity.priceChange > 0 ? '+' : '' }}{{ selectedCommodity.priceChange.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Time Range Controls -->
            <div class="flex justify-center mb-4">
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
            <div class="relative h-80">
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

            <!-- Price Summary Table -->
            <div class="mt-6 p-4 rounded-lg border" :class="isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-200 bg-slate-50'">
              <h4 class="text-sm font-semibold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Price Summary</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-500">Open:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity.openingPrice.toLocaleString() }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500">Close:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity.closingPrice.toLocaleString() }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500">High:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity.high.toLocaleString() }}
                  </span>
                </div>
                <div>
                  <span class="text-slate-500">Low:</span>
                  <span class="ml-2 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    GHC {{ selectedCommodity.low.toLocaleString() }}
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
.space-y-2::-webkit-scrollbar {
  width: 6px;
}

.space-y-2::-webkit-scrollbar-track {
  background: transparent;
}

.space-y-2::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.space-y-2::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark .space-y-2::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .space-y-2::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
