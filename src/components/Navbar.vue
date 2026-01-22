<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { isDarkMode, toggleDarkMode } from '../utils/darkMode'
import { useTickerVisibility } from '../composables/useTickerVisibility'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const isMenuOpen = ref(false)
const searchQuery = ref('')
const { isTickerVisible } = useTickerVisibility()
const { t } = useI18n()

// Dynamic navbar positioning based on ticker visibility
const navbarTop = computed(() => {
  return isTickerVisible.value ? 'top-14' : 'top-0'
})

// Simplified navigation structure
const navigation = computed(() => [
  { name: 'Home', href: '/' },
  { 
    name: 'About', 
    href: '/about',
    dropdown: [
      { 
        title: 'About GCX',
        items: [
          { name: t('navigation.about.aboutGcx'), href: '/about#about', description: 'Overview of Ghana Commodity Exchange' },
          { name: t('navigation.about.mission'), href: '/about#who', description: 'Our mission and purpose' },
          { name: t('navigation.about.vision'), href: '/about#vision', description: 'Our vision and strategic goals' },
          { name: 'GCX Rule Book', href: '/gcx_rules_obligations.pdf', description: 'GCX rules and regulations document', external: true }
        ]
      },
      { 
        title: 'Services',
        items: [
          { name: 'Trading Services', href: '/services#trading', description: 'Commodity trading and market access' },
          { name: 'Market Data', href: '/services#market-data', description: 'Real-time market information and analytics' },
          { name: 'GCX Certification Program in Commodity Trading', href: 'https://apps.gcx.com.gh/onlineforms/', description: 'Certificate Programme in Commodity Trading (CPCT)', external: true }
        ]
      },
      { 
        title: 'Leadership',
        items: [
          { name: t('navigation.about.boardOfDirectors'), href: '/about#board', description: 'GCX board members and governance' },
          { name: t('navigation.about.executiveManagement'), href: '/about#exec', description: 'Senior leadership team' },
          { name: t('navigation.about.functionalHeads'), href: '/about#func', description: 'Department and function leaders' }
        ]
      },
      { 
        title: 'Partnerships',
        items: [
          { name: 'Strategic Partners', href: '/about/partnership#partners', description: 'Building strong partnerships for market growth' },
          { name: 'Donor Agencies', href: '/about/partnership#donors', description: 'International donor partnerships' },
          { name: 'Financial Institutions', href: '/about/partnership#financial', description: 'Banking and financial collaborations' },
          { name: 'Government Agencies', href: '/about/partnership#government', description: 'Government sector partnerships' }
        ]
      }
    ]
  },
  { 
    name: 'Market Data', 
    href: '/market-data',
    dropdown: [
      { 
        title: 'Market Information',
        items: [
          { name: 'Market Overview', href: '/market-data#overview', description: 'Comprehensive market analysis and statistics' },
          { name: 'Market Reports', href: '/market-data#reports', description: 'Detailed market reports and analysis' }
        ]
      },
      { 
        title: 'Useful Links',
        items: [
          { name: 'MCX', href: 'https://www.mcxindia.com/', description: 'Multi Commodity Exchange of India', external: true },
          { name: 'NASDAQ', href: 'https://www.nasdaq.com/', description: 'NASDAQ Stock Exchange', external: true },
          { name: 'ICE', href: 'https://www.ice.com/', description: 'Intercontinental Exchange', external: true },
          { name: 'SAFEX', href: 'https://www.jse.co.za/derivatives/commodity-derivatives-market', description: 'South African Futures Exchange', external: true }
        ]
      }
    ]
  },
  { 
    name: 'Commodities', 
    href: '/commodities',
    dropdown: [
      { 
        title: 'Commodity Markets',
        items: [
          { name: 'Maize', href: '/commodities#maize', description: 'Maize commodity trading and pricing' },
          { name: 'Rice', href: '/commodities#rice', description: 'Rice market insights and trading' },
          { name: 'Sesame', href: '/commodities#sesame', description: 'Sesame seed trading and market data' },
          { name: 'Sorghum', href: '/commodities#sorghum', description: 'Sorghum commodity details and pricing' },
          { name: 'Soya Bean', href: '/commodities#soybean', description: 'Soya bean market insights and trading' }
        ]
      }
    ]
  },
  { 
    name: 'Membership', 
    href: '/membership',
    dropdown: [
      { 
        title: 'Membership Information',
        items: [
          { name: 'Membership Types', href: '/membership#types', description: 'Different membership categories and requirements' },
          { name: 'Membership Benefits', href: '/membership#benefits', description: 'Exclusive benefits for GCX members' },
          { name: 'Rights & Obligations', href: '/membership#rights', description: 'Member rights and responsibilities' },
          { name: 'Membership List', href: '/membership#list', description: 'Current GCX member directory' }
        ]
      },
      { 
        title: 'Application Process',
        items: [
          { name: 'Rules & Regulations', href: '/membership/application#rules', description: 'Complete membership rules and guidelines' },
          { name: 'Application Process', href: '/membership/application#process', description: 'Step-by-step application guide' },
          { name: 'Application Forms', href: '/membership/application#forms', description: 'Download membership application forms' }
        ]
      }
    ]
  },
  { 
    name: 'Resources', 
    href: '/resources',
    dropdown: [
      { 
        title: 'Publications & Documents',
        items: [
          { name: 'Research Papers', href: '/resources#research', description: 'Academic and industry research publications' },
          { name: 'Annual Reports', href: '/resources#annual', description: 'GCX annual performance reports' },
          { name: 'Policy Documents', href: '/resources#policy', description: 'Regulatory and policy information' }
        ]
      },
      { 
        title: 'Career Opportunities',
        items: [
          { name: 'Job Openings', href: '/careers#openings', description: 'Current career opportunities at GCX' },
          { name: 'Functional Areas', href: '/careers/functional-areas', description: 'Available job functions and departments' }
        ]
      }
    ]
  },
  { name: 'RTI', href: '/rti' },
  { 
    name: 'Media', 
    href: '/blog',
    dropdown: [
      { 
        title: 'News & Events',
        items: [
          { name: 'Latest News', href: '/blog', description: 'Recent news and announcements' },
          { name: 'Event Archives', href: '/media/archives', description: 'Past events and historical coverage' }
        ]
      },
      { 
        title: 'Multimedia',
        items: [
          { name: 'Videos', href: '/media/videos', description: 'Video content and presentations' },
          { name: 'Photo Gallery', href: '/media/gallery', description: 'Event photos and visual content' }
        ]
      }
    ]
  },
  { name: 'Contact', href: '/contact' }
])

