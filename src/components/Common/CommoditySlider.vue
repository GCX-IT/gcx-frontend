<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 overflow-hidden"
      @click="close"
    >
        <!-- Sliding Panel -->
        <div
          class="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
          :class="[
            isOpen ? 'translate-x-0' : 'translate-x-full',
            isDarkMode ? 'dark:bg-slate-800' : 'bg-white'
          ]"
          @click.stop
        >
        <!-- Header -->
        <div 
          class="flex items-center justify-between p-6 border-b transition-colors duration-200"
          :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'"
        >
          <h2 
            class="text-2xl font-bold transition-colors duration-200"
            :class="isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            {{ commodity?.name }}
          </h2>
          <button
            @click="close"
            class="p-2 rounded-lg transition-colors duration-200"
            :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
          >
            <svg 
              class="w-6 h-6 transition-colors duration-200" 
              :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
          <div class="p-6">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              <span class="ml-3 text-slate-600 dark:text-slate-400">Loading contract types...</span>
            </div>
            
            <!-- No Contract Types State (should not show now due to fallback) -->
            <div v-else-if="contractTypes.length === 0" class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="text-slate-400 dark:text-slate-500 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p class="text-slate-600 dark:text-slate-400">Error loading commodity data</p>
                <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">Please try again later</p>
              </div>
            </div>
            
            <!-- Contract Type Tabs (only show if multiple contract types) -->
            <div v-else-if="contractTypes.length > 1" class="mb-6">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(contractType, index) in contractTypes"
                  :key="index"
                  @click="selectedContractType = index"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="selectedContractType === index 
                    ? 'bg-yellow-500 text-black shadow-lg' 
                    : isDarkMode 
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                >
                  {{ contractType.name }}
                </button>
              </div>
            </div>

            <!-- Commodity Header -->
            <div v-else class="flex flex-col items-center mb-8">
              <!-- Image -->
              <div class="relative mb-6">
                <div class="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    :src="currentContractType?.image || commodity?.image || '/placeholder-commodity.jpg'"
                    :alt="currentContractType?.name || commodity?.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <!-- Category indicator -->
                <div class="absolute -bottom-2 -right-2 px-3 py-1 bg-yellow-500 text-black text-sm font-semibold rounded-full border-4 border-white dark:border-slate-800">
                  {{ commodity?.category }}
                </div>
              </div>

              <!-- Name and Description -->
              <div class="text-center">
                <h3 
                  class="text-3xl font-bold mb-4 transition-colors duration-200"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ currentContractType?.name || commodity?.name }}
                </h3>
                <div class="w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6"></div>
              </div>
            </div>

            <!-- Contract Specifications -->
            <div 
              v-if="currentContractType?.specifications || commodity?.specifications" 
              class="mb-8 transition-colors duration-200"
              :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
            >
              <h4 
                class="text-lg font-semibold mb-4 pt-6 transition-colors duration-200"
                :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
              >
                Contract Specifications
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(value, key) in (currentContractType?.specifications || commodity?.specifications)" 
                  :key="key" 
                  class="flex justify-between items-center py-3 px-4 rounded-lg transition-colors duration-200"
                  :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-50 hover:bg-slate-100'"
                >
                  <span class="text-sm font-medium capitalize transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    {{ String(key).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }}:
                  </span>
                  <span class="text-sm font-semibold transition-colors duration-200"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ value }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Full Description -->
            <div 
              v-if="currentContractType?.description || commodity?.fullDescription" 
              class="pt-8 transition-colors duration-200"
              :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
            >
              <h4 
                class="text-lg font-semibold mb-4 transition-colors duration-200"
                :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
              >
                About {{ currentContractType?.name || commodity?.name }}
              </h4>
              <div class="prose max-w-none">
                <p 
                  class="leading-relaxed whitespace-pre-line transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                >
                  {{ currentContractType?.description || commodity?.fullDescription }}
                </p>
              </div>
            </div>


            <!-- Action Buttons -->
            <div class="pt-8 border-t border-slate-200 dark:border-slate-700">
              <div class="flex flex-col sm:flex-row gap-4">
                <button 
                  @click="downloadContract"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Contract
                </button>
                <button 
                  @click="close"
                  class="flex-1 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
