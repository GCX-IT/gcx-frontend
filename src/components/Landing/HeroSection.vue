<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { ChevronRightIcon, ChevronLeftIcon, PhoneIcon, CheckCircleIcon, LockClosedIcon, ShoppingCartIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

import { useTickerVisibility } from '../../composables/useTickerVisibility'
import { useI18n } from '../../composables/useI18n'
import { getImagePath } from '../../utils/imageUtils'
import NewsTicker from './NewsTicker.vue'

// Ticker visibility
const { isTickerVisible } = useTickerVisibility()
const { t } = useI18n()

// Dynamic hero height based on ticker visibility
const heroHeight = computed(() => {
  return isTickerVisible.value ? 'min-h-[100svh] md:h-[calc(90vh-4rem)]' : 'min-h-[100svh] md:h-[calc(90vh-3rem)]'
})

// Market stats
const marketStats = ref([
  { label: 'Warehouse Network', value: '9', description: 'Certified storage sites nationwide' },
  { label: 'Active Commodities', value: '6', description: 'Trading across Ghana' }
])

// Commodity snapshot (T+1 indicative)
const commodityPrices = ref([
  { symbol: 'GAPWM2', name: 'White Maize', deliveryCentre: 'Afram Plains' },
  { symbol: 'GAPYM2', name: 'Yellow Maize', deliveryCentre: 'Afram Plains' },
  { symbol: 'GKUYM2', name: 'Yellow Soya Bean', deliveryCentre: 'Kumasi' },
  { symbol: 'GSRSM2', name: 'Sorghum', deliveryCentre: 'Saboba' },
  { symbol: 'GARRC2', name: 'Rice', deliveryCentre: 'Tamale' },
  { symbol: 'GSESM2', name: 'Sesame', deliveryCentre: 'Tamale' }
])

// Slider functionality
const currentSlide = ref(0)
const isHovered = ref(false)
let slideInterval: number | undefined

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 3
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? 2 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startSlideShow = () => {
  if (!isHovered.value) {
    slideInterval = setInterval(nextSlide, 8000) // Slower transition: 8 seconds
  }
}

const stopSlideShow = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = undefined
  }
}

const handleMouseEnter = () => {
  isHovered.value = true
  stopSlideShow()
}

const handleMouseLeave = () => {
  isHovered.value = false
  startSlideShow()
}

onMounted(() => {
  // Start slider
  startSlideShow()
})

