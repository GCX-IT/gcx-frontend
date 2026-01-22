<template>
  <div 
    class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
    :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
  >
    <div class="flex flex-col items-center text-center">
      <div class="w-24 h-24 mb-4 flex items-center justify-center">
        <img :src="imageSrc" :alt="title" class="max-w-full max-h-full object-contain" />
      </div>
      <h4 
        class="text-sm font-semibold transition-colors duration-300"
        :class="isDarkMode ? 'text-white' : 'text-slate-900'"
      >
        {{ title }}
      </h4>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageSrc: string;
  title: string;
  isDarkMode: boolean;
}

defineProps<Props>();
</script>
