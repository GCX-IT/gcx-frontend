<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNewsManagement } from '../../composables/useNews'
import { newsService, type NewsItem } from '../../services/newsService'
import { isDarkMode } from '../../utils/darkMode'

// State
const newsItems = ref<NewsItem[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const showCreateForm = ref(false)
const editingItem = ref<NewsItem | null>(null)

// Form data
const formData = ref({
  title: '',
  content: '',
  source: 'gcx' as const,
  source_name: '',
  source_url: '',
  category: '',
  priority: 0,
  is_breaking: false,
  status: 'draft' as const
})

// Computed
const { isSubmitting, submitError, createNewsItem, updateNewsItem, deleteNewsItem, publishNewsItem, archiveNewsItem, setBreakingNews } = useNewsManagement()

const publishedNews = computed(() => newsItems.value.filter(item => item.status === 'published'))
const draftNews = computed(() => newsItems.value.filter(item => item.status === 'draft'))
const archivedNews = computed(() => newsItems.value.filter(item => item.status === 'archived'))

// Methods
const fetchNewsItems = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const response = await newsService.getAllNewsItems({ limit: 50 })
    if (response.success) {
      newsItems.value = response.data
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch news items'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    content: '',
    source: 'gcx',
    source_name: '',
    source_url: '',
    category: '',
    priority: 0,
    is_breaking: false,
    status: 'draft'
  }
  editingItem.value = null
  showCreateForm.value = false
}

const editItem = (item: NewsItem) => {
  editingItem.value = item
  formData.value = {
    title: item.title,
    content: item.content,
    source: item.source,
    source_name: item.source_name || '',
    source_url: item.source_url || '',
    category: item.category || '',
    priority: item.priority,
    is_breaking: item.is_breaking,
    status: item.status
  }
  showCreateForm.value = true
}

const saveItem = async () => {
  try {
    if (editingItem.value) {
      await updateNewsItem({
        id: editingItem.value.id,
        ...formData.value
      })
    } else {
      await createNewsItem(formData.value)
    }
    
    await fetchNewsItems()
    resetForm()
  } catch (err) {
    console.error('Error saving news item:', err)
  }
}

const deleteItem = async (item: NewsItem) => {
  if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
    try {
      await deleteNewsItem(item.id)
      await fetchNewsItems()
    } catch (err) {
      console.error('Error deleting news item:', err)
    }
  }
}

const publishItem = async (item: NewsItem) => {
  try {
    await publishNewsItem(item.id)
    await fetchNewsItems()
  } catch (err) {
    console.error('Error publishing news item:', err)
  }
}

const archiveItem = async (item: NewsItem) => {
  try {
    await archiveNewsItem(item.id)
    await fetchNewsItems()
  } catch (err) {
    console.error('Error archiving news item:', err)
  }
}

const toggleBreaking = async (item: NewsItem) => {
  try {
    await setBreakingNews(item.id, !item.is_breaking)
    await fetchNewsItems()
  } catch (err) {
    console.error('Error updating breaking news status:', err)
  }
}

