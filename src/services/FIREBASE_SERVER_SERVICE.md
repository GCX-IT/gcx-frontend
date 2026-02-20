# Firebase Server Service

This service handles the Firebase server_requests/server_responses pattern for fetching real-time market data and historical closing prices.

## Overview

The Firebase Server Service implements a request/response pattern where:
1. **POST** a request to `server_requests/{REQUESTOR ID}.json`
2. **Poll** `server_responses/{REQUESTOR ID}/{POST ID}.json` for the response

## Usage

### Basic Example

```typescript
import { firebaseServerService } from '@/services/firebaseServerService'

// Get ticker information for a symbol
const response = await firebaseServerService.getTickerInfo('GEJYM2')

console.log(response.symbol) // 'GEJYM2'
console.log(response.closingPrices) // Array of historical price points
console.log(response.lastTradeDate) // '2026-02-18'
```

### Get Historical Chart Data

```typescript
// Get formatted chart data for a symbol
const chartData = await firebaseServerService.getHistoricalChartData('GEJYM2', '3M')

console.log(chartData.labels) // ['Jan 15', 'Feb 15', 'Feb 18']
console.log(chartData.data) // [1200, 1300, 3332]
console.log(chartData.high) // [1250, 1350, 3332]
console.log(chartData.low) // [1150, 1250, 3332]
console.log(chartData.open) // [1200, 1300, 0]
console.log(chartData.close) // [1200, 1300, 3332]
```

### With Progress Callback

```typescript
// Monitor polling progress
const response = await firebaseServerService.getTickerInfo(
  'GEJYM2',
  undefined,
  (attempt, maxAttempts) => {
    console.log(`Polling... ${attempt}/${maxAttempts}`)
  }
)
```

### With Date Filter

```typescript
// Get data as of a specific date
const response = await firebaseServerService.getTickerInfo(
  'GEJYM2',
  'Last Traded: 18-Feb-2026'
)
```

## API Reference

### `getTickerInfo(symbol, asAtDate?, onProgress?)`

Fetches ticker information (historical closing prices) for a symbol.

**Parameters:**
- `symbol` (string): The commodity symbol (e.g., "GEJYM2")
- `asAtDate` (string, optional): Date filter (e.g., "Last Traded: 18-Feb-2026")
- `onProgress` (function, optional): Callback for polling progress `(attempt: number, maxAttempts: number) => void`

**Returns:** `Promise<ServerResponse>`

**Example Response:**
```json
{
  "closingPrices": [
    {
      "closing": "3332",
      "high": "3332",
      "low": "3332",
      "opening": "0",
      "sessionDate": "2026-02-18"
    }
  ],
  "lastTradeDate": "2026-02-18",
  "success": "true",
  "symbol": "GEJYM2"
}
```

### `getHistoricalChartData(symbol, period, asAtDate?)`

Gets historical data formatted for chart display.

**Parameters:**
- `symbol` (string): The commodity symbol
- `period` ('1D' | '1W' | '1M' | '3M' | '6M' | '1Y'): Time period filter (default: '3M')
- `asAtDate` (string, optional): Date filter

**Returns:** `Promise<ChartData>`

**Example Response:**
```typescript
{
  labels: string[]      // Formatted date labels
  data: number[]        // Closing prices
  high: number[]        // High prices
  low: number[]         // Low prices
  open: number[]        // Opening prices
  close: number[]       // Closing prices (same as data)
  rawData: HistoricalPricePoint[]  // Raw data points
}
```

## Integration with MarketDataService

The `marketDataService.getHistoricalData()` method now uses this Firebase server service by default, with automatic fallback to the legacy method if the new service fails.

```typescript
import { marketDataService } from '@/services/marketDataService'

// This now uses the Firebase server service internally
const chartData = await marketDataService.getHistoricalData('GEJYM2', '3M')
```

## Configuration

The service uses the following configuration:

- **Poll Interval**: 1 second between polling attempts
- **Max Poll Attempts**: 30 attempts (30 seconds max wait time)
- **Request Timeout**: 35 seconds total timeout
- **Base URL**: `https://sserp-gcx-webservices-default-rtdb.firebaseio.com/7fc5499a-eccb-4bab-aa52-6ac0269a9dc3/marketdata`

## Error Handling

The service handles various error scenarios:

- **Network errors**: Throws error with descriptive message
- **Timeout**: Throws error after max polling attempts
- **404 errors**: Continues polling (response not ready yet)
- **No data**: Throws error if no historical data found

## Testing

Tests are located in `src/services/__tests__/firebaseServerService.test.ts`.

To run tests:
```bash
npm install -D vitest @vitest/ui
npm test
```

## Request Format

The service sends requests in the following format:

```json
{
  "header": {
    "request": "GetTickerInfo",
    "timestamp": "2025-05-07T13:59:43"
  },
  "request": {
    "asAtDate": "Last Traded: 18-Feb-2026",
    "symbol": "GEJYM2"
  }
}
```

## Response Format

Responses follow this structure:

```json
{
  "closingPrices": [
    {
      "closing": "3332",
      "high": "3332",
      "low": "3332",
      "opening": "0",
      "sessionDate": "2026-02-18"
    }
  ],
  "lastTradeDate": "2026-02-18",
  "success": "true",
  "symbol": "GEJYM2"
}
```
