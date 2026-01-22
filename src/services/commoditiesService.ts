import axios from '../plugins/axios'
import { marketDataService, type ProcessedMarketData } from './marketDataService'

// Types for CMS commodity data
export interface CMSCommodity {
  id: number
  name: string
  code: string
  description: string
  full_description: string
  specifications: string
  trading_hours: string
  contract_size: string
  price_unit: string
  minimum_price: number
  maximum_price: number
  current_price: number
  price_change: number
  price_change_percent: number
  trading_volume: number
  market_status: string
  image_path: string
  contract_file: string
  category: string
  origin_country: string
  harvest_season: string
  delivery_months: string
  storage_requirements: string
  quality_standards: string
  created_at: string
  updated_at: string
  contract_types?: CMSCommodityContractType[]
}

// Types for CMS commodity contract type data
// Note: Price data (current_price, price_change, trading_volume) comes from Firebase API
// CMS only handles static content (descriptions, images, specifications)
export interface CMSCommodityContractType {
  id: number
  commodity_id: number
  name: string
  code: string
  description: string
  full_description: string
  specifications: string
  trading_hours: string
  contract_size: string
  price_unit: string
  image_path: string
  contract_file: string
  delivery_months: string
  storage_requirements: string
  quality_standards: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Combined commodity data for frontend
export interface CommodityData {
  id: number
  name: string
  description: string
  fullDescription: string
  image: string
  fallbackImage: string
  category: string
  contracts: Array<{
    code: string
    price: number
    change: number
    deliveryCentre: string
    grade: string
  }>
  specifications: {
    contractSize: string
    tradingHours: string
    deliveryMonths: string
    minimumPrice: string
    maximumPrice: string
  }
  contractFile: string
}

class CommoditiesService {

  /**
   * Fetch all commodities from CMS
   */
  async getCommodities(): Promise<CMSCommodity[]> {
    try {
      const response = await axios.get<{
        success: boolean
        data: CMSCommodity[]
      }>('/api/commodities')
      
      console.log('✅ Commodities fetched from CMS:', response.data.data.length)
      return response.data.data
    } catch (error) {
      console.error('❌ Error fetching commodities from CMS:', error)
      throw new Error('Failed to fetch commodities from CMS')
    }
  }

  async getCommoditiesWithContractTypes(): Promise<CMSCommodity[]> {
    try {
      const response = await axios.get<{
        success: boolean
        data: CMSCommodity[]
      }>('/api/commodities-with-contract-types')
      console.log('✅ Commodities with contract types fetched from CMS:', response.data.data.length)
      return response.data.data
    } catch (error) {
      console.error('❌ Error fetching commodities with contract types from CMS:', error)
      throw new Error('Failed to fetch commodities with contract types from CMS.')
    }
  }

  async getContractTypes(commodityId: number): Promise<CMSCommodityContractType[]> {
    try {
      const response = await axios.get<{
        success: boolean
        data: CMSCommodityContractType[]
      }>(`/api/contract-types/commodity/${commodityId}`)
      console.log('✅ Contract types fetched from CMS:', response.data.data.length)
      return response.data.data
    } catch (error) {
      console.error('❌ Error fetching contract types from CMS:', error)
      throw new Error('Failed to fetch contract types from CMS.')
    }
  }

