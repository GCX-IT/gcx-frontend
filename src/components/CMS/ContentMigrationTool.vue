<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'

interface MigrationItem {
  id: string
  name: string
  type: 'page' | 'homepage_section' | 'setting'
  description: string
  status: 'pending' | 'migrating' | 'completed' | 'error'
  error?: string
}

const { t } = useI18n()

// State
const migrationItems = ref<MigrationItem[]>([])
const isMigrating = ref(false)
const migrationProgress = ref(0)
const completedCount = ref(0)

// Computed
const totalItems = computed(() => migrationItems.value.length)
const progressPercentage = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((completedCount.value / totalItems.value) * 100)
})

const canStartMigration = computed(() => {
  return !isMigrating.value && migrationItems.value.some(item => item.status === 'pending')
})

// Methods
const initializeMigrationItems = () => {
  migrationItems.value = [
    {
      id: 'homepage_hero',
      name: 'Homepage Hero Section',
      type: 'homepage_section',
      description: 'Hero banner with title, subtitle, and CTA buttons',
      status: 'pending'
    },
    {
      id: 'homepage_why_join',
      name: 'Why Join Us Section',
      type: 'homepage_section',
      description: 'Three cards explaining benefits of joining GCX',
      status: 'pending'
    },
    {
      id: 'homepage_services',
      name: 'Services Section',
      type: 'homepage_section',
      description: 'Services overview and features',
      status: 'pending'
    },
    {
      id: 'homepage_market_data',
      name: 'Market Data Section',
      type: 'homepage_section',
      description: 'Market statistics and data visualization',
      status: 'pending'
    },
    {
      id: 'homepage_cta',
      name: 'Call to Action Section',
      type: 'homepage_section',
      description: 'Final CTA section with registration and resources',
      status: 'pending'
    },
    {
      id: 'site_settings_general',
      name: 'General Site Settings',
      type: 'setting',
      description: 'Site name, tagline, logo, and basic information',
      status: 'pending'
    },
    {
      id: 'site_settings_contact',
      name: 'Contact Information',
      type: 'setting',
      description: 'Contact details and location information',
      status: 'pending'
    },
    {
      id: 'site_settings_social',
      name: 'Social Media Links',
      type: 'setting',
      description: 'Social media links and sharing settings',
      status: 'pending'
    },
    {
      id: 'main_navigation',
      name: 'Main Navigation Menu',
      type: 'setting',
      description: 'Header navigation menu items',
      status: 'pending'
    },
    {
      id: 'footer_menu',
      name: 'Footer Menu',
      type: 'setting',
      description: 'Footer navigation links',
      status: 'pending'
    }
  ]
}

