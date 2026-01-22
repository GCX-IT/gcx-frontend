<template>
  <div class="p-6" :class="isDarkMode ? 'bg-slate-900' : 'bg-gray-50'">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        Video Library Manager
      </h2>
      <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
        Manage video categories and upload educational content
      </p>
    </div>

    <!-- Action Bar -->
    <div class="mb-6 flex justify-between items-center">
      <button
        @click="openAddLibraryModal"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="pi pi-plus"></i>
        Add New Library
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

    <!-- Libraries Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="library in libraries"
          :key="library.id"
          class="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
        >
          <!-- Library Cover -->
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="library.cover_image"
              :src="library.cover_image"
              :alt="library.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
              <i class="pi pi-video text-4xl text-gray-500"></i>
            </div>
            <!-- Status Badge -->
            <div class="absolute top-2 right-2">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold"
                :class="library.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'"
              >
                {{ library.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>

          <!-- Library Info -->
          <div class="p-4">
            <h3 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              {{ library.title }}
            </h3>
            <p class="text-sm mb-3 line-clamp-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              {{ library.description || 'No description' }}
            </p>

            <!-- Meta Info -->
            <div class="flex items-center gap-4 mb-3 text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
              <span class="flex items-center gap-1">
                <i class="pi pi-tag"></i>
                {{ library.category }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-video"></i>
                {{ library.video_count }} videos
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="manageVideos(library)"
                class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                <i class="pi pi-video mr-1"></i>
                Videos
              </button>
              <button
                @click="editLibrary(library)"
                class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="deleteLibraryConfirm(library)"
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
        v-if="libraries.length === 0"
        class="text-center py-12"
        :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'"
      >
        <i class="pi pi-video text-6xl mb-4 opacity-50"></i>
        <p class="text-lg">No video libraries yet. Create your first library!</p>
      </div>
    </div>

    <!-- Add/Edit Library Modal -->
    <Dialog
      v-model:visible="showLibraryModal"
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
          {{ isEditingLibrary ? 'Edit Library' : 'Add New Library' }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Library Title *
          </label>
          <input
            v-model="currentLibrary.title"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="e.g., Tutorial Videos"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Description
          </label>
          <textarea
            v-model="currentLibrary.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Brief description of this video library..."
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Category *
          </label>
          <select
            v-model="currentLibrary.category"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
          >
            <option value="">Select category...</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Analysis">Analysis</option>
            <option value="Stories">Stories</option>
            <option value="Events">Events</option>
            <option value="Education">Education</option>
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
              v-model="currentLibrary.date"
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
              v-model="currentLibrary.location"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="e.g., GCX Headquarters"
            />
          </div>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Cover Image
          </label>
          <div class="space-y-2">
            <div v-if="currentLibrary.cover_image" class="relative w-32 h-32">
              <img
                :src="currentLibrary.cover_image"
                alt="Cover"
                class="w-full h-full object-cover rounded-lg"
              />
              <button
                @click="currentLibrary.cover_image = ''"
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
              {{ currentLibrary.cover_image ? 'Change Cover Image' : 'Select Cover Image' }}
            </button>
          </div>
        </div>

        <!-- Image Gallery for Cover (Embedded) -->
        <div v-if="showCoverImageGallery" class="border rounded-lg p-4" :class="isDarkMode ? 'border-slate-700' : 'border-gray-300'">
          <ImageGallery
            @image-selected="(url: string) => { currentLibrary.cover_image = url; showCoverImageGallery = false }"
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
            placeholder="e.g., Tutorial, Platform, Guide"
          />
        </div>

        <!-- Settings -->
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentLibrary.is_featured"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Featured Library</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentLibrary.is_active"
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
            @click="showLibraryModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700'"
          >
            Cancel
          </button>
          <button
            @click="saveLibrary"
            :disabled="saving"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEditingLibrary ? 'Update Library' : 'Create Library') }}
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Manage Videos Modal -->
    <Dialog
      v-model:visible="showVideosModal"
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
          Manage Videos: {{ selectedLibrary?.title }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Add Videos Button -->
        <button
          @click="openAddVideoModal"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-plus"></i>
          Add Videos
        </button>

        <!-- Videos Grid -->
        <div v-if="currentVideos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="video in currentVideos"
            :key="video.id"
            class="relative group rounded-lg overflow-hidden"
            :class="isDarkMode ? 'bg-slate-700' : 'bg-gray-100'"
          >
            <!-- Video Thumbnail -->
            <div class="w-full h-32 relative">
              <img
                v-if="video.thumbnail_url"
                :src="video.thumbnail_url"
                :alt="video.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-300">
                <i class="pi pi-video text-2xl text-gray-500"></i>
              </div>
              <!-- Play Button -->
              <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <i class="pi pi-play text-white text-2xl"></i>
              </div>
              <!-- Duration Badge -->
              <div v-if="video.duration" class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {{ video.duration }}
              </div>
            </div>
            
            <!-- Video Info -->
            <div class="p-3">
              <h4 class="text-sm font-medium mb-1 line-clamp-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ video.title }}
              </h4>
              <div class="flex items-center justify-between text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
                <span>{{ video.view_count }} views</span>
                <span v-if="video.resolution">{{ video.resolution }}</span>
              </div>
            </div>

            <!-- Hover Actions -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
              <button
                @click="editVideo(video)"
                class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-all"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="deleteVideo(video)"
                class="opacity-0 group-hover:opacity-100 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-all"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
            
            <!-- Cover Badge -->
            <div v-if="video.is_cover" class="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Cover
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
          <i class="pi pi-video text-4xl mb-2 opacity-50"></i>
          <p>No videos yet. Add videos to this library!</p>
        </div>
      </div>
    </Dialog>

    <!-- Add/Edit Video Modal -->
    <Dialog
      v-model:visible="showVideoModal"
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
          {{ isEditingVideo ? 'Edit Video' : 'Add Video' }}
        </h3>
      </template>

      <div class="space-y-4">
        <!-- Video Title -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Video Title *
          </label>
          <input
            v-model="currentVideo.title"
            type="text"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="e.g., GCX Trading Platform Overview"
          />
        </div>

        <!-- Video Description -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Description
          </label>
          <textarea
            v-model="currentVideo.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="Brief description of the video..."
          ></textarea>
        </div>

        <!-- Video URL -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Video URL *
          </label>
          <input
            v-model="currentVideo.video_url"
            type="url"
            required
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            placeholder="https://example.com/video.mp4"
          />
          <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
            Upload your video to AWS S3 or external hosting service
          </p>
        </div>

        <!-- Thumbnail URL -->
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
            Thumbnail Image
          </label>
          <div class="space-y-2">
            <input
              v-model="currentVideo.thumbnail_url"
              type="url"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="https://example.com/thumbnail.jpg"
            />
            <button
              @click="showThumbnailGallery = true"
              type="button"
              class="px-4 py-2 border-2 border-dashed rounded-lg hover:border-green-500 transition-colors"
              :class="isDarkMode ? 'border-slate-600 text-slate-300' : 'border-gray-300 text-gray-700'"
            >
              <i class="pi pi-image mr-2"></i>
              Select from Gallery
            </button>
          </div>
        </div>

        <!-- Thumbnail Gallery -->
        <div v-if="showThumbnailGallery" class="border rounded-lg p-4" :class="isDarkMode ? 'border-slate-700' : 'border-gray-300'">
          <ImageGallery
            @image-selected="(url: string) => { currentVideo.thumbnail_url = url; showThumbnailGallery = false }"
            @close="showThumbnailGallery = false"
          />
        </div>

        <!-- Video Metadata -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Duration
            </label>
            <input
              v-model="currentVideo.duration"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
              placeholder="5:30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Resolution
            </label>
            <select
              v-model="currentVideo.resolution"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="">Select resolution...</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4K">4K</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              Video Type
            </label>
            <select
              v-model="currentVideo.video_type"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
            >
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
              <option value="mov">MOV</option>
            </select>
          </div>
        </div>

        <!-- Settings -->
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentVideo.is_featured"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Featured Video</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="currentVideo.is_cover"
              type="checkbox"
              class="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Set as cover video</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showVideoModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700'"
          >
            Cancel
          </button>
          <button
            @click="saveVideo"
            :disabled="saving || !currentVideo.title || !currentVideo.video_url"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : (isEditingVideo ? 'Update Video' : 'Add Video') }}
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
import * as videoService from '../../services/videoService'
import type { VideoLibrary, LibraryVideo } from '../../services/videoService'

