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

// Track which dropdowns are open
const openDropdowns = ref<Set<string>>(new Set()) // All dropdowns closed by default

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
        id: 'pages',
        label: 'Pages',
        icon: 'pi pi-globe',
        permissions: ['admin']
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
    id: 'market-data',
    label: 'Market Data',
    icon: 'pi pi-chart-line',
    permissions: ['admin']
  },
  {
    id: 'users',
    label: 'User Management',
    icon: 'pi pi-users',
    permissions: ['admin']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'pi pi-chart-bar',
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
  return openDropdowns.value.has(itemId)
}

const toggleDropdown = (itemId: string) => {
  if (openDropdowns.value.has(itemId)) {
    openDropdowns.value.delete(itemId)
  } else {
    openDropdowns.value.add(itemId)
  }
  // Force reactivity update
  openDropdowns.value = new Set(openDropdowns.value)
}

const navigateToSection = (section: string) => {
  // Map section IDs to route names
  const routeMap: Record<string, string> = {
    'dashboard': 'cms-dashboard',
    'posts': 'cms-posts',
    'image-manager': 'cms-images',
    'pages': 'cms-pages',
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
    'market-data': 'cms-market-data',
    'users': 'cms-users',
    'analytics': 'cms-analytics',
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
    class="fixed left-0 top-0 h-full w-72 z-40 transform transition-all duration-300 ease-in-out border-r shadow-xl bg-gray-900 border-gray-800"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-800">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
          <img src="/logo_black.png" alt="GCX" class="h-5 w-auto" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">
            GCX CMS
          </h1>
          <p class="text-xs text-gray-400 font-medium">
            Content Management
          </p>
        </div>
      </div>
      
      <!-- Toggle Button for Mobile -->
      <button
        @click="emit('toggle')"
        class="lg:hidden p-2 rounded-lg transition-colors hover:bg-gray-800 text-gray-400 hover:text-white"
      >
        <i class="pi pi-times text-lg"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-2 pb-80">
      <template v-for="item in visibleItems" :key="item.id">
        <!-- Parent Item without children -->
        <div v-if="!hasChildren(item)">
          <button
            @click="navigateToSection(item.id)"
            class="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group"
            :class="isItemActive(item.id)
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-white hover:bg-gray-800 hover:text-white'"
          >
            <div class="w-6 h-6 flex items-center justify-center">
              <i :class="item.icon" class="text-lg"></i>
            </div>
            <span>{{ item.label }}</span>
          </button>
        </div>

        <!-- Parent with Children (Dropdown) -->
        <div v-else class="space-y-1">
          <button
            @click="toggleDropdown(item.id)"
            class="w-full flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 group hover:bg-gray-800"
          >
            <div class="flex items-center space-x-4">
              <div class="w-6 h-6 flex items-center justify-center">
                <i :class="item.icon" class="text-lg text-white group-hover:text-white"></i>
              </div>
              <span class="text-white group-hover:text-white">{{ item.label }}</span>
            </div>
            <i 
              :class="[
                'pi transition-transform duration-200 text-white',
                isDropdownOpen(item.id) ? 'pi-chevron-down' : 'pi-chevron-right'
              ]"
            ></i>
          </button>
          
          <!-- Dropdown Content -->
          <div 
            v-show="isDropdownOpen(item.id)"
            class="space-y-1 ml-6 border-l border-gray-700 pl-4"
          >
            <button
              v-for="child in item.children"
              :key="child.id"
              @click="navigateToSection(child.id)"
              class="w-full flex items-center space-x-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
              :class="isItemActive(child.id)
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-white hover:bg-gray-800 hover:text-white'"
            >
              <div class="w-5 h-5 flex items-center justify-center">
                <i :class="child.icon" class="text-base"></i>
              </div>
              <span>{{ child.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </nav>

    <!-- Fixed Bottom Section -->
    <div class="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <!-- User Info -->
      <div class="px-6 py-4">
        <div class="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <span class="text-lg font-bold text-white">
              {{ user?.name?.charAt(0)?.toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-white truncate">
              {{ user?.name }}
            </p>
            <div class="flex items-center space-x-2">
              <p class="text-xs text-green-400 font-medium capitalize">
                {{ user?.role }}
              </p>
              <div class="flex items-center space-x-1">
                <i class="pi pi-circle-fill text-green-500 text-xs"></i>
                <span class="text-xs text-gray-400">{{ t('common.status.online') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logout Section -->
      <div class="px-6 py-4 border-t-2 border-gray-700">
        <button
          @click="handleLogout"
          class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-900/20 hover:text-red-300 group"
        >
          <i class="pi pi-sign-out text-base"></i>
          <span>{{ t('navigation.menu.logout') }}</span>
          <i class="pi pi-angle-right text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity"></i>
        </button>
      </div>

      <!-- Footer -->
      <div class="px-6 py-3 border-t border-gray-800 bg-gray-900/50">
        <p class="text-xs text-gray-500 text-center">
          © 2025 GCX Platform
        </p>
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

/* Hover effects */
button:hover {
  transform: translateX(2px);
}

/* Icon animations */
i {
  transition: transform 0.2s ease;
}

button:hover i {
  transform: scale(1.1);
}
</style>