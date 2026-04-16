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
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <!-- Header with Glassmorphism -->
    <div class="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-green-600 to-emerald-800 shadow-2xl shadow-green-900/20">
      <div class="relative z-10">
        <div class="flex items-center space-x-4 mb-4">
          <div class="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <i class="pi pi-sparkles text-2xl text-green-300"></i>
          </div>
          <span class="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-green-100 uppercase tracking-widest border border-white/10">
            CMS Overview
          </span>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tight">
          Welcome back, <span class="text-green-300">{{ user?.name || 'User' }}</span>!
        </h1>
        <p class="mt-4 text-lg text-green-100/80 max-w-2xl font-medium leading-relaxed">
          Your content ecosystem is thriving. Here's a snapshot of your current platform performance and recent updates.
        </p>
        
        <!-- Quick Stats Overlay -->
        <div class="mt-8 flex items-center space-x-8">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-sm font-bold text-green-100 uppercase tracking-wider">System Online</span>
          </div>
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span class="text-sm font-bold text-green-100 uppercase tracking-wider">{{ dashboardData.stats.publishedPosts + dashboardData.stats.publishedPages }} Live Assets</span>
          </div>
        </div>
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Loading State -->
    <div v-if="dashboardData.loading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <div class="relative">
        <div class="w-16 h-16 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <i class="pi pi-spin pi-spinner text-green-500"></i>
        </div>
      </div>
      <p class="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-8">
      <!-- Stats Grid - Modern Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Posts -->
        <div class="group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden"
             :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-2" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
                Blog Ecosystem
              </p>
              <h3 class="text-4xl font-black tracking-tighter" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ dashboardData.stats.totalPosts }}
              </h3>
              <p class="text-xs font-bold mt-1 text-gray-500 uppercase tracking-wider">Total Articles</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center transition-all duration-300">
              <i class="pi pi-file-edit text-2xl" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'"></i>
            </div>
          </div>
          <div class="mt-6 flex items-center space-x-4">
            <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" :style="{ width: (dashboardData.stats.publishedPosts / dashboardData.stats.totalPosts * 100) + '%' }"></div>
            </div>
            <span class="text-[10px] font-black text-gray-500 uppercase">{{ Math.round(dashboardData.stats.publishedPosts / dashboardData.stats.totalPosts * 100) || 0 }}% Live</span>
          </div>
        </div>

        <!-- Published -->
        <div class="group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden"
             :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-2" :class="isDarkMode ? 'text-green-400' : 'text-green-600'">
                Active Content
              </p>
              <h3 class="text-4xl font-black tracking-tighter" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ dashboardData.stats.publishedPosts }}
              </h3>
              <p class="text-xs font-bold mt-1 text-gray-500 uppercase tracking-wider">Published</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center transition-all duration-300">
              <i class="pi pi-check-circle text-2xl" :class="isDarkMode ? 'text-green-400' : 'text-green-600'"></i>
            </div>
          </div>
          <div class="mt-6">
            <span class="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">Publicly Visible</span>
          </div>
        </div>

        <!-- Drafts -->
        <div class="group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden"
             :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-2" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                In Progress
              </p>
              <h3 class="text-4xl font-black tracking-tighter" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ dashboardData.stats.draftPosts }}
              </h3>
              <p class="text-xs font-bold mt-1 text-gray-500 uppercase tracking-wider">Drafts</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center transition-all duration-300">
              <i class="pi pi-clock text-2xl" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'"></i>
            </div>
          </div>
          <div class="mt-6">
            <span class="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-black uppercase tracking-widest">Awaiting Review</span>
          </div>
        </div>

        <!-- Media -->
        <div class="group relative p-6 rounded-3xl border transition-all duration-300 overflow-hidden"
             :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
          <div class="relative z-10 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] mb-2" :class="isDarkMode ? 'text-purple-400' : 'text-purple-600'">
                Asset Library
              </p>
              <h3 class="text-4xl font-black tracking-tighter" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ dashboardData.stats.mediaFiles }}
              </h3>
              <p class="text-xs font-bold mt-1 text-gray-500 uppercase tracking-wider">Media Files</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center transition-all duration-300">
              <i class="pi pi-image text-2xl" :class="isDarkMode ? 'text-purple-400' : 'text-purple-600'"></i>
            </div>
          </div>
          <div class="mt-6">
            <span class="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-[10px] font-black uppercase tracking-widest">Optimized Storage</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Quick Actions - Modern Sidebar Style -->
        <div class="lg:col-span-1 space-y-6">
          <div class="p-8 rounded-3xl border bg-gradient-to-b"
               :class="isDarkMode ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-white to-slate-50 border-slate-200'">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Quick Actions
              </h3>
              <div class="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                <i class="pi pi-bolt text-green-500 text-sm"></i>
              </div>
            </div>
            
            <div class="space-y-3">
              <button
                @click="navigateToSection('posts')"
                class="group w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                :class="isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center transition-colors">
                    <i class="pi pi-plus text-blue-500"></i>
                  </div>
                  <span class="text-sm font-bold transition-colors" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Create New Post
                  </span>
                </div>
                <i class="pi pi-chevron-right text-[10px] text-gray-500 transition-all group-hover:translate-x-1"></i>
              </button>
              
              <button
                @click="navigateToSection('pages')"
                class="group w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                :class="isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center transition-colors">
                    <i class="pi pi-globe text-purple-500"></i>
                  </div>
                  <span class="text-sm font-bold transition-colors" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Manage Pages
                  </span>
                </div>
                <i class="pi pi-chevron-right text-[10px] text-gray-500 transition-all group-hover:translate-x-1"></i>
              </button>
              
              <button
                @click="navigateToSection('images')"
                class="group w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                :class="isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-white'"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center transition-colors">
                    <i class="pi pi-upload text-emerald-500"></i>
                  </div>
                  <span class="text-sm font-bold transition-colors" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Upload Media
                  </span>
                </div>
                <i class="pi pi-chevron-right text-[10px] text-gray-500 transition-all group-hover:translate-x-1"></i>
              </button>
            </div>
          </div>
          
          <!-- System Status Card -->
          <div class="p-6 rounded-3xl border bg-slate-900 border-slate-800 relative overflow-hidden group">
            <div class="relative z-10">
              <h4 class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">System Health</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-400">API Latency</span>
                  <span class="text-xs font-black text-green-400">24ms</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-400">DB Connectivity</span>
                  <span class="text-xs font-black text-green-400">Optimal</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-400">Uptime</span>
                  <span class="text-xs font-black text-green-400">99.99%</span>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all duration-700"></div>
          </div>
        </div>

        <!-- Recent Activity - Modern Timeline Style -->
        <div class="lg:col-span-2">
          <div class="p-8 rounded-3xl border h-full"
               :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-2xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Recent Activity
                </h3>
                <p class="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Latest updates across the platform</p>
              </div>
              <button class="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300">
                <i class="pi pi-refresh text-sm"></i>
              </button>
            </div>
            
            <div class="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-800">
              <div v-if="dashboardData.recentActivity.length > 0" class="space-y-8">
                <div
                  v-for="activity in dashboardData.recentActivity"
                  :key="activity.id"
                  class="relative flex items-start space-x-6 group"
                >
                  <!-- Timeline Dot -->
                  <div class="relative z-10 w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-green-500 shadow-sm"
                       :class="[
                         isDarkMode ? 'border-slate-700' : 'border-gray-100',
                         getActivityColor(activity.color).replace('bg-', 'text-')
                       ]">
                    <i :class="activity.icon || 'pi pi-circle-fill'" class="text-sm"></i>
                  </div>
                  
                  <div class="flex-1 pt-1">
                    <div class="flex items-center justify-between mb-1">
                      <p class="text-sm font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                        {{ activity.message }}
                      </p>
                      <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                        {{ formatTimeAgo(activity.timestamp) }}
                      </span>
                    </div>
                    <p class="text-xs font-medium text-gray-500 leading-relaxed">
                      {{ activity.details || 'No additional details provided for this action.' }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <i class="pi pi-inbox text-3xl text-gray-400"></i>
                </div>
                <h4 class="text-lg font-black" :class="isDarkMode ? 'text-white' : 'text-slate-900'">All Quiet Here</h4>
                <p class="text-sm font-medium text-gray-500 mt-2 max-w-xs">
                  No recent activity recorded. Start creating content to see updates here.
                </p>
              </div>
            </div>
            
            <div v-if="dashboardData.recentActivity.length > 0" class="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button class="w-full py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-green-500 hover:text-white transition-all duration-300">
                View Full Audit Log
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
