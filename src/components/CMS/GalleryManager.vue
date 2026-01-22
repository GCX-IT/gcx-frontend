<template>
  <div class="p-6" :class="isDarkMode ? 'bg-slate-900' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        Photo Gallery Manager
      </h2>
      <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
        Manage photo albums and upload event photos
      </p>
    </div>

    <!-- Action Bar -->
    <div class="mb-6 flex justify-between items-center">
      <button
        @click="openAddGalleryModal"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="pi pi-plus"></i>
        Add New Gallery
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 rounded-lg bg-red-100 border border-red-300 text-red-700">
      {{ error }}
    </div>

    <!-- Galleries Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="gallery in galleries"
          :key="gallery.id"
          class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
        >
          <!-- Gallery Cover -->
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="gallery.cover_image"
              :src="gallery.cover_image"
              :alt="gallery.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
              <i class="pi pi-image text-4xl text-gray-500"></i>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="gallery.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'"
              >
                {{ gallery.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Gallery Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ gallery.title }}
            </h3>
            <p class="text-sm mb-3 line-clamp-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              {{ gallery.description || 'No description' }}
            </p>

            <!-- Meta Info -->
            <div class="flex items-center gap-4 mb-3 text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
              <span class="flex items-center gap-1">
                <i class="pi pi-tag"></i>
                {{ gallery.category }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-images"></i>
                {{ gallery.photo_count }} photos
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="managePhotos(gallery)"
                class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <i class="pi pi-images mr-1"></i>
                Photos
              </button>
              <button
                @click="editGallery(gallery)"
                class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="deleteGalleryConfirm(gallery)"
                class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="galleries.length === 0"
        class="text-center py-12"
        :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'"
      >
        <i class="pi pi-images text-6xl mb-4 opacity-50"></i>
        <p class="text-lg">No galleries yet. Create your first gallery!</p>
      </div>
    </div>

    <!-- Add/Edit Gallery Modal -->
    <Dialog
      v-model:visible="showGalleryModal"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="w-full max-w-3xl"
      :pt="{
        root: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        header: { class: isDarkMode ? 'bg-slate-800 text-white border-b border-slate-700' : 'bg-white text-gray-900' },
        content: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        mask: { class: 'backdrop-blur-sm' }
      }"
    >
      <template #header>
        <h3 class="text-xl font-semibold">
          {{ isEditingGallery ? 'Edit Gallery' : 'Add New Gallery' }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Gallery Title *
          </label>
          <input
            v-model="currentGallery.title"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="e.g., Events & Conferences"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Description
          </label>
          <textarea
            v-model="currentGallery.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Brief description of this gallery..."
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Category *
          </label>
          <select
            v-model="currentGallery.category"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
          >
            <option value="">Select category...</option>
            <option value="Events">Events</option>
            <option value="Training">Training</option>
            <option value="Operations">Operations</option>
            <option value="Quality">Quality</option>
            <option value="Programs">Programs</option>
            <option value="Analysis">Analysis</option>
            <option value="Partnerships">Partnerships</option>
            <option value="Forums">Forums</option>
            <option value="Technology">Technology</option>
          </select>
        </div>

        <!-- Date & Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Date
            </label>
            <input
              v-model="currentGallery.date"
              type="date"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Location
            </label>
            <input
              v-model="currentGallery.location"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="e.g., Accra, Ghana"
            />
          </div>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Cover Image
          </label>
          <div class="space-y-2">
            <div v-if="currentGallery.cover_image" class="relative w-32 h-32">
              <img
                :src="currentGallery.cover_image"
                alt="Cover"
                class="w-full h-full object-cover rounded-lg"
              />
              <button
                @click="currentGallery.cover_image = ''"
                class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
              >
                <i class="pi pi-times text-xs"></i>
              </button>
            </div>
            <button
              @click="showCoverImageGallery = true"
              type="button"
              class="px-4 py-2 border-2 border-dashed rounded-lg hover:border-green-500 transition-colors"
              :class="isDarkMode ? 'border-slate-600 text-slate-300' : 'border-gray-300 text-gray-700'"
            >
              <i class="pi pi-image mr-2"></i>
              {{ currentGallery.cover_image ? 'Change Cover Image' : 'Select Cover Image' }}
            </button>
          </div>
        </div>

        <!-- Image Gallery for Cover (Embedded) -->
        <div v-if="showCoverImageGallery" class="border rounded-lg p-4" :class="isDarkMode ? 'border-slate-700' : 'border-gray-300'">
          <ImageGallery
            @select="(url: string) => { currentGallery.cover_image = url; showCoverImageGallery = false }"
            @close="showCoverImageGallery = false"
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Tags (comma-separated)
          </label>
          <input
            v-model="tagsInput"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="e.g., Conference, Leadership, Innovation"
          />
        </div>

        <!-- Settings -->
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentGallery.is_featured"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Featured Gallery</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentGallery.is_active"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Active</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showGalleryModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700'"
          >
            Cancel
          </button>
          <button
            @click="saveGallery"
            :disabled="saving"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEditingGallery ? 'Update Gallery' : 'Create Gallery') }}
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Manage Photos Modal -->
    <Dialog
      v-model:visible="showPhotosModal"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="w-full max-w-6xl"
      :pt="{
        root: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        header: { class: isDarkMode ? 'bg-slate-800 text-white border-b border-slate-700' : 'bg-white text-gray-900' },
        content: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        mask: { class: 'backdrop-blur-sm' }
      }"
    >
      <template #header>
        <h3 class="text-xl font-semibold">
          Manage Photos: {{ selectedGallery?.title }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Add Photos Button -->
        <button
          @click="openAddPhotoModal"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-plus"></i>
          Add Photos
        </button>

        <!-- Photos Grid -->
        <div v-if="currentPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="photo in currentPhotos"
            :key="photo.id"
            class="relative group rounded-lg overflow-hidden bg-gray-200"
            :class="isDarkMode ? 'bg-slate-700' : 'bg-gray-200'"
          >
            <!-- Image Container -->
            <div class="w-full h-32 relative">
              <img
                :src="photo.image_url"
                :alt="photo.title || 'Gallery photo'"
                class="w-full h-full object-cover"
                @error="handleImageError"
                @load="handleImageLoad"
                loading="lazy"
              />
            </div>
            
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
              <button
                @click="editPhoto(photo)"
                class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-all"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="deletePhoto(photo)"
                class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
            
            <!-- Cover badge -->
            <div v-if="photo.is_cover" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Cover
            </div>
            
            <!-- Debug info (remove this after testing) -->
            <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
              {{ photo.image_url }}
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
          <i class="pi pi-images text-4xl mb-2 opacity-50"></i>
          <p>No photos yet. Add photos to this gallery!</p>
        </div>
      </div>
    </Dialog>

    <!-- Add/Edit Photo Modal -->
    <Dialog
      v-model:visible="showPhotoModal"
      :modal="true"
      :closable="true"
      :draggable="false"
      class="w-full max-w-2xl"
      :pt="{
        root: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        header: { class: isDarkMode ? 'bg-slate-800 text-white border-b border-slate-700' : 'bg-white text-gray-900' },
        content: { class: isDarkMode ? 'bg-slate-800' : 'bg-white' },
        mask: { class: 'backdrop-blur-sm' }
      }"
    >
      <template #header>
        <h3 class="text-xl font-semibold">
          {{ isEditingPhoto ? 'Edit Photo' : 'Add Photos' }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Selected Images Preview -->
        <div v-if="selectedImages.length > 0" class="p-4 rounded-lg" :class="isDarkMode ? 'bg-slate-700' : 'bg-green-50'">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              {{ selectedImages.length }} image(s) selected
            </p>
            <button
              @click="selectedImages = []"
              class="text-xs text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          </div>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="(imgUrl, idx) in selectedImages"
              :key="idx"
              class="relative group"
            >
              <img
                :src="imgUrl"
                class="w-full h-16 object-cover rounded"
                @error="handleImageError"
              />
              <button
                @click="selectedImages.splice(idx, 1)"
                class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Select Images -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Select Images * (click images below to add/remove)
          </label>
          <div class="border rounded-lg p-4" :class="isDarkMode ? 'border-slate-700' : 'border-gray-300'">
            <ImageGallery
              @image-selected="handlePhotoSelect"
            />
          </div>
        </div>

        <!-- Photo Title (for single edit) -->
        <div v-if="isEditingPhoto">
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Title
          </label>
          <input
            v-model="currentPhoto.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Photo title..."
          />
        </div>

        <!-- Set as Cover (for single edit) -->
        <div v-if="isEditingPhoto">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentPhoto.is_cover"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Set as cover photo</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showPhotoModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700'"
          >
            Cancel
          </button>
          <button
            @click="savePhoto"
            :disabled="saving || selectedImages.length === 0"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEditingPhoto ? 'Update Photo' : `Add ${selectedImages.length} Photo(s)`) }}
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import ImageGallery from './ImageGallery.vue'
import * as galleryService from '../../services/galleryService'
import type { PhotoGallery, GalleryPhoto } from '../../services/galleryService'

