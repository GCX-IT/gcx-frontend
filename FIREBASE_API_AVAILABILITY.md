# Firebase API Data Availability

## ✅ Available from Firebase API

The following data IS available from Firebase and can be displayed:

1. **Commodity Prices**
   - Symbol (e.g., GAPWM2, GEJWM2)
   - Commodity Name (e.g., Maize, Soya Bean)
   - Opening Price
   - Closing Price
   - High Price
   - Low Price
   - Price Change (amount and percentage)
   - Last Trade Date

2. **Commodity Metadata**
   - Delivery Centre (Region)
   - Grade

3. **Market Statistics (Computed)**
   - Total Number of Contracts
   - Number of Unique Commodities
   - Number of Delivery Centres
   - Average Price (calculated from available prices)

4. **Historical Data**
   - Historical closing prices (for charts)
   - Date-based price data

## ❌ NOT Available from Firebase API

The following features should NOT be displayed as they are not in the API:

1. **Volume Data**
   - Trading volume (tons)
   - Volume distribution
   - Volume charts

2. **Market Depth**
   - ASKS (Sell Orders)
   - BIDS (Buy Orders)
   - Order book data

3. **Live Trading Activity**
   - Real-time buy/sell transactions
   - Trader names
   - Order feed

4. **Advanced Statistics**
   - Total Market Volume
   - Market Value
   - Active Traders count
   - Volatility metrics

5. **Trading Data**
   - Individual order details
   - Trade execution data
   - Order status

## Current Implementation Status

- ✅ MarketOverview.vue - Uses Firebase API correctly
- ✅ LivePrices.vue - Uses Firebase API, volume set to 'N/A'
- ❌ PriceChart.vue - Has fake volume data (needs to be removed)
- ❌ Any Market Depth components - Should not exist
- ❌ Any Live Trading Activity components - Should not exist

