<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode, toggleDarkMode } from '../../utils/darkMode'
import { useTickerVisibility } from '../../composables/useTickerVisibility'
import { globalMarketData, globalLoading, globalError, refreshMarketData } from '../../utils/marketDataUtils'
import { marketDataService, type ProcessedMarketData } from '../../services/marketDataService'

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

const props = withDefaults(defineProps<{ 
  fullscreen?: boolean,
  ultraWide?: boolean
}>(), {
  fullscreen: false,
  ultraWide: false
})

// Fullscreen state
const isBrowserFullscreen = ref(false)

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    try {
      await document.documentElement.requestFullscreen()
      isBrowserFullscreen.value = true
    } catch (err) {
      console.error(`Error attempting to enable fullscreen mode: ${err}`)
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isBrowserFullscreen.value = false
    }
  }
}

const handleFullscreenChange = () => {
  isBrowserFullscreen.value = !!document.fullscreenElement
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
  'Aromatic Straight Millled Rice': { avatar: 'rice', color: 'bg-blue-500' },
  'White Sesame Seed': { avatar: 'sesame', color: 'bg-slate-400' },
  'Sorghum': { avatar: 'sorghum', color: 'bg-amber-500' }
}

// Default avatar for unmapped commodities
const getDefaultAvatar = (commodity: string): { avatar: string; color: string } => {
  if (commodity.toLowerCase().includes('maize')) return { avatar: '🌽', color: 'bg-yellow-500' }
  if (commodity.toLowerCase().includes('soya')) return { avatar: '🫘', color: 'bg-green-500' }
  if (commodity.toLowerCase().includes('rice')) return { avatar: 'rice', color: 'bg-blue-500' }
  if (commodity.toLowerCase().includes('sesame')) return { avatar: 'sesame', color: 'bg-slate-400' }
  if (commodity.toLowerCase().includes('sorghum')) return { avatar: 'sorghum', color: 'bg-amber-500' }
  return { avatar: 'commodity', color: 'bg-gray-500' }
}

const isEmojiAvatar = (avatar: string): boolean => avatar === '🌽' || avatar === '🫘'

const getCommodityIconPath = (icon: string): string => {
  switch (icon) {
    case 'maize':
      return 'M12 3C9.5 5.2 8 8.4 8 12c0 3.6 1.5 6.8 4 9 2.5-2.2 4-5.4 4-9 0-3.6-1.5-6.8-4-9z M12 6v12 M9.5 9.5L12 11l2.5-1.5 M9.5 13.5L12 15l2.5-1.5'
    case 'soya':
      return 'M7 13c0-3 2.2-5 5-5s5 2 5 5-2.2 5-5 5-5-2-5-5z M10 8c0-2 1-3.5 2-4.5 1 1 2 2.5 2 4.5'
    case 'rice':
      return 'M5 14c0 3 3 5 7 5s7-2 7-5H5z M7 14c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5'
    case 'sesame':
      return 'M12 6l2 3-2 3-2-3 2-3z M8 11l2 3-2 3-2-3 2-3z M16 11l2 3-2 3-2-3 2-3z'
    case 'sorghum':
      return 'M12 4v16 M12 8c-2 0-3-1-3-3 M12 10c2 0 3-1 3-3 M12 12c-2 0-3 1-3 3 M12 14c2 0 3 1 3 3'
    default:
      return 'M12 3l7 4-7 4-7-4 7-4z M5 7v8l7 4 7-4V7'
  }
}

// Convert Firebase data to ticker format
const convertToTickerFormat = (data: ProcessedMarketData[]): TickerCommodity[] => {
  return data.map(item => {
    const avatarInfo = commodityAvatars[item.Commodity] || getDefaultAvatar(item.Commodity)
    const formattedDate = formatTradeDate(item.latestDate || item.LastTradeDate)
    
    return {
      symbol: item.Symbol,
      name: item.Commodity,
      price: item.latestPrice || parseFloat(item.ClosingPrice) || 0,
      change: parseFloat(item.PriceChange) || 0,
      changePercent: item.priceChangePercent || 0,
      volume: formatVolume(item.Symbol),
      avatar: avatarInfo.avatar,
      color: avatarInfo.color,
      lastTradeDate: formattedDate
    }
  })
}

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