const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))

const galleries = ref<PhotoGallery[]>([])
const loading = ref(false)
const error = ref('')
const saving = ref(false)

// Gallery modal state
const showGalleryModal = ref(false)
const isEditingGallery = ref(false)
const currentGallery = ref<Partial<PhotoGallery>>({
  is_active: true,
  is_featured: false
})
const showCoverImageGallery = ref(false)
const tagsInput = ref('')

// Photos modal state
const showPhotosModal = ref(false)
const selectedGallery = ref<PhotoGallery | null>(null)
const currentPhotos = ref<GalleryPhoto[]>([])

// Photo modal state
const showPhotoModal = ref(false)
const isEditingPhoto = ref(false)
const currentPhoto = ref<Partial<GalleryPhoto>>({})
const selectedImages = ref<string[]>([])

// Fetch galleries
const fetchGalleries = async () => {
  loading.value = true
  error.value = ''
  try {
    galleries.value = await galleryService.getAllGalleries()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load galleries'
    console.error('Error fetching galleries:', err)
  } finally {
    loading.value = false
  }
}

// Open add gallery modal
const openAddGalleryModal = () => {
  currentGallery.value = {
    is_active: true,
    is_featured: false
  }
  tagsInput.value = ''
  isEditingGallery.value = false
  showGalleryModal.value = true
  showCoverImageGallery.value = false
}

