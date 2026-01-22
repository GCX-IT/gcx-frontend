<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { useBlog } from '../../composables/useBlog'
import { useAuth } from '../../composables/useAuth'
import { formatRelativeTime } from '../../utils/cms'
import type { BlogPost } from '../../types/cms'

interface Emits {
  (e: 'edit', post: BlogPost): void
  (e: 'create'): void
}

const emit = defineEmits<Emits>()
const { t } = useI18n()

const { posts, fetchPosts, deletePost, isLoading, error, publishedPosts, draftPosts, privatePosts } = useBlog()
const { user, isAdmin } = useAuth()

// UI State
const selectedStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const postsPerPage = 10
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')



// Computed properties
const statusOptions = [
  { value: 'all', label: 'All Posts', count: computed(() => posts.value.length) },
  { value: 'published', label: 'Published', count: computed(() => publishedPosts.value.length) },
  { value: 'draft', label: 'Drafts', count: computed(() => draftPosts.value.length) },
  { value: 'private', label: 'Private', count: computed(() => privatePosts.value.length) }
]

const filteredPosts = computed(() => {
  let filtered = posts.value

  // Filter by status
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(post => post.status === selectedStatus.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.author?.name.toLowerCase().includes(query) ||
      (Array.isArray(post.tags) ? post.tags.some(tag => tag.toLowerCase().includes(query)) : false)
    )
  }

  // Sort posts
  filtered.sort((a, b) => {
    let aValue = a[sortBy.value as keyof BlogPost] as any
    let bValue = b[sortBy.value as keyof BlogPost] as any

    if (sortBy.value === 'created_at' || sortBy.value === 'updated_at') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    return sortOrder.value === 'desc' ? -result : result
  })

  return filtered
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

// Methods
onMounted(async () => {
  await fetchPosts()
})

const handleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'desc'
  }
}