onBeforeUnmount(() => {
  stopSlideShow()
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Slider Container -->
    <div 
      class="relative transition-all duration-500 ease-in-out" 
      :class="heroHeight"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Slide 1: Trading Dashboard -->
      <div 
        class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        :class="{ 'opacity-100 z-10': currentSlide === 0, 'opacity-0 z-0': currentSlide !== 0 }"
      >
        <div class="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
        <img :src="getImagePath('/trading dashboard.jpg')" alt="Trading Dashboard" class="w-full h-full object-cover" />
        
        <!-- Mobile Layout -->
        <div class="absolute inset-0 flex flex-col justify-center md:hidden px-4 py-8">
          <div class="text-white text-center">
            <div class="inline-flex items-center px-3 py-1.5 bg-yellow-500/20 rounded-full text-yellow-300 text-xs font-medium mb-4">
              <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              Live Market Data
            </div>
            
            <h1 class="text-3xl font-bold mb-3 leading-tight px-2">
              {{ t('pages.home.hero.title') }}
            </h1>
            
            <p class="text-sm text-slate-300 mb-6 px-4">
              {{ t('pages.home.hero.subtitle') }}
            </p>
            
            <!-- Mobile CTA Buttons -->
            <div class="flex flex-col gap-3 px-4 mb-8">
              <RouterLink
                to="/market-data"
                class="w-full inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg text-sm transition-all shadow-lg"
              >
                View Market Data
              </RouterLink>
              <RouterLink
                to="/membership"
                class="w-full inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all"
              >
                Become a Member
              </RouterLink>
            </div>

            <!-- Mobile Stats Row -->
            <div class="grid grid-cols-2 gap-4 px-4">
              <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div class="text-xl font-bold text-blue-400">9</div>
                <div class="text-slate-400 text-xs mt-1">Warehouse Network</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div class="text-xl font-bold text-green-400">6</div>
                <div class="text-slate-400 text-xs mt-1">Active Commodities</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="absolute inset-0 hidden md:flex items-center">
          <div class="w-full px-6 lg:px-12">
            <div class="w-full">
              <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="text-white">
                  <div class="inline-flex items-center px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-300 text-sm font-medium mb-6">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    {{ t('pages.home.hero.features.realTimeData.title') }} • {{ t('common.status.online') }}
                  </div>
                  
                  <h1 class="text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 leading-tight">
                    {{ t('pages.home.hero.title') }}
                  </h1>
                  
                  <p class="text-base lg:text-xl text-slate-300 mb-8 max-w-lg">
                    {{ t('pages.home.hero.subtitle') }}
                  </p>
                  
                  <!-- CTA Buttons -->
                  <div class="flex flex-row gap-4 mb-12">
                    <RouterLink
                      to="/market-data"
                      class="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-8 rounded-xl text-base transition-all transform hover:scale-105 shadow-lg"
                    >
                      View Market Data
                    </RouterLink>
                    <RouterLink
                      to="/membership"
                      class="inline-flex items-center justify-center border-2 border-white/30 hover:border-white/60 text-white font-semibold py-4 px-8 rounded-xl text-base transition-all"
                    >
                      Become a Member
                    </RouterLink>
                  </div>

                  <!-- Verified Stats -->
                  <div class="grid grid-cols-2 gap-6">
                    <div class="text-left">
                      <div class="text-lg lg:text-2xl font-semibold text-slate-300 uppercase tracking-wide">Warehouse Network</div>
                      <div class="text-2xl lg:text-3xl font-bold text-blue-400 mt-2">9</div>
                      <div class="text-slate-400 text-sm mt-1">Certified storage sites nationwide</div>
                    </div>
                    <div class="text-left">
                      <div class="text-lg lg:text-2xl font-semibold text-slate-300 uppercase tracking-wide">Active Commodities</div>
                      <div class="text-2xl lg:text-3xl font-bold text-green-400 mt-2">6</div>
                      <div class="text-slate-400 text-sm mt-1">Trading across Ghana</div>
                    </div>
                  </div>
                </div>

                <!-- Right Content - Live Market Dashboard (Desktop only) -->
                <div class="hidden lg:block">
                  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="text-white font-bold text-lg">{{ t('pages.home.statistics.marketCap') }}</h3>
                      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <!-- Market Stats Grid -->
                    <div class="grid grid-cols-2 gap-4 mb-6">
                      <div 
                        v-for="stat in marketStats" 
                        :key="stat.label"
                        class="bg-white/5 rounded-xl p-4 border border-white/10"
                      >
                        <div class="text-2xl font-bold text-white mb-1">{{ stat.value }}</div>
                        <div class="text-slate-300 text-xs mb-2">{{ stat.label }}</div>
                        <div class="text-slate-400 text-xs">{{ stat.description }}</div>
                      </div>
                    </div>

                    <!-- Quick Prices -->
                    <div class="space-y-2">
                      <div 
                        v-for="commodity in commodityPrices" 
                        :key="commodity.symbol"
                        class="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center text-black text-xs font-bold">
                            {{ commodity.symbol.slice(0, 2) }}
                          </div>
                          <div>
                            <div class="text-white font-medium text-sm">{{ commodity.name }}</div>
                            <div class="text-slate-400 text-xs">{{ commodity.symbol }}</div>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-300 text-xs">{{ commodity.deliveryCentre }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 2: Free SHS Feeding Program -->
      <div 
        class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        :class="{ 'opacity-100 z-10': currentSlide === 1, 'opacity-0 z-0': currentSlide !== 1 }"
      >
        <div class="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-green-900/90 via-green-800/80 to-green-900/90"></div>
        <img :src="getImagePath('/964789397755_1639105501636.jpg')" alt="Free SHS Feeding Program" class="w-full h-full object-cover" />
        
        <!-- Mobile Layout -->
        <div class="absolute inset-0 flex flex-col justify-center md:hidden px-4 py-8">
          <div class="text-white text-center">
            <div class="inline-flex items-center px-3 py-1.5 bg-green-500/20 rounded-full text-green-300 text-xs font-medium mb-4">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Social Impact
            </div>
            
            <h1 class="text-2xl font-bold mb-3 leading-tight px-2">
              Free SHS <span class="text-green-400">Feeding Program</span>
            </h1>
            
            <p class="text-sm text-slate-300 mb-6 px-4">
              Supporting Ghana's education sector by providing quality food supplies to Senior High Schools.
            </p>
            
            <!-- Mobile CTA Buttons -->
            <div class="flex flex-col gap-3 px-4 mb-6">
              <a
                href="http://188.166.159.42:8012/" 
                target="_blank"
                rel="noopener noreferrer"
                class="w-full inline-flex items-center justify-center bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all shadow-lg"
              >
                Apply as Supplier
                <ChevronRightIcon class="ml-2 h-4 w-4" />
              </a>
              <RouterLink
                to="/commodities"
                class="w-full inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all"
              >
                Browse Commodities
              </RouterLink>
            </div>

            <!-- Mobile Info Card -->
            <div class="bg-white/10 backdrop-blur rounded-lg p-4 mx-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-400 font-bold">✓</span>
                </div>
                <div class="text-left">
                  <div class="text-white font-semibold text-sm">Quick Application</div>
                  <div class="text-slate-300 text-xs">Become a certified supplier</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="absolute inset-0 hidden md:flex items-center">
          <div class="w-full px-6 lg:px-12">
            <div class="w-full">
              <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="text-white">
                  <div class="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm font-medium mb-6">
                    <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Social Impact Initiative
                  </div>
                  
                  <h1 class="text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 leading-tight">
                    Free SHS 
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                      Feeding Program
                    </span>
                  </h1>
                  
                  <p class="text-base lg:text-xl text-slate-300 mb-8 max-w-lg">
                    Supporting Ghana's education sector by providing quality food supplies to Senior High Schools. Suppliers can apply to participate in this impactful program.
                  </p>
                  
                  <!-- CTA Buttons -->
                  <div class="flex flex-row gap-4 mb-12">
                    <RouterLink
                      to="/membership"
                      class="inline-flex items-center justify-center bg-green-500 hover:bg-green-400 text-white font-bold py-4 px-8 rounded-xl text-base transition-all transform hover:scale-105 shadow-lg"
                    >
                      Learn More
                    </RouterLink>
                    <RouterLink
                      to="/commodities"
                      class="inline-flex items-center justify-center border-2 border-white/30 hover:border-white/60 text-white font-semibold py-4 px-8 rounded-xl text-base transition-all"
                    >
                      Browse Commodities
                    </RouterLink>
                  </div>
                </div>

                <!-- Right Content - Application Card (Desktop only) -->
                <div class="hidden lg:block relative z-50">
                  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 relative z-50">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="text-white font-bold text-xl">Supplier Application</h3>
                      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div class="space-y-6">
                      <div class="text-center">
                        <p class="text-slate-300 text-lg mb-6">
                          Are you a supplier interested in participating in the Free SHS Feeding Program?
                        </p>
                        <p class="text-slate-400 text-sm mb-8">
                          Submit your application to become a certified supplier and help feed Ghana's future leaders.
                        </p>
                      </div>
                      
                      <a
                        href="http://188.166.159.42:8012/" 
                        target="_blank"
                        rel="noopener noreferrer"
                        class="relative z-50 w-full inline-flex items-center justify-center bg-green-500 hover:bg-green-400 text-white font-bold py-5 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg cursor-pointer"
                        @click.stop
                      >
                        Apply as Supplier
                        <ChevronRightIcon class="ml-2 h-6 w-6" />
                      </a>
                      
                      <div class="pt-4 border-t border-white/10">
                        <div class="flex items-start space-x-3">
                          <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span class="text-green-400 font-bold text-sm">✓</span>
                          </div>
                          <div>
                            <div class="text-white font-semibold text-sm mb-1">Quick Application Process</div>
                            <div class="text-slate-300 text-xs">Fill out the form on our application portal</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide 3: USSD App -->
      <div 
        class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
        :class="{ 'opacity-100 z-10': currentSlide === 2, 'opacity-0 z-0': currentSlide !== 2 }"
      >
        <div class="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-red-900/90 via-red-800/80 to-red-900/90"></div>
        <img :src="getImagePath('/trading.jpg')" alt="USSD Trading App" class="w-full h-full object-cover" />
        
        <!-- Mobile Layout -->
        <div class="absolute inset-0 flex flex-col justify-center md:hidden px-4 py-8">
          <div class="text-white text-center">
            <div class="inline-flex items-center px-3 py-1.5 bg-red-500/20 rounded-full text-red-300 text-xs font-medium mb-4">
              <span class="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
              USSD Trading
            </div>
            
            <h1 class="text-2xl font-bold mb-3 leading-tight px-2">
              Trade with <span class="text-red-400">USSD</span>
            </h1>
            
            <p class="text-sm text-slate-300 mb-4 px-4">
              Buy and sell commodities from any phone. No internet required.
            </p>
            
            <!-- Mobile Dial Code -->
            <div class="bg-white/10 backdrop-blur rounded-lg py-3 px-6 mb-6 mx-4 inline-block">
              <span class="text-yellow-400 font-bold text-xl">*920*23#</span>
            </div>
            
            <!-- Mobile CTA Buttons -->
            <div class="flex flex-col gap-3 px-4 mb-6">
              <RouterLink
                to="/ussd-register"
                class="w-full inline-flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-lg text-sm transition-all shadow-lg"
              >
                Register Now
                <ChevronRightIcon class="ml-2 h-4 w-4" />
              </RouterLink>
              <RouterLink
                to="/market-data"
                class="w-full inline-flex items-center justify-center border-2 border-white/40 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-all"
              >
                View Market Data
              </RouterLink>
            </div>

            <!-- Mobile Features Grid -->
            <div class="grid grid-cols-2 gap-3 px-4">
              <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <PhoneIcon class="h-5 w-5 text-red-400 mx-auto mb-1" />
                <div class="text-xs text-white">Any Phone</div>
              </div>
              <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <CheckCircleIcon class="h-5 w-5 text-green-400 mx-auto mb-1" />
                <div class="text-xs text-white">No Internet</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="absolute inset-0 hidden md:flex items-center">
          <div class="w-full px-6 lg:px-12">
            <div class="w-full">
              <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div class="text-white">
                  <div class="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-full text-red-300 text-sm font-medium mb-6">
                    <span class="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    Mobile Trading Platform
                  </div>
                  
                  <h1 class="text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 leading-tight">
                    Trade Anywhere with Our
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                      USSD App
                    </span>
                  </h1>
                  
                  <p class="text-base lg:text-xl text-slate-300 mb-8 max-w-lg">
                    Buy and sell commodities directly from your mobile phone using our simple USSD platform. No internet required - just dial *920*23# and start trading.
                  </p>
                  
                  <!-- CTA Buttons -->
                  <div class="flex flex-row gap-4 mb-12">
                    <RouterLink
                      to="/ussd-register"
                      class="relative z-50 inline-flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-bold py-4 px-8 rounded-xl text-base transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                      @click.stop
                    >
                      Register Now
                      <ChevronRightIcon class="ml-2 h-5 w-5" />
                    </RouterLink>
                    <RouterLink
                      to="/market-data"
                      class="inline-flex items-center justify-center border-2 border-white/30 hover:border-white/60 text-white font-semibold py-4 px-8 rounded-xl text-base transition-all"
                    >
                      View Market Data
                    </RouterLink>
                  </div>

                  <!-- Quick Info -->
                  <div class="flex items-center gap-6 text-sm">
                    <div class="flex items-center">
                      <PhoneIcon class="h-5 w-5 text-red-400 mr-2" />
                      <span class="text-slate-300">Dial *920*23#</span>
                    </div>
                    <div class="flex items-center">
                      <CheckCircleIcon class="h-5 w-5 text-green-400 mr-2" />
                      <span class="text-slate-300">No Internet Required</span>
                    </div>
                  </div>
                </div>

                <!-- Right Content - USSD Features (Desktop only) -->
                <div class="hidden lg:block relative z-50">
                  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div class="flex items-center justify-between mb-6">
                      <h3 class="text-white font-bold text-xl">USSD Features</h3>
                      <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div class="space-y-4">
                      <div class="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PhoneIcon class="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <div class="text-white font-semibold">Easy Registration</div>
                          <div class="text-slate-300 text-sm">Simple 5-step process via USSD</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingCartIcon class="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <div class="text-white font-semibold">Buy & Sell Commodities</div>
                          <div class="text-slate-300 text-sm">Trade maize, rice, soya, and more</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <LockClosedIcon class="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <div class="text-white font-semibold">Secure Transactions</div>
                          <div class="text-slate-300 text-sm">PIN-protected account & trades</div>
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircleIcon class="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <div class="text-white font-semibold">Works on Any Phone</div>
                          <div class="text-slate-300 text-sm">No smartphone or app needed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Controls -->
      <button
        @click.stop="prevSlide"
        class="absolute left-2 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all backdrop-blur-md z-50 cursor-pointer"
      >
        <ChevronLeftIcon class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </button>
      <button
        @click.stop="nextSlide"
        class="absolute right-2 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 sm:p-3 transition-all backdrop-blur-md z-50 cursor-pointer"
      >
        <ChevronRightIcon class="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </button>

      <!-- Slide Indicators -->
      <div class="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-50">
        <button
          v-for="(slide, index) in 3"
          :key="index"
          @click.stop="goToSlide(index)"
          class="rounded-full transition-all duration-200 cursor-pointer"
          :class="index === currentSlide ? 'bg-yellow-500 w-3 h-3 sm:w-4 sm:h-4' : 'bg-white/50 hover:bg-white/75 w-2 h-2 sm:w-3 sm:h-3'"
        ></button>
      </div>
    </div>

    <!-- News Ticker -->
    <NewsTicker />
  </section>
</template>
