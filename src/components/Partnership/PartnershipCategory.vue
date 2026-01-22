<template>
  <div 
    class="transition-colors duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border"
    :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'"
  >
    <div class="w-20 h-20 bg-gradient-to-br rounded-2xl mx-auto mb-6 flex items-center justify-center"
         :class="iconBgClass">
      <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
      </svg>
    </div>
    <h3 
      class="text-xl font-bold transition-colors duration-300 mb-4 text-center"
      :class="isDarkMode ? 'text-white' : 'text-slate-900'"
    >
      {{ title }}
    </h3>
    <p 
      class="transition-colors duration-300 text-center mb-4"
      :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
    >
      {{ description }}
    </p>
    <div class="flex flex-wrap gap-2 justify-center">
      <span 
        v-for="tag in tags" 
        :key="tag"
        class="px-3 py-1 text-xs rounded-full"
        :class="tagClasses"
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  tags: string[];
  iconPath: string;
  iconBgClass: string;
  tagClasses: string;
  isDarkMode: boolean;
}

defineProps<Props>();
</script>
