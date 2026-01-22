<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import CommoditySlider from '../components/Common/CommoditySlider.vue'
import commoditiesService, { type CommodityData } from '../services/commoditiesService'

const { t } = useI18n()

// Image loading state
const commodityBgLoaded = ref(false)

// Active tab state
const activeTab = ref('maize')

// Modal state
const showModal = ref(false)
const selectedCommodity = ref<CommodityData | null>(null)

// Loading and error states
const loading = ref(true)
const error = ref<string | null>(null)

// Commodity data from CMS + Firebase
const commodityData = ref<Record<string, CommodityData>>({})

// Computed properties
const activeCommodity = computed(() => commodityData.value[activeTab.value])
const commodityTabs = computed(() => Object.keys(commodityData.value))

// Functions
const formatPrice = (price: number) => {
  return `GHS ${price.toLocaleString()}`
}

const getPriceChangeColor = (change: number) => {
  if (change > 0) return 'text-green-600 dark:text-green-400'
  if (change < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-600 dark:text-gray-400'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const commodity = activeCommodity.value
  if (commodity && commodity.fallbackImage) {
    img.src = commodity.fallbackImage
  }
}

const downloadContract = (commodity: any) => {
  // If multiple contract types, let user choose via slider
  const hasMultipleContractTypes = commodity.contractTypes && commodity.contractTypes.length > 1
  if (hasMultipleContractTypes) {
    openModal(commodity)
    return
  }

  // Open the contract file for inline viewing in a new tab if available
  if (commodity.contractFile) {
    window.open(commodity.contractFile, '_blank', 'noopener,noreferrer')
  }
}

const openModal = (commodity: CommodityData) => {
  selectedCommodity.value = commodity
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCommodity.value = null
}

const startTrading = () => {
  // Route to membership page for trading registration
  window.location.href = '/membership'
}

const viewMarketData = () => {
  // Navigate to internal Market Data page
  window.location.href = '/market-data'
}

// Load commodity data from CMS + Firebase
const loadCommodityData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const combinedData = await commoditiesService.getCombinedCommodityData()
    
    // Convert array to object with lowercase keys for tabs
    const dataObject: Record<string, CommodityData> = {}
    combinedData.forEach(commodity => {
      const key = commodity.name.toLowerCase().replace(/\s+/g, '')
      dataObject[key] = commodity
    })
    
    commodityData.value = dataObject
    
    // Set first commodity as active if none selected
    if (!activeTab.value || !commodityData.value[activeTab.value]) {
      const firstKey = Object.keys(commodityData.value)[0]
      if (firstKey) {
        activeTab.value = firstKey
      }
    }
    
    console.log('✅ Commodity data loaded successfully:', Object.keys(commodityData.value))
  } catch (err) {
    console.error('❌ Error loading commodity data:', err)
    error.value = 'Failed to load commodity data. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCommodityData()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <!-- Hero Section -->
    <section class="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] -mt-1 overflow-hidden bg-slate-800">
      <!-- Placeholder blur while loading -->
      <div 
        v-show="!commodityBgLoaded"
        class="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 animate-pulse"
      ></div>
      
      <div class="absolute inset-0">
        <img 
          src="/USSD/commodity.jpg" 
          alt="Commodities Background" 
          class="w-full h-full object-cover transition-opacity duration-500"
          :class="commodityBgLoaded ? 'opacity-100' : 'opacity-0'"
          loading="lazy"
          @load="commodityBgLoaded = true"
        />
        <div class="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 lg:py-20 text-center h-full flex flex-col justify-center">
        <div class="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-8 border border-white/20 mx-auto">
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live Market Data (T+1)
        </div>
        
        <h1 class="text-2xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold mb-3 sm:mb-6 text-white leading-tight">
          Commodities
        </h1>
        <p class="text-xs sm:text-base lg:text-xl xl:text-2xl max-w-4xl mx-auto text-white/80 mb-6 sm:mb-12 leading-relaxed">
          Access real-time commodity prices, market data, and trading information for agricultural products across Ghana.
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
          <div class="text-center p-3 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">{{ commodityTabs.length }}</div>
            <div class="text-white/70 text-xs sm:text-sm">Active Commodities</div>
          </div>
          <div class="text-center p-3 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">24/7</div>
            <div class="text-white/70 text-xs sm:text-sm">Market Access</div>
          </div>
          <div class="text-center p-3 sm:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Real-time</div>
            <div class="text-white/70 text-xs sm:text-sm">Price Updates</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Commodity Tabs Section -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <div class="inline-flex items-center gap-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <span class="text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Loading commodity data...
            </span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="max-w-md mx-auto">
            <div class="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Failed to Load Data
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
            <button 
              @click="loadCommodityData"
              class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Content -->
        <div v-else>
        <!-- Tab Navigation -->
        <div class="mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Commodity Markets
          </h2>
          
          <!-- Tabs -->
          <div class="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2">
            <button
              v-for="tab in commodityTabs"
              :key="tab"
              @click="activeTab = tab"
              class="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 capitalize whitespace-nowrap"
              :class="activeTab === tab 
                ? 'bg-yellow-500 text-black shadow-lg scale-105' 
                : isDarkMode 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                  : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'"
            >
                {{ commodityData[tab]?.name || tab }}
            </button>
          </div>
        </div>

        <!-- Active Commodity Content -->
        <div v-if="activeCommodity" class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-start px-2">
          <!-- Commodity Information -->
          <div class="space-y-4 sm:space-y-8">
            <!-- Image -->
            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                :src="activeCommodity.image"
                :alt="activeCommodity.name"
                @error="handleImageError"
                class="w-full h-auto sm:h-80 object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <span class="px-2 sm:px-3 py-1 bg-yellow-500 text-black text-xs sm:text-sm font-semibold rounded-full">
                    {{ activeCommodity.category }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold">{{ activeCommodity.name }}</h3>
              </div>
            </div>

            <!-- Description -->
            <div class="rounded-2xl p-4 sm:p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h4 class="text-lg sm:text-2xl font-bold mb-3 sm:mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                About {{ activeCommodity.name }}
              </h4>
              <p class="text-xs sm:text-base lg:text-lg leading-relaxed mb-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                {{ activeCommodity.description }}
              </p>
              <button 
                @click="openModal(activeCommodity)"
                class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-xs sm:text-base flex items-center gap-2 transition-colors duration-200"
              >
                <span>Read More</span>
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Specifications -->
            <div class="rounded-2xl p-4 sm:p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <h4 class="text-lg sm:text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Contract Specifications
                </h4>
                <button 
                  @click="downloadContract(activeCommodity)"
                  class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded transition-colors duration-200 shadow-md text-xs sm:text-base flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Contract
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(value, key) in activeCommodity.specifications" :key="key" class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
                  <span class="font-medium capitalize" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    {{ String(key).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}:
                  </span>
                  <span class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ value }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Data -->
          <div class="space-y-8">
            <!-- Current Prices Header -->
            <div class="text-center">
              <h4 class="text-3xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Current Prices (T+1)
              </h4>
              <p class="text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                Live commodity prices for {{ activeCommodity.name }}
              </p>
            </div>

            <!-- Contracts Table -->
            <div class="rounded-2xl shadow-2xl overflow-hidden" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <div class="p-6">
                <h5 class="text-xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Active Contracts
                </h5>
                
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead class="border-b" :class="isDarkMode ? 'border-slate-600' : 'border-gray-200'">
                      <tr>
                        <th class="text-left py-3 px-2 font-semibold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Contract Code</th>
                        <th class="text-right py-3 px-2 font-semibold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Closing Price (GHS)</th>
                        <th class="text-right py-3 px-2 font-semibold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Change</th>
                        <th class="text-right py-3 px-2 font-semibold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Delivery Centre</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-600' : 'divide-gray-200'">
                      <tr v-for="contract in activeCommodity.contracts" :key="contract.code" class="hover:bg-opacity-50 transition-colors" :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'">
                        <td class="py-4 px-2">
                          <span class="font-mono font-semibold px-3 py-1 rounded-lg text-sm" :class="isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-gray-100 text-slate-800'">
                            {{ contract.code }}
                          </span>
                        </td>
                        <td class="py-4 px-2 text-right">
                          <span class="text-lg font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                            {{ formatPrice(contract.price) }}
                          </span>
                        </td>
                        <td class="py-4 px-2 text-right">
                          <div class="flex items-center justify-end gap-1">
                            <svg v-if="contract.change > 0" class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
                            </svg>
                            <svg v-else-if="contract.change < 0" class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
                            </svg>
                            <span class="font-semibold" :class="getPriceChangeColor(contract.change)">
                              {{ contract.change >= 0 ? '+' : '' }}{{ contract.change }}
                            </span>
                          </div>
                        </td>
                        <td class="py-4 px-2 text-right">
                          <span class="font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                            {{ contract.deliveryCentre }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Trading Actions -->
            <div class="grid grid-cols-1 gap-4">
              <button @click="viewMarketData" class="border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Market Data
              </button>
            </div>

            <!-- Market Status -->
            <div class="text-center p-6 rounded-2xl" :class="isDarkMode ? 'bg-slate-700' : 'bg-gray-50'">
              <div class="flex items-center justify-center gap-2 mb-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Market Status: Open</span>
              </div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                Trading hours: 9:00 AM - 4:00 PM (GMT)
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Commodity Slider Panel -->
    <CommoditySlider 
      :is-open="showModal"
      :commodity="selectedCommodity"
      @close="closeModal"
      @download-contract="downloadContract"
    />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Animation for floating elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
