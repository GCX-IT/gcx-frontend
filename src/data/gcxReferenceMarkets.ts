/**
 * GCX reference warehouse markets — from "GCX REFERENCE PRICES AS AT 11th May 2020".
 * Used for commodity-by-location tables (no Firebase).
 */

export const GCX_REFERENCE_AS_AT = '11 May 2020'

export interface ReferenceMarketRow {
  market: string
  whiteMaizeGhsMt: number | null
  yellowMaizeGhsMt: number | null
  soyaGhsMt: number | null
  riceGhsMt: number | null
  sesameGhsMt: number | null
  sorghumGhsMt: number | null
}

/** All warehouse / delivery centres from the GCX reference price sheet. */
export const GCX_REFERENCE_MARKETS: ReferenceMarketRow[] = [
  { market: 'Nkoranza', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3333.33, soyaGhsMt: null, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Techiman', whiteMaizeGhsMt: 3333.33, yellowMaizeGhsMt: 3666.67, soyaGhsMt: 7000, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Wenchi', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3000, soyaGhsMt: 9000, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Ejura', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3333.33, soyaGhsMt: null, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Abofour', whiteMaizeGhsMt: 3666.67, yellowMaizeGhsMt: 4000, soyaGhsMt: null, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Mampong', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3666.67, soyaGhsMt: null, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Wa', whiteMaizeGhsMt: 2400, yellowMaizeGhsMt: 2400, soyaGhsMt: 5300, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: 6000 },
  { market: 'Kintampo', whiteMaizeGhsMt: 3200, yellowMaizeGhsMt: 3200, soyaGhsMt: 4000, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Tamale', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3000, soyaGhsMt: 5500, riceGhsMt: null, sesameGhsMt: 16500, sorghumGhsMt: null },
  { market: 'Sandema', whiteMaizeGhsMt: 3000, yellowMaizeGhsMt: 3000, soyaGhsMt: 5500, riceGhsMt: null, sesameGhsMt: 11000, sorghumGhsMt: 6000 },
  { market: 'Bolgatanga', whiteMaizeGhsMt: 4400, yellowMaizeGhsMt: 4400, soyaGhsMt: 5200, riceGhsMt: 12000, sesameGhsMt: null, sorghumGhsMt: 6000 },
  { market: 'Kumasi', whiteMaizeGhsMt: 3666.67, yellowMaizeGhsMt: 4000, soyaGhsMt: 6050, riceGhsMt: null, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Hohoe', whiteMaizeGhsMt: null, yellowMaizeGhsMt: null, soyaGhsMt: null, riceGhsMt: 10000, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Ho', whiteMaizeGhsMt: null, yellowMaizeGhsMt: null, soyaGhsMt: null, riceGhsMt: 12000, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Awalavi', whiteMaizeGhsMt: null, yellowMaizeGhsMt: null, soyaGhsMt: null, riceGhsMt: 10000, sesameGhsMt: null, sorghumGhsMt: null },
  { market: 'Tumu', whiteMaizeGhsMt: 2300, yellowMaizeGhsMt: 2300, soyaGhsMt: 5000, riceGhsMt: null, sesameGhsMt: 8500, sorghumGhsMt: null },
]

export type ReferenceCommodityKey = 'maize' | 'rice' | 'sesame' | 'sorghum' | 'soyabean'

export type MaizeVariety = 'white' | 'yellow'

export interface CommodityMarketLocationRow {
  deliveryCentre: string
  volumeTradedMt: number | null
}

type PriceFieldKey = keyof Pick<
  ReferenceMarketRow,
  'whiteMaizeGhsMt' | 'yellowMaizeGhsMt' | 'soyaGhsMt' | 'riceGhsMt' | 'sesameGhsMt' | 'sorghumGhsMt'
>

export interface CommodityVarietyTab {
  id: string
  label: string
  priceKey: PriceFieldKey
  tableTitle: string
}

export interface CommodityMarketConfig {
  title: string
  varieties: CommodityVarietyTab[] | null
  singlePriceKey: PriceFieldKey | null
  singleTableTitle: string | null
}

export const COMMODITY_MARKET_CONFIG: Record<ReferenceCommodityKey, CommodityMarketConfig> = {
  maize: {
    title: 'Maize Market',
    varieties: [
      { id: 'white', label: 'White Maize Market', priceKey: 'whiteMaizeGhsMt', tableTitle: 'White Maize by location' },
      { id: 'yellow', label: 'Yellow Maize Market', priceKey: 'yellowMaizeGhsMt', tableTitle: 'Yellow Maize by location' },
    ],
    singlePriceKey: null,
    singleTableTitle: null,
  },
  rice: {
    title: 'Rice Market',
    varieties: null,
    singlePriceKey: 'riceGhsMt',
    singleTableTitle: 'Rice by location',
  },
  sesame: {
    title: 'Sesame Market',
    varieties: null,
    singlePriceKey: 'sesameGhsMt',
    singleTableTitle: 'Sesame by location',
  },
  sorghum: {
    title: 'Sorghum Market',
    varieties: null,
    singlePriceKey: 'sorghumGhsMt',
    singleTableTitle: 'Sorghum by location',
  },
  soyabean: {
    title: 'Soya Bean Market',
    varieties: null,
    singlePriceKey: 'soyaGhsMt',
    singleTableTitle: 'Soya Bean by location',
  },
}

/** Map CMS tab keys to reference commodity keys. */
export function tabKeyToReferenceCommodity(tabKey: string): ReferenceCommodityKey | null {
  const map: Record<string, ReferenceCommodityKey> = {
    maize: 'maize',
    rice: 'rice',
    sesame: 'sesame',
    sorghum: 'sorghum',
    soyabean: 'soyabean',
    soya: 'soyabean',
  }
  return map[tabKey] ?? null
}

export function getMarketRowsByPriceKey(priceKey: PriceFieldKey): CommodityMarketLocationRow[] {
  return GCX_REFERENCE_MARKETS.filter((row) => row[priceKey] != null).map((row) => ({
    deliveryCentre: row.market,
    volumeTradedMt: null,
  }))
}

/** @deprecated Use getMarketRowsByPriceKey */
export function getMaizeMarketByVariety(variety: MaizeVariety): CommodityMarketLocationRow[] {
  const priceKey = variety === 'white' ? 'whiteMaizeGhsMt' : 'yellowMaizeGhsMt'
  return getMarketRowsByPriceKey(priceKey)
}

export function formatVolumeMt(volume: number | null): string {
  if (volume == null) return '—'
  return `${volume.toLocaleString('en-GH')} MT`
}
