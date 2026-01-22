<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'

const currentSlide = ref(0)
const autoplayInterval = ref<NodeJS.Timeout | null>(null)

const slides = [
  {
    id: 1,
    title: 'Right to Information Act, 2019',
    subtitle: 'Transparency & Accountability',
    description: 'Access information transparently in accordance with Ghana\'s Right to Information Act, 2019 (Act 989)',
    image: '/Picture3.png',
    bgColor: 'from-green-900/80 via-slate-800/70 to-yellow-900/90'
  },
  {
    id: 2,
    title: 'Constitutional Right',
    subtitle: 'Article 21 (1) (f)',
    description: 'All persons shall have the right to information, subject to such qualifications and laws as are necessary in a democratic society.',
    image: '/Picture3.png',
    bgColor: 'from-yellow-900/80 via-slate-800/70 to-red-900/90'
  },
  {
    id: 3,
    title: 'GCX RTI Unit',
    subtitle: 'Professional Service',
    description: 'Spearheaded by the Communications and Corporate Affairs Department with trained RTI officers.',
    image: '/Picture3.png',
    bgColor: 'from-red-900/80 via-slate-800/70 to-green-900/90'
  }
]

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoplay = () => {
  autoplayInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
    autoplayInterval.value = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="relative py-20 lg:py-32 overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img 
        :src="slides[currentSlide].image" 
        :alt="slides[currentSlide].title" 
        class="w-full h-full object-cover transition-all duration-1000" 
      />
      <div 
        class="absolute inset-0 bg-gradient-to-br transition-all duration-1000"
        :class="slides[currentSlide].bgColor"
      ></div>
    </div>
    
    <!-- RTI Logo -->
    <div class="absolute top-8 left-8 z-10">
      <img 
        :src="'/rtic-logo.png'" 
        alt="RTI Logo" 
        class="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
    
    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 text-center">
      <!-- Slide Indicator -->
      <div class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 border border-white/20">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Right to Information Portal
      </div>
      
      <!-- Slide Content -->
      <div class="min-h-[400px] flex items-center justify-center">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight animate-fade-in">
            {{ slides[currentSlide].title }}
          </h1>
          <h2 class="text-2xl lg:text-3xl font-semibold mb-6 text-white/90 animate-fade-in-delay-1">
            {{ slides[currentSlide].subtitle }}
          </h2>
          <p class="text-xl lg:text-2xl max-w-4xl mx-auto text-white/80 mb-12 leading-relaxed animate-fade-in-delay-2">
            {{ slides[currentSlide].description }}
          </p>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-delay-3">
        <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div class="text-3xl font-bold text-white mb-2">2019</div>
          <div class="text-white/70 text-sm">RTI Act Enacted</div>
        </div>
        <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div class="text-3xl font-bold text-white mb-2">24/7</div>
          <div class="text-white/70 text-sm">Online Access</div>
        </div>
        <div class="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
          <div class="text-3xl font-bold text-white mb-2">100%</div>
          <div class="text-white/70 text-sm">Transparency</div>
        </div>
      </div>
    </div>
    
    <!-- Navigation Arrows -->
    <button 
      @click="prevSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <button 
      @click="nextSlide"
      @mouseenter="stopAutoplay"
      @mouseleave="startAutoplay"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 backdrop-blur-sm"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
    
    <!-- Slide Indicators -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(slide, index) in slides"
        :key="slide.id"
        @click="goToSlide(index)"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/75'"
      ></button>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delay-1 {
  animation: fade-in 0.8s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fade-in 0.8s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
  animation: fade-in 0.8s ease-out 0.6s both;
}
</style>
