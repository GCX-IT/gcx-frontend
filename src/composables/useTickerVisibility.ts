import { ref, onMounted, onUnmounted } from 'vue'

const isTickerVisible = ref(true)
const lastScrollY = ref(0)

// Handle scroll to show/hide ticker
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Show ticker when scrolling up or at the top
  if (currentScrollY < lastScrollY.value || currentScrollY < 100) {
    isTickerVisible.value = true
  } 
  // Hide ticker when scrolling down (but not at the very top)
  else if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isTickerVisible.value = false
  }
  
  lastScrollY.value = currentScrollY
}

// Initialize scroll listener
const initScrollListener = () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
}

// Remove scroll listener
const removeScrollListener = () => {
  window.removeEventListener('scroll', handleScroll)
}

export function useTickerVisibility() {
  onMounted(() => {
    initScrollListener()
  })

  onUnmounted(() => {
    removeScrollListener()
  })

  return {
    isTickerVisible
  }
}
