import { ref, type Ref } from 'vue'
import { marketDataService, type ProcessedMarketData } from '../services/marketDataService'

/**
 * Centralized market data utility with 6-hour caching
 * All components should use this instead of direct marketDataService calls
 */

export interface MarketDataState {
  data: ProcessedMarketData[]
  loading: boolean
  error: string | null
  lastUpdated: string
}

/**
 * Global market data state - shared across all components
 */
const globalMarketData = ref<ProcessedMarketData[]>([])
const globalLoading = ref(false)
const globalError = ref<string | null>(null)
const globalLastUpdated = ref('')

/**
 * Auto-refresh interval - shared across all components
 */
let globalRefreshInterval: number | null = null

/**
 * Load market data with caching (6 hours)
 */
export const loadMarketData = async (): Promise<ProcessedMarketData[]> => {
  try {
    globalLoading.value = true
    globalError.value = null
    
    const data = await marketDataService.getCombinedMarketData()
    globalMarketData.value = data
    globalLastUpdated.value = new Date().toLocaleTimeString('en-GH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    return data
  } catch (err) {
    globalError.value = err instanceof Error ? err.message : 'Failed to load market data'
    throw err
  } finally {
    globalLoading.value = false
  }
}

/**
 * Refresh market data (clears cache and fetches fresh data)
 */
export const refreshMarketData = async (): Promise<ProcessedMarketData[]> => {
  marketDataService.clearCache()
  return await loadMarketData()
}

/**
 * Start global auto-refresh (6 hours for commodity market)
 */
export const startGlobalAutoRefresh = (): void => {
  if (globalRefreshInterval) {
    clearInterval(globalRefreshInterval)
  }
  
  // Refresh every 6 hours (commodity prices don't change frequently)
  globalRefreshInterval = setInterval(async () => {
    if (!globalLoading.value) {
      await loadMarketData()
    }
  }, 6 * 60 * 60 * 1000) // 6 hours = 21,600,000ms
  
}

/**
 * Stop global auto-refresh
 */
export const stopGlobalAutoRefresh = (): void => {
  if (globalRefreshInterval) {
    clearInterval(globalRefreshInterval)
    globalRefreshInterval = null
  }
}

/**
 * Get current market data state
 */
export const getMarketDataState = (): MarketDataState => ({
  data: globalMarketData.value,
  loading: globalLoading.value,
  error: globalError.value,
  lastUpdated: globalLastUpdated.value
})

/**
 * Get market data by commodity type
 */
export const getMarketDataByCommodity = (commodityType: string): ProcessedMarketData[] => {
  return globalMarketData.value.filter(item =>
    item.Commodity.toLowerCase().includes(commodityType.toLowerCase())
  )
}

/**
 * Get market data by delivery centre
 */
export const getMarketDataByDeliveryCentre = (centreName: string): ProcessedMarketData[] => {
  return globalMarketData.value.filter(item =>
    item.DeliveryCentre?.toLowerCase().includes(centreName.toLowerCase())
  )
}

/**
 * Search market data
 */
export const searchMarketData = (searchTerm: string): ProcessedMarketData[] => {
  const term = searchTerm.toLowerCase()
  return globalMarketData.value.filter(item => 
    item.Symbol.toLowerCase().includes(term) ||
    item.Commodity.toLowerCase().includes(term) ||
    item.DeliveryCentre?.toLowerCase().includes(term)
  )
}

/**
 * Get unique commodities
 */
export const getUniqueCommodities = (): string[] => {
  const commodities = [...new Set(globalMarketData.value.map(item => item.Commodity))]
  return commodities.sort()
}

/**
 * Get unique delivery centres
 */
export const getUniqueDeliveryCentres = (): string[] => {
  const centres = [...new Set(globalMarketData.value.map(item => item.DeliveryCentre).filter(Boolean))]
  return centres.sort()
}

/**
 * Get historical data for charts
 */
export const getHistoricalData = async (symbol: string, period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' = '3M') => {
  return await marketDataService.getHistoricalData(symbol, period)
}

/**
 * Get market statistics
 */
export const getMarketStatistics = () => {
  const data = globalMarketData.value
  const sortedByChange = [...data].sort((a, b) => 
    (b.priceChangePercent || 0) - (a.priceChangePercent || 0)
  )

  return {
    totalSymbols: data.length,
    totalCommodities: [...new Set(data.map(item => item.Commodity))].length,
    totalDeliveryCentres: [...new Set(data.map(item => item.DeliveryCentre).filter(Boolean))].length,
    lastUpdated: globalLastUpdated.value,
    topPerformers: sortedByChange.slice(0, 5),
    bottomPerformers: sortedByChange.slice(-5).reverse()
  }
}

/**
 * Initialize market data system
 * Call this once when the app starts
 */
export const initializeMarketData = async (): Promise<void> => {
  await loadMarketData()
  startGlobalAutoRefresh()
}

/**
 * Cleanup market data system
 * Call this when the app is unmounted
 */
export const cleanupMarketData = (): void => {
  stopGlobalAutoRefresh()
  console.log('🧹 Market data system cleaned up')
}

// Export reactive refs for components that need them
export {
  globalMarketData,
  globalLoading,
  globalError,
  globalLastUpdated
}
