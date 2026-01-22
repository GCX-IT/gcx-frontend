<template>
  <div class="hero-block">
    <!-- Edit Mode -->
    <div v-if="editing" class="hero-block-editor">
      <div class="block-header flex items-center justify-between mb-4">
        <span class="text-sm font-medium text-gray-600">Hero Block</span>
        <button @click="openMediaLibrary" class="btn-primary">
          <i class="pi pi-image"></i> Choose Background
        </button>
      </div>
      
      <!-- Background Preview -->
      <div class="background-preview mb-4">
        <div 
          class="w-full h-48 rounded-lg border border-gray-200 bg-cover bg-center bg-gray-100"
          :style="{ backgroundImage: localData.backgroundImage ? `url(${localData.backgroundImage})` : 'none' }"
        >
          <div v-if="!localData.backgroundImage" class="w-full h-full flex items-center justify-center text-gray-400">
            <div class="text-center">
              <i class="pi pi-image text-3xl mb-2"></i>
              <p class="text-sm">No background image</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hero Settings -->
      <div class="hero-settings space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <input 
            v-model="localData.title" 
            type="text" 
            class="w-full p-3 border border-gray-300 rounded-md text-lg"
            placeholder="Enter hero title"
            @blur="updateContent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Subtitle</label>
          <textarea 
            v-model="localData.subtitle" 
            rows="3"
            class="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Enter hero subtitle"
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
              placeholder="Get Started"
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
        
        <div>
          <label class="block text-sm font-medium mb-2">Text Alignment</label>
          <select v-model="localData.textAlignment" @change="updateContent" class="w-full p-2 border border-gray-300 rounded-md">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Text Color</label>
          <select v-model="localData.textColor" @change="updateContent" class="w-full p-2 border border-gray-300 rounded-md">
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Preview Mode -->
    <div v-else class="hero-block-preview">
      <div 
        class="hero-preview relative min-h-[400px] flex items-center justify-center rounded-lg overflow-hidden"
        :style="{ backgroundImage: localData.backgroundImage ? `url(${localData.backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <!-- Content -->
        <div 
          class="relative z-10 text-center max-w-4xl mx-auto px-6"
          :class="{
            'text-left': localData.textAlignment === 'left',
            'text-center': localData.textAlignment === 'center',
            'text-right': localData.textAlignment === 'right'
          }"
        >
          <h1 
            class="text-4xl md:text-6xl font-bold mb-4"
            :class="{
              'text-white': localData.textColor === 'white',
              'text-black': localData.textColor === 'black',
              'text-blue-600': localData.textColor === 'blue'
            }"
          >
            {{ localData.title || 'Your Hero Title' }}
          </h1>
          
          <p 
            class="text-xl md:text-2xl mb-8"
            :class="{
              'text-white': localData.textColor === 'white',
              'text-gray-800': localData.textColor === 'black',
              'text-blue-700': localData.textColor === 'blue'
            }"
          >
            {{ localData.subtitle || 'Your hero subtitle goes here' }}
          </p>
          
          <button 
            v-if="localData.buttonText"
            class="btn-hero"
            :class="{
              'bg-white text-black hover:bg-gray-100': localData.textColor === 'white',
              'bg-black text-white hover:bg-gray-800': localData.textColor === 'black',
              'bg-blue-600 text-white hover:bg-blue-700': localData.textColor === 'blue'
            }"
          >
            {{ localData.buttonText }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Media Library Modal -->
    <MediaLibraryModal 
      v-if="showMediaLibrary"
      @close="showMediaLibrary = false"
      @select="selectBackgroundImage"
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
  title: 'Your Hero Title',
  subtitle: 'Your hero subtitle goes here',
  backgroundImage: '',
  buttonText: 'Get Started',
  buttonLink: '#',
  textAlignment: 'center',
  textColor: 'white',
  ...props.block.data 
})

const showMediaLibrary = ref(false)

const updateContent = () => {
  emit('update', localData.value)
}

const openMediaLibrary = () => {
  showMediaLibrary.value = true
}

const selectBackgroundImage = (image: any) => {
  localData.value.backgroundImage = image.url
  updateContent()
  showMediaLibrary.value = false
}

watch(() => props.block.data, (newData) => {
  localData.value = { ...localData.value, ...newData }
}, { deep: true })
</script>

<style scoped>
.hero-block {
  @apply bg-white rounded-lg border border-gray-200;
}

.hero-block-editor {
  @apply p-4;
}

.hero-block-preview {
  @apply p-6;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.btn-hero {
  @apply px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg;
}
</style>
