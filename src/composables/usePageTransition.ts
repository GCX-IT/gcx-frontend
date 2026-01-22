import { ref, onBeforeRouteUpdate } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const isPageLoading = ref(false)

export const usePageTransition = () => {
  const startLoading = () => {
    isPageLoading.value = true
  }

  const stopLoading = () => {
    isPageLoading.value = false
  }

  const isLoading = () => {
    return isPageLoading.value
  }

  return {
    startLoading,
    stopLoading,
    isLoading
  }
}

export { isPageLoading }
