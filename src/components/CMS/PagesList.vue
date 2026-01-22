<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContentMigrator } from '../../composables/useContentMigrator'
import { isDarkMode } from '../../utils/darkMode'


interface Page {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published' | 'private' | 'archived'
  author: {
    name: string
  }
  created_at: string
  updated_at: string
  published_at?: string
}

const { pageContents } = useContentMigrator()

// State
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('updated_at')
const sortOrder = ref('desc')
const selectedPages = ref<number[]>([])
const viewMode = ref<'grid' | 'list'>('list')
const showFilters = ref(false)

// Convert content migrator pages to the expected format
const pages = computed(() => {
  return pageContents.map((content: any, index: number) => ({
    id: index + 1,
    title: content.title,
    slug: content.pageId,
    status: 'published' as const,
    author: {
      name: 'GCX Admin'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  }))
})

// Computed
const filteredPages = computed(() => {
  let filtered = pages.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((page: Page) => 
      page.title.toLowerCase().includes(query) ||
      page.slug.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter((page: Page) => page.status === statusFilter.value)
  }

  // Sort
  filtered.sort((a: Page, b: Page) => {
    const aValue = a[sortBy.value as keyof Page]
    const bValue = b[sortBy.value as keyof Page]
    
    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})

const statusCounts = computed(() => {
  const counts = {
    all: pages.value.length,
    draft: 0,
    published: 0,
    private: 0,
    archived: 0
  }
  
  pages.value.forEach((page: Page) => {
    counts[page.status as keyof typeof counts]++
  })
  
  return counts
})

// Additional computed properties
const hasSelectedPages = computed(() => selectedPages.value.length > 0)
const allPagesSelected = computed(() => selectedPages.value.length === pages.value.length && pages.value.length > 0)
const somePagesSelected = computed(() => selectedPages.value.length > 0 && selectedPages.value.length < pages.value.length)

// Methods

const deletePage = async (pageId: number) => {
  if (!confirm('Are you sure you want to delete this page?')) return
  
  try {
    // For migrated pages, we can't actually delete them from the content migrator
    // This is just a placeholder - in a real implementation, you'd need to handle this differently
    // Page deletion not allowed for migrated pages
  } catch (err) {
    console.error('Error deleting page:', err)
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    private: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
  return colors[status as keyof typeof colors] || colors.draft
}

const navigateToContentManager = () => {
  // Emit event to parent to navigate to content manager
  emit('navigate', 'content-manager')
}

// Selection methods
const togglePageSelection = (pageId: number) => {
  const index = selectedPages.value.indexOf(pageId)
  if (index > -1) {
    selectedPages.value.splice(index, 1)
  } else {
    selectedPages.value.push(pageId)
  }
}

const toggleSelectAll = () => {
  if (allPagesSelected.value) {
    selectedPages.value = []
  } else {
    selectedPages.value = pages.value.map(page => page.id)
  }
}

const clearSelection = () => {
  selectedPages.value = []
}

// Bulk actions
const bulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedPages.value.length} pages?`)) return
  
  try {
    // Bulk delete functionality
    clearSelection()
  } catch (err) {
    console.error('Error in bulk delete:', err)
  }
}

const bulkPublish = async () => {
  try {
    // Bulk publish functionality
    clearSelection()
  } catch (err) {
    console.error('Error in bulk publish:', err)
  }
}

const bulkArchive = async () => {
  try {
    // Bulk archive functionality
    clearSelection()
  } catch (err) {
    console.error('Error in bulk archive:', err)
  }
}

// View methods
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Page actions
const editPage = (page: Page) => {
  emit('edit', page)
}

const duplicatePage = (page: Page) => {
  // Duplicate page functionality
}

const previewPage = (page: Page) => {
  // Preview page functionality
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Emits
const emit = defineEmits<{
  edit: [page: Page]
  create: []
  navigate: [section: string]
}>()

</script>

<template>
  <div class="space-y-6">
    <!-- Enhanced Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <i class="pi pi-file text-green-600 dark:text-green-400 text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Website Pages
            </h1>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              Manage and organize your website content
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button
          @click="toggleViewMode"
          class="inline-flex items-center px-3 py-2 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          :class="isDarkMode ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-600'"
        >
          <i :class="viewMode === 'list' ? 'pi pi-list' : 'pi pi-th-large'" class="mr-2"></i>
          {{ viewMode === 'list' ? 'List' : 'Grid' }}
        </button>
        
        <button
          @click="navigateToContentManager"
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          <i class="pi pi-plus mr-2"></i>
          New Page
        </button>
      </div>
    </div>

    <!-- Enhanced Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div 
        v-for="(count, status) in statusCounts" 
        :key="status"
        class="rounded-xl border p-4 cursor-pointer transition-all duration-200 group hover:shadow-lg"
        :class="[
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
          statusFilter === status ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : ''
        ]"
        @click="statusFilter = status"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ count }}
          </div>
          <div class="w-2 h-2 rounded-full" :class="getStatusColor(status).split(' ')[0]"></div>
        </div>
        <div class="text-sm font-medium capitalize" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          {{ status === 'all' ? 'Total' : status }}
        </div>
      </div>
    </div>

    <!-- Bulk Actions Bar -->
    <div 
      v-if="hasSelectedPages"
      class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
    >
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-blue-700 dark:text-blue-300">
          {{ selectedPages.length }} page{{ selectedPages.length > 1 ? 's' : '' }} selected
        </span>
        <button
          @click="clearSelection"
          class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          Clear selection
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          @click="bulkPublish"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded-md transition-colors"
        >
          <i class="pi pi-check mr-1"></i>
          Publish
        </button>
        <button
          @click="bulkArchive"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 rounded-md transition-colors"
        >
          <i class="pi pi-archive mr-1"></i>
          Archive
        </button>
        <button
          @click="bulkDelete"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-md transition-colors"
        >
          <i class="pi pi-trash mr-1"></i>
          Delete
        </button>
      </div>
    </div>

    <!-- Enhanced Filters and Search -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search pages by title or slug..."
              class="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 placeholder-slate-500'"
            />
          </div>
        </div>
        
        <!-- Sort and Filter Controls -->
        <div class="flex gap-3">
          <select
            v-model="sortBy"
            class="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
          >
            <option value="updated_at">Last Updated</option>
            <option value="created_at">Created Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          
          <button
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
            class="px-4 py-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            :class="isDarkMode ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-600'"
            :title="sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
          >
            <i :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"></i>
          </button>
          
          <button
            @click="toggleFilters"
            class="px-4 py-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            :class="[
              isDarkMode ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-600',
              showFilters ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : ''
            ]"
            title="Toggle Advanced Filters"
          >
            <i class="pi pi-filter"></i>
          </button>
        </div>
      </div>
      
      <!-- Advanced Filters (Collapsible) -->
      <div v-if="showFilters" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Author
            </label>
            <select class="w-full px-3 py-2 border rounded-lg" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'">
              <option value="">All Authors</option>
              <option value="admin">GCX Admin</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Date Range
            </label>
            <input
              type="date"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Content Type
            </label>
            <select class="w-full px-3 py-2 border rounded-lg" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'">
              <option value="">All Types</option>
              <option value="page">Page</option>
              <option value="post">Post</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Pages Table -->
    <div class="rounded-xl border overflow-hidden shadow-sm" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="allPagesSelected"
                    :indeterminate="somePagesSelected"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span>Title</span>
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Author
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Updated
              </th>
              <th class="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-slate-200'">
            <tr v-if="pages.length === 0 && !searchQuery" class="animate-pulse">
              <td colspan="5" class="px-6 py-12 text-center" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                <i class="pi pi-spin pi-spinner text-2xl mr-2"></i>
                Loading pages...
              </td>
            </tr>
            
            <tr v-else-if="filteredPages.length === 0" class="text-center">
              <td colspan="5" class="px-6 py-12" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                <i class="pi pi-file text-4xl mb-4 block"></i>
                <div v-if="pages.length === 0">
                  <p class="text-lg font-medium mb-2">No migrated pages found</p>
                  <p class="text-sm">Go to Content Manager to manage your website content</p>
                </div>
                <div v-else>
                  <p class="text-lg font-medium mb-2">No pages match your search</p>
                  <p class="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
            
            <tr 
              v-else
              v-for="page in filteredPages" 
              :key="page.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              :class="selectedPages.includes(page.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="selectedPages.includes(page.id)"
                    @change="togglePageSelection(page.id)"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <div class="flex-1">
                    <div class="font-medium flex items-center gap-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                      <i class="pi pi-file text-slate-400"></i>
                      {{ page.title }}
                    </div>
                    <div class="text-sm flex items-center gap-2 mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                      <i class="pi pi-link text-xs"></i>
                      /{{ page.slug }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  :class="getStatusColor(page.status)"
                >
                  <i class="pi pi-circle-fill text-xs mr-1.5"></i>
                  {{ page.status }}
                </span>
              </td>
              
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <i class="pi pi-user text-xs text-green-600 dark:text-green-400"></i>
                  </div>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    {{ page.author.name }}
                  </span>
                </div>
              </td>
              
              <td class="px-6 py-4">
                <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ formatDate(page.updated_at) }}
                </div>
              </td>
              
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="previewPage(page)"
                    class="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Preview page"
                  >
                    <i class="pi pi-eye"></i>
                  </button>
                  <button
                    @click="editPage(page)"
                    class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit page"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="duplicatePage(page)"
                    class="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Duplicate page"
                  >
                    <i class="pi pi-copy"></i>
                  </button>
                  <button
                    @click="deletePage(page.id)"
                    class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete page"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
