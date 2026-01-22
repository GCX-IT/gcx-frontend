<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../../utils/darkMode'

const router = useRouter()
const currentIndex = ref(0)

const commodities = [
  {
    id: 'maize',
    name: 'Maize',
    image: '/commodities/miaze.jpg',
    description: 'White & Yellow Maize',
    contractCode: 'GAPWM2',
    price: 'GH₵1,880',
    change: '+1.62%',
    isPositive: true
  },
  {
    id: 'rice',
    name: 'Rice',
    image: '/commodities/rice.jpg',
    description: 'Premium Rice',
    contractCode: 'GAPRM2',
    price: 'GH₵2,450',
    change: '+0.85%',
    isPositive: true
  },
  {
    id: 'sesame',
    name: 'Sesame',
    image: '/commodities/seasame.jpg',
    description: 'White Sesame',
    contractCode: 'GKUWM2',
    price: 'GH₵4,645',
    change: '+0.98%',
    isPositive: true
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    image: '/commodities/sorghon.jpg',
    description: 'Red Sorghum',
    contractCode: 'GSAWM2',
    price: 'GH₵4,745',
    change: '+0.53%',
    isPositive: true
  },
  {
    id: 'soya',
    name: 'Soya Bean',
    image: '/commodities/soya.jpg',
    description: 'Premium Soya Bean',
    contractCode: 'GEJWM2',
    price: 'GH₵4,030',
    change: '+1.26%',
    isPositive: true
  }
]

const visibleCommodities = computed(() => {
  const start = currentIndex.value
  const end = Math.min(start + 4, commodities.length)
  return commodities.slice(start, end)
})

const canGoNext = computed(() => currentIndex.value < commodities.length - 4)
const canGoPrev = computed(() => currentIndex.value > 0)

const nextSlide = () => {
  if (canGoNext.value) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (canGoPrev.value) {
    currentIndex.value--
  }
}

const goToCommodity = (commodityId: string) => {
  router.push(`/commodities#${commodityId}`)
}
</script>

<template>
  <section class="py-20 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-100'">
    <div class="w-full px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4 text-green-600">
          Our Commodities
        </h2>
        <p class="text-xl max-w-3xl mx-auto transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Trade in Ghana's most important agricultural commodities with transparent pricing and secure transactions
        </p>
      </div>

      <!-- Carousel Container -->
      <div class="relative">
        <!-- Navigation Arrows -->
        <button
          @click="prevSlide"
          :disabled="!canGoPrev"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDarkMode 
            ? 'bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-800' 
            : 'bg-white text-slate-600 hover:bg-slate-50 disabled:bg-gray-100'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          @click="nextSlide"
          :disabled="!canGoNext"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDarkMode 
            ? 'bg-slate-700 text-white hover:bg-slate-600 disabled:bg-slate-800' 
            : 'bg-white text-slate-600 hover:bg-slate-50 disabled:bg-gray-100'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Commodities Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8">
          <div
            v-for="commodity in visibleCommodities"
            :key="commodity.id"
            @click="goToCommodity(commodity.id)"
            class="group cursor-pointer transition-all duration-500 transform hover:scale-102"
          >
            <!-- Commodity Card -->
            <div class="relative shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:bg-white"
                 :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-100'">
              
              <!-- Image Container with Frame -->
              <div class="p-6">
                <div class="relative h-56 overflow-hidden">
                  <img
                    :src="commodity.image"
                    :alt="commodity.name"
                    class="w-full h-full object-cover transition-all duration-700 group-hover:scale-102 filter grayscale group-hover:grayscale-0"
                  />
                </div>
                
                <!-- Commodity Name and Symbol (Below Image) -->
                <div class="mt-4 text-center">
                  <div :class="isDarkMode ? 'text-white' : 'text-black'">
                    <div class="text-xl font-bold mb-1">{{ commodity.name }}</div>
                    <div class="text-sm font-mono" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">{{ commodity.contractCode.replace(/\d/g, '') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dots Indicator -->
        <div class="flex justify-center mt-8 space-x-2">
          <button
            v-for="(_, index) in Math.ceil(commodities.length / 4)"
            :key="index"
            @click="currentIndex = index"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="index === Math.floor(currentIndex / 4) 
              ? (isDarkMode ? 'bg-green-500' : 'bg-green-600')
              : (isDarkMode ? 'bg-slate-600' : 'bg-slate-300')"
          ></button>
        </div>
      </div>

      <!-- View All Commodities Button -->
      <div class="text-center mt-12">
        <button
          @click="router.push('/commodities')"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"
          :class="isDarkMode 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-green-500 text-white hover:bg-green-600'"
        >
          View All Commodities
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions for all interactive elements */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Ensure proper image scaling */
.group img {
  transition: transform 0.7s ease-in-out;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #10b981;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #059669;
}
</style>
