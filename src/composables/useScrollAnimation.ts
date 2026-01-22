import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'

export type AnimationType = 
  | 'fade-in' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'scale-up' 
  | 'rotate' 
  | 'blur-in'
  | 'flip-in'

export interface ScrollAnimationOptions extends IntersectionObserverInit {
  animationType?: AnimationType
  duration?: number // in ms
  delay?: number // in ms
  easing?: 'ease-out' | 'ease-in' | 'ease-in-out' | 'linear'
  once?: boolean // whether to animate only once
}

/**
 * Composable for scroll-triggered animations using Intersection Observer
 * 
 * Usage:
 * ```vue
 * <script setup>
 * const { element, isAnimating, animationClasses } = useScrollAnimation({
 *   animationType: 'slide-up',
 *   duration: 700,
 *   delay: 0,
 *   threshold: 0.2
 * })
 * </script>
 * 
 * <template>
 *   <div :ref="element" :class="animationClasses">
 *     Content that animates on scroll
 *   </div>
 * </template>
 * ```
 */
export function useScrollAnimation(options?: ScrollAnimationOptions) {
  const isIntersecting = ref(false)
  const hasIntersected = ref(false)
  const element = ref<HTMLElement | null>(null)
  
  const animationType = ref<AnimationType>(options?.animationType || 'fade-in')
  const duration = ref(options?.duration || 700)
  const delay = ref(options?.delay || 0)
  const easing = ref(options?.easing || 'ease-out')
  const once = ref(options?.once !== false) // default to true
  
  let observer: IntersectionObserver | null = null
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }

  /**
   * Get animation class based on animation type
   */
  const getAnimationClass = (isVisible: boolean): string => {
    const baseClasses = 'transition-all'
    const durationClass = `duration-${duration.value}`
    const easingClass = `ease-${easing.value === 'ease-in-out' ? 'in-out' : easing.value}`
    
    let animationClasses = ''
    
    if (isVisible || hasIntersected.value) {
      // Visible state
      switch (animationType.value) {
        case 'fade-in':
          animationClasses = 'opacity-100'
          break
        case 'slide-up':
          animationClasses = 'opacity-100 translate-y-0'
          break
        case 'slide-down':
          animationClasses = 'opacity-100 -translate-y-0'
          break
        case 'slide-left':
          animationClasses = 'opacity-100 translate-x-0'
          break
        case 'slide-right':
          animationClasses = 'opacity-100 -translate-x-0'
          break
        case 'scale-up':
          animationClasses = 'opacity-100 scale-100'
          break
        case 'rotate':
          animationClasses = 'opacity-100 rotate-0'
          break
        case 'blur-in':
          animationClasses = 'opacity-100 blur-none'
          break
        case 'flip-in':
          animationClasses = 'opacity-100'
          break
      }
    } else {
      // Hidden state (before intersection)
      switch (animationType.value) {
        case 'fade-in':
          animationClasses = 'opacity-0'
          break
        case 'slide-up':
          animationClasses = 'opacity-0 translate-y-4'
          break
        case 'slide-down':
          animationClasses = 'opacity-0 -translate-y-4'
          break
        case 'slide-left':
          animationClasses = 'opacity-0 -translate-x-4'
          break
        case 'slide-right':
          animationClasses = 'opacity-0 translate-x-4'
          break
        case 'scale-up':
          animationClasses = 'opacity-0 scale-90'
          break
        case 'rotate':
          animationClasses = 'opacity-0 -rotate-12'
          break
        case 'blur-in':
          animationClasses = 'opacity-0 blur-md'
          break
        case 'flip-in':
          animationClasses = 'opacity-0 scale-y-0'
          break
      }
    }
    
    return `${baseClasses} ${durationClass} ${easingClass} ${animationClasses}`
  }

  /**
   * Get initial (hidden) state classes
   */
  const getInitialClasses = (): string => {
    const baseClasses = 'transition-all'
    const durationClass = `duration-${duration.value}`
    const easingClass = `ease-${easing.value === 'ease-in-out' ? 'in-out' : easing.value}`
    
    let initialClasses = ''
    
    switch (animationType.value) {
      case 'fade-in':
        initialClasses = 'opacity-0'
        break
      case 'slide-up':
        initialClasses = 'opacity-0 translate-y-4'
        break
      case 'slide-down':
        initialClasses = 'opacity-0 -translate-y-4'
        break
      case 'slide-left':
        initialClasses = 'opacity-0 -translate-x-4'
        break
      case 'slide-right':
        initialClasses = 'opacity-0 translate-x-4'
        break
      case 'scale-up':
        initialClasses = 'opacity-0 scale-90'
        break
      case 'rotate':
        initialClasses = 'opacity-0 -rotate-12'
        break
      case 'blur-in':
        initialClasses = 'opacity-0 blur-md'
        break
      case 'flip-in':
        initialClasses = 'opacity-0 scale-y-0'
        break
    }
    
    return `${baseClasses} ${durationClass} ${easingClass} ${initialClasses}`
  }

  /**
   * Computed animation classes
   */
  const animationClasses = computed(() => {
    return getAnimationClass(isIntersecting.value)
  })

  /**
   * Computed initial classes (for v-bind)
   */
  const initialClasses = computed(() => {
    return getInitialClasses()
  })

  /**
   * Create intersection observer
   */
  const createObserver = () => {
    if (element.value) {
      if (observer) {
        observer.disconnect()
      }
      
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting.value = entry.isIntersecting
        
        if (entry.isIntersecting) {
          if (!hasIntersected.value) {
            hasIntersected.value = true
          }
          // Keep intersecting true while in view
          isIntersecting.value = true
        } else {
          // If 'once' is false, allow re-triggering when leaving view
          if (!once.value) {
            hasIntersected.value = false
          }
          isIntersecting.value = false
        }
      }, defaultOptions)
      
      observer.observe(element.value)
    }
  }

  /**
   * Watch for element changes
   */
  watch(element, () => {
    nextTick(() => {
      createObserver()
    })
  })

  /**
   * Initialize observer on mount
   */
  onMounted(() => {
    nextTick(() => {
      if (element.value) {
        // Check if element is already visible on mount
        const rect = element.value.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isVisible) {
          hasIntersected.value = true
          isIntersecting.value = true
        }
        
        createObserver()
      }
    })
  })

  /**
   * Cleanup observer on unmount
   */
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    element,
    isIntersecting,
    hasIntersected,
    animationClasses,
    initialClasses,
    isAnimating: computed(() => isIntersecting.value)
  }
}