const getStatusColor = (status: string) => {
  if (isDarkMode.value) {
    switch (status) {
      case 'published': return 'bg-green-900/30 text-green-300 border border-green-800'
      case 'draft': return 'bg-yellow-900/30 text-yellow-300 border border-yellow-800'
      case 'archived': return 'bg-slate-700 text-slate-300 border border-slate-600'
      default: return 'bg-slate-700 text-slate-300 border border-slate-600'
    }
  } else {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
}

const getSourceColor = (source: string) => {
  if (isDarkMode.value) {
    switch (source) {
      case 'gcx': return 'bg-blue-900/30 text-blue-300 border border-blue-800'
      case 'partner': return 'bg-purple-900/30 text-purple-300 border border-purple-800'
      case 'external': return 'bg-orange-900/30 text-orange-300 border border-orange-800'
      case 'api': return 'bg-cyan-900/30 text-cyan-300 border border-cyan-800'
      case 'firebase': return 'bg-red-900/30 text-red-300 border border-red-800'
      default: return 'bg-slate-700 text-slate-300 border border-slate-600'
    }
  } else {
    switch (source) {
      case 'gcx': return 'bg-blue-100 text-blue-800'
      case 'partner': return 'bg-purple-100 text-purple-800'
      case 'external': return 'bg-orange-100 text-orange-800'
      case 'api': return 'bg-cyan-100 text-cyan-800'
      case 'firebase': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }
}

// Lifecycle
onMounted(() => {
  fetchNewsItems()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">News Ticker Management</h1>
        <p class="mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Manage news items for the website ticker</p>
      </div>
      <button
        @click="showCreateForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
      >
        <i class="pi pi-plus"></i>
        <span>Add News Item</span>
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="rounded-lg p-4 border" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
      <div class="flex items-center space-x-2">
        <i class="pi pi-exclamation-triangle" :class="isDarkMode ? 'text-red-400' : 'text-red-600'"></i>
        <span :class="isDarkMode ? 'text-red-300' : 'text-red-800'">{{ error }}</span>
      </div>
    </div>

    <!-- Create/Edit Form -->
    <div v-if="showCreateForm" class="rounded-lg p-6 border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        {{ editingItem ? 'Edit News Item' : 'Create News Item' }}
      </h2>
      
      <form @submit.prevent="saveItem" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Title *</label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border border-gray-300 bg-white text-gray-900'"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Source</label>
            <select
              v-model="formData.source"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border border-gray-300 bg-white text-gray-900'"
            >
              <option value="gcx">GCX</option>
              <option value="partner">Partner</option>
              <option value="external">External</option>
              <option value="api">API</option>
              <option value="firebase">Firebase</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Content</label>
          <textarea
            v-model="formData.content"
            rows="3"
            class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border border-gray-300 bg-white text-gray-900'"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Category</label>
            <input
              v-model="formData.category"
              type="text"
              placeholder="e.g., market, announcement"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border border-gray-300 bg-white text-gray-900'"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Priority</label>
            <input
              v-model.number="formData.priority"
              type="number"
              min="0"
              max="10"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border border-gray-300 bg-white text-gray-900'"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Status</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border border-gray-300 bg-white text-gray-900'"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Source Name</label>
            <input
              v-model="formData.source_name"
              type="text"
              placeholder="Organization name"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border border-gray-300 bg-white text-gray-900'"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Source URL</label>
            <input
              v-model="formData.source_url"
              type="url"
              placeholder="https://example.com"
              class="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'border border-gray-300 bg-white text-gray-900'"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center space-x-2">
            <input
              v-model="formData.is_breaking"
              type="checkbox"
              class="rounded text-blue-600 focus:ring-blue-500 transition-colors"
              :class="isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300'"
            />
            <span class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Breaking News</span>
          </label>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 rounded-lg transition-colors"
            :class="isDarkMode ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? 'Saving...' : (editingItem ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>

    <!-- News Items List -->
    <div class="space-y-6">
      <!-- Published News -->
      <div v-if="publishedNews.length > 0">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Published News ({{ publishedNews.length }})</h2>
        <div class="grid gap-4">
          <div
            v-for="item in publishedNews"
            :key="item.id"
            class="rounded-lg p-4 border transition-all hover:shadow-md"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ item.title }}</h3>
                <p v-if="item.content" class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ item.content.substring(0, 100) }}...</p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <span v-if="item.is_breaking" class="px-2 py-1 text-xs font-medium rounded-full border" :class="isDarkMode ? 'bg-red-900/30 text-red-300 border-red-800' : 'bg-red-100 text-red-800'">
                  BREAKING
                </span>
                <span :class="getStatusColor(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.status }}
                </span>
                <span :class="getSourceColor(item.source)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.source }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
                <span v-if="item.source_name">{{ item.source_name }} • </span>
                {{ newsService.formatTimeAgo(item.created_at) }}
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="toggleBreaking(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="item.is_breaking 
                    ? (isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' : 'bg-red-100 text-red-700 hover:bg-red-200')
                    : (isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
                >
                  {{ item.is_breaking ? 'Unset Breaking' : 'Set Breaking' }}
                </button>
                <button
                  @click="editItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                >
                  Edit
                </button>
                <button
                  @click="archiveItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  Archive
                </button>
                <button
                  @click="deleteItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Draft News -->
      <div v-if="draftNews.length > 0">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Draft News ({{ draftNews.length }})</h2>
        <div class="grid gap-4">
          <div
            v-for="item in draftNews"
            :key="item.id"
            class="rounded-lg p-4 border transition-all hover:shadow-md"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-200 hover:shadow-lg'"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ item.title }}</h3>
                <p v-if="item.content" class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ item.content.substring(0, 100) }}...</p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <span :class="getStatusColor(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.status }}
                </span>
                <span :class="getSourceColor(item.source)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.source }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
                <span v-if="item.source_name">{{ item.source_name }} • </span>
                {{ newsService.formatTimeAgo(item.created_at) }}
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="publishItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-green-900/30 text-green-300 hover:bg-green-900/40' : 'bg-green-100 text-green-700 hover:bg-green-200'"
                >
                  Publish
                </button>
                <button
                  @click="editItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Archived News -->
      <div v-if="archivedNews.length > 0">
        <h2 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Archived News ({{ archivedNews.length }})</h2>
        <div class="grid gap-4">
          <div
            v-for="item in archivedNews"
            :key="item.id"
            class="rounded-lg p-4 border opacity-75"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ item.title }}</h3>
                <p v-if="item.content" class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ item.content.substring(0, 100) }}...</p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <span :class="getStatusColor(item.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.status }}
                </span>
                <span :class="getSourceColor(item.source)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ item.source }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center mt-3">
              <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
                <span v-if="item.source_name">{{ item.source_name }} • </span>
                {{ newsService.formatTimeAgo(item.created_at) }}
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  @click="editItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'"
                >
                  Edit
                </button>
                <button
                  @click="deleteItem(item)"
                  class="px-2 py-1 text-xs rounded transition-colors"
                  :class="isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/40' : 'bg-red-100 text-red-700 hover:bg-red-200'"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="newsItems.length === 0 && !isLoading" class="text-center py-12">
        <i class="pi pi-newspaper text-6xl mb-4" :class="isDarkMode ? 'text-slate-600' : 'text-gray-300'"></i>
        <h3 class="text-lg font-medium mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">No news items yet</h3>
        <p class="mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Create your first news item to get started</p>
        <button
          @click="showCreateForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create News Item
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl" :class="isDarkMode ? 'text-slate-500' : 'text-gray-400'"></i>
      <p class="mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Loading news items...</p>
    </div>
  </div>
</template>