// State management
const openDropdown = ref<string | null>(null)
const openMobileDropdown = ref<string | null>(null)
let dropdownTimeout: number | null = null
const navContainer = ref<HTMLElement | null>(null)
const dropdownStyles = ref<Record<string, CSSProperties>>({})

// Methods
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
  openMobileDropdown.value = null
}

const toggleMobileDropdown = (itemName: string) => {
  openMobileDropdown.value = openMobileDropdown.value === itemName ? null : itemName
}

const openDropdownMenu = (itemName: string) => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
  openDropdown.value = itemName
  if (isWideDropdown(itemName)) {
    nextTick(() => {
      const rect = navContainer.value?.getBoundingClientRect()
      if (rect) {
        const offset = 80
        dropdownStyles.value[itemName] = {
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `${Math.max(rect.bottom - offset, rect.top + 4)}px`
        }
      }
    })
  } else {
    delete dropdownStyles.value[itemName]
  }
}

const toggleDropdown = (itemName: string) => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
  openDropdown.value = openDropdown.value === itemName ? null : itemName
  if (openDropdown.value && isWideDropdown(itemName)) {
    nextTick(() => {
      const rect = navContainer.value?.getBoundingClientRect()
      if (rect) {
        const offset = 80
        dropdownStyles.value[itemName] = {
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `${Math.max(rect.bottom - offset, rect.top + 4)}px`
        }
      }
    })
  } else {
    delete dropdownStyles.value[itemName]
  }
}

