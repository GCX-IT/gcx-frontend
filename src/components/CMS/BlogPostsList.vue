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
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header with Modern Design -->
    <div class="p-8 rounded-3xl border transition-all duration-500 shadow-xl" 
         :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div class="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-500 mb-2">
            <i class="pi pi-file-edit"></i>
            <span>Editorial Hub</span>
          </div>
          <h1 class="text-4xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Blog Posts
          </h1>
          <p class="mt-2 text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Manage your articles, announcements, and market insights.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button
            @click="exportPosts"
            class="p-3 rounded-2xl border transition-all duration-300 active:scale-95 shadow-sm"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
            title="Export Data"
          >
            <i class="pi pi-download"></i>
          </button>
          
          <button
            @click="emit('create')"
            class="px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-green-600/20 active:scale-95"
          >
            <i class="pi pi-plus-circle"></i>
            <span>New Post</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center space-x-3">
      <i class="pi pi-exclamation-circle text-red-500"></i>
      <p class="text-red-500 text-xs font-bold uppercase tracking-wider">{{ error }}</p>
    </div>

    <!-- Modern Filters Bar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <!-- Status Filter Tabs -->
      <div class="lg:col-span-7 flex p-1.5 rounded-2xl transition-all duration-500" 
           :class="isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'">
        <button
          v-for="status in statusOptions"
          :key="status.value"
          @click="selectedStatus = status.value; currentPage = 1"
          class="flex-1 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2"
          :class="selectedStatus === status.value
            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
            : 'text-gray-500 hover:text-green-500'"
        >
          <span>{{ status.label }}</span>
          <span class="px-2 py-0.5 rounded-md text-[9px]"
                :class="selectedStatus === status.value ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-gray-400'">
            {{ status.count.value }}
          </span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="lg:col-span-5 relative group">
        <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search articles..."
          class="w-full pl-11 pr-4 py-3.5 rounded-2xl border text-sm font-medium transition-all duration-300 focus:ring-4 focus:ring-green-500/10 outline-none"
          :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-green-500/50' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-green-500'"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
          <i class="pi pi-times-circle"></i>
        </button>
      </div>
    </div>

    <!-- Posts Content Area -->
    <div class="rounded-3xl border overflow-hidden transition-all duration-500" 
         :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 shadow-2xl shadow-slate-950/20' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'">
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-4">
        <div class="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
        <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Synchronizing Articles...</p>
      </div>

      <!-- Table View -->
      <div v-else-if="paginatedPosts.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr :class="isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'">
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer group" @click="handleSort('title')">
                <div class="flex items-center space-x-2">
                  <span>Article Details</span>
                  <i v-if="sortBy === 'title'" :class="['pi text-[8px]', sortOrder === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down']"></i>
                </div>
              </th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Author</th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer" @click="handleSort('updated_at')">
                <div class="flex items-center space-x-2">
                  <span>Timeline</span>
                  <i v-if="sortBy === 'updated_at'" :class="['pi text-[8px]', sortOrder === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down']"></i>
                </div>
              </th>
              <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-slate-100'">
            <tr v-for="post in paginatedPosts" :key="post.id" class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-300">
              <!-- Article Info -->
              <td class="px-8 py-6">
                <div class="flex items-center space-x-5">
                  <div class="relative flex-shrink-0">
                    <img v-if="post.featured_image" :src="post.featured_image" :alt="post.title" class="w-14 h-14 rounded-2xl object-cover shadow-md transition-transform duration-500" />
                    <div v-else class="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <i class="pi pi-image text-gray-400"></i>
                    </div>
                  </div>
                  <div class="min-w-0 max-w-md">
                    <h3 class="text-sm font-black truncate mb-1" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                      {{ post.title }}
                    </h3>
                    <p class="text-xs font-medium text-gray-500 line-clamp-1 mb-2">
                      {{ getCleanExcerpt(post) }}
                    </p>
                    <div class="flex flex-wrap gap-1.5">
                      <span v-for="tag in post.tags?.slice(0, 3)" :key="tag" class="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-gray-500">
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- Status -->
              <td class="px-8 py-6">
                <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2" 
                      :class="post.status === 'published' ? 'bg-green-500/10 text-green-500' : 
                              post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' : 
                              'bg-red-500/10 text-red-500'">
                  <div class="w-1.5 h-1.5 rounded-full" :class="post.status === 'published' ? 'bg-green-500' : post.status === 'draft' ? 'bg-yellow-500' : 'bg-red-500'"></div>
                  {{ post.status }}
                </span>
              </td>

              <!-- Author -->
              <td class="px-8 py-6">
                <div class="flex items-center space-x-3">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-[10px] font-black text-gray-500">
                    {{ getAuthorName(post).charAt(0) }}
                  </div>
                  <span class="text-xs font-bold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    {{ getAuthorName(post).split(' ')[0] }}
                  </span>
                </div>
              </td>

              <!-- Timeline -->
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="text-xs font-bold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ formatRelativeTime(post.updated_at) }}</span>
                  <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{{ getShortDate(post.updated_at) }}</span>
                </div>
              </td>

              <!-- Actions -->
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a :href="`/blog/${post.slug}`" target="_blank" class="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300" title="View Live">
                    <i class="pi pi-external-link text-xs"></i>
                  </a>
                  <button v-if="canEditPost(post)" @click="emit('edit', post)" class="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300" title="Edit Article">
                    <i class="pi pi-pencil text-xs"></i>
                  </button>
                  <button v-if="canEditPost(post)" @click="handleDelete(post)" class="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300" title="Delete Article">
                    <i class="pi pi-trash text-xs"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-32 text-center">
        <div class="w-24 h-24 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
          <i class="pi pi-folder-open text-4xl text-gray-300"></i>
        </div>
        <h3 class="text-xl font-black" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ searchQuery || selectedStatus !== 'all' ? 'No matches found' : 'Start your story' }}
        </h3>
        <p class="mt-2 text-sm font-medium text-gray-500 max-w-xs">
          {{ searchQuery || selectedStatus !== 'all' ? 'Try refining your search terms or status filters.' : 'Your blog is empty. Create your first article to engage your audience.' }}
        </p>
        <div v-if="!searchQuery && selectedStatus === 'all'" class="mt-8">
          <button @click="emit('create')" class="px-8 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-lg shadow-green-600/20 active:scale-95">
            Create First Post
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Pagination -->
    <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4">
      <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
        Displaying <span class="text-green-500">{{ Math.min((currentPage - 1) * postsPerPage + 1, filteredPosts.length) }}</span> - 
        <span class="text-green-500">{{ Math.min(currentPage * postsPerPage, filteredPosts.length) }}</span> of 
        <span class="text-green-500">{{ filteredPosts.length }}</span> Articles
      </p>
      
      <div class="flex items-center space-x-2">
        <button
          @click="currentPage = currentPage - 1"
          :disabled="currentPage <= 1"
          class="p-3 rounded-xl border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          :class="isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-white shadow-sm'"
        >
          <i class="pi pi-chevron-left text-xs"></i>
        </button>
        
        <div class="flex items-center space-x-1">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="currentPage = page"
            class="w-10 h-10 rounded-xl text-xs font-black transition-all duration-300"
            :class="currentPage === page
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
              : (isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-600 hover:bg-white shadow-sm')"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="currentPage = currentPage + 1"
          :disabled="currentPage >= totalPages"
          class="p-3 rounded-xl border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          :class="isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-white shadow-sm'"
        >
          <i class="pi pi-chevron-right text-xs"></i>
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
