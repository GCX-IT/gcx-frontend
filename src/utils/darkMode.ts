import { ref, watch } from 'vue'

// Create a reactive dark mode state
const isDarkMode = ref(false)
const userHasManuallyChanged = ref(false)

// Check system theme preference
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

// Initialize dark mode with system preference
const initializeDarkMode = () => {
  if (typeof window !== 'undefined') {
    // Check if user has manually changed theme before
    const savedTheme = localStorage.getItem('darkMode')
    const userHasChanged = localStorage.getItem('userHasManuallyChanged') === 'true'
    
    if (userHasChanged && savedTheme) {
      // User has manually changed before, use their saved preference
      isDarkMode.value = savedTheme === 'true'
      userHasManuallyChanged.value = true
    } else {
      // First time or no manual change, use system preference
      const systemPrefersDark = getSystemTheme()
      isDarkMode.value = systemPrefersDark
      userHasManuallyChanged.value = false
      localStorage.setItem('darkMode', systemPrefersDark.toString())
    }
    
    applyDarkMode()
    setupSystemThemeListener()
  }
}

// Apply dark mode to document
const applyDarkMode = () => {
  if (typeof document !== 'undefined') {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

// Toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  userHasManuallyChanged.value = true
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    localStorage.setItem('userHasManuallyChanged', 'true')
  }
  applyDarkMode()
}

// Setup listener for system theme changes
const setupSystemThemeListener = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually changed theme
      if (!userHasManuallyChanged.value) {
        isDarkMode.value = e.matches
        localStorage.setItem('darkMode', e.matches.toString())
        applyDarkMode()
      }
    }
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
}

// Watch for changes and apply them
watch(isDarkMode, () => {
  applyDarkMode()
})

// Initialize on module load
initializeDarkMode()

export { isDarkMode, toggleDarkMode, initializeDarkMode } 