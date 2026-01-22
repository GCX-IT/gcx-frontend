<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Header -->
    <div class="border-b transition-colors duration-300 sticky top-0 z-10" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
          <div>
            <h1 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Content Management System
            </h1>
            <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Migrate and edit your static website content
            </p>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Migration Status -->
            <div class="flex items-center space-x-2">
              <div class="h-3 w-3 rounded-full" :class="allMigrated ? 'bg-green-500' : 'bg-yellow-500'"></div>
              <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ migratedCount }}/{{ totalPages }} pages migrated
              </span>
            </div>

            <!-- Migrate All Button -->
            <button
              @click="migrateAll"
              :disabled="migrating"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <i class="pi" :class="migrating ? 'pi-spin pi-spinner' : 'pi-upload'"></i>
              <span>{{ migrating ? 'Migrating...' : 'Migrate All' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar - Page List -->
        <div class="lg:col-span-1">
          <div class="rounded-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <h2 class="text-lg font-semibold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Pages
            </h2>
            
            <div class="space-y-2">
              <button
                v-for="page in pageContents"
                :key="page.pageId"
                @click="selectPage(page)"
                class="w-full text-left p-3 rounded-lg border transition-all duration-200"
                :class="[
                  selectedPage?.pageId === page.pageId
                    ? (isDarkMode ? 'bg-blue-900/50 border-blue-500 text-white' : 'bg-blue-50 border-blue-500 text-blue-900')
                    : (isDarkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700')
                ]"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium">{{ page.title }}</div>
                    <div class="text-xs mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                      {{ page.items.length }} content items
                    </div>
                  </div>
                  
                  <!-- Status Indicator -->
                  <div class="flex items-center space-x-1">
                    <div 
                      class="h-2 w-2 rounded-full" 
                      :class="getMigrationStatusColor(page.pageId)"
                    ></div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-3">
          <div v-if="selectedPage" class="space-y-6">
            <!-- Page Header -->
            <div class="rounded-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ selectedPage.title }}
                  </h2>
                  <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    {{ selectedPage.description }}
                  </p>
                </div>

                <div class="flex items-center space-x-3">
                  <!-- Migrate This Page -->
                  <button
                    @click="migratePage(selectedPage)"
                    :disabled="migrating"
                    class="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <i class="pi pi-upload"></i>
                    <span>Migrate Page</span>
                  </button>

                  <!-- Save Changes -->
                  <button
                    @click="savePageContent"
                    :disabled="saving"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <i class="pi" :class="saving ? 'pi-spin pi-spinner' : 'pi-save'"></i>
                    <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Content Items -->
            <div class="grid grid-cols-1 gap-6">
              <div
                v-for="item in selectedPage.items"
                :key="item.key"
                class="rounded-lg border p-6 transition-colors duration-300"
                :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-lg font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                      {{ item.label }}
                    </h3>
                    <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                      {{ item.description }}
                    </p>
                  </div>
                  
                  <!-- Type Badge -->
                  <span class="px-2 py-1 text-xs rounded-full" :class="getTypeBadgeClass(item.type)">
                    {{ item.type }}
                  </span>
                </div>

                <!-- Text Input -->
                <div v-if="item.type === 'text'">
                  <input
                    v-model="editContent[item.key]"
                    type="text"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                    :placeholder="item.fallback"
                  />
                </div>

                <!-- HTML/Rich Text -->
                <div v-else-if="item.type === 'html'">
                  <textarea
                    v-model="editContent[item.key]"
                    rows="4"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                    :placeholder="item.fallback"
                  ></textarea>
                </div>

                <!-- Image Upload -->
                <div v-else-if="item.type === 'image'">
                  <div class="space-y-4">
                    <input
                      v-model="editContent[item.key]"
                      type="text"
                      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                      placeholder="Image URL or path"
                    />
                    
                    <!-- Image Preview -->
                    <div v-if="editContent[item.key] || item.fallback" class="mt-4">
                      <img
                        :src="getImageUrl(editContent[item.key] || item.fallback)"
                        :alt="item.label"
                        class="max-w-full h-48 object-cover rounded-lg border"
                        :class="isDarkMode ? 'border-slate-600' : 'border-slate-200'"
                        @error="handleImageError"
                      />
                    </div>
                    
                    <!-- Upload Button -->
                    <div class="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleImageUpload(item.key, $event)"
                        class="hidden"
                        :ref="`fileInput-${item.key}`"
                      />
                      <button
                        @click="$refs[`fileInput-${item.key}`]?.[0]?.click()"
                        class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        :class="isDarkMode ? 'text-white' : 'text-slate-700'"
                      >
                        <i class="pi pi-upload mr-2"></i>
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>

                <!-- URL Input -->
                <div v-else-if="item.type === 'url'">
                  <input
                    v-model="editContent[item.key]"
                    type="url"
                    class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                    :placeholder="item.fallback"
                  />
                </div>

                <!-- Fallback Preview -->
                <div class="mt-3 p-3 rounded border" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
                  <div class="text-xs font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    Current/Default Value:
                  </div>
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                    {{ editContent[item.key] || item.fallback }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Page Selected -->
          <div v-else class="text-center py-12">
            <i class="pi pi-file-edit text-4xl mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"></i>
            <p class="text-lg mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Select a page to start editing
            </p>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
              Choose a page from the sidebar to view and edit its content
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div
      v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-check"></i>
        <span>{{ successMessage }}</span>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { useContentMigrator, type PageContent } from '../../composables/useContentMigrator'
import { usePageContentEditor } from '../../composables/usePageContentEditor'
import axios from '../../plugins/axios'
import { getImageUrl } from '../../utils/imageUrl'

const { 
  loading: migrating, 
  error, 
  migrationStatus, 
  pageContents, 
  migratePage: migratePageContent, 
  migrateAllContent, 
  checkMigrationStatus 
} = useContentMigrator()

// State
const selectedPage = ref<PageContent | null>(null)
const saving = ref(false)
const editContent = reactive<Record<string, string>>({})
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

// Computed
const totalPages = computed(() => pageContents.length)
const migratedCount = computed(() => {
  return Object.values(migrationStatus).filter(status => status === 'success').length
})
const allMigrated = computed(() => migratedCount.value === totalPages.value)

// Get page content editor for selected page
const pageEditor = computed(() => {
  if (selectedPage.value) {
    return usePageContentEditor(selectedPage.value.pageId)
  }
  return null
})

// Methods
const selectPage = async (page: PageContent) => {
  selectedPage.value = page
  
  // Clear previous content
  Object.keys(editContent).forEach(key => delete editContent[key])
  
  // Load current content from CMS
  if (pageEditor.value) {
    await pageEditor.value.loadPageContent()
    
    // Initialize edit content with current CMS content or fallbacks
    page.items.forEach(item => {
      editContent[item.key] = pageEditor.value?.getContent(item.key, item.fallback) || item.fallback
    })
  }
}

const migratePage = async (page: PageContent) => {
  try {
    await migratePageContent(page)
    showSuccessMessage(`✅ Successfully migrated ${page.title}`)
  } catch (err) {
    showErrorMessage(`❌ Failed to migrate ${page.title}`)
  }
}

const migrateAll = async () => {
  try {
    const result = await migrateAllContent()
    showSuccessMessage(`✅ Migration completed: ${result.successCount}/${result.totalCount} pages`)
  } catch (err) {
    showErrorMessage('❌ Migration failed')
  }
}

const savePageContent = async () => {
  if (!selectedPage.value || !pageEditor.value) return
  
  saving.value = true
  
  try {
    await pageEditor.value.savePageContent(editContent)
    showSuccessMessage(`✅ Successfully saved ${selectedPage.value.title}`)
  } catch (err) {
    showErrorMessage(`❌ Failed to save ${selectedPage.value.title}`)
  } finally {
    saving.value = false
  }
}

const handleImageUpload = async (key: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    try {
      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload to backend
      const response = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      if (response.data.success) {
        editContent[key] = response.data.data.url
        showSuccessMessage('Image uploaded successfully!')
      } else {
        throw new Error(response.data.error || 'Upload failed')
      }
      
    } catch (error) {
      console.error('Upload error:', error)
      showErrorMessage('Failed to upload image')
    }
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const getMigrationStatusColor = (pageId: string) => {
  const status = migrationStatus[pageId]
  switch (status) {
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-yellow-500'
  }
}

const getTypeBadgeClass = (type: string) => {
  const baseClass = 'px-2 py-1 text-xs rounded-full'
  switch (type) {
    case 'text': return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
    case 'html': return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
    case 'image': return `${baseClass} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`
    case 'url': return `${baseClass} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`
    default: return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
  }
}

const showSuccessMessage = (message: string) => {
  successMessage.value = message
  setTimeout(() => { successMessage.value = null }, 5000)
}

const showErrorMessage = (message: string) => {
  errorMessage.value = message
  setTimeout(() => { errorMessage.value = null }, 5000)
}

// Lifecycle
onMounted(async () => {
  await checkMigrationStatus()
  
  // Auto-select first page
  if (pageContents.length > 0) {
    await selectPage(pageContents[0])
  }
})
</script>
