<template>
  <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-20 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap gap-2 py-4 overflow-x-auto">
        <button
          v-for="category in partnershipCategories"
          :key="category.key"
          @click="$emit('update:activeCategory', category.key)"
          :class="[
            'px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap',
            activeCategory === category.key
              ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          {{ category.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PartnershipCategory {
  label: string;
  key: string;
}

interface Props {
  activeCategory: string;
  partnershipCategories: PartnershipCategory[];
}

interface Emits {
  (e: 'update:activeCategory', category: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
