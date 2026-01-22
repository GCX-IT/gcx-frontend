import { ref, computed, watch } from 'vue'
import { useI18n } from './useI18n'
import { SUPPORTED_LOCALES } from '../plugins/i18n'

// Global locale state
const globalLocale = ref<string>('en')

export function useLocale() {
  const { locale, changeLanguage, currentLocale, isRTL } = useI18n()

  // Watch for locale changes and update global state
  watch(locale, (newLocale) => {
    globalLocale.value = newLocale
  }, { immediate: true })

  // Get locale from browser
  const getBrowserLocale = (): string => {
    const browserLang = navigator.language.split('-')[0]
    return SUPPORTED_LOCALES.find(locale => locale.code === browserLang)?.code || 'en'
  }

  // Get locale from localStorage
  const getStoredLocale = (): string | null => {
    return localStorage.getItem('gcx-locale')
  }

  // Save locale to localStorage
  const saveLocale = (localeCode: string) => {
    localStorage.setItem('gcx-locale', localeCode)
  }

  // Initialize locale from various sources
  const initializeLocale = (): string => {
    // Priority: stored > browser > default
    const stored = getStoredLocale()
    if (stored && SUPPORTED_LOCALES.find(locale => locale.code === stored)) {
      return stored
    }

    const browser = getBrowserLocale()
    if (browser && SUPPORTED_LOCALES.find(locale => locale.code === browser)) {
      return browser
    }

    return 'en' // Default fallback
  }

  // Set locale with persistence
  const setLocale = (localeCode: string) => {
    if (SUPPORTED_LOCALES.find(locale => locale.code === localeCode)) {
      changeLanguage(localeCode)
      saveLocale(localeCode)
    }
  }

  // Get locale display name
  const getLocaleDisplayName = (localeCode: string): string => {
    const localeInfo = SUPPORTED_LOCALES.find(locale => locale.code === localeCode)
    return localeInfo?.nativeName || localeCode
  }

  // Get locale flag
  const getLocaleFlag = (localeCode: string): string => {
    const localeInfo = SUPPORTED_LOCALES.find(locale => locale.code === localeCode)
    return localeInfo?.flag || '🌐'
  }

  // Check if locale is RTL
  const isLocaleRTL = (localeCode: string): boolean => {
    const localeInfo = SUPPORTED_LOCALES.find(locale => locale.code === localeCode)
    return localeInfo?.isRTL || false
  }

  // Get all available locales with metadata
  const getAvailableLocales = () => {
    return SUPPORTED_LOCALES.map(locale => ({
      ...locale,
      isCurrent: locale.code === globalLocale.value,
      isRTL: locale.isRTL
    }))
  }

  // Format number according to locale
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(globalLocale.value, options).format(value)
  }

  // Format currency according to locale
  const formatCurrency = (value: number, currency: string = 'GHC'): string => {
    return new Intl.NumberFormat(globalLocale.value, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value)
  }

  // Format date according to locale
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return new Intl.DateTimeFormat(globalLocale.value, options).format(date)
  }

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const rtf = new Intl.RelativeTimeFormat(globalLocale.value, { numeric: 'auto' })
    const diffInSeconds = (date.getTime() - Date.now()) / 1000
    
    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(Math.round(diffInSeconds), 'second')
    } else if (Math.abs(diffInSeconds) < 3600) {
      return rtf.format(Math.round(diffInSeconds / 60), 'minute')
    } else if (Math.abs(diffInSeconds) < 86400) {
      return rtf.format(Math.round(diffInSeconds / 3600), 'hour')
    } else {
      return rtf.format(Math.round(diffInSeconds / 86400), 'day')
    }
  }

  return {
    // Current locale state
    locale: globalLocale,
    currentLocale,
    isRTL,
    
    // Locale management
    setLocale,
    initializeLocale,
    getAvailableLocales,
    
    // Locale information
    getLocaleDisplayName,
    getLocaleFlag,
    isLocaleRTL,
    
    // Formatting functions
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    
    // Utility functions
    getBrowserLocale,
    getStoredLocale,
    saveLocale
  }
}
