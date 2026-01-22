<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'

interface Props {
  searchQuery: string
  selectedTag: string
  allTags: string[]
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:selectedTag', value: string): void
  (e: 'clearFilters'): void
}

const props = defineProps<Props>()
const { t } = useI18n()
const emit = defineEmits<Emits>()

const updateSearchQuery = (value: string) => {
  emit('update:searchQuery', value)
}

const updateSelectedTag = (value: string) => {
  emit('update:selectedTag', value)
}

const clearFilters = () => {
  emit('clearFilters')
}
</script>

<template>
  <div class="mb-12">
    <!-- Enhanced Search Bar -->
    <div class="mb-8">
      <div class="relative max-w-2xl mx-auto">
        <input
          :value="searchQuery"
          @input="updateSearchQuery(($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search posts by title, content, or author..."
          class="w-full pl-12 pr-4 py-4 text-lg border-2 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-300 shadow-lg"
          :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400' : 'border-gray-200 bg-white text-slate-900 placeholder-slate-500'"
        />
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="flex flex-col lg:flex-row gap-6 items-center justify-between">
      <!-- Tag Filter -->
      <div class="flex flex-wrap gap-3">
        <button
          v-for="tag in ['All', ...allTags.slice(0, 6)]"
          :key="tag"
          @click="updateSelectedTag(tag === 'All' ? '' : tag)"
          class="px-4 py-2 font-medium rounded-full transition-all duration-300"
          :class="(selectedTag === tag || (selectedTag === '' && tag === 'All'))
            ? 'bg-yellow-500 text-white shadow-lg' 
            : isDarkMode 
              ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
              : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'"
        >
          {{ tag }}
        </button>
        
        <!-- More Tags Dropdown -->
        <div v-if="allTags.length > 6" class="relative">
          <select
            :value="selectedTag"
            @change="updateSelectedTag(($event.target as HTMLSelectElement).value)"
            class="px-4 py-2 rounded-full border transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
          >
            <option value="">More Tags...</option>
            <option v-for="tag in allTags.slice(6)" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
        </div>
      </div>

      <!-- Sort and Clear -->
      <div class="flex gap-3">
        <select
          class="px-4 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          :class="isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
        
        <button
          v-if="searchQuery || selectedTag"
          @click="clearFilters"
          class="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          :class="isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>
    </div>
  </div>
</template>
