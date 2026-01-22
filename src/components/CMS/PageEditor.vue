<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { useCMS } from '../../composables/useCMS'
import { isDarkMode } from '../../utils/darkMode'

interface Page {
  id?: number
  title: string
  slug: string
  content: string
  excerpt: string
  template: string
  status: 'draft' | 'published' | 'private' | 'archived'
  featured_image?: string
  meta_title: string
  meta_description: string
  meta_keywords: string
  parent_id?: number
  sort_order: number
}

interface Props {
  page?: Page | null
  isEditing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  page: null,
  isEditing: false
})

const { t } = useI18n()
const { pages: pagesAPI, loading, error } = useCMS()

// State
const saving = ref(false)
const formData = ref<Page>({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  template: 'default',
  status: 'draft',
  featured_image: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  parent_id: undefined,
  sort_order: 0
})

const errors = ref<Record<string, string>>({})

// Computed
const pageTitle = computed(() => {
  return props.isEditing ? 'Edit Page' : 'Create New Page'
})

const isFormValid = computed(() => {
  return formData.value.title.trim() !== '' && 
         formData.value.slug.trim() !== '' &&
         Object.keys(errors.value).length === 0
})

// Methods
const generateSlug = () => {
  if (formData.value.title) {
    formData.value.slug = formData.value.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!formData.value.slug.trim()) {
    errors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(formData.value.slug)) {
    errors.value.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
  }
  
  if (formData.value.meta_title && formData.value.meta_title.length > 60) {
    errors.value.meta_title = 'Meta title should be 60 characters or less'
  }
  
  if (formData.value.meta_description && formData.value.meta_description.length > 160) {
    errors.value.meta_description = 'Meta description should be 160 characters or less'
  }
}

const savePage = async () => {
  validateForm()
  
  if (!isFormValid.value) return
  
  saving.value = true
  
  try {
    let savedPage
    if (props.isEditing && formData.value.id) {
      savedPage = await pagesAPI.update(formData.value.id, formData.value)
    } else {
      savedPage = await pagesAPI.create(formData.value)
    }
    
    emit('saved', savedPage)
  } catch (err) {
    console.error('Error saving page:', err)
  } finally {
    saving.value = false
  }
}

const previewPage = () => {
  // Open preview in new tab
  const previewUrl = `/preview/${formData.value.slug}`
  window.open(previewUrl, '_blank')
}

// Emits
const emit = defineEmits<{
  saved: [page: Page]
  cancelled: []
}>()

// Initialize form data
onMounted(() => {
  if (props.page) {
    formData.value = { ...props.page }
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ pageTitle }}
        </h1>
        <p class="mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          {{ isEditing ? 'Edit your page content and settings' : 'Create a new page for your website' }}
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <button
          @click="previewPage"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          :class="isDarkMode ? 'text-white' : 'text-slate-700'"
        >
          <i class="pi pi-eye mr-2"></i>
          Preview
        </button>
        
        <button
          @click="emit('cancelled')"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          :class="isDarkMode ? 'text-white' : 'text-slate-700'"
        >
          Cancel
        </button>
        
        <button
          @click="savePage"
          :disabled="!isFormValid || saving"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors"
        >
          <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
          <i v-else class="pi pi-save mr-2"></i>
          {{ saving ? 'Saving...' : 'Save Page' }}
        </button>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="savePage" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title and Slug -->
          <div class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Page Content
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Title *
                </label>
                <input
                  v-model="formData.title"
                  @input="generateSlug"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="[
                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                    errors.title ? 'border-red-500' : ''
                  ]"
                  placeholder="Enter page title"
                />
                <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  URL Slug *
                </label>
                <div class="flex">
                  <span class="inline-flex items-center px-3 rounded-l-lg border border-r-0" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-300 text-slate-500'">
                    /
                  </span>
                  <input
                    v-model="formData.slug"
                    type="text"
                    class="flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    :class="[
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                      errors.slug ? 'border-red-500' : ''
                    ]"
                    placeholder="url-slug"
                  />
                </div>
                <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Excerpt
                </label>
                <textarea
                  v-model="formData.excerpt"
                  rows="3"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                  placeholder="Brief description of the page"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Content *
                </label>
                <textarea
                  v-model="formData.content"
                  rows="12"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                  placeholder="Write your page content here... (HTML supported)"
                ></textarea>
                <p class="mt-1 text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  You can use HTML tags for formatting
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Status
            </h3>
            
            <div class="space-y-3">
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="draft"
                  class="mr-3"
                />
                <span :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Draft</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="published"
                  class="mr-3"
                />
                <span :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Published</span>
              </label>
              
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="private"
                  class="mr-3"
                />
                <span :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Private</span>
              </label>
            </div>
          </div>

          <!-- SEO Settings -->
          <div class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              SEO Settings
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Meta Title
                </label>
                <input
                  v-model="formData.meta_title"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="[
                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                    errors.meta_title ? 'border-red-500' : ''
                  ]"
                  placeholder="SEO title"
                />
                <p v-if="errors.meta_title" class="mt-1 text-sm text-red-600">{{ errors.meta_title }}</p>
                <p class="mt-1 text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ formData.meta_title.length }}/60 characters
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Meta Description
                </label>
                <textarea
                  v-model="formData.meta_description"
                  rows="3"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="[
                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                    errors.meta_description ? 'border-red-500' : ''
                  ]"
                  placeholder="SEO description"
                ></textarea>
                <p v-if="errors.meta_description" class="mt-1 text-sm text-red-600">{{ errors.meta_description }}</p>
                <p class="mt-1 text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  {{ formData.meta_description.length }}/160 characters
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Meta Keywords
                </label>
                <input
                  v-model="formData.meta_keywords"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <!-- Page Settings -->
          <div class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Page Settings
            </h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Template
                </label>
                <select
                  v-model="formData.template"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                >
                  <option value="default">Default</option>
                  <option value="full-width">Full Width</option>
                  <option value="sidebar">With Sidebar</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Sort Order
                </label>
                <input
                  v-model.number="formData.sort_order"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