import { watch, ref, computed, onMounted } from 'vue'
import type { CommodityData } from '../../services/commoditiesService'
import type { CMSCommodityContractType } from '../../services/commoditiesService'
import commoditiesService from '../../services/commoditiesService'

interface ContractType {
  id: number
  name: string
  image: string
  description: string
  specifications: any
  contracts: Array<{
    code: string
    price: number
    change: number
    deliveryCentre: string
    grade: string
  }>
  contractFile?: string
}

interface Props {
  isOpen: boolean
  commodity: CommodityData | null
}

interface Emits {
  (e: 'close'): void
  (e: 'download-contract', commodity: CommodityData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedContractType = ref(0)
const contractTypes = ref<ContractType[]>([])
const loading = ref(false)

// Fetch contract types from CMS when commodity changes
const fetchContractTypes = async () => {
  if (!props.commodity) return
  
  try {
    loading.value = true
    const cmsContractTypes = await commoditiesService.getContractTypes(props.commodity.id)
    
    if (cmsContractTypes.length === 0) {
      // No contract types - use main commodity data
      contractTypes.value = [{
        id: 0,
        name: props.commodity.name,
        image: props.commodity.image,
        description: props.commodity.fullDescription,
        specifications: props.commodity.specifications,
        contracts: props.commodity.contracts,
        contractFile: props.commodity.contractFile
      }]
      console.log('✅ No contract types found - using main commodity data')
    } else {
      // Contract types exist - use CMS data
      contractTypes.value = cmsContractTypes.map(ct => ({
        id: ct.id,
        name: ct.name,
        image: ct.image_path || props.commodity?.image || '/placeholder-commodity.jpg',
        description: ct.full_description || ct.description,
        specifications: {
          contractSize: ct.contract_size,
          tradingHours: ct.trading_hours,
          deliveryMonths: ct.delivery_months,
          priceUnit: ct.price_unit
        },
        contracts: props.commodity?.contracts || [],
        contractFile: ct.contract_file || props.commodity?.contractFile
      }))
      console.log('✅ Contract types loaded from CMS:', contractTypes.value.length)
    }
  } catch (error) {
    console.error('❌ Error fetching contract types from CMS:', error)
    // If CMS fails, fallback to main commodity data
    if (props.commodity) {
      contractTypes.value = [{
        id: 0,
        name: props.commodity.name,
        image: props.commodity.image,
        description: props.commodity.fullDescription,
        specifications: props.commodity.specifications,
        contracts: props.commodity.contracts,
        contractFile: props.commodity.contractFile
      }]
      console.log('✅ Fallback to main commodity data due to CMS error')
    } else {
      contractTypes.value = []
    }
  } finally {
    loading.value = false
  }
}

const currentContractType = computed(() => {
  return contractTypes.value[selectedContractType.value] || null
})

const close = () => {
  emit('close')
}

const downloadContract = () => {
  const currentType = currentContractType.value
  if (currentType && currentType.contractFile) {
    const link = document.createElement('a')
    link.href = currentType.contractFile
    link.download = `${currentType.name}-Contract.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else if (props.commodity && props.commodity.contractFile) {
    // Fallback to main commodity contract file
    const link = document.createElement('a')
    link.href = props.commodity.contractFile
    link.download = `${props.commodity.name}-Contract.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.includes('placeholder-commodity.jpg')) {
    img.src = '/placeholder-commodity.jpg'
  }
}

// Reset selected contract type and fetch contract types when commodity changes
watch(() => props.commodity, async () => {
  selectedContractType.value = 0
  await fetchContractTypes()
})

// Fetch contract types when slider opens
watch(() => props.isOpen, async (newValue) => {
  if (typeof document !== 'undefined') {
    if (newValue) {
      document.body.style.overflow = 'hidden'
      // Fetch contract types when slider opens
      await fetchContractTypes()
    } else {
      document.body.style.overflow = ''
    }
  }
})

// Initial fetch when component mounts
onMounted(() => {
  if (props.commodity) {
    fetchContractTypes()
  }
})
</script>
