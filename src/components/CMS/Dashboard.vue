<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../../utils/darkMode'
import { useAuth } from '../../composables/useAuth'
import axios from '../../plugins/axios'

const router = useRouter()
const { user } = useAuth()

// Dashboard data
const dashboardData = ref({
  stats: {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    mediaFiles: 0,
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0
  },
  recentActivity: [],
  loading: true,
  hasRealData: false
})

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    dashboardData.value.loading = true
    
    // Fetch stats using axios
    try {
      const statsResponse = await axios.get('/api/cms/dashboard/stats')
      if (statsResponse.data.success) {
        dashboardData.value.stats = statsResponse.data.data
        dashboardData.value.hasRealData = true
      }
    } catch (error) {
      console.log('Stats API not available')
    }
    
    // Fetch recent activity using axios
    try {
      const activityResponse = await axios.get('/api/cms/dashboard/activity')
      if (activityResponse.data.success) {
        dashboardData.value.recentActivity = activityResponse.data.data
        dashboardData.value.hasRealData = true
      }
    } catch (error) {
      console.log('Activity API not available')
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Keep all values at 0 or empty when no real data is available
  } finally {
    dashboardData.value.loading = false
  }
}

// Navigation functions
const navigateToSection = (section: string) => {
  router.push({ name: `cms-${section}` })
}

// Format timestamp
const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

// Get activity color class
const getActivityColor = (color: string) => {
  const colorMap = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }
  return colorMap[color] || 'bg-gray-500'
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <p class="mt-2 text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
        Welcome back, {{ user?.name || 'User' }}! Here's what's happening with your content.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardData.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Posts -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-blue-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-blue-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-blue-300' : 'text-slate-600'">
                Total Posts
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-blue-100' : 'text-slate-900'">
                {{ dashboardData.stats.totalPosts }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-blue-500/30' : 'bg-blue-100'">
              <i class="pi pi-file-edit text-2xl text-blue-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Published Posts -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-green-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-green-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-green-300' : 'text-slate-600'">
                Published
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-green-100' : 'text-green-600'">
                {{ dashboardData.stats.publishedPosts }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-green-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-green-500/30' : 'bg-green-100'">
              <i class="pi pi-check-circle text-2xl text-green-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Draft Posts -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-yellow-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-yellow-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-yellow-300' : 'text-slate-600'">
                Drafts
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-yellow-100' : 'text-yellow-600'">
                {{ dashboardData.stats.draftPosts }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-yellow-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-yellow-500/30' : 'bg-yellow-100'">
              <i class="pi pi-clock text-2xl text-yellow-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Media Files -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-purple-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-purple-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-purple-300' : 'text-slate-600'">
                Media Files
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-purple-100' : 'text-purple-600'">
                {{ dashboardData.stats.mediaFiles }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-purple-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-purple-500/30' : 'bg-purple-100'">
              <i class="pi pi-image text-2xl text-purple-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      <!-- Pages Stats Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Total Pages -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-indigo-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-indigo-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-indigo-300' : 'text-slate-600'">
                Total Pages
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-indigo-100' : 'text-slate-900'">
                {{ dashboardData.stats.totalPages }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-indigo-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-indigo-500/30' : 'bg-indigo-100'">
              <i class="pi pi-globe text-2xl text-indigo-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Published Pages -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-emerald-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-emerald-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-emerald-300' : 'text-slate-600'">
                Published Pages
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-emerald-100' : 'text-emerald-600'">
                {{ dashboardData.stats.publishedPages }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-emerald-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-emerald-500/30' : 'bg-emerald-100'">
              <i class="pi pi-check-circle text-2xl text-emerald-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        <!-- Draft Pages -->
        <div class="group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
             :class="isDarkMode ? 'bg-slate-900 border-slate-600 hover:border-orange-400 shadow-lg shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-orange-300'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium mb-1" :class="isDarkMode ? 'text-orange-300' : 'text-slate-600'">
                Draft Pages
              </p>
              <p class="text-3xl font-bold" :class="isDarkMode ? 'text-orange-100' : 'text-orange-600'">
                {{ dashboardData.stats.draftPages }}
              </p>
            </div>
            <div class="p-3 rounded-xl bg-orange-500/20 group-hover:scale-110 transition-transform" :class="isDarkMode ? 'bg-orange-500/30' : 'bg-orange-100'">
              <i class="pi pi-clock text-2xl text-orange-400"></i>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>


      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Quick Actions -->
        <div class="rounded-xl border p-6 transition-all duration-300 hover:shadow-lg"
             :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Quick Actions
            </h3>
            <i class="pi pi-bolt text-green-500 text-xl"></i>
          </div>
          
          <div class="space-y-4">
            <button
              @click="navigateToSection('posts')"
              class="group w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              :class="isDarkMode ? 'border-slate-600 hover:bg-slate-700 hover:border-green-500' : 'border-slate-200 hover:bg-green-50 hover:border-green-300'"
            >
              <div class="flex items-center space-x-4">
                <div class="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                  <i class="pi pi-plus text-blue-600 dark:text-blue-400"></i>
                </div>
                <span class="font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Create New Post
                </span>
              </div>
              <i class="pi pi-arrow-right text-slate-400 group-hover:text-green-500 transition-colors"></i>
            </button>
            
            <button
              @click="navigateToSection('pages')"
              class="group w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              :class="isDarkMode ? 'border-slate-600 hover:bg-slate-700 hover:border-green-500' : 'border-slate-200 hover:bg-green-50 hover:border-green-300'"
            >
              <div class="flex items-center space-x-4">
                <div class="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform">
                  <i class="pi pi-globe text-purple-600 dark:text-purple-400"></i>
                </div>
                <span class="font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Manage Pages
                </span>
              </div>
              <i class="pi pi-arrow-right text-slate-400 group-hover:text-green-500 transition-colors"></i>
            </button>
            
            <button
              @click="navigateToSection('images')"
              class="group w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              :class="isDarkMode ? 'border-slate-600 hover:bg-slate-700 hover:border-green-500' : 'border-slate-200 hover:bg-green-50 hover:border-green-300'"
            >
              <div class="flex items-center space-x-4">
                <div class="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:scale-110 transition-transform">
                  <i class="pi pi-upload text-green-600 dark:text-green-400"></i>
                </div>
                <span class="font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Upload Media
                </span>
              </div>
              <i class="pi pi-arrow-right text-slate-400 group-hover:text-green-500 transition-colors"></i>
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="rounded-xl border p-6 transition-all duration-300 hover:shadow-lg"
             :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Recent Activity
            </h3>
            <i class="pi pi-history text-green-500 text-xl"></i>
          </div>
          
          <div class="space-y-4">
            <div v-if="dashboardData.recentActivity.length > 0">
              <div
                v-for="activity in dashboardData.recentActivity"
                :key="activity.id"
                class="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div class="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" :class="getActivityColor(activity.color)"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    {{ activity.message }}
                  </p>
                  <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <i class="pi pi-clock text-4xl text-slate-400 mb-4"></i>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                No recent activity
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
