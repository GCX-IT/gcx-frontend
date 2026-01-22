<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isDarkMode } from '../../utils/darkMode'

const router = useRouter()

const navigateToServices = () => {
  router.push('/services')
}

const services = [
  {
    title: "Trade Facilitation",
    description: "Streamlined trading processes with secure settlement and transparent pricing"
  },
  {
    title: "Price Discovery",
    description: "Real-time market data and analytics for informed decision making"
  },
  {
    title: "Storage Solutions",
    description: "Professional warehouse management with quality assurance and inventory tracking"
  },
  {
    title: "Quality Control",
    description: "Comprehensive quality standards and certification for all commodities"
  }
]

const toggleService = (index: number) => {
  // Add dropdown functionality here if needed
  console.log(`Service ${index} clicked`)
}
</script>

<template>
  <section class="py-10 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
    <div class="w-full px-18">
      <div class="grid lg:grid-cols-2 gap-6 items-center">
        <!-- Left Side - Content -->
        <div class="space-y-5 max-w-lg">
          <!-- Header -->
          <div class="space-y-2">
            <div class="text-sm font-bold tracking-wide transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
              OUR APPROACH
            </div>
            <h2 class="text-5xl font-bold leading-tight transition-colors duration-300">
              <span :class="isDarkMode ? 'text-white' : 'text-slate-900'">What We</span>
              <span class="text-green-600 ml-2">Do</span>
            </h2>
            <p class="text-lg leading-relaxed transition-colors duration-300 font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Ghana Commodity Exchange provides comprehensive trading solutions for agricultural commodities            </p>
          </div>

          <!-- Services List -->
          <div class="space-y-2">
            <div 
              v-for="(service, index) in services" 
              :key="service.title"
            >
              <div class="rounded-lg p-3 border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <h3 class="text-lg font-bold mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ service.title }}</h3>
                    <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">{{ service.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="pt-2">
            <button 
              @click="navigateToServices"
              class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-base"
            >
              Learn More →
            </button>
          </div>
        </div>

        <!-- Right Side - Image -->
        <div class="relative">
          <div class="rounded-l-2xl overflow-hidden shadow-2xl">
            <img 
              src="/crop.jpg" 
              alt="Agricultural Trading Services" 
              class="w-full h-[500px] object-cover"
            />
          </div>
          
          <!-- Floating Stats Card -->
          <div class="absolute -bottom-4 -left-4 rounded-lg p-4 shadow-xl border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-100'">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 mb-1">6</div>
              <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">Active Commodities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
