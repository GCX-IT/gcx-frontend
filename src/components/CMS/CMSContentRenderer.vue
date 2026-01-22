<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  fallback?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  fallback: '',
  className: ''
})

// Computed property to get the content to render
const renderContent = computed(() => {
  return props.content || props.fallback || ''
})

// Check if content contains HTML tags
const isHTML = computed(() => {
  return /<[a-z][\s\S]*>/i.test(renderContent.value)
})
</script>

<template>
  <div 
    v-if="isHTML"
    v-html="renderContent"
    :class="className"
    class="cms-content"
  ></div>
  <div 
    v-else
    :class="className"
    class="cms-content"
  >
    {{ renderContent }}
  </div>
</template>

<style scoped>
.cms-content {
  /* Base styles for CMS content */
}

.cms-content :deep(h1),
.cms-content :deep(h2),
.cms-content :deep(h3),
.cms-content :deep(h4),
.cms-content :deep(h5),
.cms-content :deep(h6) {
  @apply font-bold mb-4;
}

.cms-content :deep(h1) {
  @apply text-3xl;
}

.cms-content :deep(h2) {
  @apply text-2xl;
}

.cms-content :deep(h3) {
  @apply text-xl;
}

.cms-content :deep(p) {
  @apply mb-4 leading-relaxed;
}

.cms-content :deep(ul),
.cms-content :deep(ol) {
  @apply mb-4 pl-6;
}

.cms-content :deep(li) {
  @apply mb-2;
}

.cms-content :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.cms-content :deep(strong) {
  @apply font-bold;
}

.cms-content :deep(em) {
  @apply italic;
}

.cms-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic my-4;
}

.cms-content :deep(img) {
  @apply max-w-full h-auto rounded-lg shadow-md;
}

.cms-content :deep(.hero-section) {
  @apply text-center py-16;
}

.cms-content :deep(.hero-section h1) {
  @apply text-4xl md:text-5xl font-bold mb-6;
}

.cms-content :deep(.hero-section p) {
  @apply text-xl mb-8;
}

.cms-content :deep(.cta-buttons) {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

.cms-content :deep(.btn-primary) {
  @apply bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors;
}

.cms-content :deep(.btn-secondary) {
  @apply bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg font-medium transition-colors;
}

.cms-content :deep(.stats-section) {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8 py-16;
}

.cms-content :deep(.stat) {
  @apply text-center;
}

.cms-content :deep(.stat h3) {
  @apply text-3xl font-bold text-green-600 mb-2;
}

.cms-content :deep(.services-section) {
  @apply py-16;
}

.cms-content :deep(.services-grid) {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8;
}

.cms-content :deep(.service-card) {
  @apply bg-white p-6 rounded-lg shadow-md border;
}

.cms-content :deep(.service-card h3) {
  @apply text-xl font-bold mb-4;
}

.cms-content :deep(.benefits-grid) {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8;
}

.cms-content :deep(.benefit-card) {
  @apply bg-white p-6 rounded-lg shadow-md border;
}

.cms-content :deep(.benefit-card h3) {
  @apply text-xl font-bold mb-4;
}
</style>
