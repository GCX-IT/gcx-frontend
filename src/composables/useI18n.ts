import { computed } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, switchLocale, getCurrentLocaleInfo, isCurrentLocaleRTL } from '../plugins/i18n'

export function useI18n() {
  const { t, locale, availableLocales } = useVueI18n()

  // Get current locale information
  const currentLocale = computed(() => getCurrentLocaleInfo())
  
  // Check if current locale is RTL
  const isRTL = computed(() => isCurrentLocaleRTL())
  
  // Get all available locales
  const availableLanguages = computed(() => SUPPORTED_LOCALES)
  
  // Get other locales (excluding current)
  const otherLocales = computed(() => 
    SUPPORTED_LOCALES.filter(loc => loc.code !== locale.value)
  )

  // Switch language function
  const changeLanguage = (localeCode: string) => {
    switchLocale(localeCode)
  }

  // Translation function with fallback
  const translate = (key: string, params?: Record<string, any>) => {
    return t(key, params)
  }

  // Check if translation exists
  const hasTranslation = (key: string): boolean => {
    return t(key) !== key
  }

  // Get translation with fallback
  const translateWithFallback = (key: string, fallback: string, params?: Record<string, any>) => {
    const translation = t(key, params)
    return translation !== key ? translation : fallback
  }

  return {
    // Core i18n functions
    t: translate,
    locale,
    availableLocales,
    
    // Locale information
    currentLocale,
    isRTL,
    availableLanguages,
    otherLocales,
    
    // Language switching
    changeLanguage,
    
    // Utility functions
    hasTranslation,
    translateWithFallback
  }
}

// Export types for TypeScript support
export type SupportedLocale = typeof SUPPORTED_LOCALES[0]
export type LocaleCode = SupportedLocale['code']