const isDarkMode = computed(() => document.documentElement.classList.contains('dark'))

const libraries = ref<VideoLibrary[]>([])
const loading = ref(false)
const error = ref('')
const saving = ref(false)

// Library modal state
const showLibraryModal = ref(false)
const isEditingLibrary = ref(false)
const currentLibrary = ref<Partial<VideoLibrary>>({
  is_active: true,
  is_featured: false
})
const showCoverImageGallery = ref(false)
const tagsInput = ref('')

// Videos modal state
const showVideosModal = ref(false)
const selectedLibrary = ref<VideoLibrary | null>(null)
const currentVideos = ref<LibraryVideo[]>([])

// Video modal state
const showVideoModal = ref(false)
const isEditingVideo = ref(false)
const currentVideo = ref<Partial<LibraryVideo>>({
  video_type: 'mp4',
  is_featured: false,
  is_cover: false
})
const showThumbnailGallery = ref(false)

// Fetch libraries
const fetchLibraries = async () => {
  loading.value = true
  error.value = ''
  try {
    libraries.value = await videoService.getAllVideoLibraries()
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load video libraries'
    console.error('Error fetching libraries:', err)
  } finally {
    loading.value = false
  }
}

// Open add library modal
const openAddLibraryModal = () => {
  currentLibrary.value = {
    is_active: true,
    is_featured: false
  }
  tagsInput.value = ''
  isEditingLibrary.value = false
  showLibraryModal.value = true
  showCoverImageGallery.value = false
}

