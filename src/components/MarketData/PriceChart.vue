<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import TradingViewWidget from './TradingViewWidget.vue'
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const { t } = useI18n()

const props = defineProps<{
  symbol: string
  commodityName: string
}>()

const timeFrame = ref('1D')
const selectedIndicator = ref('MA')
const isUpdating = ref(false)
const useTradingView = ref(true) // Toggle between TradingView and custom chart

const timeFrames = [
  { label: '1H', value: '1H' },
  { label: '4H', value: '4H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' }
]

const indicators = [
  { label: 'Moving Average', value: 'MA' },
  { label: 'RSI', value: 'RSI' },
  { label: 'MACD', value: 'MACD' },
  { label: 'Bollinger Bands', value: 'BB' }
]

// Mock price data for statistics
const generatePriceData = (days: number, basePrice: number = 2000) => {
  const data = []
  let currentPrice = basePrice
  const today = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Simulate price movement with trend
    const volatility = basePrice * 0.015 // 1.5% daily volatility
    const trend = basePrice * 0.0001 * (days - i) // Slight upward trend
    const change = (Math.random() - 0.5) * volatility + trend
    currentPrice = Math.max(currentPrice + change, basePrice * 0.7) // Prevent going below 70% of base price
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: currentPrice - Math.random() * 20,
      high: currentPrice + Math.random() * 30,
      low: currentPrice - Math.random() * 30,
      close: currentPrice
    })
  }
  
  return data
}

// Get base price for commodity
const getCommodityBasePrice = (symbol: string) => {
  const priceMap: { [key: string]: number } = {
    'GAPWM2': 1880, // White Maize
    'GAPWM3': 1240, // White Maize
    'GAPYM2': 1200, // Yellow Maize
    'GAPYM4': 1160, // Yellow Maize
    'GEJWM2': 4030, // Soya Bean
    'GEJWM1': 3980, // Soya Bean
    'GSAWM1': 3145, // Sorghum
    'GSAWM2': 4745, // Sorghum
    'GTAWM1': 4440, // White Rice
    'GTAWM2': 4405, // White Rice
    'GTUWM2': 5995, // White Rice
    'GKUWM2': 4645  // Sesame
  }
  return priceMap[symbol] || 2000
}

const priceData = ref(generatePriceData(90, getCommodityBasePrice(props.symbol)))

// Watch for commodity changes and regenerate data
watch(() => props.symbol, (newSymbol) => {
  priceData.value = generatePriceData(90, getCommodityBasePrice(newSymbol))
}, { immediate: true })

// Watch for time frame changes
watch(timeFrame, () => {
  // Force TradingView chart to update with new time frame
  if (useTradingView.value) {
    // The key change will force re-render
  }
})

// Watch for indicator changes
watch(selectedIndicator, () => {
  // Force TradingView chart to update with new indicator
  if (useTradingView.value) {
    // The key change will force re-render
  }
})

// Reset zoom function for TradingView
const resetZoom = () => {
  // Force TradingView chart to reset zoom by triggering a re-render
  triggerReset()
}

// Reset trigger for TradingView chart
const resetTrigger = ref(0)

const triggerReset = () => {
  resetTrigger.value++
}

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    isUpdating.value = true
    const lastPrice = priceData.value[priceData.value.length - 1]
    const newPrice = lastPrice.close + (Math.random() - 0.5) * 50
    
    priceData.value.push({
      date: new Date().toISOString().split('T')[0],
      open: lastPrice.close,
      high: Math.max(lastPrice.close, newPrice),
      low: Math.min(lastPrice.close, newPrice),
      close: newPrice
    })
    
    // Keep only last 200 data points for better zoom experience
    if (priceData.value.length > 200) {
      priceData.value = priceData.value.slice(-200)
    }
    
    setTimeout(() => {
      isUpdating.value = false
    }, 500)
  }, 10000)
})

// Price statistics
const currentPrice = computed(() => priceData.value[priceData.value.length - 1]?.close || 0)
const previousPrice = computed(() => priceData.value[priceData.value.length - 2]?.close || 0)
const priceChange = computed(() => currentPrice.value - previousPrice.value)
const priceChangePercent = computed(() => (priceChange.value / previousPrice.value) * 100)
const isPriceUp = computed(() => priceChange.value > 0)

const getPriceChangeClass = (change: number) => {
  if (change > 0) return 'text-green-500 bg-green-500/10 border-green-500/20'
  if (change < 0) return 'text-red-500 bg-red-500/10 border-red-500/20'
  return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
}