/**
 * Stagger animation for lists/groups
 * 
 * Usage:
 * ```vue
 * <script setup>
 * const staggerItems = useStaggerAnimation(3, { duration: 600, baseDelay: 100 })
 * </script>
 * 
 * <template>
 *   <div :ref="staggerItems.container">
 *     <div 
 *       v-for="(item, i) in items" 
 *       :key="i"
 *       :class="staggerItems.getItemClasses(i)"
 *     >
 *       {{ item }}
 *     </div>
 *   </div>
 * </template>
 * ```
 */
export interface StaggerOptions extends ScrollAnimationOptions {
  baseDelay?: number // base delay in ms
  itemDelay?: number // delay between items in ms
}

export function useStaggerAnimation(itemCount: number, options?: StaggerOptions) {
  const container = ref<HTMLElement | null>(null)
  const isIntersecting = ref(false)
  const hasIntersected = ref(false)
  
  const duration = ref(options?.duration || 700)
  const baseDelay = ref(options?.baseDelay || 0)
  const itemDelay = ref(options?.itemDelay || 150)
  const easing = ref(options?.easing || 'ease-out')
  const animationType = ref<AnimationType>(options?.animationType || 'slide-up')
  
  let observer: IntersectionObserver | null = null
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }

  /**
   * Get item animation classes with stagger
   */
  const getItemClasses = (index: number): string => {
    const baseClasses = 'transition-all'
    const durationClass = `duration-${duration.value}`
    const easingClass = `ease-${easing.value === 'ease-in-out' ? 'in-out' : easing.value}`
    const delay = baseDelay.value + index * itemDelay.value
    const delayClass = `delay-[${delay}ms]`
    
    let animationClasses = ''
    
    if (isIntersecting.value || hasIntersected.value) {
      switch (animationType.value) {
        case 'fade-in':
          animationClasses = 'opacity-100'
          break
        case 'slide-up':
          animationClasses = 'opacity-100 translate-y-0'
          break
        case 'slide-left':
          animationClasses = 'opacity-100 translate-x-0'
          break
        case 'scale-up':
          animationClasses = 'opacity-100 scale-100'
          break
        default:
          animationClasses = 'opacity-100'
      }
    } else {
      switch (animationType.value) {
        case 'fade-in':
          animationClasses = 'opacity-0'
          break
        case 'slide-up':
          animationClasses = 'opacity-0 translate-y-4'
          break
        case 'slide-left':
          animationClasses = 'opacity-0 -translate-x-4'
          break
        case 'scale-up':
          animationClasses = 'opacity-0 scale-90'
          break
        default:
          animationClasses = 'opacity-0'
      }
    }
    
    return `${baseClasses} ${durationClass} ${easingClass} ${animationClasses}`
  }

  /**
   * Create intersection observer
   */
  const createObserver = () => {
    if (container.value) {
      if (observer) {
        observer.disconnect()
      }
      
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting.value = entry.isIntersecting
        
        if (entry.isIntersecting && !hasIntersected.value) {
          hasIntersected.value = true
        }
      }, defaultOptions)
      
      observer.observe(container.value)
    }
  }

  /**
   * Watch for container changes
   */
  watch(container, () => {
    nextTick(() => {
      createObserver()
    })
  })

  /**
   * Initialize on mount
   */
  onMounted(() => {
    nextTick(() => {
      if (container.value) {
        const rect = container.value.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (isVisible) {
          hasIntersected.value = true
          isIntersecting.value = true
        }
        
        createObserver()
      }
    })
  })

  /**
   * Cleanup
   */
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    container,
    isIntersecting,
    hasIntersected,
    getItemClasses
  }
}