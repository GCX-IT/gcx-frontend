<template>
  <Transition name="loading" appear>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div class="flex flex-col items-center justify-center space-y-6">
        <!-- Logo with scale animation -->
        <div 
          class="logo-container"
        >
          <img 
            :src="logoPath" 
            alt="GCX Logo" 
            class="h-24 w-24 object-contain drop-shadow-lg"
          />
        </div>
        
        <!-- Loading Animation Dots -->
        <div class="flex space-x-3 items-center">
          <div 
            v-for="(dot, index) in dots" 
            :key="index"
            class="loading-dot"
            :style="{ animationDelay: `${index * 150}ms` }"
          ></div>
        </div>
        
        <!-- Loading Text -->
        <p class="loading-text">
          Loading...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode } from '../composables/useDarkMode'

const { isDarkMode } = useDarkMode()
const dots = [0, 1, 2]

// Use different logos for light and dark mode
const logoPath = computed(() => {
  // For now, using the black logo for both - you can add a white logo later
  return '/logo_black.png'
})
</script>

<style scoped>
/* Loading transition */
.loading-enter-active {
  transition: opacity 0.5s ease;
}

.loading-enter-from {
  opacity: 0;
}

/* Logo container animation */
.logo-container {
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* Loading dot animation */
.loading-dot {
  width: 10px;
  height: 10px;
  background-color: rgb(249, 115, 22);
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite;
}

.dark .loading-dot {
  background-color: rgb(251, 146, 60);
}

@keyframes dotBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-12px);
    opacity: 1;
  }
}

/* Loading text animation */
.loading-text {
  color: rgb(75, 85, 99);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  animation: textFade 2s ease-in-out infinite;
}

.dark .loading-text {
  color: rgb(156, 163, 175);
}

@keyframes textFade {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}
</style>