// TradingView widget configuration
const tradingViewConfig = computed(() => ({
  allow_symbol_change: true,
  calendar: false,
  details: false,
  hide_side_toolbar: false, // Show side toolbar for zoom controls
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: true,
  hotlist: false,
  interval: timeFrame.value,
  locale: "en",
  save_image: true,
  style: "1",
  // Use real symbols that TradingView recognizes, or fallback to a default
  symbol: getValidSymbol(props.symbol),
  theme: isDarkMode.value ? "dark" : "light",
  timezone: "Etc/UTC",
  backgroundColor: isDarkMode.value ? "#1f2937" : "#ffffff",
  gridColor: isDarkMode.value ? "rgba(255, 255, 255, 0.1)" : "rgba(46, 46, 46, 0.06)",
  watchlist: [],
  withdateranges: true, // Enable date range selection
  compareSymbols: [],
  studies: selectedIndicator.value === 'MA' ? ["MASimple@tv-basicstudies"] : 
           selectedIndicator.value === 'RSI' ? ["RSI@tv-basicstudies"] :
           selectedIndicator.value === 'MACD' ? ["MACD@tv-basicstudies"] :
           selectedIndicator.value === 'BB' ? ["BB@tv-basicstudies"] : [],
  autosize: true,
  // Enable zoom and pan controls
  enable_publishing: false,
  container_id: `tradingview_chart_${props.symbol}`,
  // Add zoom controls
  toolbar_bg: isDarkMode.value ? "#1f2937" : "#ffffff",
  enable_volume: false,
  // Enable chart interactions
  studies_overrides: {},
  disabled_features: ["volume_force_overlay"],
  enabled_features: ["use_localstorage_for_settings"],
  // Enable zoom and pan
  overrides: {
    "paneProperties.background": isDarkMode.value ? "#1f2937" : "#ffffff",
    "paneProperties.vertGridProperties.color": isDarkMode.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    "paneProperties.horzGridProperties.color": isDarkMode.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
  }
}))

// Function to get valid TradingView symbols
const getValidSymbol = (gcxSymbol: string) => {
  // Map GCX symbols to real market symbols that TradingView recognizes
  const symbolMap: { [key: string]: string } = {
    'GAPWM2': 'NASDAQ:CORN',      // Corn futures as proxy for maize
    'GAPWM3': 'NASDAQ:CORN',      // Corn futures as proxy for maize
    'GEJWM2': 'NASDAQ:SOYB',      // Soybean futures
    'GEJWM1': 'NASDAQ:SOYB',      // Soybean futures
    'GSAWM1': 'NASDAQ:WEAT',      // Wheat futures as proxy for sorghum
    'GTAWM1': 'NASDAQ:RICE',      // Rice futures
    'GTUWM2': 'NASDAQ:RICE',      // Rice futures
    'GKUWM2': 'NASDAQ:SESAME'     // Use a general commodity index
  }
  
  // Return mapped symbol or fallback to a default
  return symbolMap[gcxSymbol] || 'NASDAQ:CORN'
}

// Chart data for custom Chart.js
const chartData = computed(() => {
  return {
    labels: priceData.value.map(d => d.date),
    datasets: [
      {
        label: `${props.symbol} Price`,
        data: priceData.value.map(d => d.close),
        borderColor: isDarkMode.value ? '#22c55e' : '#16a34a',
        backgroundColor: isDarkMode.value ? 'rgba(34, 197, 94, 0.1)' : 'rgba(22, 163, 74, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6
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
          size: 10
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
          size: 10
        },
        callback: function(value: any) {
          return 'GHC ' + value.toLocaleString()
        }
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  },
  elements: {
    point: {
      hoverRadius: 6
    }
  }
}))
</script>

