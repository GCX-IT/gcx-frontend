<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'

defineProps<{
  activeTab: string
}>()

defineEmits<{
  'update:activeTab': [value: string]
}>()

const sections = [
  { id: 'overview', name: 'Overview', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'application', name: 'Application', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: 'resources', name: 'Resources', icon: 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'exemptions', name: 'Exemptions', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'contact', name: 'Contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
]
</script>

<template>
  <nav class="sticky top-0 z-40 py-4 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-wrap justify-center gap-2">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="$emit('update:activeTab', section.id)"
          class="flex items-center gap-2 px-4 py-2 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          :class="activeTab === section.id
            ? 'bg-green-500 text-white shadow-lg' 
            : isDarkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="section.icon" />
          </svg>
          {{ section.name }}
        </button>
      </div>
    </div>
  </nav>
</template>
