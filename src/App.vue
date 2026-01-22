<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { initializeDarkMode } from './utils/darkMode'
import Navbar from './components/Navbar.vue'
import TradingViewTicker from './components/Landing/TradingViewTicker.vue'
import LoadingPage from './components/LoadingPage.vue'

import { RouterView } from 'vue-router'

const route = useRoute()
const isLoading = ref(true)

// Hide navbar and ticker for CMS and auth pages
const hideNavbar = computed(() => {
  const hideOnRoutes = ['/login', '/cms']
  const hideOnRoutePrefixes = ['/cms/']
  
  // Check exact routes
  if (hideOnRoutes.includes(route.path)) {
    return true
  }
  
  // Check route prefixes
  if (hideOnRoutePrefixes.some(prefix => route.path.startsWith(prefix))) {
    return true
  }
  
  return false
})

// Hide ticker for CMS, auth pages, and other protected routes
const hideTicker = computed(() => {
  const hideOnRoutes = ['/login', '/cms']
  const hideOnRoutePrefixes = ['/admin', '/dashboard', '/api', '/cms']
  
  // Check exact routes
  if (hideOnRoutes.includes(route.path)) {
    return true
  }
  
  // Check route prefixes
  if (hideOnRoutePrefixes.some(prefix => route.path.startsWith(prefix))) {
    return true
  }
  
  return false
})

onMounted(() => {
  initializeDarkMode()
  
  // Simulate loading time - you can adjust this
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div id="app" class="min-h-screen transition-colors duration-300">
    <!-- Initial Loading Page -->
    <LoadingPage v-if="isLoading" />
    
    <!-- Main Application - Only show after loading -->
    <div v-if="!isLoading" class="animate-fade-in">
      <!-- TradingView Ticker - Only show on main website pages -->
      <TradingViewTicker v-if="!hideTicker" />
      
      <!-- Only show Navbar for main website pages -->
      <Navbar v-if="!hideNavbar" />
      
      <!-- Main content area with page transition -->
      <main class="page-container">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in" appear>
            <div :key="route.path">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Page fade-in animation for initial load */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-container {
  min-height: calc(100vh - 64px);
}
</style>
