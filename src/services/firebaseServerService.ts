import axios from 'axios'
import type { AxiosInstance } from 'axios'

/**
 * Firebase Server Request/Response Service
 * 
 * This service handles the Firebase server_requests/server_responses pattern:
 * 1. POST request to server_requests/{REQUESTOR ID}.json
 * 2. Poll/listen to server_responses/{REQUESTOR ID}/{POST ID}.json for response
 * 
 * Base URL: https://sserp-gcx-webservices-default-rtdb.firebaseio.com/7fc5499a-eccb-4bab-aa52-6ac0269a9dc3/marketdata
 */

const FIREBASE_BASE_URL = 'https://sserp-gcx-webservices-default-rtdb.firebaseio.com/7fc5499a-eccb-4bab-aa52-6ac0269a9dc3/marketdata'

export interface ServerRequestHeader {
  request: string
  timestamp: string
}

export interface ServerRequestPayload {
  asAtDate?: string
  symbol: string
}

export interface ServerRequest {
  header: ServerRequestHeader
  request: ServerRequestPayload
}

export interface HistoricalPricePoint {
  closing: string | number
  high: string | number
  low: string | number
  opening: string | number
  sessionDate: string
}

export interface ServerResponse {
  closingPrices: HistoricalPricePoint[]
  lastTradeDate: string
  success: string
  symbol: string
}

interface CachedYearlyData {
  data: HistoricalPricePoint[]
  symbol: string
  timestamp: number
  lastTradeDate: string
}

class FirebaseServerService {
  private readonly axiosInstance: AxiosInstance
  private readonly POLL_INTERVAL = 1000 // 1 second
  private readonly MAX_POLL_ATTEMPTS = 30 // 30 seconds max wait time
  private readonly REQUEST_TIMEOUT = 35000 // 35 seconds total timeout
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000 // 6 hours cache duration
  private readonly CACHE_KEY_PREFIX = 'gcx_firebase_yearly_data_'

