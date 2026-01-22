import { computed } from 'vue'
import { isDarkMode as globalDarkMode } from '../utils/darkMode'

export const useDarkMode = () => {
  const isDarkMode = computed(() => globalDarkMode.value)
  
  return {
    isDarkMode
  }
}