const parseDate = (dateString: string): Date | null => {
  if (!dateString || dateString.trim() === '') return null
  let date = new Date(dateString)
  if (!isNaN(date.getTime())) return date
  const dateStr = String(dateString).trim()
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    date = new Date(dateStr)
    if (!isNaN(date.getTime())) return date
  }
  return null
}

const formatTradeDate = (dateString: string): string => {
  try {
    if (!dateString || dateString.trim() === '') return ''
    const date = parseDate(dateString)
    if (!date) return ''
    return date.toLocaleDateString('en-GH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (error) {
    return ''
  }
}

const loadLatestTradedSymbols = async () => {
  try {
    const latestData = await marketDataService.getCurrentMarketData()
    commodities.value = convertToTickerFormat(latestData)
  } catch (error) {
    commodities.value = []
  }
}

const refreshData = async () => {
  await refreshMarketData()
  await loadLatestTradedSymbols()
}

const isPaused = ref(false)
const { isTickerVisible: isVisible } = useTickerVisibility()

const tickerWrapperClasses = computed(() => {
  if (props.fullscreen || props.ultraWide) {
    return [
      'relative',
      'left-0',
      'right-0',
      'w-full',
      'h-screen',
      'overflow-hidden',
      'z-[60]',
      'transition-all',
      'duration-500',
      'ease-in-out',
      'shadow-lg',
      (isDarkMode.value || props.ultraWide)
        ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-r from-slate-50 via-white to-slate-50'
    ]
  }

  return [
    'fixed',
    'left-0',
    'right-0',
    'z-[60]',
    'transition-all',
    'duration-500',
    'ease-in-out',
    'shadow-lg',
    isVisible.value ? 'top-0' : '-top-16',
    isDarkMode.value
      ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border-b border-slate-700/50'
      : 'bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200/50'
  ]
})

const tickerTrackHeightClass = computed(() => (props.fullscreen || props.ultraWide ? 'h-screen' : 'h-16 md:h-16'))

const toggleScrolling = () => {
  isPaused.value = !isPaused.value
}

const getChangeColor = (change: number) => {
  if (props.ultraWide) {
    if (change > 0) return 'text-[#00ff88]' // Matrix Green
    if (change < 0) return 'text-[#ff4466]' // Bright Red
    return 'text-[#ffaa00]' // GCX Gold
  }

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

const getChangeIcon = (change: number) => {
  if (change > 0) return '↗'
  if (change < 0) return '↘'
  return '→'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2
  }).format(price)
}

