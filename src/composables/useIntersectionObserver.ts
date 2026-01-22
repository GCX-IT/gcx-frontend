import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const isIntersecting = ref(false)
  const hasIntersected = ref(false)
  
  const element = ref<HTMLElement | null>(null)
  
  let observer: IntersectionObserver | null = null
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }
  
  const createObserver = () => {
    if (element.value) {
      // Clean up previous observer
      if (observer) {
        observer.disconnect()
      }
      
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting.value = entry.isIntersecting
        
        // Track if element has ever been visible
        if (entry.isIntersecting && !hasIntersected.value) {
          hasIntersected.value = true
        }
      }, defaultOptions)
      
      observer.observe(element.value)
    }
  }
  
  // Watch for element changes
  watch(element, () => {
    nextTick(() => {
      createObserver()
    })
  })
  
  onMounted(() => {
    nextTick(() => {
      if (element.value) {
        // Check if element is already visible on mount
        const rect = element.value.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isVisible && !hasIntersected.value) {
          hasIntersected.value = true
        }
      }
      createObserver()
    })
  })
  
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
  
  return {
    element,
    isIntersecting,
    hasIntersected
  }
}
