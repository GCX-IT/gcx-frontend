<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'
import { useTraders } from '../../composables/useTraders'

const { t } = useI18n()
const { traders, loading, error, loadTraders } = useTraders()

const pageSizeOptions = [10, 25, 50]
const pageSize = ref<number>(10)
const currentPage = ref<number>(1)
const query = ref<string>('')

// Convert traders to the format expected by the template
const allMembers = computed(() => 
  traders.value.map(trader => ({
    name: trader.name,
    industry: trader.industry || '',
    memberType: trader.member_type,
    phone: trader.phone_no || ''
  }))
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allMembers.value
  return allMembers.value.filter(m =>
    [m.name, m.industry ?? '', m.memberType, m.phone].some(f => f.toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paged = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function setPageSize(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

function goTo(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// Watch for search query changes and reload data
watch(query, (newQuery) => {
  loadTraders({ search: newQuery })
}, { debounce: 500 })
</script>

<template>
  <div class="rounded-2xl p-6 lg:p-8 border" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
    <div class="mb-6 flex items-center justify-between gap-4 flex-wrap">
      <h2 class="text-3xl lg:text-4xl font-extrabold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership List</h2>
      <div class="flex items-center gap-3">
        <label class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Show</label>
        <select class="px-2 py-1 rounded border bg-transparent"
                :class="isDarkMode ? 'text-slate-200 border-slate-700' : 'text-slate-800 border-slate-300'"
                :value="pageSize" @change="setPageSize(parseInt(($event.target as HTMLSelectElement).value))">
          <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
        <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">entries</span>
      </div>
    </div>

    <div class="mb-4 flex items-center justify-between gap-4 flex-wrap">
      <div class="text-sm font-semibold" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Search:</div>
      <input type="text" v-model="query" placeholder="Search name, type, phone..."
             class="w-full md:w-80 px-3 py-2 rounded border outline-none focus:ring"
             :class="isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100 focus:ring-yellow-700' : 'bg-white border-slate-300 text-slate-900 focus:ring-yellow-300'" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center space-x-2">
        <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
        <span class="text-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading members...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
        <i class="pi pi-exclamation-triangle text-3xl text-red-600 mb-4"></i>
        <h3 class="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Error Loading Members</h3>
        <p class="text-red-600 dark:text-red-300">{{ error }}</p>
        <button
          @click="loadTraders()"
          class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="overflow-x-auto rounded-xl border" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
      <table class="min-w-full text-left">
        <thead>
          <tr :class="isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-700'">
            <th class="px-4 py-3 font-semibold">Name</th>
            <th class="px-4 py-3 font-semibold">Industry</th>
            <th class="px-4 py-3 font-semibold">Member Type</th>
            <th class="px-4 py-3 font-semibold">Phone No.</th>
          </tr>
        </thead>
        <tbody :class="isDarkMode ? 'divide-y divide-slate-700' : 'divide-y divide-slate-200'">
          <tr v-for="m in paged" :key="m.name" :class="isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'">
            <td class="px-4 py-3" :class="isDarkMode ? 'text-slate-100' : 'text-slate-800'">{{ m.name }}</td>
            <td class="px-4 py-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ m.industry || '-' }}</td>
            <td class="px-4 py-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ m.memberType }}</td>
            <td class="px-4 py-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ m.phone }}</td>
          </tr>
          <tr v-if="paged.length === 0">
            <td colspan="4" class="px-4 py-6 text-center" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">No results found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- pagination -->
    <div class="mt-4 flex items-center justify-between flex-wrap gap-3">
      <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
        Showing
        <span class="font-semibold">{{ (currentPage - 1) * pageSize + 1 }}</span>
        to
        <span class="font-semibold">{{ Math.min(currentPage * pageSize, filtered.length) }}</span>
        of
        <span class="font-semibold">{{ filtered.length }}</span>
        entries
      </div>

      <div class="inline-flex items-center gap-2">
        <button class="px-3 py-1.5 rounded border text-sm"
                :class="isDarkMode ? 'text-slate-200 border-slate-700 hover:bg-slate-800' : 'text-slate-800 border-slate-300 hover:bg-slate-50'"
                @click="goTo(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
        <div class="hidden md:flex items-center gap-1">
          <button v-for="p in totalPages" :key="p" class="px-3 py-1.5 rounded border text-sm"
                  :class="p === currentPage ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300') : (isDarkMode ? 'text-slate-200 border-slate-700 hover:bg-slate-800' : 'text-slate-800 border-slate-300 hover:bg-slate-50')"
                  @click="goTo(p)">{{ p }}</button>
        </div>
        <button class="px-3 py-1.5 rounded border text-sm"
                :class="isDarkMode ? 'text-slate-200 border-slate-700 hover:bg-slate-800' : 'text-slate-800 border-slate-300 hover:bg-slate-50'"
                @click="goTo(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>