const startMigration = async () => {
  isMigrating.value = true
  migrationProgress.value = 0
  completedCount.value = 0

  try {
    for (let i = 0; i < migrationItems.value.length; i++) {
      const item = migrationItems.value[i]
      
      // Update status to migrating
      item.status = 'migrating'
      
      try {
        // Simulate migration process
        await migrateItem(item)
        
        // Mark as completed
        item.status = 'completed'
        completedCount.value++
      } catch (error) {
        item.status = 'error'
        item.error = error instanceof Error ? error.message : 'Unknown error'
      }
      
      // Update progress
      migrationProgress.value = Math.round(((i + 1) / migrationItems.value.length) * 100)
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  } finally {
    isMigrating.value = false
  }
}

const migrateItem = async (item: MigrationItem): Promise<void> => {
  // Simulate API call - replace with actual migration logic
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock migration based on item type
  switch (item.type) {
    case 'homepage_section':
      await migrateHomepageSection(item.id)
      break
    case 'setting':
      await migrateSettings(item.id)
      break
    default:
      throw new Error(`Unknown migration type: ${item.type}`)
  }
}

const migrateHomepageSection = async (sectionId: string): Promise<void> => {
  // Mock data for homepage sections
  const sectionData = {
    hero: {
      title: 'Ghana Commodity Exchange',
      subtitle: 'Connecting Markets, Connecting People, Providing Opportunities',
      cta_primary_text: 'Start Trading',
      cta_primary_url: '/trading',
      cta_secondary_text: 'View Platform',
      cta_secondary_url: '/platform',
      background_image_1: '/trading dashboard.jpg',
      background_image_2: '/crop.jpg',
      background_image_3: '/trading.jpg'
    },
    why_join: {
      section_title: 'Why Join The Ghana Commodity Exchange?',
      section_subtitle: 'Connecting Markets, Connecting People, Providing Opportunities',
      card1_title: 'What is GCX?',
      card1_description: 'Simply put, GCX is a marketplace or a platform for buying and selling listed commodities. Starting with spot contracts for physical products, GCX will later trade in futures and options contracts for the listed commodities.',
      card1_image: '/trading dashboard.jpg',
      card2_title: 'Benefits to Members',
      card2_description: 'As a member, you gain access to a wide range of market actors (buyers and sellers) thereby creating opportunities for you to increase your revenue stream in a simplified manner, and without risk.',
      card2_image: '/crop.jpg',
      card3_title: 'Benefits to Society',
      card3_description: 'Apart from job creation, agricultural economic transformation will occur through the myriad of opportunities for value chain actors to achieve high levels of sustainable and equitable growth, from farmers who receive a premium on quality grains to traders who are guaranteed the right quality, with cash and contract settlement within a few days.',
      card3_image: '/trading.jpg'
    },
    services: {
      section_title: 'What We Do',
      section_subtitle: 'Ghana Commodity Exchange provides comprehensive trading solutions for agricultural commodities',
      service1_title: 'Trading Platform',
      service1_description: 'Advanced trading platform with real-time data and analytics',
      service1_icon: 'pi pi-chart-line',
      service2_title: 'Market Data',
      service2_description: 'Comprehensive market data and price information',
      service2_icon: 'pi pi-database',
      service3_title: 'Membership Services',
      service3_description: 'Exclusive membership benefits and support',
      service3_icon: 'pi pi-users',
      service4_title: 'Certification',
      service4_description: 'Quality certification and standards compliance',
      service4_icon: 'pi pi-check-circle'
    },
    market_data: {
      section_title: 'Market Statistics',
      section_subtitle: 'Real-time market data and performance metrics',
      stat1_label: 'Total Volume',
      stat1_value: '₵2.4B',
      stat1_change: '+12.5%',
      stat2_label: 'Active Traders',
      stat2_value: '1,247',
      stat2_change: '+8.2%',
      stat3_label: 'Commodities Listed',
      stat3_value: '15',
      stat3_change: '+2',
      stat4_label: 'Market Cap',
      stat4_value: '₵8.9B',
      stat4_change: '+5.1%'
    },
    cta: {
      main_title: 'GHANA COMMODITY EXCHANGE',
      main_subtitle: 'Connecting Markets, Connecting People, Providing Opportunities',
      cta1_title: 'Register to become a member',
      cta1_description: 'And be part of a growing network',
      cta1_button_text: 'Become a Member',
      cta1_button_url: '/membership',
      cta2_title: 'Download Forms and Other resources',
      cta2_description: 'Get access to much more information',
      cta2_button_text: 'Learn More',
      cta2_button_url: '/resources'
    }
  }

  const data = sectionData[sectionId as keyof typeof sectionData]
  if (!data) {
    throw new Error(`No data found for section: ${sectionId}`)
  }

  // Simulate API call to save homepage section
  console.log(`Migrating homepage section: ${sectionId}`, data)
  // await fetch(`/api/cms/homepage/sections/${sectionId}`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ content: data })
  // })
}

const migrateSettings = async (settingGroup: string): Promise<void> => {
  // Mock data for settings
  const settingsData = {
    site_settings_general: [
      { key: 'site_name', value: 'Ghana Commodity Exchange' },
      { key: 'site_tagline', value: 'Connecting Markets, Connecting People, Providing Opportunities' },
      { key: 'site_logo', value: '/logo_black.png' },
      { key: 'site_favicon', value: '/favicon.ico' }
    ],
    site_settings_contact: [
      { key: 'contact_email', value: 'info@gcx.com.gh' },
      { key: 'contact_phone', value: '+233 302 123 456' },
      { key: 'contact_address', value: '123 Independence Avenue, Accra, Ghana' },
      { key: 'contact_website', value: 'https://gcx.com.gh' }
    ],
    site_settings_social: [
      { key: 'social_facebook', value: 'https://facebook.com/gcx' },
      { key: 'social_twitter', value: 'https://twitter.com/gcx' },
      { key: 'social_linkedin', value: 'https://linkedin.com/company/gcx' },
      { key: 'social_instagram', value: 'https://instagram.com/gcx' }
    ],
    main_navigation: [
      { label: 'Home', url: '/', icon_class: 'pi pi-home', sort_order: 1 },
      { label: 'About', url: '/about', icon_class: 'pi pi-info-circle', sort_order: 2 },
      { label: 'Services', url: '/services', icon_class: 'pi pi-cog', sort_order: 3 },
      { label: 'Market Data', url: '/market-data', icon_class: 'pi pi-chart-line', sort_order: 4 },
      { label: 'Resources', url: '/resources', icon_class: 'pi pi-file', sort_order: 5 },
      { label: 'Contact', url: '/contact', icon_class: 'pi pi-phone', sort_order: 6 }
    ],
    footer_menu: [
      { label: 'Privacy Policy', url: '/privacy', sort_order: 1 },
      { label: 'Terms of Service', url: '/terms', sort_order: 2 },
      { label: 'Help Center', url: '/help', sort_order: 3 }
    ]
  }

  const data = settingsData[settingGroup as keyof typeof settingsData]
  if (!data) {
    throw new Error(`No data found for setting group: ${settingGroup}`)
  }

  // Simulate API call to save settings
  console.log(`Migrating settings: ${settingGroup}`, data)
  // await fetch('/api/cms/settings', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
}

const resetMigration = () => {
  migrationItems.value.forEach(item => {
    item.status = 'pending'
    delete item.error
  })
  migrationProgress.value = 0
  completedCount.value = 0
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return 'pi pi-clock'
    case 'migrating': return 'pi pi-spin pi-spinner'
    case 'completed': return 'pi pi-check-circle'
    case 'error': return 'pi pi-times-circle'
    default: return 'pi pi-question-circle'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-slate-500'
    case 'migrating': return 'text-blue-500'
    case 'completed': return 'text-green-500'
    case 'error': return 'text-red-500'
    default: return 'text-slate-500'
  }
}