const closeDropdown = () => {
  dropdownTimeout = setTimeout(() => {
    openDropdown.value = null
    dropdownStyles.value = {}
  }, 220)
}

const clearDropdownTimeout = () => {
  if (dropdownTimeout) {
    clearTimeout(dropdownTimeout)
    dropdownTimeout = null
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Navigate to search results page
    router.push({
      path: '/search',
      query: { q: searchQuery.value }
    })
  }
}

const navigateToApplication = () => {
  router.push('/membership/application')
  closeMenu()
}

const isWideDropdown = (name: string) => name === 'About'
</script>

<template>
  <!-- Professional Modern Navbar -->
  <nav 
    class="fixed left-0 right-0 z-50 backdrop-blur-md shadow-sm border-b transition-all duration-300" 
    :class="[
      navbarTop,
      isDarkMode ? 'bg-slate-900/95 border-slate-700/50 shadow-slate-900/20' : 'bg-white/95 border-gray-200/50 shadow-gray-200/20'
    ]"
    ref="navContainer"
  >
    <!-- Main navbar content -->
    <div class="w-full px-6">
      <div class="flex items-center h-20">
        
        <!-- Logo - Left -->
        <div class="flex items-center flex-shrink-0">
          <router-link to="/" class="flex items-center group">
            <!-- Desktop - Main logo -->
            <img 
              src="/logo_black.png"
              alt="GCX Logo"
              class="hidden sm:block h-16 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <!-- Mobile - Compact version -->
            <img 
              src="/logo_black.png" 
              alt="GCX Logo"
              class="block sm:hidden h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </router-link>
        </div>

        <!-- Desktop Navigation - Center -->
        <div class="hidden xl:flex items-center justify-center flex-1">
          <div class="flex items-center space-x-0.5 rounded-full px-2 py-1.5 backdrop-blur-sm border max-w-5xl"
               :class="isDarkMode ? 'bg-slate-800/90 border-slate-700/50' : 'bg-gray-100/80 border-gray-200/50'">
            <div
              v-for="item in navigation"
              :key="item.name"
              class="relative"
              @mouseenter="item.dropdown ? (clearDropdownTimeout(), openDropdownMenu(item.name)) : null"
              @mouseleave="closeDropdown"
            >
              <router-link 
                :to="item.href"
                @click="item.dropdown ? (toggleDropdown(item.name), $event.preventDefault()) : null"
                class="px-2.5 py-2 text-xs font-medium rounded-full transition-all flex items-center whitespace-nowrap"
                :class="$route.path === item.href 
                  ? (isDarkMode ? 'bg-slate-700 shadow-sm text-white' : 'bg-white shadow-sm text-black')
                  : (isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-black hover:bg-white/50')"
              >
                {{ item.name }}
                <ChevronDownIcon v-if="item.dropdown" class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
                </ChevronDownIcon>
              </router-link>
              
              <!-- Large Dropdown Menu -->
              <transition name="fade-slide">
                <div
                  v-if="item.dropdown && openDropdown === item.name"
                  :class="[
                    'mt-2 rounded-xl shadow-lg border py-4 z-50 transition-all duration-300 origin-top',
                    isDarkMode ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300',
                    isWideDropdown(item.name)
                      ? 'w-[min(800px,88vw)]'
                      : 'absolute top-full left-0 w-[560px] max-w-[85vw]'
                  ]"
                  :style="isWideDropdown(item.name) ? dropdownStyles[item.name] : undefined"
                  @mouseenter="clearDropdownTimeout()"
                  @mouseleave="closeDropdown"
                >
                  <div v-if="isWideDropdown(item.name)" class="px-6">
                    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
                      <div v-for="section in item.dropdown" :key="section.title" class="space-y-3">
                        <h4 class="text-xs font-semibold uppercase tracking-wide mb-2"
                            :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                          {{ section.title }}
                        </h4>
                        <div class="space-y-1">
                          <component
                            :is="(dropdownItem as any).external ? 'a' : 'router-link'"
                            v-for="dropdownItem in section.items"
                            :key="dropdownItem.name"
                            :to="(dropdownItem as any).external ? undefined : dropdownItem.href"
                            :href="(dropdownItem as any).external ? dropdownItem.href : undefined"
                            :target="(dropdownItem as any).external ? '_blank' : undefined"
                            :rel="(dropdownItem as any).external ? 'noopener noreferrer' : undefined"
                            @click="closeDropdown"
                            class="group block p-3 rounded-lg transition-all duration-200 border"
                            :class="isDarkMode ? 'border-slate-700/60 hover:border-yellow-500/60 hover:bg-slate-800' : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50/60'"
                          >
                            <div class="flex items-start justify-between gap-2">
                              <div class="flex-1">
                                <h5 class="font-medium text-sm mb-0.5 transition-colors"
                                    :class="isDarkMode ? 'text-white group-hover:text-yellow-300' : 'text-gray-900 group-hover:text-yellow-600'">
                                  {{ dropdownItem.name }}
                                </h5>
                                <p class="text-xs leading-relaxed transition-colors"
                                   :class="isDarkMode ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-600 group-hover:text-gray-700'">
                                  {{ dropdownItem.description }}
                                </p>
                              </div>
                              <svg class="w-4 h-4 transition-colors"
                                   :class="isDarkMode ? 'text-slate-500 group-hover:text-yellow-300' : 'text-gray-400 group-hover:text-yellow-500'"
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </div>
                          </component>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else class="grid grid-cols-2 gap-3 px-4">
                    <!-- Left Column -->
                    <div class="space-y-2">
                      <div v-for="(section, index) in item.dropdown.slice(0, Math.ceil(item.dropdown.length / 2))" :key="index">
                        <h4 class="text-xs font-semibold uppercase tracking-wide mb-2"
                            :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                          {{ section.title }}
                        </h4>
                        <div class="space-y-1">
                          <component
                            :is="(dropdownItem as any).external ? 'a' : 'router-link'"
                            v-for="dropdownItem in section.items"
                            :key="dropdownItem.name"
                            :to="(dropdownItem as any).external ? undefined : dropdownItem.href"
                            :href="(dropdownItem as any).external ? dropdownItem.href : undefined"
                            :target="(dropdownItem as any).external ? '_blank' : undefined"
                            :rel="(dropdownItem as any).external ? 'noopener noreferrer' : undefined"
                            @click="closeDropdown"
                            class="group block p-2 rounded-lg transition-all duration-200"
                            :class="isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'"
                          >
                            <div class="flex items-start justify-between">
                              <div class="flex-1">
                                <h5 class="font-medium text-sm mb-0.5 transition-colors"
                                    :class="isDarkMode ? 'text-white group-hover:text-yellow-300' : 'text-black group-hover:text-yellow-500'">
                                  {{ dropdownItem.name }}
                                </h5>
                                <p class="text-xs leading-relaxed transition-colors"
                                   :class="isDarkMode ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-600 group-hover:text-gray-500'">
                                  {{ dropdownItem.description }}
                                </p>
                              </div>
                              <svg class="w-4 h-4 transition-colors"
                                   :class="isDarkMode ? 'text-slate-500 group-hover:text-yellow-400' : 'text-gray-400 group-hover:text-yellow-500'"
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </div>
                          </component>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-2">
                      <div v-for="(section, index) in item.dropdown.slice(Math.ceil(item.dropdown.length / 2))" :key="index">
                        <h4 class="text-xs font-semibold uppercase tracking-wide mb-2"
                            :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
                          {{ section.title }}
                        </h4>
                        <div class="space-y-1">
                          <component
                            :is="(dropdownItem as any).external ? 'a' : 'router-link'"
                            v-for="dropdownItem in section.items"
                            :key="dropdownItem.name"
                            :to="(dropdownItem as any).external ? undefined : dropdownItem.href"
                            :href="(dropdownItem as any).external ? dropdownItem.href : undefined"
                            :target="(dropdownItem as any).external ? '_blank' : undefined"
                            :rel="(dropdownItem as any).external ? 'noopener noreferrer' : undefined"
                            @click="closeDropdown"
                            class="group block p-2 rounded-lg transition-all duration-200"
                            :class="isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'"
                          >
                            <div class="flex items-start justify-between">
                              <div class="flex-1">
                                <h5 class="font-medium text-sm mb-0.5 transition-colors"
                                    :class="isDarkMode ? 'text-white group-hover:text-yellow-300' : 'text-black group-hover:text-yellow-500'">
                                  {{ dropdownItem.name }}
                                </h5>
                                <p class="text-xs leading-relaxed transition-colors"
                                   :class="isDarkMode ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-600 group-hover:text-gray-500'">
                                  {{ dropdownItem.description }}
                                </p>
                              </div>
                              <svg class="w-4 h-4 transition-colors"
                                   :class="isDarkMode ? 'text-slate-500 group-hover:text-yellow-400' : 'text-gray-400 group-hover:text-yellow-500'"
                                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </div>
                          </component>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom CTA Section -->
                  <div class="mt-4 pt-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-gray-200'">
                    <div class="px-6">
                      <div class="rounded-lg p-3 border"
                           :class="isDarkMode ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border-yellow-700/30' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'">
                        <div class="flex items-center justify-between">
                          <div>
                            <h4 class="font-semibold text-sm mb-0.5" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">Ready to Get Started?</h4>
                            <p class="text-xs" :class="isDarkMode ? 'text-yellow-200' : 'text-yellow-700'">Join GCX and access our comprehensive trading platform</p>
                          </div>
                          <button 
                            @click="navigateToApplication"
                            class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-1.5 rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Medium Screen Navigation (Tablets) -->
        <div class="hidden lg:flex xl:hidden items-center justify-center flex-1">
          <div class="flex items-center space-x-1 rounded-full px-2 py-1.5 backdrop-blur-sm border max-w-4xl"
               :class="isDarkMode ? 'bg-slate-800/90 border-slate-700/50' : 'bg-gray-100/80 border-gray-200/50'">
            <div
              v-for="item in navigation.slice(0, 7)"
              :key="item.name"
              class="relative"
              @mouseenter="item.dropdown ? (clearDropdownTimeout(), toggleDropdown(item.name)) : null"
              @mouseleave="item.dropdown ? closeDropdown : null"
            >
              <router-link 
                :to="item.href"
                @click="item.dropdown ? $event.preventDefault() : null"
                class="px-2 py-1.5 text-xs font-medium rounded-full transition-all flex items-center whitespace-nowrap"
                :class="$route.path === item.href 
                  ? (isDarkMode ? 'bg-slate-700 shadow-sm text-white' : 'bg-white shadow-sm text-black')
                  : (isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-black hover:bg-white/50')"
              >
                {{ item.name }}
                <ChevronDownIcon v-if="item.dropdown" class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
                </ChevronDownIcon>
              </router-link>
              
              <!-- Medium Dropdown Menu -->
              <div
                v-if="item.dropdown && openDropdown === item.name"
                class="absolute top-full left-0 mt-1 w-[500px] rounded-xl shadow-lg border py-4 z-50 transition-all duration-300"
                :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
              >
                <div class="grid grid-cols-1 gap-6 px-6">
                  <div v-for="section in item.dropdown" :key="section.title" class="space-y-3">
                    <h4 class="text-sm font-semibold text-yellow-500 border-b border-yellow-200 pb-2" :class="isDarkMode ? 'border-yellow-700' : 'border-yellow-200'">
                      {{ section.title }}
                    </h4>
                    <div class="space-y-1">
                      <component
                        :is="(dropdownItem as any).external ? 'a' : 'router-link'"
                    v-for="dropdownItem in section.items"
                    :key="dropdownItem.name"
                        :to="(dropdownItem as any).external ? undefined : dropdownItem.href"
                        :href="(dropdownItem as any).external ? dropdownItem.href : undefined"
                        :target="(dropdownItem as any).external ? '_blank' : undefined"
                        :rel="(dropdownItem as any).external ? 'noopener noreferrer' : undefined"
                        class="group block p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:border-gray-200"
                        :class="isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'"
                      >
                        <div class="flex items-start justify-between">
                          <div class="flex-1">
                            <h5 class="font-medium text-sm mb-0.5 transition-colors text-black group-hover:text-yellow-500"
                                :class="isDarkMode ? 'text-white group-hover:text-yellow-300' : 'text-black group-hover:text-yellow-500'">
                              {{ dropdownItem.name }}
                            </h5>
                            <p class="text-xs leading-relaxed text-gray-600 group-hover:text-gray-500"
                               :class="isDarkMode ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-600 group-hover:text-gray-500'">
                              {{ dropdownItem.description }}
                            </p>
                          </div>
                          <svg class="w-4 h-4 transition-colors text-gray-400 group-hover:text-yellow-500" 
                               :class="isDarkMode ? 'text-slate-500 group-hover:text-yellow-400' : 'text-gray-400 group-hover:text-yellow-500'" 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </component>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- More button for remaining items -->
            <div class="relative" @mouseenter="clearDropdownTimeout(); toggleDropdown('more')" @mouseleave="closeDropdown">
              <button class="px-2 py-1.5 text-xs font-medium rounded-full transition-all flex items-center whitespace-nowrap"
                      :class="isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-black hover:bg-white/50'">
                More
                <ChevronDownIcon class="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M19 9l-7 7-7-7" />
                </ChevronDownIcon>
              </button>
              
              <!-- More items dropdown -->
              <div
                v-if="openDropdown === 'more'"
                class="absolute top-full left-0 mt-1 w-[300px] rounded-xl shadow-lg border py-4 z-50 transition-all duration-300"
                :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
              >
                <div class="px-4 space-y-2">
                  <router-link
                    v-for="item in navigation.slice(7)"
                    :key="item.name"
                    :to="item.href"
                    class="block px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                    :class="isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
                  >
                    {{ item.name }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Actions closer to navigation -->
        <div class="flex items-center justify-end space-x-4 ml-4">
          <!-- Enhanced Search Bar with more space -->
          <div class="hidden md:flex items-center">
            <div class="relative">
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search..."
                class="w-48 pl-4 pr-10 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 shadow-sm transition-all duration-300"
                :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400 hover:border-slate-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400'"
              />
              <button
                @click="handleSearch"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-yellow-500 transition-colors duration-200"
              >
                <MagnifyingGlassIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Mobile Search -->
          <button
            @click="toggleMenu"
            class="md:hidden p-2.5 rounded-full transition-all duration-300"
            :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'"
          >
            <MagnifyingGlassIcon class="h-5 w-5" :class="isDarkMode ? 'text-slate-300' : 'text-gray-600'" />
          </button>


          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="hidden lg:flex items-center p-2.5 rounded-full transition-all duration-300"
            :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'"
          >
            <SunIcon v-if="!isDarkMode" class="h-5 w-5" :class="isDarkMode ? 'text-slate-300' : 'text-gray-600'" />
            <MoonIcon v-else class="h-5 w-5" :class="isDarkMode ? 'text-slate-300' : 'text-gray-600'" />
          </button>

          <!-- Apply Button -->
          <button 
            @click="navigateToApplication"
            class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-sm"
          >
            Apply
          </button>

          <!-- Mobile menu button -->
          <div class="lg:hidden">
            <button
              @click="toggleMenu"
              class="p-2.5 rounded-full transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'"
            >
              <div class="relative w-5 h-5">
                <!-- Animated hamburger icon -->
                <span class="absolute left-0 top-1 w-5 h-0.5 transition-all duration-300" :class="[isDarkMode ? 'bg-slate-300' : 'bg-gray-600', isMenuOpen ? 'rotate-45 translate-y-1.5' : '']"></span>
                <span class="absolute left-0 top-2.5 w-5 h-0.5 transition-all duration-300" :class="[isDarkMode ? 'bg-slate-300' : 'bg-gray-600', isMenuOpen ? 'opacity-0' : '']"></span>
                <span class="absolute left-0 top-4 w-5 h-0.5 transition-all duration-300" :class="[isDarkMode ? 'bg-slate-300' : 'bg-gray-600', isMenuOpen ? '-rotate-45 -translate-y-1.5' : '']"></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMenuOpen" class="lg:hidden">
        <div class="py-4 space-y-2 backdrop-blur-md rounded-2xl mx-2 mb-4 shadow-xl border transition-all duration-300 max-h-[80vh] overflow-y-auto"
             :class="isDarkMode ? 'bg-slate-800/95 border-slate-700/50' : 'bg-white/95 border-gray-200/50'">
          
          <!-- Mobile Search -->
          <div class="px-4 mb-4">
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                v-model="searchQuery"
                @keyup.enter="handleSearch"
                type="text"
                placeholder="Search..."
                class="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                :class="isDarkMode ? 'bg-slate-700 text-white placeholder-slate-400 border-slate-600' : 'bg-slate-50 text-slate-900 placeholder-slate-500 border-slate-300'"
              />
            </div>
          </div>

          <!-- Mobile Navigation Links -->
          <div class="px-2">
            <div v-for="item in navigation" :key="item.name" class="mb-1">
              <!-- Main navigation item -->
              <div class="flex items-center">
                <router-link
                  :to="item.href"
                  @click="closeMenu"
                  class="flex-1 px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
                  :class="$route.path === item.href 
                    ? (isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-yellow-50 text-yellow-600')
                    : (isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900')"
                >
                  <span class="truncate">{{ item.name }}</span>
                </router-link>
                
                <!-- Dropdown toggle button -->
                <button
                  v-if="item.dropdown"
                  @click="toggleMobileDropdown(item.name)"
                  class="p-2 rounded-lg transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'"
                >
                  <ChevronDownIcon 
                    class="h-4 w-4 transition-transform duration-200"
                    :class="openMobileDropdown === item.name ? 'rotate-180' : ''"
                  />
                </button>
              </div>
              
              <!-- Mobile Dropdown (collapsed by default) -->
              <div 
                v-if="item.dropdown && openMobileDropdown === item.name" 
                class="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200"
              >
                <div v-for="section in item.dropdown" :key="section.title" class="mb-3">
                  <h4 class="text-xs font-semibold uppercase tracking-wide mb-2 px-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                    {{ section.title }}
                  </h4>
                      <component
                        :is="(dropdownItem as any).external ? 'a' : 'router-link'"
                    v-for="dropdownItem in section.items"
                    :key="dropdownItem.name"
                        :to="(dropdownItem as any).external ? undefined : dropdownItem.href"
                        :href="(dropdownItem as any).external ? dropdownItem.href : undefined"
                        :target="(dropdownItem as any).external ? '_blank' : undefined"
                        :rel="(dropdownItem as any).external ? 'noopener noreferrer' : undefined"
                    @click="closeMenu"
                    class="block px-3 py-2 text-sm transition-colors rounded-lg truncate"
                    :class="isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
                  >
                    {{ dropdownItem.name }}
                  </component>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Utilities -->
          <div class="px-4 pt-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
            <div class="flex items-center justify-between mb-4">
              <!-- Dark Mode Toggle -->
              <button
                @click="toggleDarkMode"
                class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200"
                :class="isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'"
              >
                <SunIcon v-if="!isDarkMode" class="h-4 w-4" />
                <MoonIcon v-else class="h-4 w-4" />
                <span class="text-sm font-medium">{{ isDarkMode ? 'Light' : 'Dark' }}</span>
              </button>

            </div>

            <!-- Mobile Apply Button -->
            <button 
              @click="navigateToApplication"
              class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Brand Line at Bottom - Full Width -->
    <div class="h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 w-full"></div>
  </nav>

  <!-- Spacer for fixed navbar -->
  <div class="h-20"></div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}
</style>