<template>
  <div class="space-y-6">
    <!-- Chart Header -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
      <div class="flex items-center gap-4">
        <div>
          <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ props.symbol }} - {{ props.commodityName }}
          </h3>
          <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            Price Chart & Technical Analysis
          </p>
          <!-- Note about proxy symbols -->
          <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
            📊 Using proxy market data ({{ getValidSymbol(props.symbol) }}) for demonstration
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-medium text-green-500">LIVE</span>
        </div>
      </div>
      
      <!-- Chart Controls -->
      <div class="flex items-center gap-4">
        <!-- Chart Type Toggle -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Chart:</span>
          <button
            @click="useTradingView = !useTradingView"
            class="px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200"
            :class="useTradingView 
              ? 'bg-blue-500 text-white border-blue-500' 
              : (isDarkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-700' : 'text-slate-600 border-slate-300 hover:bg-slate-200')"
          >
            {{ useTradingView ? 'TradingView' : 'Custom' }}
          </button>
        </div>
        
        <!-- Time Frame Selector -->
        <div class="flex rounded-xl border overflow-hidden shadow-lg" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
          <button
            v-for="tf in timeFrames"
            :key="tf.value"
            @click="timeFrame = tf.value"
            class="px-4 py-2 text-sm font-bold transition-all duration-200"
            :class="timeFrame === tf.value 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-200')"
          >
            {{ tf.label }}
          </button>
        </div>
        
        <!-- Indicator Selector -->
        <select
          v-model="selectedIndicator"
          class="px-4 py-2 text-sm rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
          :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
        >
          <option v-for="indicator in indicators" :key="indicator.value" :value="indicator.value">
            {{ indicator.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Current Price Display -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Current Price</div>
        <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          GHC {{ currentPrice.toLocaleString() }}
        </div>
      </div>
      
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Price Change</div>
        <div class="flex items-center gap-2">
          <span 
            class="text-xl font-bold px-3 py-1 rounded-lg border"
            :class="getPriceChangeClass(priceChange)"
          >
            {{ priceChange >= 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}
          </span>
          <span 
            class="text-sm font-semibold"
            :class="isPriceUp ? 'text-green-500' : 'text-red-500'"
          >
            ({{ priceChangePercent.toFixed(2) }}%)
          </span>
        </div>
      </div>
      
      <div class="p-4 rounded-xl border transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Last Update</div>
        <div class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT' }) }}
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative">
      <div class="w-full h-96 rounded-xl border overflow-hidden shadow-2xl"
           :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
         
         <!-- TradingView Widget -->
         <TradingViewWidget 
           v-if="useTradingView"
           :key="`tv-${props.symbol}-${timeFrame}-${selectedIndicator}-${resetTrigger}`"
           :config="tradingViewConfig"
           class="w-full h-full"
         />
         
         <!-- Custom Chart -->
         <div v-else class="w-full h-full p-4">
           <Line 
             :data="chartData" 
             :options="chartOptions"
             class="w-full h-full"
           />
         </div>
         
       </div>
     </div>

     <!-- Zoom Controls for TradingView -->
     <div v-if="useTradingView" class="flex justify-center mb-4 gap-2">
       <button
         @click="resetZoom"
         class="px-3 py-1 text-xs font-medium rounded border transition-all duration-200"
                     :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-600 hover:bg-slate-200'"
       >
         Reset Zoom
       </button>
       <span class="text-xs text-slate-500 self-center">|</span>
       <span class="text-xs text-slate-500 self-center">
         Mouse wheel: Zoom | Drag: Pan | Right-click: Menu
       </span>
     </div>

    <!-- Technical Indicators -->
    <div class="grid grid-cols-1 gap-6">
      <!-- RSI Chart -->
      <div class="rounded-xl border p-6 shadow-lg transition-all duration-200 hover:shadow-xl" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'">
        <h4 class="text-lg font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">RSI (14)</h4>
        <div class="h-40 relative">
          <!-- RSI Chart Placeholder -->
          <div class="w-full h-full flex items-end justify-between px-4">
            <div 
              v-for="(item, index) in priceData.slice(-20)" 
              :key="index"
              class="w-2 bg-gradient-to-t from-purple-500 to-purple-600 rounded-t shadow-md transition-all duration-200 hover:shadow-lg"
              :style="{ height: `${Math.min(100, Math.max(0, (item.close / 3000) * 100))}%` }"
            ></div>
          </div>
          <!-- RSI Levels -->
          <div class="absolute left-0 top-0 w-full h-full pointer-events-none">
            <div class="absolute top-0 left-0 right-0 h-px bg-red-500 opacity-50"></div>
            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-500 opacity-30"></div>
            <div class="absolute bottom-0 left-0 right-0 h-px bg-green-500 opacity-50"></div>
          </div>
        </div>
        <div class="flex justify-between text-xs mt-3 font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          <span class="text-red-500">70 (Overbought)</span>
          <span>50 (Neutral)</span>
          <span class="text-green-500">30 (Oversold)</span>
        </div>
      </div>

    </div>

    <!-- Price Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">24h High</div>
        <div class="text-xl font-bold text-green-500">
          {{ Math.max(...priceData.slice(-24).map(d => d.high)).toFixed(2) }}
        </div>
      </div>
      
      <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">24h Low</div>
        <div class="text-xl font-bold text-red-500">
          {{ Math.min(...priceData.slice(-24).map(d => d.low)).toFixed(2) }}
        </div>
      </div>
      
      <div class="p-4 rounded-xl border text-center transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800 hover:bg-slate-750' : 'border-slate-200 bg-white hover:bg-slate-50'">
        <div class="text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Price Change</div>
        <div class="text-xl font-bold" :class="isPriceUp ? 'text-green-500' : 'text-red-500'">
          {{ priceChange.toFixed(2) }}
        </div>
      </div>
    </div>

    <!-- Chart Info -->
    <div class="mt-4 text-center">
      <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
        Last updated: {{ new Date().toLocaleTimeString('en-GB', { timeZone: 'GMT' }) }} | 
        <span v-if="useTradingView">Use mouse wheel to zoom, drag to pan, right-click for menu</span>
        <span v-else>Use mouse wheel to zoom in/out, Ctrl+drag to pan</span> | 
        Click time range buttons to see different periods
      </p>
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
