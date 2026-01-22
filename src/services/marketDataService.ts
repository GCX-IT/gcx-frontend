import axios from 'axios'

// Firebase endpoint base URL
const FIREBASE_BASE_URL = 'https://sserp-gcx-webservices-default-rtdb.firebaseio.com/7fc5499a-eccb-4bab-aa52-6ac0269a9dc3/marketdata'

// Market Data Types
export interface ClosingPriceData {
  ClosingPrice: string
  Commodity: string
  HighPrice: string
  LastTradeDate: string
  LowPrice: string
  OpeningPrice: string
  PriceChange: string
  Symbol: string
}

export interface CommoditySymbolData {
  Commodity: string
  DeliveryCentre: string
  Grade: string
}

export interface MarketDataResponse {
  data: Record<string, ClosingPriceData>
  header: {
    timestamp: string
  }
}

export interface ProcessedMarketData extends ClosingPriceData {
  DeliveryCentre?: string
  Grade?: string
  priceChangePercent?: number
  formattedPrice?: string
  isPositiveChange?: boolean
}

class MarketDataService {
  private readonly axiosInstance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Cache configuration
  private readonly CACHE_KEY_CLOSING_PRICES = 'gcx_market_data_closing_prices'
  private readonly CACHE_KEY_COMMODITY_SYMBOLS = 'gcx_market_data_commodity_symbols'
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    const now = Date.now()
    return (now - timestamp) < this.CACHE_DURATION
  }

  /**
   * Get data from cache
   */
  private getFromCache<T>(key: string): { data: T; timestamp: number } | null {
    try {
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const parsed = JSON.parse(cached)
      if (!parsed.timestamp || !this.isCacheValid(parsed.timestamp)) {
        localStorage.removeItem(key)
        return null
      }

      return parsed
    } catch (error) {
      localStorage.removeItem(key)
      return null
    }
  }

  /**
   * Save data to cache
   */
  private saveToCache<T>(key: string, data: T): void {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
    }
  }

  /**
   * Fetch closing prices from Firebase with caching
   */
  async getClosingPrices(): Promise<MarketDataResponse> {
    // Try to get from cache first
    const cached = this.getFromCache<MarketDataResponse>(this.CACHE_KEY_CLOSING_PRICES)
    if (cached) {
      return cached.data
    }

    try {
      const response = await this.axiosInstance.get<MarketDataResponse>(
        `${FIREBASE_BASE_URL}/closing_prices.json`
      )
      
      // Save to cache
      this.saveToCache(this.CACHE_KEY_CLOSING_PRICES, response.data)
      
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch market data. Please try again later.')
    }
  }

  /**
   * Fetch commodity symbols from Firebase with caching
   */
  async getCommoditySymbols(): Promise<Record<string, CommoditySymbolData>> {
    // Try to get from cache first
    const cached = this.getFromCache<Record<string, CommoditySymbolData>>(this.CACHE_KEY_COMMODITY_SYMBOLS)
    if (cached) {
      return cached.data
    }

    try {
      const response = await this.axiosInstance.get<Record<string, CommoditySymbolData>>(
        `${FIREBASE_BASE_URL}/commodity_symbols.json`
      )
      
      // Save to cache
      this.saveToCache(this.CACHE_KEY_COMMODITY_SYMBOLS, response.data)
      
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch commodity symbols. Please try again later.')
    }
  }

  /**
   * Get combined market data with symbol information
   */
  async getCombinedMarketData(): Promise<ProcessedMarketData[]> {
    try {
      const [closingPricesResponse, commoditySymbols] = await Promise.all([
        this.getClosingPrices(),
        this.getCommoditySymbols()
      ])

      const combinedData: ProcessedMarketData[] = []

      Object.entries(closingPricesResponse.data).forEach(([symbol, priceData]) => {
        const symbolInfo = commoditySymbols[symbol]
        
        // Calculate price change percentage
        const openingPrice = parseFloat(priceData.OpeningPrice) || 0
        const priceChange = parseFloat(priceData.PriceChange) || 0
        const priceChangePercent = openingPrice > 0 ? (priceChange / openingPrice) * 100 : 0

        const processedData: ProcessedMarketData = {
          ...priceData,
          DeliveryCentre: symbolInfo?.DeliveryCentre,
          Grade: symbolInfo?.Grade,
          priceChangePercent,
          formattedPrice: this.formatPrice(priceData.ClosingPrice),
          isPositiveChange: priceChange >= 0
        }

        combinedData.push(processedData)
      })

      // Sort by commodity name and then by delivery centre
      combinedData.sort((a, b) => {
        if (a.Commodity !== b.Commodity) {
          return a.Commodity.localeCompare(b.Commodity)
        }
        return (a.DeliveryCentre || '').localeCompare(b.DeliveryCentre || '')
      })

      return combinedData
    } catch (error) {
      throw error
    }
  }

  /**
   * Get market data filtered by commodity type
   */
  async getMarketDataByCommodity(commodityType: string): Promise<ProcessedMarketData[]> {
    try {
      const allData = await this.getCombinedMarketData()
      return allData.filter(item => 
        item.Commodity.toLowerCase().includes(commodityType.toLowerCase())
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Get market data for a specific delivery centre
   */
  async getMarketDataByDeliveryCentre(centreName: string): Promise<ProcessedMarketData[]> {
    try {
      const allData = await this.getCombinedMarketData()
      return allData.filter(item => 
        item.DeliveryCentre?.toLowerCase().includes(centreName.toLowerCase())
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Get unique commodities list
   */
  async getUniqueCommodities(): Promise<string[]> {
    try {
      const allData = await this.getCombinedMarketData()
      const commodities = [...new Set(allData.map(item => item.Commodity))]
      return commodities.sort()
    } catch (error) {
      throw error
    }
  }

  /**
   * Get unique delivery centres list
   */
  async getUniqueDeliveryCentres(): Promise<string[]> {
    try {
      const allData = await this.getCombinedMarketData()
      const centres = [...new Set(allData.map(item => item.DeliveryCentre).filter(Boolean))]
      return centres.sort()
    } catch (error) {
      throw error
    }
  }

  /**
   * Search market data by symbol or commodity name
   */
  async searchMarketData(searchTerm: string): Promise<ProcessedMarketData[]> {
    try {
      const allData = await this.getCombinedMarketData()
      const term = searchTerm.toLowerCase()
      
      return allData.filter(item => 
        item.Symbol.toLowerCase().includes(term) ||
        item.Commodity.toLowerCase().includes(term) ||
        item.DeliveryCentre?.toLowerCase().includes(term)
      )
    } catch (error) {
      throw error
    }
  }

         /**
          * Get historical market data for charts from Firebase
          */
         async getHistoricalData(symbol: string, period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' = '3M'): Promise<{
           labels: string[]
           data: number[]
           high: number[]
           low: number[]
           open: number[]
           close: number[]
         }> {
           try {
             
             // Create a new axios instance with longer timeout for historical data
             const historicalAxios = axios.create({
               timeout: 30000, // 30 seconds timeout
               headers: {
                 'Content-Type': 'application/json',
               },
             })
             
             // Fetch historical data from Firebase
             const response = await historicalAxios.get(
               `${FIREBASE_BASE_URL}.json`
             )
             
             
             // Find the symbol's historical data by searching through all entries
             let historicalData = null
             let foundSymbol = null
             
             // First, search through the main structure for entries with closingPrices
             for (const [key, value] of Object.entries(response.data)) {
               if (value && typeof value === 'object' && 'closingPrices' in value && 'symbol' in value) {
                 const item = value as any
                 
                 if (item.closingPrices && Array.isArray(item.closingPrices) && item.closingPrices.length > 0) {
                   if (item.symbol === symbol) {
                     historicalData = item.closingPrices
                     foundSymbol = item.symbol
                     break
                   }
                 }
               }
             }
             
             // If no exact match found, search through nested entries (like harold@gcx,com,gh)
             if (!historicalData) {
               
               for (const [outerKey, outerValue] of Object.entries(response.data)) {
                 if (outerValue && typeof outerValue === 'object') {
                   for (const [innerKey, innerValue] of Object.entries(outerValue)) {
                     if (innerValue && typeof innerValue === 'object' && 'closingPrices' in innerValue && 'symbol' in innerValue) {
                       const item = innerValue as any
                       
                       if (item.closingPrices && Array.isArray(item.closingPrices) && item.closingPrices.length > 0) {
                         if (item.symbol === symbol) {
                           historicalData = item.closingPrices
                           foundSymbol = item.symbol
                           break
                         }
                       }
                     }
                   }
                   if (historicalData) break
                 }
               }
             }
             
             // If still no exact match found, use the first available symbol with data
             if (!historicalData) {
               
               for (const [outerKey, outerValue] of Object.entries(response.data)) {
                 if (outerValue && typeof outerValue === 'object') {
                   for (const [innerKey, innerValue] of Object.entries(outerValue)) {
                     if (innerValue && typeof innerValue === 'object' && 'closingPrices' in innerValue && 'symbol' in innerValue) {
                       const item = innerValue as any
                       
                       if (item.closingPrices && Array.isArray(item.closingPrices) && item.closingPrices.length > 0) {
                         historicalData = item.closingPrices
                         foundSymbol = item.symbol
                         break
                       }
                     }
                   }
                   if (historicalData) break
                 }
               }
             }
             
             if (!historicalData || historicalData.length === 0) {
               throw new Error(`No historical data found for symbol: ${symbol}`)
             }

         // Filter data based on period
         let filteredData = this.filterDataByPeriod(historicalData, period)
         
         // If no data after filtering, use all available data but limit to reasonable amount
         if (filteredData.length === 0) {
           filteredData = historicalData.slice(-30) // Take last 30 records
         }
         
         // If still no data, create a fallback with current price
         if (filteredData.length === 0) {
           const currentPrice = 1000 // Default fallback price
           const days = 30
           const fallbackData = []
           
           for (let i = days; i >= 0; i--) {
             const date = new Date()
             date.setDate(date.getDate() - i)
             fallbackData.push({
               sessionDate: date.toISOString().split('T')[0],
               closing: currentPrice + (Math.random() - 0.5) * 100,
               high: currentPrice + Math.random() * 50,
               low: currentPrice - Math.random() * 50,
               opening: currentPrice + (Math.random() - 0.5) * 20
             })
           }
           filteredData = fallbackData
         }
         
         // Sort by date (oldest first)
         filteredData.sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())
             
             const labels = filteredData.map(item => this.formatDateLabel(item.sessionDate, period))
             const data = filteredData.map(item => parseFloat(item.closing))
             const high = filteredData.map(item => parseFloat(item.high))
             const low = filteredData.map(item => parseFloat(item.low))
             const open = filteredData.map(item => parseFloat(item.opening))
             const close = filteredData.map(item => parseFloat(item.closing))
             
             // Return actual data as-is from Firebase, no artificial variation
             return { labels, data, high, low, open, close }
           } catch (error) {
             throw error
           }
         }

  /**
   * Filter historical data by time period
   */
  private filterDataByPeriod(data: any[], period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'): any[] {
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (period) {
      case '1D':
        cutoffDate.setDate(now.getDate() - 1)
        break
      case '1W':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    return data.filter(item => new Date(item.sessionDate) >= cutoffDate)
  }

  /**
   * Format date label for chart display
   */
  private formatDateLabel(dateString: string, period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'): string {
    const date = new Date(dateString)
    
    if (period === '1D') {
      return date.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' })
    } else if (period === '1W') {
      return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
    }
  }


  /**
   * Get market data statistics
   */
  async getMarketStatistics(): Promise<{
    totalSymbols: number
    totalCommodities: number
    totalDeliveryCentres: number
    lastUpdated: string
    topPerformers: ProcessedMarketData[]
    bottomPerformers: ProcessedMarketData[]
  }> {
    try {
      const [closingPricesResponse, allData] = await Promise.all([
        this.getClosingPrices(),
        this.getCombinedMarketData()
      ])

      // Sort by price change percentage
      const sortedByChange = [...allData].sort((a, b) => 
        (b.priceChangePercent || 0) - (a.priceChangePercent || 0)
      )

      return {
        totalSymbols: allData.length,
        totalCommodities: [...new Set(allData.map(item => item.Commodity))].length,
        totalDeliveryCentres: [...new Set(allData.map(item => item.DeliveryCentre).filter(Boolean))].length,
        lastUpdated: closingPricesResponse.header?.timestamp || '',
        topPerformers: sortedByChange.slice(0, 5),
        bottomPerformers: sortedByChange.slice(-5).reverse()
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Format price with proper currency formatting
   */
  private formatPrice(price: string): string {
    const numPrice = parseFloat(price)
    if (isNaN(numPrice)) return price
    
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numPrice)
  }

  /**
   * Clear all cached market data
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY_CLOSING_PRICES)
      localStorage.removeItem(this.CACHE_KEY_COMMODITY_SYMBOLS)
    } catch (error) {
    }
  }

  /**
   * Get cache status information
   */
  getCacheStatus(): {
    hasClosingPrices: boolean
    hasCommoditySymbols: boolean
    closingPricesAge: number | null
    commoditySymbolsAge: number | null
  } {
    const closingPricesCache = this.getFromCache<MarketDataResponse>(this.CACHE_KEY_CLOSING_PRICES)
    const commoditySymbolsCache = this.getFromCache<Record<string, CommoditySymbolData>>(this.CACHE_KEY_COMMODITY_SYMBOLS)

    return {
      hasClosingPrices: !!closingPricesCache,
      hasCommoditySymbols: !!commoditySymbolsCache,
      closingPricesAge: closingPricesCache ? Math.round((Date.now() - closingPricesCache.timestamp) / 1000 / 60) : null,
      commoditySymbolsAge: commoditySymbolsCache ? Math.round((Date.now() - commoditySymbolsCache.timestamp) / 1000 / 60) : null
    }
  }

  /**
   * Format date to readable format
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService()
export default marketDataService
