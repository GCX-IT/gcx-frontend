<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { useAuth } from '../../composables/useAuth'
import { useRouter, useRoute } from 'vue-router'
import type { NavigationItem } from '../../types/cms'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'toggle'): void
  (e: 'navigate', section: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()

const activeSection = computed(() => route.meta.section || 'dashboard')

// Track which dropdowns are open - only one at a time
const openDropdowns = ref<string | null>(null)

// Navigation items with PrimeIcons - Organized with dropdowns
const navigationItems = computed<NavigationItem[]>(() => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'pi pi-th-large',
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: 'pi pi-folder',
    children: [
      {
        id: 'posts',
        label: 'Blog Posts',
        icon: 'pi pi-file-edit',
        permissions: ['blogger', 'admin']
      },
      {
        id: 'image-manager',
        label: 'Images',
        icon: 'pi pi-image',
        permissions: ['blogger', 'admin']
      },
      {
        id: 'content-manager',
        label: 'Content Library',
        icon: 'pi pi-database',
        permissions: ['admin', 'editor']
      }
    ]
  },
  {
    id: 'people',
    label: 'People & Roles',
    icon: 'pi pi-users',
    children: [
      {
        id: 'team-manager',
        label: 'Team Members',
        icon: 'pi pi-user',
        permissions: ['admin', 'editor']
      },
      {
        id: 'trader-manager',
        label: 'Traders',
        icon: 'pi pi-user-plus',
        permissions: ['admin', 'editor']
      },
      {
        id: 'broker-manager',
        label: 'Brokers',
        icon: 'pi pi-briefcase',
        permissions: ['admin', 'editor']
      },
      {
        id: 'partner-manager',
        label: 'Partners',
        icon: 'pi pi-handshake',
        permissions: ['admin', 'editor']
      }
    ]
  },
  {
    id: 'resources',
    label: 'Resources',
    icon: 'pi pi-book',
    children: [
      {
        id: 'publication-manager',
        label: 'Publications',
        icon: 'pi pi-file-pdf',
        permissions: ['admin', 'editor']
      },
      {
        id: 'career-manager',
        label: 'Careers',
        icon: 'pi pi-briefcase',
        permissions: ['admin', 'editor']
      },
      {
        id: 'commodity-manager',
        label: 'Commodities',
        icon: 'pi pi-shopping-cart',
        permissions: ['admin', 'editor']
      },
      {
        id: 'event-manager',
        label: 'Events',
        icon: 'pi pi-calendar',
        permissions: ['admin', 'editor']
      },
      {
        id: 'gallery-manager',
        label: 'Photo Gallery',
        icon: 'pi pi-images',
        permissions: ['admin', 'editor']
      },
      {
        id: 'video-manager',
        label: 'Video Library',
        icon: 'pi pi-video',
        permissions: ['admin', 'editor']
      }
    ]
  },
  {
    id: 'rti-manager',
    label: 'RTI Requests',
    icon: 'pi pi-file-check',
    permissions: ['admin', 'editor']
  },
  {
    id: 'news-manager',
    label: 'News Ticker',
    icon: 'pi pi-bell',
    permissions: ['admin', 'editor']
  },
  {
    id: 'users',
    label: 'User Management',
    icon: 'pi pi-users',
    permissions: ['admin']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'pi pi-cog',
    permissions: ['admin']
  },
])

// Filter navigation items based on user permissions
const visibleItems = computed(() => {
  const userRole = user.value?.role
  if (!userRole) return []

  const filterItems = (items: NavigationItem[]): NavigationItem[] => {
    return items.filter(item => {
      if (!item.permissions || item.permissions.length === 0) return true
      return item.permissions.includes(userRole)
    }).map(item => ({
      ...item,
      children: item.children ? filterItems(item.children) : undefined
    }))
  }

  return filterItems(navigationItems.value)
})

const isItemActive = (itemId: string): boolean => {
  return activeSection.value === itemId
}

const hasChildren = (item: NavigationItem): boolean => {
  return !!(item.children && item.children.length > 0)
}

