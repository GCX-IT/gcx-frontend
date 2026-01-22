<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '../composables/useI18n'
import { useLocale } from '../composables/useLocale'
import { isDarkMode } from '../utils/darkMode'

const { currentLocale, availableLanguages, changeLanguage } = useI18n()
const { setLocale, getLocaleDisplayName, getLocaleFlag } = useLocale()

const isOpen = ref(false)

// Toggle dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// Close dropdown
const closeDropdown = () => {
  isOpen.value = false
}

// Handle language change
const handleLanguageChange = (localeCode: string) => {
  setLocale(localeCode)
  closeDropdown()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    closeDropdown()
  }
}

// Add/remove event listener
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="language-switcher relative">
    <!-- Language Switcher Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' : 'bg-white border-slate-200 text-gray-700 hover:bg-gray-50'"
    >
      <GlobeAltIcon class="w-4 h-4" />
      <span class="text-sm font-medium">{{ getLocaleFlag(currentLocale.code) }}</span>
      <span class="text-sm font-medium hidden sm:inline">{{ getLocaleDisplayName(currentLocale.code) }}</span>
      <ChevronDownIcon 
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50"
        :class="isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'"
      >
        <div class="py-1">
          <button
            v-for="locale in availableLanguages"
            :key="locale.code"
            @click="handleLanguageChange(locale.code)"
            class="w-full flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-200"
            :class="[
              locale.code === currentLocale.code
                ? isDarkMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-50 text-green-700'
                : isDarkMode
                  ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-50'
            ]"
          >
            <span class="text-lg">{{ locale.flag }}</span>
            <div class="flex-1 text-left">
              <div class="font-medium">{{ locale.nativeName }}</div>
              <div class="text-xs opacity-75">{{ locale.name }}</div>
            </div>
            <div
              v-if="locale.code === currentLocale.code"
              class="w-2 h-2 rounded-full"
              :class="isDarkMode ? 'bg-white' : 'bg-green-600'"
            ></div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Custom styles for language switcher */
.language-switcher {
  position: relative;
}

/* RTL support */
[dir="rtl"] .language-switcher .absolute {
  right: auto;
  left: 0;
}

[dir="rtl"] .language-switcher .text-left {
  text-align: right;
}
</style>