  /**
   * Get combined commodity data (CMS + Firebase)
   */
  async getCombinedCommodityData(): Promise<CommodityData[]> {
    try {
      // Fetch data from both sources - use the new endpoint that includes contract types
      const [cmsCommodities, firebaseData] = await Promise.all([
        this.getCommoditiesWithContractTypes(),
        marketDataService.getCombinedMarketData()
      ])

      // Group Firebase data by commodity name
      const firebaseByCommodity = this.groupFirebaseDataByCommodity(firebaseData)

      // Combine CMS and Firebase data
      const combinedData: CommodityData[] = cmsCommodities.map(cmsCommodity => {
        const firebaseContracts = firebaseByCommodity[cmsCommodity.name] || []
        
        return {
          id: cmsCommodity.id, // Add the ID field needed for contract types
          name: cmsCommodity.name,
          description: cmsCommodity.description,
          fullDescription: cmsCommodity.full_description || cmsCommodity.description,
          image: cmsCommodity.image_path || `/commodities/${cmsCommodity.name.toLowerCase()}.jpg`,
          fallbackImage: `/commodities/${cmsCommodity.name.toLowerCase()}.jpg`,
          category: cmsCommodity.category,
          contracts: firebaseContracts.map(contract => ({
            code: contract.Symbol,
            price: parseFloat(contract.ClosingPrice) || 0,
            change: parseFloat(contract.PriceChange) || 0,
            deliveryCentre: contract.DeliveryCentre || 'GCX',
            grade: contract.Grade || 'Standard'
          })),
          specifications: {
            contractSize: cmsCommodity.contract_size,
            tradingHours: cmsCommodity.trading_hours,
            deliveryMonths: cmsCommodity.delivery_months,
            minimumPrice: `GHS ${cmsCommodity.minimum_price.toLocaleString()} per metric ton`,
            maximumPrice: `GHS ${cmsCommodity.maximum_price.toLocaleString()} per metric ton`
          },
          contractFile: cmsCommodity.contract_file || '/gcx-online-trading-member.pdf'
        }
      })

      return combinedData
    } catch (error) {
      console.error('❌ Error getting combined commodity data:', error)
      throw error
    }
  }

  /**
   * Group Firebase data by commodity name
   */
  private groupFirebaseDataByCommodity(firebaseData: ProcessedMarketData[]): Record<string, ProcessedMarketData[]> {
    const grouped: Record<string, ProcessedMarketData[]> = {}
    
    firebaseData.forEach(item => {
      const commodityName = this.mapSymbolToCommodityName(item.Symbol)
      if (!grouped[commodityName]) {
        grouped[commodityName] = []
      }
      grouped[commodityName].push(item)
    })
    
    return grouped
  }

  /**
   * Map Firebase symbols to commodity names
   */
  private mapSymbolToCommodityName(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'GAPWM2': 'Maize',
      'GAPWM3': 'Maize',
      'GAPYM2': 'Maize',
      'GAPYM4': 'Maize',
      'GEJWM2': 'Soya Bean',
      'GSAWM2': 'Sorghum',
      'GKUWM2': 'Sesame',
      'GRIWM2': 'Rice',
      'GKIWM1': 'Rice',
      'GKIWM2': 'Rice',
      'GKIWM3': 'Rice',
      'GKIWM4': 'Rice',
      'GKIYM2': 'Rice',
      'GKIYM3': 'Rice'
    }
    
    return symbolMap[symbol] || 'Unknown'
  }

  /**
   * Get commodity by name
   */
  async getCommodityByName(name: string): Promise<CommodityData | null> {
    try {
      const allCommodities = await this.getCombinedCommodityData()
      return allCommodities.find(commodity => 
        commodity.name.toLowerCase() === name.toLowerCase()
      ) || null
    } catch (error) {
      console.error('❌ Error getting commodity by name:', error)
      throw error
    }
  }

  /**
   * Get commodities by category
   */
  async getCommoditiesByCategory(category: string): Promise<CommodityData[]> {
    try {
      const allCommodities = await this.getCombinedCommodityData()
      return allCommodities.filter(commodity => 
        commodity.category.toLowerCase() === category.toLowerCase()
      )
    } catch (error) {
      console.error('❌ Error getting commodities by category:', error)
      throw error
    }
  }

  /**
   * Get unique categories
   */
  async getUniqueCategories(): Promise<string[]> {
    try {
      const cmsCommodities = await this.getCommodities()
      const categories = [...new Set(cmsCommodities.map(c => c.category))]
      return categories.sort()
    } catch (error) {
      console.error('❌ Error getting unique categories:', error)
      throw error
    }
  }
}

// Export singleton instance
export const commoditiesService = new CommoditiesService()
export default commoditiesService
