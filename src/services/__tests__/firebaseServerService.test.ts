/**
 * Tests for FirebaseServerService
 * 
 * To run these tests:
 * 1. Install dependencies: npm install -D vitest @vitest/ui
 * 2. Add to package.json scripts: "test": "vitest"
 * 3. Run: npm test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { firebaseServerService, type ServerRequest, type ServerResponse } from '../firebaseServerService'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

describe('FirebaseServerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getTickerInfo', () => {
    it('should successfully get ticker info for a symbol', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-123' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [
          {
            closing: '3332',
            high: '3332',
            low: '3332',
            opening: '0',
            sessionDate: '2026-02-18',
          },
          {
            closing: '1200',
            high: '1200',
            low: '1200',
            opening: '1200',
            sessionDate: '2026-02-17',
          },
        ],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      // Mock POST request
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: mockGetResponse }),
      })

      const result = await firebaseServerService.getTickerInfo('GEJYM2')

      expect(result).toEqual(mockGetResponse)
      expect(result.symbol).toBe('GEJYM2')
      expect(result.success).toBe('true')
      expect(result.closingPrices).toHaveLength(2)
    })

    it('should poll for response when not immediately available', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-456' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [
          {
            closing: '3332',
            high: '3332',
            low: '3332',
            opening: '0',
            sessionDate: '2026-02-18',
          },
        ],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: null }) // First poll: no response
          .mockResolvedValueOnce({ data: null }) // Second poll: no response
          .mockResolvedValueOnce({ data: mockGetResponse }), // Third poll: response ready
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      // Use fake timers to speed up the test
      vi.useFakeTimers()

      const promise = firebaseServerService.getTickerInfo('GEJYM2')

      // Fast-forward time to allow polling
      await vi.runAllTimersAsync()

      const result = await promise

      expect(result).toEqual(mockGetResponse)
      expect(axiosInstance.get).toHaveBeenCalledTimes(3)

      vi.useRealTimers()
    })

    it('should handle timeout when response never arrives', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-789' },
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: null }), // Always return null
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      await expect(firebaseServerService.getTickerInfo('GEJYM2')).rejects.toThrow(
        'Timeout: No response received'
      )
    })

    it('should include asAtDate in request when provided', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-date' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: mockGetResponse }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      await firebaseServerService.getTickerInfo('GEJYM2', 'Last Traded: 18-Feb-2026')

      // Check that POST was called with asAtDate
      const postCall = axiosInstance.post.mock.calls[0]
      expect(postCall[1].request.asAtDate).toBe('Last Traded: 18-Feb-2026')
    })

    it('should call onProgress callback during polling', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-progress' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [
          {
            closing: '3332',
            high: '3332',
            low: '3332',
            opening: '0',
            sessionDate: '2026-02-18',
          },
        ],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const progressCallback = vi.fn()

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi
          .fn()
          .mockResolvedValueOnce({ data: null })
          .mockResolvedValueOnce({ data: mockGetResponse }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      vi.useFakeTimers()

      const promise = firebaseServerService.getTickerInfo('GEJYM2', undefined, progressCallback)

      await vi.runAllTimersAsync()
      await promise

      expect(progressCallback).toHaveBeenCalled()
      expect(progressCallback.mock.calls[0][0]).toBeGreaterThan(0) // attempt number
      expect(progressCallback.mock.calls[0][1]).toBeGreaterThan(0) // max attempts

      vi.useRealTimers()
    })
  })

  describe('getHistoricalChartData', () => {
    it('should format historical data for chart display', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-chart' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [
          {
            closing: '1200',
            high: '1250',
            low: '1150',
            opening: '1200',
            sessionDate: '2026-01-15',
          },
          {
            closing: '1300',
            high: '1350',
            low: '1250',
            opening: '1300',
            sessionDate: '2026-02-15',
          },
          {
            closing: '3332',
            high: '3332',
            low: '3332',
            opening: '0',
            sessionDate: '2026-02-18',
          },
        ],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: mockGetResponse }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      const result = await firebaseServerService.getHistoricalChartData('GEJYM2', '3M')

      expect(result.labels).toHaveLength(3)
      expect(result.data).toEqual([1200, 1300, 3332])
      expect(result.high).toEqual([1250, 1350, 3332])
      expect(result.low).toEqual([1150, 1250, 3332])
      expect(result.open).toEqual([1200, 1300, 0])
      expect(result.close).toEqual([1200, 1300, 3332])
      expect(result.rawData).toHaveLength(3)
    })

    it('should filter data by period', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-filter' },
      }

      // Create data spanning more than 3 months
      const oldDate = new Date()
      oldDate.setMonth(oldDate.getMonth() - 4) // 4 months ago

      const recentDate = new Date()
      recentDate.setMonth(recentDate.getMonth() - 1) // 1 month ago

      const mockGetResponse: ServerResponse = {
        closingPrices: [
          {
            closing: '1000',
            high: '1000',
            low: '1000',
            opening: '1000',
            sessionDate: oldDate.toISOString().split('T')[0],
          },
          {
            closing: '2000',
            high: '2000',
            low: '2000',
            opening: '2000',
            sessionDate: recentDate.toISOString().split('T')[0],
          },
          {
            closing: '3332',
            high: '3332',
            low: '3332',
            opening: '0',
            sessionDate: '2026-02-18',
          },
        ],
        lastTradeDate: '2026-02-18',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: mockGetResponse }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      const result = await firebaseServerService.getHistoricalChartData('GEJYM2', '3M')

      // Should filter out data older than 3 months
      expect(result.rawData.length).toBeLessThanOrEqual(3)
      // Should include recent data
      expect(result.rawData.some(d => d.sessionDate === '2026-02-18')).toBe(true)
    })

    it('should throw error when no historical data found', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-empty' },
      }

      const mockGetResponse: ServerResponse = {
        closingPrices: [],
        lastTradeDate: '',
        success: 'true',
        symbol: 'GEJYM2',
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockResolvedValue({ data: mockGetResponse }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      await expect(
        firebaseServerService.getHistoricalChartData('GEJYM2', '3M')
      ).rejects.toThrow('No historical data found for symbol: GEJYM2')
    })
  })

  describe('Error handling', () => {
    it('should handle network errors gracefully', async () => {
      mockedAxios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(new Error('Network error')),
        get: vi.fn(),
      })

      await expect(firebaseServerService.getTickerInfo('GEJYM2')).rejects.toThrow(
        'Failed to post request to Firebase'
      )
    })

    it('should handle 404 errors during polling', async () => {
      const mockPostResponse = {
        data: { name: 'test-post-id-404' },
      }

      const axiosInstance = {
        post: vi.fn().mockResolvedValue(mockPostResponse),
        get: vi.fn().mockRejectedValue({
          response: { status: 404 },
          isAxiosError: true,
        }),
      }

      mockedAxios.create.mockReturnValue(axiosInstance)

      // Should eventually timeout after polling
      await expect(firebaseServerService.getTickerInfo('GEJYM2')).rejects.toThrow()
    })
  })
})
