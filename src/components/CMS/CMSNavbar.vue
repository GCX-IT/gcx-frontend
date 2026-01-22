<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { useRouter } from 'vue-router'
import { isDarkMode, toggleDarkMode } from '../../utils/darkMode'
import { useAuth } from '../../composables/useAuth'

interface Props {
  sidebarOpen: boolean
}

interface Emits {
  (e: 'toggle-sidebar'): void
  (e: 'navigate', section: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const router = useRouter()
const { user, logout } = useAuth()

const showUserMenu = ref(false)
const showNotifications = ref(false)

const handleLogout = () => {
  logout()
  router.push('/login')
}

const goToWebsite = () => {
  window.open('/', '_blank')
}

const goToProfile = () => {
  // Navigate to profile settings
}

// Mock notifications
const notifications = ref([
  {
    id: 1,
    title: 'New comment on your post',
    message: 'Someone commented on "GCX Trading Platform Launch"',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    title: 'Post published successfully',
    message: 'Your post "Market Update" is now live',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    title: 'System maintenance',
    message: 'Scheduled maintenance will begin at 2 AM',
    time: '3 hours ago',
    read: true
  }
])

const unreadCount = ref(notifications.value.filter(n => !n.read).length)
</script>

<template>
  <header class="sticky top-0 z-30 border-b transition-colors duration-300"
          :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <!-- Sidebar Toggle -->
        <button
          @click="emit('toggle-sidebar')"
          class="p-2 rounded-lg transition-colors hover:scale-105"
          :class="isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'"
        >
          <i class="pi pi-bars text-lg"></i>
        </button>

        <!-- Page Title -->
        <div>
          <h1 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Dashboard
          </h1>
          <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Welcome back, {{ user?.name }}
          </p>
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-3">
        <!-- Quick Actions -->
        <div class="hidden md:flex items-center space-x-2">
          <!-- New Post Button -->
          <button
            @click="() => $emit('navigate', 'posts')"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 text-sm hover:scale-105 shadow-lg"
          >
            <i class="pi pi-plus text-sm mr-2"></i>
            New Post
          </button>

          <!-- View Website -->
          <button
            @click="goToWebsite"
            class="px-4 py-2 border rounded-lg font-medium transition-all duration-200 text-sm hover:scale-105"
            :class="isDarkMode 
              ? 'border-slate-600 text-slate-300 hover:bg-slate-700' 
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'"
          >
            <i class="pi pi-external-link text-sm mr-2"></i>
            View Site
          </button>
        </div>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg transition-all duration-200 hover:scale-105"
          :class="isDarkMode ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-slate-100 text-slate-600'"
        >
          <i v-if="isDarkMode" class="pi pi-sun text-lg"></i>
          <i v-else class="pi pi-moon text-lg"></i>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 rounded-lg transition-all duration-200 relative hover:scale-105"
            :class="isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'"
          >
            <i class="pi pi-bell text-lg"></i>
            <span v-if="unreadCount > 0" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
              {{ unreadCount }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div v-if="showNotifications" 
               class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border overflow-hidden z-50"
               :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <div class="p-4 border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <h3 class="text-sm font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Notifications
              </h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div v-for="notification in notifications" :key="notification.id"
                   class="p-4 border-b hover:bg-opacity-50 transition-colors cursor-pointer"
                   :class="[
                     isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50',
                     !notification.read ? (isDarkMode ? 'bg-slate-700/30' : 'bg-blue-50/50') : ''
                   ]">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 rounded-full mt-2"
                         :class="notification.read ? 'bg-slate-400' : 'bg-blue-500'">
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                      {{ notification.title }}
                    </p>
                    <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                      {{ notification.message }}
                    </p>
                    <p class="text-xs mt-1" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
                      {{ notification.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-3 text-center border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <button class="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors"
            :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
          >
            <div class="w-9 h-9 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <span class="text-sm font-bold text-white">
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <i class="pi pi-angle-down text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"></i>
          </button>

          <!-- User Dropdown -->
          <div v-if="showUserMenu" 
               class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border overflow-hidden z-50"
               :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
            <div class="p-3 border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ user?.name }}
              </p>
              <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                {{ user?.email }}
              </p>
              <span class="inline-block mt-1 px-2 py-1 rounded text-xs font-medium"
                    :class="user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'">
                {{ user?.role }}
              </span>
            </div>
            
            <div class="py-1">
              <button
                @click="goToProfile"
                class="w-full flex items-center px-4 py-2 text-sm transition-colors hover:scale-105"
                :class="isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-100'"
              >
                <i class="pi pi-user text-sm mr-3"></i>
                Profile Settings
              </button>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-200 hover:scale-105"
              >
                <i class="pi pi-sign-out text-sm mr-3"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Click outside to close dropdowns -->
  <div v-if="showUserMenu || showNotifications" 
       @click="showUserMenu = false; showNotifications = false"
       class="fixed inset-0 z-40"></div>
</template>
