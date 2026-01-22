<template>
  <div class="text-block">
    <!-- Edit Mode -->
    <div v-if="editing" class="text-block-editor">
      <div class="block-header flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-600">Text Block</span>
        <div class="flex items-center gap-2">
          <select v-model="localData.alignment" class="text-sm border border-gray-300 rounded px-2 py-1">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
      
      <div class="relative">
        <textarea
          v-model="localData.content"
          class="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="6"
          placeholder="Enter your text content..."
          @blur="updateContent"
        ></textarea>
        
        <!-- Rich Text Toolbar -->
        <div class="absolute top-2 right-2 flex gap-1">
          <button @click="formatText('bold')" class="toolbar-btn" title="Bold">
            <i class="pi pi-bold"></i>
          </button>
          <button @click="formatText('italic')" class="toolbar-btn" title="Italic">
            <i class="pi pi-italic"></i>
          </button>
          <button @click="formatText('underline')" class="toolbar-btn" title="Underline">
            <i class="pi pi-underline"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Preview Mode -->
    <div v-else class="text-block-preview">
      <div 
        class="prose max-w-none"
        :class="{
          'text-left': localData.alignment === 'left',
          'text-center': localData.alignment === 'center',
          'text-right': localData.alignment === 'right'
        }"
        v-html="formattedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  block: any
  editing: boolean
}>()

const emit = defineEmits<{
  update: [data: any]
}>()

const localData = ref({ ...props.block.data })

const formattedContent = computed(() => {
  let content = localData.value.content || ''
  
  // Simple formatting (in a real app, you'd use a proper rich text editor)
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>')
  content = content.replace(/__(.*?)__/g, '<u>$1</u>')
  content = content.replace(/\n/g, '<br>')
  
  return content
})

const updateContent = () => {
  emit('update', localData.value)
}

const formatText = (format: string) => {
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement
  if (!textarea) return
  
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = textarea.value.substring(start, end)
  
  if (selectedText) {
    let formattedText = ''
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
    }
    
    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end)
    localData.value.content = newContent
    updateContent()
  }
}

watch(() => props.block.data, (newData) => {
  localData.value = { ...newData }
}, { deep: true })
</script>

<style scoped>
.text-block {
  @apply bg-white rounded-lg border border-gray-200;
}

.text-block-editor {
  @apply p-4;
}

.text-block-preview {
  @apply p-6;
}

.toolbar-btn {
  @apply w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors;
}

.prose {
  @apply text-gray-900 leading-relaxed;
}

.prose h1 {
  @apply text-3xl font-bold mb-4;
}

.prose h2 {
  @apply text-2xl font-bold mb-3;
}

.prose h3 {
  @apply text-xl font-bold mb-2;
}

.prose p {
  @apply mb-4;
}

.prose strong {
  @apply font-bold;
}

.prose em {
  @apply italic;
}

.prose u {
  @apply underline;
}
</style>