onMounted(() => {
  loadLatestTradedSymbols()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div :class="tickerWrapperClasses">
    <!-- Custom Commodity Ticker -->
    <div class="relative overflow-hidden flex items-center justify-center" :class="[tickerTrackHeightClass, { 'ultra-wide-viewport': ultraWide }]">
      <div :class="{ 'ultra-wide-scaler': ultraWide }">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center h-full px-4">
          <div class="flex items-center space-x-4">
            <div :class="[fullscreen ? 'w-8 h-8' : 'w-3 h-3']" class="bg-blue-500 rounded-full animate-pulse"></div>
            <span :class="[[fullscreen ? 'text-2xl' : 'text-xs'], (isDarkMode || ultraWide) ? 'text-slate-300' : 'text-slate-600']">
              Loading market data...
            </span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex items-center justify-center h-full px-4">
          <div class="flex items-center space-x-4">
            <div :class="[fullscreen ? 'w-8 h-8' : 'w-3 h-3']" class="bg-red-500 rounded-full"></div>
            <span :class="[[fullscreen ? 'text-2xl' : 'text-red-300'], (isDarkMode || ultraWide) ? 'text-red-300' : 'text-red-600']">
              {{ error }}
            </span>
          </div>
        </div>

        <!-- Ticker Container -->
        <div 
          v-else-if="commodities.length > 0"
          class="flex items-center px-4 ticker-scroll h-full"
          :class="[
            { 'ticker-paused': isPaused, 'ticker-scroll-fullscreen': (fullscreen || ultraWide) && !ultraWide, 'ultra-wide-track': ultraWide },
            (fullscreen || ultraWide) ? 'space-x-8' : 'space-x-2'
          ]"
          @click="toggleScrolling"
        >
          <!-- Set 1 -->
          <div 
            v-for="commodity in commodities" 
            :key="commodity.symbol"
            class="flex flex-shrink-0 group cursor-pointer transition-all duration-200"
            :class="[
              !ultraWide ? 'backdrop-blur-md shadow-2xl' : '',
              (isDarkMode || ultraWide) 
                ? (ultraWide ? '' : 'hover:bg-slate-800/90 border-slate-700/50 bg-slate-900/90') 
                : (ultraWide ? '' : 'hover:bg-slate-50/90 border-slate-200/50 bg-white/90'),
              (fullscreen || ultraWide) 
                ? 'flex-col p-8 space-y-4 min-w-[350px] lg:min-w-[400px] xl:min-w-[20vw] items-center text-center rounded-[2.5rem] border-4 backdrop-blur-none shadow-lg' 
                : 'flex-row px-2 py-2.5 space-x-1 min-w-[100px] items-center rounded-xl border',
              { 'ultra-wide-item': ultraWide }
            ]"
          >
            <!-- Commodity Avatar -->
            <div 
              class="rounded-full flex items-center justify-center text-white font-bold shadow-2xl ring-4 ring-white/20" 
              :class="[
                commodity.color,
                (fullscreen || ultraWide) ? 'w-24 h-24 text-4xl mb-2' : 'w-5 h-5 md:w-5 md:h-5 text-xs',
                { 'ultra-wide-avatar': ultraWide }
              ]"
            >
              <span v-if="isEmojiAvatar(commodity.avatar)">{{ commodity.avatar }}</span>
              <svg v-else class="w-[70%] h-[70%]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  :d="getCommodityIconPath(commodity.avatar)"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            
            <!-- Commodity Info -->
            <div class="flex flex-col flex-1 w-full" :class="(fullscreen || ultraWide) ? 'items-center' : ''">
              <div class="flex items-center mb-1 w-full" :class="[(fullscreen || ultraWide) ? 'flex-col mb-2 space-y-1' : 'justify-between mb-0.5']">
                <span 
                  class="font-black leading-tight" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-white' : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-2xl lg:text-3xl' : 'text-[10px] md:text-xs',
                    { 'ultra-wide-text-large': ultraWide }
                  ]"
                >
                  {{ commodity.name }}
                </span>
                <span 
                  class="font-mono px-3 py-1 rounded-xl shadow-inner" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-slate-300 bg-slate-800/80' : 'text-slate-600 bg-slate-100',
                    (fullscreen || ultraWide) ? 'text-lg lg:text-xl' : 'text-[9px] hidden md:inline',
                    { 'ultra-wide-text-mono': ultraWide }
                  ]"
                >
                  {{ commodity.symbol }}
                </span>
              </div>
              <div class="flex items-center w-full" :class="[(fullscreen || ultraWide) ? 'flex-col space-y-2' : 'justify-between']">
                <span 
                  class="font-black" 
                  :class="[
                    (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#00ff88]' : 'text-white') : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-4xl lg:text-6xl' : 'text-xs md:text-sm',
                    { 'ultra-wide-text-xl': ultraWide }
                  ]"
                >
                  {{ formatPrice(commodity.price) }}
                </span>
                <span 
                  class="font-bold rounded-full flex items-center justify-center shadow-lg" 
                  :class="[
                    getChangeColor(commodity.change),
                    (fullscreen || ultraWide) ? 'text-xl lg:text-2xl px-6 py-2 gap-3' : 'text-[10px] px-1.5 py-0.5 gap-0.5',
                    { 'ultra-wide-change': ultraWide }
                  ]"
                >
                  <span>{{ getChangeIcon(commodity.change) }}</span>
                  <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
                </span>
              </div>
              <div 
                v-if="commodity.lastTradeDate" 
                class="font-bold mt-1 leading-tight whitespace-nowrap flex items-center" 
                :class="[
                  (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#aaffee]' : 'text-slate-400') : 'text-slate-500',
                  (fullscreen || ultraWide) ? 'text-lg lg:text-xl gap-3 mt-4' : 'text-[8px] gap-0.5 mt-0.5 mb-0.5',
                  { 'ultra-wide-text-date': ultraWide }
                ]"
              >
                <span class="rounded-full animate-pulse" :class="[(isDarkMode || ultraWide) ? 'bg-green-400' : 'bg-green-500', (fullscreen || ultraWide) ? 'w-3 h-3' : 'w-1 h-1']"></span>
                <span>As at {{ commodity.lastTradeDate }}</span>
              </div>
            </div>
          </div>

          <!-- Set 2 -->
          <div 
            v-for="commodity in commodities" 
            :key="`duplicate-${commodity.symbol}`"
            class="flex flex-shrink-0 group cursor-pointer transition-all duration-200"
            :class="[
              !ultraWide ? 'backdrop-blur-md shadow-2xl' : '',
              (isDarkMode || ultraWide) 
                ? (ultraWide ? '' : 'hover:bg-slate-800/90 border-slate-700/50 bg-slate-900/90') 
                : (ultraWide ? '' : 'hover:bg-slate-50/90 border-slate-200/50 bg-white/90'),
              (fullscreen || ultraWide) 
                ? 'flex-col p-8 space-y-4 min-w-[350px] lg:min-w-[400px] xl:min-w-[20vw] items-center text-center rounded-[2.5rem] border-4 backdrop-blur-none shadow-lg' 
                : 'flex-row px-2 py-2.5 space-x-1 min-w-[100px] items-center rounded-xl border',
              { 'ultra-wide-item': ultraWide }
            ]"
          >
            <!-- Commodity Avatar -->
            <div 
              class="rounded-full flex items-center justify-center text-white font-bold shadow-2xl ring-4 ring-white/20" 
              :class="[
                commodity.color,
                (fullscreen || ultraWide) ? 'w-24 h-24 text-4xl mb-2' : 'w-5 h-5 md:w-5 md:h-5 text-xs',
                { 'ultra-wide-avatar': ultraWide }
              ]"
            >
              <span v-if="isEmojiAvatar(commodity.avatar)">{{ commodity.avatar }}</span>
              <svg v-else class="w-[70%] h-[70%]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  :d="getCommodityIconPath(commodity.avatar)"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            
            <!-- Commodity Info -->
            <div class="flex flex-col flex-1 w-full" :class="(fullscreen || ultraWide) ? 'items-center' : ''">
              <div class="flex items-center mb-1 w-full" :class="[(fullscreen || ultraWide) ? 'flex-col mb-2 space-y-1' : 'justify-between mb-0.5']">
                <span 
                  class="font-black leading-tight" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-white' : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-2xl lg:text-3xl' : 'text-[10px] md:text-xs',
                    { 'ultra-wide-text-large': ultraWide }
                  ]"
                >
                  {{ commodity.name }}
                </span>
                <span 
                  class="font-mono px-3 py-1 rounded-xl shadow-inner" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-slate-300 bg-slate-800/80' : 'text-slate-600 bg-slate-100',
                    (fullscreen || ultraWide) ? 'text-lg lg:text-xl' : 'text-[9px] hidden md:inline',
                    { 'ultra-wide-text-mono': ultraWide }
                  ]"
                >
                  {{ commodity.symbol }}
                </span>
              </div>
              <div class="flex items-center w-full" :class="[(fullscreen || ultraWide) ? 'flex-col space-y-2' : 'justify-between']">
                <span 
                  class="font-black" 
                  :class="[
                    (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#00ff88]' : 'text-white') : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-4xl lg:text-6xl' : 'text-xs md:text-sm',
                    { 'ultra-wide-text-xl': ultraWide }
                  ]"
                >
                  {{ formatPrice(commodity.price) }}
                </span>
                <span 
                  class="font-bold rounded-full flex items-center justify-center shadow-lg" 
                  :class="[
                    getChangeColor(commodity.change),
                    (fullscreen || ultraWide) ? 'text-xl lg:text-2xl px-6 py-2 gap-3' : 'text-[10px] px-1.5 py-0.5 gap-0.5',
                    { 'ultra-wide-change': ultraWide }
                  ]"
                >
                  <span>{{ getChangeIcon(commodity.change) }}</span>
                  <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
                </span>
              </div>
              <div 
                v-if="commodity.lastTradeDate" 
                class="font-bold mt-1 leading-tight whitespace-nowrap flex items-center" 
                :class="[
                  (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#aaffee]' : 'text-slate-400') : 'text-slate-500',
                  (fullscreen || ultraWide) ? 'text-lg lg:text-xl gap-3 mt-4' : 'text-[8px] gap-0.5 mt-0.5 mb-0.5',
                  { 'ultra-wide-text-date': ultraWide }
                ]"
              >
                <span class="rounded-full animate-pulse" :class="[(isDarkMode || ultraWide) ? 'bg-green-400' : 'bg-green-500', (fullscreen || ultraWide) ? 'w-3 h-3' : 'w-1 h-1']"></span>
                <span>As at {{ commodity.lastTradeDate }}</span>
              </div>
            </div>
          </div>

          <!-- Set 3 -->
          <div 
            v-for="commodity in commodities" 
            :key="`triplicate-${commodity.symbol}`"
            class="flex flex-shrink-0 group cursor-pointer transition-all duration-200"
            :class="[
              !ultraWide ? 'backdrop-blur-md shadow-2xl' : '',
              (isDarkMode || ultraWide) 
                ? (ultraWide ? '' : 'hover:bg-slate-800/90 border-slate-700/50 bg-slate-900/90') 
                : (ultraWide ? '' : 'hover:bg-slate-50/90 border-slate-200/50 bg-white/90'),
              (fullscreen || ultraWide) 
                ? 'flex-col p-8 space-y-4 min-w-[350px] lg:min-w-[400px] xl:min-w-[20vw] items-center text-center rounded-[2.5rem] border-4 backdrop-blur-none shadow-lg' 
                : 'flex-row px-2 py-2.5 space-x-1 min-w-[100px] items-center rounded-xl border',
              { 'ultra-wide-item': ultraWide }
            ]"
          >
            <!-- Commodity Avatar -->
            <div 
              class="rounded-full flex items-center justify-center text-white font-bold shadow-2xl ring-4 ring-white/20" 
              :class="[
                commodity.color,
                (fullscreen || ultraWide) ? 'w-24 h-24 text-4xl mb-2' : 'w-5 h-5 md:w-5 md:h-5 text-xs',
                { 'ultra-wide-avatar': ultraWide }
              ]"
            >
              <span v-if="isEmojiAvatar(commodity.avatar)">{{ commodity.avatar }}</span>
              <svg v-else class="w-[70%] h-[70%]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  :d="getCommodityIconPath(commodity.avatar)"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            
            <!-- Commodity Info -->
            <div class="flex flex-col flex-1 w-full" :class="(fullscreen || ultraWide) ? 'items-center' : ''">
              <div class="flex items-center mb-1 w-full" :class="[(fullscreen || ultraWide) ? 'flex-col mb-2 space-y-1' : 'justify-between mb-0.5']">
                <span 
                  class="font-black leading-tight" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-white' : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-2xl lg:text-3xl' : 'text-[10px] md:text-xs',
                    { 'ultra-wide-text-large': ultraWide }
                  ]"
                >
                  {{ commodity.name }}
                </span>
                <span 
                  class="font-mono px-3 py-1 rounded-xl shadow-inner" 
                  :class="[
                    (isDarkMode || ultraWide) ? 'text-slate-300 bg-slate-800/80' : 'text-slate-600 bg-slate-100',
                    (fullscreen || ultraWide) ? 'text-lg lg:text-xl' : 'text-[9px] hidden md:inline',
                    { 'ultra-wide-text-mono': ultraWide }
                  ]"
                >
                  {{ commodity.symbol }}
                </span>
              </div>
              <div class="flex items-center w-full" :class="[(fullscreen || ultraWide) ? 'flex-col space-y-2' : 'justify-between']">
                <span 
                  class="font-black" 
                  :class="[
                    (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#00ff88]' : 'text-white') : 'text-slate-900',
                    (fullscreen || ultraWide) ? 'text-4xl lg:text-6xl' : 'text-xs md:text-sm',
                    { 'ultra-wide-text-xl': ultraWide }
                  ]"
                >
                  {{ formatPrice(commodity.price) }}
                </span>
                <span 
                  class="font-bold rounded-full flex items-center justify-center shadow-lg" 
                  :class="[
                    getChangeColor(commodity.change),
                    (fullscreen || ultraWide) ? 'text-xl lg:text-2xl px-6 py-2 gap-3' : 'text-[10px] px-1.5 py-0.5 gap-0.5',
                    { 'ultra-wide-change': ultraWide }
                  ]"
                >
                  <span>{{ getChangeIcon(commodity.change) }}</span>
                  <span>{{ commodity.change > 0 ? '+' : '' }}{{ commodity.changePercent.toFixed(2) }}%</span>
                </span>
              </div>
              <div 
                v-if="commodity.lastTradeDate" 
                class="font-bold mt-1 leading-tight whitespace-nowrap flex items-center" 
                :class="[
                  (isDarkMode || ultraWide) ? (ultraWide ? 'text-[#aaffee]' : 'text-slate-400') : 'text-slate-500',
                  (fullscreen || ultraWide) ? 'text-lg lg:text-xl gap-3 mt-4' : 'text-[8px] gap-0.5 mt-0.5 mb-0.5',
                  { 'ultra-wide-text-date': ultraWide }
                ]"
              >
                <span class="rounded-full animate-pulse" :class="[(isDarkMode || ultraWide) ? 'bg-green-400' : 'bg-green-500', (fullscreen || ultraWide) ? 'w-3 h-3' : 'w-1 h-1']"></span>
                <span>As at {{ commodity.lastTradeDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div v-if="!isBrowserFullscreen" class="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-4">
        <!-- Fullscreen Toggle -->
        <button 
          v-if="fullscreen || ultraWide"
          @click="toggleFullscreen"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95"
          :class="(isDarkMode || ultraWide) ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-900 border border-slate-200'"
          title="Toggle Fullscreen"
        >
          <svg v-if="!isBrowserFullscreen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Theme Toggle -->
        <button 
          v-if="fullscreen || ultraWide"
          @click="toggleDarkMode"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110 active:scale-95"
          :class="(isDarkMode || ultraWide) ? 'bg-yellow-500 text-slate-900' : 'bg-slate-900 text-yellow-500'"
          title="Toggle Theme"
        >
          <svg v-if="isDarkMode || ultraWide" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Refresh Button -->
        <button 
          @click="refreshData"
          :disabled="isLoading"
          class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl disabled:opacity-50 hover:scale-110 active:scale-95"
          :class="isLoading 
            ? 'bg-blue-500 animate-pulse' 
            : ((isDarkMode || ultraWide) 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white')"
          :title="isLoading ? 'Refreshing...' : 'Refresh data'"
        >
          <svg 
            v-if="!isLoading"
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.5"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path>
          </svg>
          <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ticker scrolling animation */
@keyframes ticker-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-33.3333%, 0, 0);
  }
}

