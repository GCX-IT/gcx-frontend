<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'

const email = ref('')
const { t } = useI18n()
const isSubscribing = ref(false)

const subscribe = () => {
  if (email.value) {
    isSubscribing.value = true
    // Simulate API call
    setTimeout(() => {
      isSubscribing.value = false
      email.value = ''
      alert('Thank you for subscribing to GCX Blog!')
    }, 1000)
  }
}
</script>

<template>
  <section class="relative py-32 lg:py-40 overflow-hidden">
    <!-- Background with overlay -->
    <div class="absolute inset-0">
      <img src="/trading dashboard.jpg" alt="GCX Blog" class="w-full h-full object-cover" />
      <div class="absolute inset-0" :class="isDarkMode ? 'bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80' : 'bg-gradient-to-b from-black/60 via-black/50 to-black/60'"></div>
      <!-- Decorative gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-green-500/10"></div>
    </div>
    
    <!-- Content -->
    <div class="relative max-w-[1600px] mx-auto px-4 text-center z-10">
      <div class="max-w-4xl mx-auto">
        <!-- Badge -->
        <div class="mb-8 animate-fade-in">
          <div class="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 backdrop-blur-sm border" :class="isDarkMode ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-white/20 text-yellow-300 border-yellow-400/30'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span class="text-base font-semibold">Our Blog</span>
          </div>
        </div>
        
        <!-- Main Heading -->
        <div class="mb-12 animate-fade-in-delay">
          <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
            Stories and Insights
          </h1>
          <p class="text-xl lg:text-2xl max-w-3xl mx-auto mb-10 text-white/90 leading-relaxed">
            Subscribe to learn about new trading features, the latest in agricultural technology, market solutions, and industry updates.
          </p>
        </div>
        
        <!-- Enhanced Subscription Form -->
        <div class="max-w-2xl mx-auto animate-fade-in-delay-2">
          <div class="flex flex-col sm:flex-row gap-4 p-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
            <div class="flex-1">
              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                class="w-full px-6 py-4 text-lg rounded-xl border-2 transition-all duration-200 focus:ring-4 focus:ring-yellow-500/30 focus:border-yellow-500 bg-white/95 backdrop-blur-sm"
                :class="isDarkMode ? 'border-slate-300 text-slate-900 placeholder-slate-500' : 'border-slate-200 text-slate-900 placeholder-slate-500'"
              />
            </div>
            <button
              @click="subscribe"
              :disabled="isSubscribing || !email"
              class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:hover:scale-100"
            >
              {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
            </button>
          </div>
          
          <p class="text-sm mt-4 text-white/80">
            We care about your data in our 
            <a href="#" class="underline hover:text-yellow-400 transition-colors font-medium">privacy policy</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in 1s ease-out 0.4s both;
}
</style>
