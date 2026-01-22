<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'

// Hardcoded partners for landing page
const displayPartners = [
  { name: 'Ghana EXIM Bank', logo: '/Partners/ghana-exim-bank.jpg' },
  { name: 'Standard Chartered', logo: '/Partners/standard-chartered.jpg' },
  { name: 'Ghana Export Promotion Authority', logo: '/Partners/ghana-export-promotion-authority-gepa.png' },
  { name: 'GIZ', logo: '/Donors/giz-logo.gif' },
  { name: 'AGRA', logo: '/Donors/agra.png' },
  { name: 'Ghana Grains Council', logo: '/Partners/ghana-grains-council-ggc.png' }
]

// Error handling for images
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/Partners/1-ukaid.jpg'
}
</script>

<template>
  <section class="py-12 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-gray-100'">
    <div class="max-w-6xl mx-auto px-6">

      <!-- Section Header -->
      <div class="text-center mb-8">
        <h2 class="text-2xl lg:text-3xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
          Our <span class="text-green-600">Trusted Partners</span>
        </h2>
        <p class="text-base" :class="isDarkMode ? 'text-slate-300' : 'text-gray-600'">
          Working together to transform Ghana's agricultural sector
        </p>
      </div>

      <!-- Partners Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div 
          v-for="partner in displayPartners" 
          :key="partner.name"
          class="flex items-center justify-center p-4 rounded-lg border transition-all duration-300 hover:shadow-lg hover:scale-105"
          :class="isDarkMode ? 'border-slate-600 hover:border-green-500 bg-slate-700' : 'border-gray-200 hover:border-green-500 bg-gray-50'"
        >
          <img 
            :src="partner.logo" 
            :alt="partner.name" 
            class="max-w-full max-h-10 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Call to Action Section -->
      <div class="text-center mt-12">
        <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
          <h3 class="text-2xl font-bold mb-4">Become Our Partner</h3>
          <p class="text-green-100 mb-6 max-w-2xl mx-auto">
            Join our network of trusted partners and help us build a stronger agricultural ecosystem in Ghana
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="() => $router.push('/about/partnership')"
              class="bg-white text-green-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              View All Partners
            </button>
            <button 
              @click="() => $router.push('/contact')"
              class="border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold py-3 px-8 rounded-xl transition-all"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hover effects for partner logos */
.partner-logo {
  transition: all 0.3s ease;
}

.partner-logo:hover {
  transform: scale(1.05);
}
</style>