// Edit library
const editLibrary = (library: VideoLibrary) => {
  currentLibrary.value = { ...library }
  tagsInput.value = library.tags ? library.tags.join(', ') : ''
  isEditingLibrary.value = true
  showLibraryModal.value = true
  showCoverImageGallery.value = false
}

// Save library
const saveLibrary = async () => {
  if (!currentLibrary.value.title || !currentLibrary.value.category) {
    alert('Please fill in all required fields')
    return
  }

  // Parse tags
  if (tagsInput.value.trim()) {
    currentLibrary.value.tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
  }

  saving.value = true
  try {
    if (isEditingLibrary.value && currentLibrary.value.id) {
      await videoService.updateVideoLibrary(currentLibrary.value.id, currentLibrary.value)
    } else {
      await videoService.createVideoLibrary(currentLibrary.value)
    }
    showLibraryModal.value = false
    await fetchLibraries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to save library')
    console.error('Error saving library:', err)
  } finally {
    saving.value = false
  }
}

// Delete library
const deleteLibraryConfirm = async (library: VideoLibrary) => {
  if (!confirm(`Are you sure you want to delete "${library.title}"? This will also delete all videos in this library.`)) {
    return
  }

  try {
    await videoService.deleteVideoLibrary(library.id)
    await fetchLibraries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete library')
    console.error('Error deleting library:', err)
  }
}

// Manage videos
const manageVideos = async (library: VideoLibrary) => {
  selectedLibrary.value = library
  try {
    currentVideos.value = await videoService.getLibraryVideos(library.id)
    showVideosModal.value = true
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to load videos')
    console.error('Error loading videos:', err)
  }
}

// Open add video modal
const openAddVideoModal = () => {
  currentVideo.value = {
    video_type: 'mp4',
    is_featured: false,
    is_cover: false
  }
  isEditingVideo.value = false
  showVideoModal.value = true
  showThumbnailGallery.value = false
}

// Edit video
const editVideo = (video: LibraryVideo) => {
  currentVideo.value = { ...video }
  isEditingVideo.value = true
  showVideoModal.value = true
  showThumbnailGallery.value = false
}

// Save video
const saveVideo = async () => {
  if (!selectedLibrary.value) return

  saving.value = true
  try {
    if (isEditingVideo.value && currentVideo.value.id) {
      await videoService.updateLibraryVideo(currentVideo.value.id, currentVideo.value)
    } else {
      await videoService.addVideoToLibrary(selectedLibrary.value.id, currentVideo.value)
    }
    showVideoModal.value = false
    // Reload videos
    currentVideos.value = await videoService.getLibraryVideos(selectedLibrary.value.id)
    // Update library in list
    await fetchLibraries()
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to save video')
    console.error('Error saving video:', err)
  } finally {
    saving.value = false
  }
}

// Delete video
const deleteVideo = async (video: LibraryVideo) => {
  if (!confirm('Are you sure you want to delete this video?')) return

  try {
    await videoService.deleteLibraryVideo(video.id)
    // Reload videos
    if (selectedLibrary.value) {
      currentVideos.value = await videoService.getLibraryVideos(selectedLibrary.value.id)
      // Update library in list
      await fetchLibraries()
    }
  } catch (err: any) {
    alert(err.response?.data?.error || 'Failed to delete video')
    console.error('Error deleting video:', err)
  }
}

// Handle image error
const handleImageError = (e: any) => {
  e.target.src = '/Picture3.png'
}

onMounted(() => {
  fetchLibraries()
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
</style>
