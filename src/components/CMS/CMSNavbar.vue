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
  <header class="sticky top-0 z-30 border-b transition-colors duration-300 backdrop-blur-md"
          :class="isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'">
    <div class="flex items-center justify-between px-8 py-4">
      <!-- Left Section -->
      <div class="flex items-center space-x-6">
        <!-- Sidebar Toggle -->
        <button
          @click="emit('toggle-sidebar')"
          class="p-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
          :class="isDarkMode ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'"
        >
          <i :class="sidebarOpen ? 'pi pi-align-left' : 'pi pi-bars'" class="text-lg"></i>
        </button>

        <!-- Page Breadcrumbs/Title -->
        <div class="hidden sm:block">
          <div class="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-0.5">
            <span>CMS</span>
            <i class="pi pi-chevron-right text-[8px]"></i>
            <span class="text-green-500">Dashboard</span>
          </div>
          <h1 class="text-xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Overview
          </h1>
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Quick Actions -->
        <div class="hidden lg:flex items-center space-x-3 mr-4 pr-4 border-r border-gray-200 dark:border-gray-700">
          <!-- View Website -->
          <button
            @click="goToWebsite"
            class="group flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 text-xs uppercase tracking-widest"
            :class="isDarkMode 
              ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'"
          >
            <i class="pi pi-external-link group-hover:text-green-500 transition-colors"></i>
            <span>Live Site</span>
          </button>

          <!-- New Post Button -->
          <button
            @click="() => $emit('navigate', 'posts')"
            class="flex items-center space-x-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl transition-all duration-300 text-xs uppercase tracking-[0.15em] shadow-lg shadow-green-600/20 active:scale-95"
          >
            <i class="pi pi-plus-circle"></i>
            <span>New Post</span>
          </button>
        </div>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2.5 rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
          :class="isDarkMode ? 'bg-slate-700/50 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
        >
          <i v-if="isDarkMode" class="pi pi-sun text-lg"></i>
          <i v-else class="pi pi-moon text-lg"></i>
        </button>

        <!-- User Profile -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl transition-all duration-300 active:scale-95 shadow-sm"
            :class="isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'"
          >
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <span class="text-xs font-black text-white">
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="hidden md:block text-left">
              <p class="text-xs font-black leading-none mb-1" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ user?.name?.split(' ')[0] }}
              </p>
              <p class="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-none">
                {{ user?.role }}
              </p>
            </div>
            <i class="pi pi-chevron-down text-[10px] text-gray-500"></i>
          </button>

          <!-- User Dropdown - Modern Style -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="showUserMenu" 
                 class="absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border overflow-hidden z-50 backdrop-blur-xl"
                 :class="isDarkMode ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'">
              <div class="p-5 border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-100'">
                <p class="text-sm font-black" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  {{ user?.name }}
                </p>
                <p class="text-xs font-medium text-gray-500 truncate mt-1">
                  {{ user?.email }}
                </p>
              </div>
              
              <div class="p-2">
                <button
                  @click="goToProfile"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 hover:bg-green-500 hover:text-white group"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
                >
                  <i class="pi pi-user text-sm group-hover:scale-110 transition-transform"></i>
                  <span>Profile</span>
                </button>
                
                <button
                  @click="handleLogout"
                  class="w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 text-red-500 hover:bg-red-500 hover:text-white group"
                >
                  <i class="pi pi-sign-out text-sm group-hover:scale-110 transition-transform"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>

  <!-- Click outside to close dropdowns -->
  <div v-if="showUserMenu || showNotifications" 
       @click="showUserMenu = false; showNotifications = false"
       class="fixed inset-0 z-40"></div>
</template>