.ticker-scroll {
  animation: ticker-scroll 180s linear infinite;
  width: max-content;
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000;
}

.ticker-scroll-fullscreen {
  animation: ticker-scroll 135s linear infinite;
}

/* Ultra-wide support */
.ultra-wide-viewport {
  width: 100vw;
  height: 100vh;
  background: #000;
}

.ultra-wide-scaler {
  width: 600vw;
  height: 100vh;
  transform: scaleX(0.16667);
  transform-origin: left center;
  display: flex;
  align-items: center;
}

.ultra-wide-track {
  animation: ticker-scroll 90s linear infinite !important;
}

.ultra-wide-item {
  min-width: 2100px !important; /* 350px * 6 */
  padding: 48px !important; /* 8px * 6 */
  margin-right: 48px !important; /* 8px * 6 */
  border-radius: 0 !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  flex-direction: row !important; /* Force horizontal for ultra-wide */
  space-x: 36px !important; /* 6px * 6 */
}

.ultra-wide-avatar {
  width: 144px !important; /* 24px * 6 */
  height: 144px !important; /* 24px * 6 */
  font-size: 84px !important; /* Scaled for visibility */
  ring-width: 24px !important;
}

.ultra-wide-text-large {
  font-size: 144px !important; /* 24px * 6 */
}

.ultra-wide-text-mono {
  font-size: 90px !important; /* 15px * 6 */
  padding: 6px 48px !important;
  border-radius: 60px !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #ffaa00 !important; /* Symbol forced to Gold */
}

.ultra-wide-text-xl {
  font-size: 192px !important; /* 32px * 6 */
}

.ultra-wide-change {
  font-size: 108px !important; /* 18px * 6 */
  padding: 12px 60px !important;
  gap: 18px !important;
  background: transparent !important;
  box-shadow: none !important;
}

.ultra-wide-text-date {
  font-size: 90px !important; /* 15px * 6 */
  margin-top: 24px !important;
  gap: 18px !important;
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
