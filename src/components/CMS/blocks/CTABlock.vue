<template>
  <div class="cta-block">
    <!-- Edit Mode -->
    <div v-if="editing" class="cta-block-editor">
      <div class="block-header flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-gray-600">Call to Action Block</span>
        <select v-model="localData.style" @change="updateContent" class="p-2 border border-gray-300 rounded-md">
          <option value="default">Default Style</option>
          <option value="gradient">Gradient Style</option>
          <option value="outline">Outline Style</option>
        </select>
      </div>
      
      <!-- CTA Settings -->
      <div class="cta-settings space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <input 
            v-model="localData.title" 
            type="text" 
            class="w-full p-3 border border-gray-300 rounded-md text-lg"
            placeholder="Enter CTA title"
            @blur="updateContent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea 
            v-model="localData.description" 
            rows="3"
            class="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter CTA description"
            @blur="updateContent"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Button Text</label>
            <input 
              v-model="localData.buttonText" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Click Here"
              @blur="updateContent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Button Link</label>
            <input 
              v-model="localData.buttonLink" 
              type="text" 
              class="w-full p-2 border border-gray-300 rounded-md"
              placeholder="/contact"
              @blur="updateContent"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Background Color</label>
            <input 
              v-model="localData.backgroundColor" 
              type="color" 
              class="w-full h-10 border border-gray-300 rounded-md"
              @change="updateContent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Text Color</label>
            <input 
              v-model="localData.textColor" 
              type="color" 
              class="w-full h-10 border border-gray-300 rounded-md"
              @change="updateContent"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Alignment</label>
          <select v-model="localData.alignment" @change="updateContent" class="w-full p-2 border border-gray-300 rounded-md">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Preview Mode -->
    <div v-else class="cta-block-preview">
      <div 
        class="cta-preview p-8 rounded-lg"
        :class="{
          'text-left': localData.alignment === 'left',
          'text-center': localData.alignment === 'center',
          'text-right': localData.alignment === 'right'
        }"
        :style="{
          backgroundColor: localData.backgroundColor || '#3b82f6',
          color: localData.textColor || '#ffffff'
        }"
      >
        <h2 class="text-3xl font-bold mb-4">
          {{ localData.title || 'Call to Action' }}
        </h2>
        
        <p class="text-lg mb-6 opacity-90">
          {{ localData.description || 'Take action now!' }}
        </p>
        
        <button 
          v-if="localData.buttonText"
          class="btn-cta"
          :class="{
            'bg-white text-gray-900 hover:bg-gray-100': localData.style === 'default',
            'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600': localData.style === 'gradient',
            'border-2 border-white text-white hover:bg-white hover:text-gray-900': localData.style === 'outline'
          }"
        >
          {{ localData.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  block: any
  editing: boolean
}>()

const emit = defineEmits<{
  update: [data: any]
}>()

const localData = ref({ 
  title: 'Call to Action',
  description: 'Take action now!',
  buttonText: 'Click Here',
  buttonLink: '#',
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  alignment: 'center',
  style: 'default',
  ...props.block.data 
})

const updateContent = () => {
  emit('update', localData.value)
}

watch(() => props.block.data, (newData) => {
  localData.value = { ...localData.value, ...newData }
}, { deep: true })
</script>

<style scoped>
.cta-block {
  @apply bg-white rounded-lg border border-gray-200;
}

.cta-block-editor {
  @apply p-4;
}

.cta-block-preview {
  @apply p-6;
}

.btn-cta {
  @apply px-6 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg;
}
</style>