// Initialize
onMounted(() => {
  initializeMigrationItems()
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Content Migration Tool
        </h1>
        <p class="mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Migrate your static content to the CMS system
        </p>
      </div>
      
      <div class="flex items-center space-x-3">
        <button
          @click="resetMigration"
          :disabled="isMigrating"
          class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          :class="isDarkMode ? 'text-white' : 'text-slate-700'"
        >
          <i class="pi pi-refresh mr-2"></i>
          Reset
        </button>
        
        <button
          @click="startMigration"
          :disabled="!canStartMigration"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors"
        >
          <i v-if="isMigrating" class="pi pi-spin pi-spinner mr-2"></i>
          <i v-else class="pi pi-play mr-2"></i>
          {{ isMigrating ? 'Migrating...' : 'Start Migration' }}
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="isMigrating || completedCount > 0" class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Migration Progress
        </h3>
        <span class="text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          {{ completedCount }} / {{ totalItems }} items
        </span>
      </div>
      
      <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
        <div 
          class="bg-green-600 h-3 rounded-full transition-all duration-500 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
        {{ progressPercentage }}% complete
      </p>
    </div>

    <!-- Migration Items -->
    <div class="space-y-4">
      <div
        v-for="item in migrationItems"
        :key="item.id"
        class="rounded-lg border p-6 transition-all duration-200"
        :class="[
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
          item.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : '',
          item.status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <i 
                :class="[getStatusIcon(item.status), getStatusColor(item.status)]"
                class="text-xl"
              ></i>
            </div>
            
            <div class="flex-1">
              <h3 class="text-lg font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ item.name }}
              </h3>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                {{ item.description }}
              </p>
              <div class="mt-2">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300': item.status === 'pending',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': item.status === 'migrating',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': item.status === 'completed',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': item.status === 'error'
                  }"
                >
                  {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="item.error" class="text-right">
            <p class="text-sm text-red-600 dark:text-red-400">
              {{ item.error }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Migration Complete -->
    <div v-if="completedCount === totalItems && totalItems > 0" class="rounded-lg border p-6 bg-green-50 dark:bg-green-900/20 border-green-500">
      <div class="flex items-center space-x-3">
        <i class="pi pi-check-circle text-green-500 text-2xl"></i>
        <div>
          <h3 class="text-lg font-semibold text-green-800 dark:text-green-300">
            Migration Complete!
          </h3>
          <p class="text-sm text-green-600 dark:text-green-400">
            All content has been successfully migrated to the CMS. You can now edit your content through the CMS interface.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