  constructor() {
    this.axiosInstance = axios.create({
      timeout: this.REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Generate a unique requestor ID (can be user ID, session ID, or random UUID)
   */
  private generateRequestorId(): string {
    // Use a combination of timestamp and random string
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `${timestamp}-${random}`
  }

  /**
   * POST a request to Firebase server_requests endpoint
   * Returns the POST ID (Firebase push key)
   */
  private async postRequest(requestorId: string, request: ServerRequest): Promise<string> {
    try {
      const url = `${FIREBASE_BASE_URL}/server_requests/${requestorId}.json`
      const response = await this.axiosInstance.post(url, request)
      
      // Firebase returns the POST ID in the response
      return response.data.name || response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to post request to Firebase: ${error.message}`)
      }
      throw new Error('Failed to post request to Firebase')
    }
  }

  /**
   * Poll for response from Firebase server_responses endpoint
   */
  private async pollForResponse(
    requestorId: string,
    postId: string,
    onProgress?: (attempt: number, maxAttempts: number) => void
  ): Promise<ServerResponse> {
    const url = `${FIREBASE_BASE_URL}/server_responses/${requestorId}/${postId}.json`
    
    for (let attempt = 1; attempt <= this.MAX_POLL_ATTEMPTS; attempt++) {
      try {
        if (onProgress) {
          onProgress(attempt, this.MAX_POLL_ATTEMPTS)
        }

        const response = await this.axiosInstance.get<ServerResponse | null>(url)
        
        // Check if response exists and has data
        if (response.data && response.data.success === 'true' && response.data.closingPrices) {
          return response.data
        }

        // If response exists but is not ready yet, wait and continue polling
        if (response.data && response.data.success !== 'true') {
          await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL))
          continue
        }

        // If no response yet, wait and continue polling
        await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL))
      } catch (error) {
        // If 404, response not ready yet - continue polling
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          await new Promise(resolve => setTimeout(resolve, this.POLL_INTERVAL))
          continue
        }
        
        // Other errors should be thrown
        if (axios.isAxiosError(error)) {
          throw new Error(`Failed to poll for response: ${error.message}`)
        }
        throw new Error('Failed to poll for response')
      }
    }

    throw new Error(`Timeout: No response received after ${this.MAX_POLL_ATTEMPTS} attempts`)
  }

  /**
   * Delete request from Firebase server_requests endpoint
   */
  private async deleteRequest(requestorId: string, postId: string): Promise<void> {
    try {
      const url = `${FIREBASE_BASE_URL}/server_requests/${requestorId}/${postId}.json`
      await this.axiosInstance.delete(url)
    } catch (error) {
      // Silently fail - cleanup is best effort
      console.warn('Failed to delete request from Firebase:', error)
    }
  }

  /**
   * Delete response from Firebase server_responses endpoint
   */
  private async deleteResponse(requestorId: string, postId: string): Promise<void> {
    try {
      const url = `${FIREBASE_BASE_URL}/server_responses/${requestorId}/${postId}.json`
      await this.axiosInstance.delete(url)
    } catch (error) {
      // Silently fail - cleanup is best effort
      console.warn('Failed to delete response from Firebase:', error)
    }
  }

  /**
   * Cleanup request and response from Firebase after successful fetch
   */
  private async cleanupFirebaseData(requestorId: string, postId: string): Promise<void> {
    // Delete both request and response in parallel
    await Promise.all([
      this.deleteRequest(requestorId, postId),
      this.deleteResponse(requestorId, postId)
    ])
  }

  /**
   * Get cached yearly data for a symbol
   */
  private getCachedYearlyData(symbol: string): CachedYearlyData | null {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${symbol}`
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const parsed: CachedYearlyData = JSON.parse(cached)
      const now = Date.now()
      
      // Check if cache is still valid
      if (now - parsed.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(cacheKey)
        return null
      }

      // Verify it's for the same symbol
      if (parsed.symbol !== symbol) {
        localStorage.removeItem(cacheKey)
        return null
      }

      return parsed
    } catch (error) {
      // If cache is corrupted, remove it
      const cacheKey = `${this.CACHE_KEY_PREFIX}${symbol}`
      localStorage.removeItem(cacheKey)
      return null
    }
  }

  /**
   * Cache yearly data for a symbol
   */
  private cacheYearlyData(symbol: string, data: HistoricalPricePoint[], lastTradeDate: string): void {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${symbol}`
      const cacheData: CachedYearlyData = {
        data,
        symbol,
        timestamp: Date.now(),
        lastTradeDate
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      // Silently fail - caching is best effort
      console.warn('Failed to cache yearly data:', error)
    }
  }

  /**
   * Get ticker information (historical closing prices) for a symbol
   * Always fetches 1 year of data and caches it
   * 
   * @param symbol - The commodity symbol (e.g., "GEJYM2")
   * @param asAtDate - Optional date filter (e.g., "Last Traded: 18-Feb-2026")
   * @param onProgress - Optional callback for polling progress
   * @returns Promise<ServerResponse> with closing prices and historical data
   */
  async getTickerInfo(
    symbol: string,
    asAtDate?: string,
    onProgress?: (attempt: number, maxAttempts: number) => void
  ): Promise<ServerResponse> {
    const requestorId = this.generateRequestorId()
    let postId: string | null = null
    
    const request: ServerRequest = {
      header: {
        request: 'GetTickerInfo',
        timestamp: new Date().toISOString(),
      },
      request: {
        symbol,
        ...(asAtDate && { asAtDate }),
      },
    }

    try {
      // Step 1: POST the request
      postId = await this.postRequest(requestorId, request)
      
      // Step 2: Poll for the response
      const response = await this.pollForResponse(requestorId, postId, onProgress)
      
      // Step 3: Cleanup Firebase data (request and response)
      if (postId) {
        await this.cleanupFirebaseData(requestorId, postId)
      }
      
      // Step 4: Cache the yearly data
      if (response.closingPrices && response.closingPrices.length > 0) {
        this.cacheYearlyData(symbol, response.closingPrices, response.lastTradeDate)
      }
      
      return response
    } catch (error) {
      // Try to cleanup even on error
      if (postId) {
        await this.cleanupFirebaseData(requestorId, postId).catch(() => {
          // Ignore cleanup errors
        })
      }
      
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to get ticker information')
    }
  }

  /**
   * Get historical data formatted for chart display
   * Uses cached yearly data for 1M and 3M periods, fetches fresh data for 1Y
   * 
   * @param symbol - The commodity symbol
   * @param period - Time period filter ('1M' | '3M' | '1Y')
   * @param asAtDate - Optional date filter
   * @param onProgress - Optional callback for polling progress
   * @returns Formatted chart data with labels and price arrays
   */
  async getHistoricalChartData(
    symbol: string,
    period: '1M' | '3M' | '1Y' = '3M',
    asAtDate?: string,
    onProgress?: (attempt: number, maxAttempts: number) => void
  ): Promise<{
    labels: string[]
    data: number[]
    high: number[]
    low: number[]
    open: number[]
    close: number[]
    rawData: HistoricalPricePoint[]
  }> {
    let yearlyData: HistoricalPricePoint[] = []
    let useCache = false

    // For 1M and 3M, try to use cached yearly data first
    if (period === '1M' || period === '3M') {
      const cached = this.getCachedYearlyData(symbol)
      if (cached && cached.data.length > 0) {
        yearlyData = cached.data
        useCache = true
      }
    }

    // If no cache available or requesting 1Y, fetch fresh yearly data
    if (!useCache || period === '1Y') {
      const response = await this.getTickerInfo(symbol, asAtDate, onProgress)
      
      if (!response.closingPrices || response.closingPrices.length === 0) {
        throw new Error(`No historical data found for symbol: ${symbol}`)
      }

      yearlyData = response.closingPrices
    }

    // Filter data based on period
    let filteredData = this.filterDataByPeriod(yearlyData, period)
    
    // If no data after filtering, use all available data but limit to reasonable amount
    if (filteredData.length === 0) {
      filteredData = yearlyData.slice(-30) // Take last 30 records
    }

    // Sort by date (oldest first)
    filteredData.sort((a, b) => 
      new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    )

    const labels = filteredData.map(item => this.formatDateLabel(item.sessionDate, period))
    const data = filteredData.map(item => parseFloat(String(item.closing)))
    const high = filteredData.map(item => parseFloat(String(item.high)))
    const low = filteredData.map(item => parseFloat(String(item.low)))
    const open = filteredData.map(item => parseFloat(String(item.opening)))
    const close = filteredData.map(item => parseFloat(String(item.closing)))

    return {
      labels,
      data,
      high,
      low,
      open,
      close,
      rawData: filteredData,
    }
  }

  /**
   * Filter historical data by time period
   */
  private filterDataByPeriod(
    data: HistoricalPricePoint[],
    period: '1M' | '3M' | '1Y'
  ): HistoricalPricePoint[] {
    const now = new Date()
    const cutoffDate = new Date()

    switch (period) {
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3)
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
  private formatDateLabel(
    dateString: string,
    period: '1M' | '3M' | '1Y'
  ): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
  }

  /**
   * Clear cached yearly data for a symbol
   */
  clearCache(symbol: string): void {
    const cacheKey = `${this.CACHE_KEY_PREFIX}${symbol}`
    localStorage.removeItem(cacheKey)
  }

  /**
   * Clear all cached yearly data
   */
  clearAllCache(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }
}

// Export singleton instance
export const firebaseServerService = new FirebaseServerService()
export default firebaseServerService
