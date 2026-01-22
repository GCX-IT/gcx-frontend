<template>
  <div class="image-block">
    <!-- Edit Mode -->
    <div v-if="editing" class="image-block-editor">
      <div class="block-header flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-gray-600">Image Block</span>
        <button @click="openMediaLibrary" class="btn-primary">
          <i class="pi pi-image"></i> Choose Image
        </button>
      </div>
      
      <!-- Image Preview -->
      <div v-if="localData.src" class="image-preview mb-4">
        <img 
          :src="localData.src" 
          :alt="localData.alt"
          class="max-w-full h-auto rounded-lg border border-gray-200"
        />
      </div>
      
      <!-- No Image State -->
      <div v-else class="no-image-placeholder mb-4">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <i class="pi pi-image text-4xl text-gray-400 mb-2"></i>
          <p class="text-gray-500">No image selected</p>
          <button @click="openMediaLibrary" class="btn-primary mt-2">
            Choose Image
          </button>
        </div>
      </div>
      
      <!-- Image Settings -->
      <div class="image-settings space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Alt Text</label>
          <input 
            v-model="localData.alt" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Describe the image for accessibility"
            @blur="updateContent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Caption</label>
          <input 
            v-model="localData.caption" 
            type="text" 
            class="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Optional caption"
            @blur="updateContent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Alignment</label>
          <select v-model="localData.alignment" @change="updateContent" class="w-full p-2 border border-gray-300 rounded-md">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Size</label>
          <select v-model="localData.size" @change="updateContent" class="w-full p-2 border border-gray-300 rounded-md">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="full">Full Width</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Preview Mode -->
    <div v-else class="image-block-preview">
      <div 
        class="image-container"
        :class="{
          'text-left': localData.alignment === 'left',
          'text-center': localData.alignment === 'center',
          'text-right': localData.alignment === 'right'
        }"
      >
        <img 
          v-if="localData.src"
          :src="localData.src" 
          :alt="localData.alt"
          class="image-preview-img"
          :class="{
            'max-w-xs': localData.size === 'small',
            'max-w-md': localData.size === 'medium',
            'max-w-2xl': localData.size === 'large',
            'w-full': localData.size === 'full'
          }"
        />
        
        <div v-if="localData.caption" class="image-caption mt-2 text-sm text-gray-600">
          {{ localData.caption }}
        </div>
      </div>
    </div>
    
    <!-- Media Library Modal -->
    <MediaLibraryModal 
      v-if="showMediaLibrary"
      @close="showMediaLibrary = false"
      @select="selectImage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MediaLibraryModal from '../MediaLibraryModal.vue'

const props = defineProps<{
  block: any
  editing: boolean
}>()

const emit = defineEmits<{
  update: [data: any]
}>()

const localData = ref({ 
  src: '',
  alt: '',
  caption: '',
  alignment: 'center',
  size: 'medium',
  ...props.block.data 
})

const showMediaLibrary = ref(false)

const updateContent = () => {
  emit('update', localData.value)
}

const openMediaLibrary = () => {
  showMediaLibrary.value = true
}

const selectImage = (image: any) => {
  localData.value.src = image.url
  localData.value.alt = image.alt || image.name
  updateContent()
  showMediaLibrary.value = false
}

watch(() => props.block.data, (newData) => {
  localData.value = { ...localData.value, ...newData }
}, { deep: true })
</script>

<style scoped>
.image-block {
  @apply bg-white rounded-lg border border-gray-200;
}

.image-block-editor {
  @apply p-4;
}

.image-block-preview {
  @apply p-6;
}

.image-container {
  @apply inline-block;
}

.image-preview-img {
  @apply rounded-lg shadow-sm;
}

.image-caption {
  @apply italic;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}
</style>