const handleDelete = async (post: BlogPost) => {
  if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
    return
  }

  try {
    const result = await deletePost(post.id)
    if (result.success) {
      // Post will be automatically removed from the store
    }
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

const canEditPost = (post: BlogPost): boolean => {
  return isAdmin.value || post.author?.id === user.value?.id
}

const getAuthorName = (post: BlogPost): string => {
  return post.author?.name || 'Unknown Author'
}

// Clean excerpt from HTML and tips
const getCleanExcerpt = (post: BlogPost): string => {
  let excerpt = post.excerpt || ''
  
  // If excerpt is empty, try to extract from content
  if (!excerpt && post.content) {
    // Remove HTML tags and get plain text
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = post.content
    excerpt = tempDiv.textContent || tempDiv.innerText || ''
  }
  
  // Remove tip text and other unwanted content
  excerpt = excerpt
    .replace(/💡 Tip:.*$/g, '') // Remove tip text
    .replace(/trying to test.*$/g, '') // Remove test text
    .trim()
  
  // Limit to 100 characters
  if (excerpt.length > 100) {
    excerpt = excerpt.substring(0, 100) + '...'
  }
  
  return excerpt || 'No excerpt available'
}

// Format date as "Aug 18, 2025"
const getShortDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

const clearFilters = () => {
  selectedStatus.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

const exportPosts = () => {
  // TODO: Implement export functionality
  // Export functionality
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div>
        <h1 class="text-4xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
          Blog Posts
        </h1>
        <p class="mt-3 text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
          Manage your blog posts and content
        </p>
      </div>
      
      <div class="flex gap-4">
        <button
          @click="exportPosts"
          class="px-6 py-3 border rounded-lg font-medium transition-colors duration-200"
          :class="isDarkMode 
            ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export
        </button>
        
        <button
          @click="emit('create')"
          class="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-4 rounded-lg bg-red-50 border border-red-200">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col lg:flex-row gap-6 p-8 rounded-2xl shadow-lg border"
         :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      
      <!-- Status Filter -->
      <div class="flex flex-wrap gap-3">
        <button
          v-for="status in statusOptions"
          :key="status.value"
          @click="selectedStatus = status.value; currentPage = 1"
          class="px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200"
          :class="selectedStatus === status.value
            ? 'bg-green-600 text-white'
            : (isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')"
        >
          {{ status.label }}
          <span class="ml-2 px-3 py-1 rounded-full text-sm font-bold"
                :class="selectedStatus === status.value 
                  ? 'bg-white/20 text-white' 
                  : (isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-white text-gray-600')"
          >
            {{ status.count.value }}
          </span>
        </button>
      </div>

      <!-- Search -->
      <div class="flex-1 max-w-lg">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search posts..."
            class="w-full pl-12 pr-6 py-4 text-lg border rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors duration-200"
            :class="isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
          />
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Clear Filters -->
      <button
        v-if="selectedStatus !== 'all' || searchQuery"
        @click="clearFilters"
        class="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        Clear Filters
      </button>
    </div>

    <!-- Posts Table -->
    <div class="rounded-2xl border-2 overflow-hidden shadow-xl" 
         :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <svg class="animate-spin h-8 w-8 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Loading posts...
        </p>
      </div>

      <!-- Table -->
      <div v-else-if="paginatedPosts.length > 0" class="overflow-x-auto">
        <table class="w-full">
          <thead class="border-b-2" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'"
                  @click="handleSort('title')">
                <div class="flex items-center">
                  Title
                  <svg v-if="sortBy === 'title'" class="ml-1 w-4 h-4" :class="sortOrder === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Author
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'"
                  @click="handleSort('created_at')">
                <div class="flex items-center">
                  Created
                  <svg v-if="sortBy === 'created_at'" class="ml-1 w-4 h-4" :class="sortOrder === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'"
                  @click="handleSort('updated_at')">
                <div class="flex items-center">
                  Updated
                  <svg v-if="sortBy === 'updated_at'" class="ml-1 w-4 h-4" :class="sortOrder === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-slate-200'">
            <tr v-for="post in paginatedPosts" :key="post.id" 
                class="border-b"
                :class="isDarkMode ? 'border-slate-600' : 'border-gray-200'"
            >
              
              <!-- Title & Excerpt -->
              <td class="px-6 py-4">
                <div class="flex items-start space-x-3">
                  <div v-if="post.featured_image" class="flex-shrink-0">
                    <img :src="post.featured_image" :alt="post.title" class="w-10 h-10 rounded-lg object-cover" />
                  </div>
                  <div class="flex-1 min-w-0 max-w-md">
                    <h3 class="text-sm font-semibold truncate" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                      {{ post.title }}
                    </h3>
                    <p class="text-xs mt-1 line-clamp-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                      {{ getCleanExcerpt(post) }}
                    </p>
                    <div v-if="Array.isArray(post.tags) && post.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                      <span
                        v-for="tag in post.tags.slice(0, 2)"
                        :key="tag"
                        class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      >
                        {{ tag }}
                      </span>
                      <span v-if="post.tags.length > 2" class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                        +{{ post.tags.length - 2 }}
                      </span>
                    </div>

                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      :class="post.status === 'published' ? 'bg-green-100 text-green-800' : 
                              post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'">
                  {{ post.status }}
                </span>
              </td>

              <!-- Author -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  {{ getAuthorName(post).split(' ')[0] }}
                </div>
              </td>

              <!-- Created Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  {{ formatRelativeTime(post.created_at) }}
                </div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
                  {{ getShortDate(post.created_at) }}
                </div>
              </td>

              <!-- Updated Date -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  {{ formatRelativeTime(post.updated_at) }}
                </div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
                  {{ getShortDate(post.updated_at) }}
                </div>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <a
                    :href="`/blog/${post.slug}`"
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Post"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </a>
                  
                  <button
                    v-if="canEditPost(post)"
                    @click="emit('edit', post)"
                    class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    title="Edit Post"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    v-if="canEditPost(post)"
                    @click="handleDelete(post)"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete Post"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">
          {{ searchQuery || selectedStatus !== 'all' ? 'No posts found' : 'No blog posts yet' }}
        </h3>
        <p class="mt-1 text-sm" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">
          {{ searchQuery || selectedStatus !== 'all' ? 'Try adjusting your filters.' : 'Get started by creating your first blog post.' }}
        </p>
        <div v-if="!searchQuery && selectedStatus === 'all'" class="mt-6">
          <button
            @click="emit('create')"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Create First Post
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
        Showing {{ Math.min((currentPage - 1) * postsPerPage + 1, filteredPosts.length) }} to 
        {{ Math.min(currentPage * postsPerPage, filteredPosts.length) }} of 
        {{ filteredPosts.length }} posts
      </div>
      
      <div class="flex space-x-1">
        <button
          @click="currentPage = currentPage - 1"
          :disabled="currentPage <= 1"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDarkMode 
            ? 'text-slate-300 hover:bg-slate-700 disabled:hover:bg-transparent' 
            : 'text-slate-700 hover:bg-slate-100 disabled:hover:bg-transparent'"
        >
          Previous
        </button>
        
        <button
          v-for="page in Math.min(totalPages, 5)"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="currentPage === page
            ? 'bg-green-600 text-white'
            : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-100')"
        >
          {{ page }}
        </button>
        
        <button
          @click="currentPage = currentPage + 1"
          :disabled="currentPage >= totalPages"
          class="px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isDarkMode 
            ? 'text-slate-300 hover:bg-slate-700 disabled:hover:bg-transparent' 
            : 'text-slate-700 hover:bg-slate-100 disabled:hover:bg-transparent'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Line clamp for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  max-height: 2.8em;
}

/* Clean transitions for interactive elements */
button, input, select {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Professional focus states */
input:focus, select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Simplified table rows - no distracting hover effects */
tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: rgba(248, 250, 252, 0.8);
}

.dark tbody tr:hover {
  background-color: rgba(30, 41, 59, 0.5);
}
</style>