// Edit gallery
const editGallery = (gallery: PhotoGallery) => {
  currentGallery.value = { ...gallery }
  tagsInput.value = gallery.tags ? gallery.tags.join(', ') : ''
  isEditingGallery.value = true
  showGalleryModal.value = true
  showCoverImageGallery.value = false
}

// Save gallery
const saveGallery = async () => {
  if (!currentGallery.value.title || !currentGallery.value.category) {
    alert('Please fill in all required fields')
    return
  }

  // Parse tags
  if (tagsInput.value.trim()) {
    currentGallery.value.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }

  saving.value = true
  try {
    if (isEditingGallery.value && currentGallery.value.id) {
      await galleryService.updateGallery(currentGallery.value.id, currentGallery.value)
    } else {
      await galleryService.createGallery(currentGallery.value)
    }
    showGalleryModal.value = false
    await fetchGalleries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to save gallery')
    console.error('Error saving gallery:', err)
  } finally {
    saving.value = false
  }
}

// Delete gallery
const deleteGalleryConfirm = async (gallery: PhotoGallery) => {
  if (!confirm(`Are you sure you want to delete "${gallery.title}"? This will also delete all photos in this gallery.`)) {
    return
  }

  try {
    await galleryService.deleteGallery(gallery.id)
    await fetchGalleries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete gallery')
    console.error('Error deleting gallery:', err)
  }
}

// Manage photos
const managePhotos = async (gallery: PhotoGallery) => {
  selectedGallery.value = gallery
  try {
    currentPhotos.value = await galleryService.getGalleryPhotos(gallery.id)
    showPhotosModal.value = true
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to load photos')
    console.error('Error loading photos:', err)
  }
}

// Open add photo modal
const openAddPhotoModal = () => {
  currentPhoto.value = {
    is_cover: false
  }
  selectedImages.value = []
  isEditingPhoto.value = false
  showPhotoModal.value = true
}

// Edit photo
const editPhoto = (photo: GalleryPhoto) => {
  currentPhoto.value = { ...photo }
  selectedImages.value = [photo.image_url]
  isEditingPhoto.value = true
  showPhotoModal.value = true
}

// Handle photo selection from ImageGallery
const handlePhotoSelect = (image: any) => {
  // ImageGallery emits an image object with a url property
  const imageUrl = image.url || image
  
  if (isEditingPhoto.value) {
    // For editing, update the current photo
    currentPhoto.value.image_url = imageUrl
    selectedImages.value = [imageUrl]
  } else {
    // For adding, check if image already selected
    const index = selectedImages.value.indexOf(imageUrl)
    if (index > -1) {
      // Remove if already selected (toggle)
      selectedImages.value.splice(index, 1)
    } else {
      // Add to selection
      selectedImages.value.push(imageUrl)
    }
  }
}

// Save photo(s)
const savePhoto = async () => {
  if (!selectedGallery.value) return

  saving.value = true
  try {
    if (isEditingPhoto.value && currentPhoto.value.id) {
      // Update single photo
      await galleryService.updateGalleryPhoto(currentPhoto.value.id, currentPhoto.value)
    } else {
      // Add multiple photos
      for (const imageUrl of selectedImages.value) {
        await galleryService.addPhotoToGallery(selectedGallery.value.id, {
          image_url: imageUrl,
          thumbnail_url: imageUrl,
          is_cover: false
        })
      }
    }
    showPhotoModal.value = false
    // Reload photos
    currentPhotos.value = await galleryService.getGalleryPhotos(selectedGallery.value.id)
    // Update gallery in list
    await fetchGalleries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to save photo')
    console.error('Error saving photo:', err)
  } finally {
    saving.value = false
  }
}

// Delete photo
const deletePhoto = async (photo: GalleryPhoto) => {
  if (!confirm('Are you sure you want to delete this photo?')) return

  try {
    await galleryService.deleteGalleryPhoto(photo.id)
    // Reload photos
    if (selectedGallery.value) {
      currentPhotos.value = await galleryService.getGalleryPhotos(selectedGallery.value.id)
      // Update gallery in list
      await fetchGalleries()
    }
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete photo')
    console.error('Error deleting photo:', err)
  }
}

// Handle image error
const handleImageError = (e: any) => {
  console.log('Image failed to load:', e.target.src)
  e.target.src = '/Picture3.png'
}

// Handle image load
const handleImageLoad = (e: any) => {
  console.log('Image loaded successfully:', e.target.src)
  // Hide loading spinner when image loads
  const container = e.target.parentElement
  const spinner = container?.querySelector('.loading-spinner')
  if (spinner) {
    spinner.style.display = 'none'
  }
}

onMounted(() => {
  fetchGalleries()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.loading-spinner {
  z-index: 5;
}

.loading-spinner img {
  z-index: 10;
}

/* Ensure images are visible */
img {
  position: relative;
  z-index: 10;
}
</style>
