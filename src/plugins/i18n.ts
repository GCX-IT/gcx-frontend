import { createI18n } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'

// Import translation files
import enCommon from '../locales/en/common.json'
import enNavigation from '../locales/en/navigation.json'
import enPages from '../locales/en/pages.json'
import enForms from '../locales/en/forms.json'
import enErrors from '../locales/en/errors.json'

import esCommon from '../locales/es/common.json'
import esNavigation from '../locales/es/navigation.json'
import esPages from '../locales/es/pages.json'

import frCommon from '../locales/fr/common.json'

// Define the default locale
const DEFAULT_LOCALE = 'en'

// Define supported locales
export const SUPPORTED_LOCALES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isRTL: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isRTL: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true }
]

// Define messages for each locale
const messages: Record<string, any> = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    pages: enPages,
    forms: enForms,
    errors: enErrors
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    pages: esPages,
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  },
  fr: {
    common: frCommon,
    navigation: enNavigation, // Fallback to English for now
    pages: enPages, // Fallback to English for now
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  },
  pt: {
    common: enCommon, // Fallback to English for now
    navigation: enNavigation, // Fallback to English for now
    pages: enPages, // Fallback to English for now
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  },
  de: {
    common: enCommon, // Fallback to English for now
    navigation: enNavigation, // Fallback to English for now
    pages: enPages, // Fallback to English for now
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  },
  zh: {
    common: enCommon, // Fallback to English for now
    navigation: enNavigation, // Fallback to English for now
    pages: enPages, // Fallback to English for now
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  },
  ar: {
    common: enCommon, // Fallback to English for now
    navigation: enNavigation, // Fallback to English for now
    pages: enPages, // Fallback to English for now
    forms: enForms, // Fallback to English for now
    errors: enErrors // Fallback to English for now
  }
}

// Get initial locale from localStorage or browser language
function getInitialLocale(): string {
  // Check localStorage first
  const savedLocale = localStorage.getItem('gcx-locale')
  if (savedLocale && SUPPORTED_LOCALES.find(locale => locale.code === savedLocale)) {
    return savedLocale
  }

  // Check browser language
  const browserLocale = navigator.language.split('-')[0]
  if (SUPPORTED_LOCALES.find(locale => locale.code === browserLocale)) {
    return browserLocale
  }

  // Default to English
  return DEFAULT_LOCALE
}

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true
})

// Export the i18n instance
export default i18n

// Helper function to get current locale info
export function getCurrentLocaleInfo() {
  const currentLocale = i18n.global.locale.value
  return SUPPORTED_LOCALES.find(locale => locale.code === currentLocale) || SUPPORTED_LOCALES[0]
}

// Helper function to check if current locale is RTL
export function isCurrentLocaleRTL(): boolean {
  return getCurrentLocaleInfo().isRTL
}

// Helper function to switch locale
export function switchLocale(localeCode: string) {
  if (SUPPORTED_LOCALES.find(locale => locale.code === localeCode)) {
    i18n.global.locale.value = localeCode
    localStorage.setItem('gcx-locale', localeCode)
    
    // Update document direction for RTL languages
    const localeInfo = SUPPORTED_LOCALES.find(locale => locale.code === localeCode)
    if (localeInfo) {
      document.documentElement.dir = localeInfo.isRTL ? 'rtl' : 'ltr'
      document.documentElement.lang = localeCode
    }
  }
}

// Initialize document direction and language
const currentLocaleInfo = getCurrentLocaleInfo()
document.documentElement.dir = currentLocaleInfo.isRTL ? 'rtl' : 'ltr'
document.documentElement.lang = currentLocaleInfo.code