const isDropdownOpen = (itemId: string): boolean => {
  return openDropdowns.value === itemId
}

const toggleDropdown = (itemId: string) => {
  // Professional accordion behavior - close if already open, otherwise open and close others
  openDropdowns.value = openDropdowns.value === itemId ? null : itemId
}

const navigateToSection = (section: string) => {
  // Map section IDs to route names
  const routeMap: Record<string, string> = {
    'dashboard': 'cms-dashboard',
    'posts': 'cms-posts',
    'image-manager': 'cms-images',
    'content-manager': 'cms-content',
    'team-manager': 'cms-team',
    'trader-manager': 'cms-traders',
    'broker-manager': 'cms-brokers',
    'partner-manager': 'cms-partners',
    'publication-manager': 'cms-publications',
    'career-manager': 'cms-careers',
    'commodity-manager': 'cms-commodities',
    'event-manager': 'cms-events',
    'gallery-manager': 'cms-gallery',
    'video-manager': 'cms-video',
    'rti-manager': 'cms-rti',
    'news-manager': 'cms-news',
    'users': 'cms-users',
    'settings': 'cms-settings'
  }
  
  const routeName = routeMap[section]
  if (routeName) {
    router.push({ name: routeName })
  }
  emit('navigate', section)
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<template>
  <div 
    class="fixed left-0 top-0 h-full z-40 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) border-r shadow-2xl bg-gray-900 border-gray-800 flex flex-col overflow-hidden"
    :class="[
      isOpen ? 'w-72 translate-x-0' : 'w-20 translate-x-0 shadow-none',
      'lg:translate-x-0'
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center h-20 border-b border-gray-800 bg-gray-900/50 overflow-hidden relative">
      <div class="flex items-center px-5 min-w-[288px]">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0 cursor-pointer"
             @click="emit('toggle')">
          <img src="/logo_black.png" alt="GCX" class="h-6 w-auto brightness-0 invert" />
        </div>
        <div class="ml-3 transition-all duration-300" :class="isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'">
          <h1 class="text-xl font-black tracking-tight text-white leading-none">
            GCX<span class="text-green-500">CMS</span>
          </h1>
          <p class="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mt-1">
            Admin Portal
          </p>
        </div>
      </div>
      
      <!-- Expand Toggle Button (Visible when collapsed) -->
      <button 
        v-if="!isOpen"
        @click="emit('toggle')"
        class="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent hover:bg-gray-800/30 transition-colors group"
      >
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform">
          <img src="/logo_black.png" alt="GCX" class="h-6 w-auto brightness-0 invert" />
        </div>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar overflow-x-hidden">
      <template v-for="item in visibleItems" :key="item.id">
        <!-- Section Header -->
        <div v-if="(item.id === 'content' || item.id === 'people' || item.id === 'resources') && isOpen" 
             class="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 truncate">
          {{ item.label }}
        </div>
        <div v-else-if="(item.id === 'content' || item.id === 'people' || item.id === 'resources') && !isOpen"
             class="h-6 flex items-center justify-center">
          <div class="w-1 h-1 rounded-full bg-gray-700"></div>
        </div>

        <!-- Parent Item without children -->
        <div v-if="!hasChildren(item)">
          <button
            @click="navigateToSection(item.id)"
            class="w-full flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden mb-1"
            :class="isItemActive(item.id)
              ? 'bg-green-600/20 text-green-400 shadow-inner shadow-green-500/10'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'"
            :title="!isOpen ? item.label : ''"
          >
            <!-- Active Indicator -->
            <div v-if="isItemActive(item.id)" class="absolute left-0 top-2 bottom-2 w-1.5 bg-green-500 rounded-r-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            
            <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-xl transition-all duration-300"
                 :class="isItemActive(item.id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-500 group-hover:bg-gray-700 group-hover:text-white'">
              <i :class="item.icon" class="text-lg"></i>
            </div>
            <span class="ml-4 transition-all duration-500 whitespace-nowrap font-black uppercase tracking-widest text-[11px]" 
                  :class="isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'">
              {{ item.label }}
            </span>
          </button>
        </div>

        <!-- Parent with Children (Dropdown) -->
        <div v-else class="space-y-1 mb-1">
          <button
            @click="isOpen ? toggleDropdown(item.id) : emit('toggle')"
            class="w-full flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group hover:bg-gray-800 relative overflow-hidden"
            :class="isDropdownOpen(item.id) ? 'text-white bg-gray-800/50' : 'text-gray-400'"
            :title="!isOpen ? item.label : ''"
          >
            <div class="flex items-center flex-1">
              <div class="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-xl transition-all duration-300"
                   :class="isDropdownOpen(item.id) ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-500 group-hover:bg-gray-700 group-hover:text-white'">
                <i :class="item.icon" class="text-lg"></i>
              </div>
              <span class="ml-4 transition-all duration-500 group-hover:text-white whitespace-nowrap font-black uppercase tracking-widest text-[11px]" 
                    :class="isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'">
                {{ item.label }}
              </span>
            </div>
            <i 
              v-if="isOpen"
              :class="[
                'pi transition-transform duration-300 text-[10px] ml-2',
                isDropdownOpen(item.id) ? 'pi-chevron-down text-green-400' : 'pi-chevron-right text-gray-600'
              ]"
            ></i>
          </button>
          
          <!-- Dropdown Content -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div 
              v-show="isDropdownOpen(item.id) && isOpen"
              class="space-y-1 mt-1 ml-4 pl-4 border-l border-gray-800"
            >
              <button
                v-for="child in item.children"
                :key="child.id"
                @click="navigateToSection(child.id)"
                class="w-full flex items-center px-4 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 group relative"
                :class="isItemActive(child.id)
                  ? 'text-green-400 bg-green-500/5'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800/30'"
              >
                <div class="w-4 h-4 flex items-center justify-center flex-shrink-0"
                     :class="isItemActive(child.id) ? 'text-green-400' : 'text-gray-600 group-hover:text-white'">
                  <i :class="child.icon" class="text-sm"></i>
                </div>
                <span class="ml-3 whitespace-nowrap">{{ child.label }}</span>
              </button>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <!-- Fixed Bottom Section -->
    <div class="shrink-0 bg-gray-900/80 backdrop-blur-md border-t border-gray-800/50 overflow-hidden">
      <!-- User Info -->
      <div class="px-3 py-4">
        <div class="flex items-center p-2 rounded-2xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 transition-all duration-300 group cursor-pointer overflow-hidden">
          <div class="relative flex-shrink-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 transition-transform duration-300">
              <span class="text-lg font-black text-white">
                {{ user?.name?.charAt(0)?.toUpperCase() }}
              </span>
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div class="ml-4 flex-1 min-w-0 transition-all duration-500" :class="isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'">
            <p class="text-xs font-black text-white truncate group-hover:text-green-400 transition-colors uppercase tracking-wider">
              {{ user?.name }}
            </p>
            <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">
              {{ user?.role }}
            </p>
          </div>
          <button @click="handleLogout" 
                  class="ml-2 p-2 text-gray-500 hover:text-red-400 transition-all duration-300"
                  :class="isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'">
            <i class="pi pi-sign-out"></i>
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 bg-gray-950/50 min-w-[288px]">
        <div class="flex items-center justify-between transition-opacity duration-300" :class="isOpen ? 'opacity-100' : 'opacity-0'">
          <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            v2.1.0
          </p>
          <p class="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            © 2026 GCX
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    @click="emit('toggle')"
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
  ></div>
</template>

<style scoped>
/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

/* Smooth transitions */
button {
  transition: all 0.2s ease;
}

/* Active item glow effect */
.bg-green-600 {
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.3);
}

/* Reduced hover effects */
button:hover {
  /* Removed translateX for a more stable feel */
}

/* Icon animations - more subtle */
i {
  transition: transform 0.2s ease;
}

button:hover i {
  /* Removed scale(1.1) for a more stable feel */
}
</style>