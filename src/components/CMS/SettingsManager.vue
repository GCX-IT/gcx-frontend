<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { apiFetch } from '@/utils/api'
import { isDarkMode } from '../../utils/darkMode'

interface Setting {
  id?: number
  key: string
  value: string
  type: 'text' | 'textarea' | 'image' | 'url' | 'email' | 'phone' | 'json'
  group: string
  label: string
  description: string
  is_public: boolean
  sort_order: number
}

interface SettingGroup {
  name: string
  label: string
  description: string
  icon: string
  settings: Setting[]
}

const { t } = useI18n()

// State
const activeGroup = ref('general')
const settings = ref<Setting[]>([])
const saving = ref(false)
const errors = ref<Record<string, string>>({})

// Setting groups
const settingGroups = ref<SettingGroup[]>([
  {
    name: 'general',
    label: 'General Settings',
    description: 'Basic site information and branding',
    icon: 'pi pi-cog',
    settings: []
  },
  {
    name: 'contact',
    label: 'Contact Information',
    description: 'Contact details and location information',
    icon: 'pi pi-phone',
    settings: []
  },
  {
    name: 'social',
    label: 'Social Media',
    description: 'Social media links and sharing settings',
    icon: 'pi pi-share-alt',
    settings: []
  },
  {
    name: 'homepage',
    label: 'Homepage Content',
    description: 'Homepage sections and content',
    icon: 'pi pi-home',
    settings: []
  },
  {
    name: 'footer',
    label: 'Footer Content',
    description: 'Footer links and information',
    icon: 'pi pi-list',
    settings: []
  }
])

// Computed
const currentGroup = computed(() => {
  return settingGroups.value.find(group => group.name === activeGroup.value)
})

const currentSettings = computed(() => {
  return currentGroup.value?.settings || []
})

// Methods
const loadSettings = async () => {
  try {
    // Load settings from API
    const response = await apiFetch('/api/settings')
    const data = await response.json()
    const apiSettings = data.settings || []
    
    // If no settings exist, use mock data for initial setup
    if (apiSettings.length === 0) {
      const mockSettings: Setting[] = [
      // General Settings
      { key: 'site_name', value: 'Ghana Commodity Exchange', type: 'text', group: 'general', label: 'Site Name', description: 'The name of your website', is_public: true, sort_order: 1 },
      { key: 'site_tagline', value: 'Connecting Markets, Connecting People, Providing Opportunities', type: 'text', group: 'general', label: 'Site Tagline', description: 'Your site tagline or motto', is_public: true, sort_order: 2 },
      { key: 'site_logo', value: '/logo_black.png', type: 'image', group: 'general', label: 'Site Logo', description: 'Your site logo', is_public: true, sort_order: 3 },
      { key: 'site_favicon', value: '/favicon.ico', type: 'image', group: 'general', label: 'Favicon', description: 'Site favicon', is_public: true, sort_order: 4 },
      
      // Contact Settings
      { key: 'contact_email', value: 'info@gcx.com.gh', type: 'email', group: 'contact', label: 'Contact Email', description: 'Main contact email address', is_public: true, sort_order: 1 },
      { key: 'contact_phone', value: '+233 302 123 456', type: 'phone', group: 'contact', label: 'Contact Phone', description: 'Main contact phone number', is_public: true, sort_order: 2 },
      { key: 'contact_address', value: '123 Independence Avenue, Accra, Ghana', type: 'textarea', group: 'contact', label: 'Address', description: 'Physical address', is_public: true, sort_order: 3 },
      { key: 'contact_website', value: 'https://gcx.com.gh', type: 'url', group: 'contact', label: 'Website URL', description: 'Main website URL', is_public: true, sort_order: 4 },
      
      // Social Media
      { key: 'social_facebook', value: 'https://facebook.com/gcx', type: 'url', group: 'social', label: 'Facebook', description: 'Facebook page URL', is_public: true, sort_order: 1 },
      { key: 'social_twitter', value: 'https://twitter.com/gcx', type: 'url', group: 'social', label: 'Twitter', description: 'Twitter profile URL', is_public: true, sort_order: 2 },
      { key: 'social_linkedin', value: 'https://linkedin.com/company/gcx', type: 'url', group: 'social', label: 'LinkedIn', description: 'LinkedIn company page', is_public: true, sort_order: 3 },
      { key: 'social_instagram', value: 'https://instagram.com/gcx', type: 'url', group: 'social', label: 'Instagram', description: 'Instagram profile URL', is_public: true, sort_order: 4 },
      
      // Homepage Content
      { key: 'homepage_hero_title', value: 'Ghana Commodity Exchange', type: 'text', group: 'homepage', label: 'Hero Title', description: 'Main hero section title', is_public: true, sort_order: 1 },
      { key: 'homepage_hero_subtitle', value: 'Connecting Markets, Connecting People, Providing Opportunities', type: 'text', group: 'homepage', label: 'Hero Subtitle', description: 'Hero section subtitle', is_public: true, sort_order: 2 },
      { key: 'homepage_hero_cta_primary', value: 'Start Trading', type: 'text', group: 'homepage', label: 'Primary CTA Button', description: 'Main call-to-action button text', is_public: true, sort_order: 3 },
      { key: 'homepage_hero_cta_secondary', value: 'View Platform', type: 'text', group: 'homepage', label: 'Secondary CTA Button', description: 'Secondary call-to-action button text', is_public: true, sort_order: 4 },
      
      // Footer Content
      { key: 'footer_copyright', value: '© 2025 Ghana Commodity Exchange. All rights reserved.', type: 'text', group: 'footer', label: 'Copyright Text', description: 'Footer copyright text', is_public: true, sort_order: 1 },
      { key: 'footer_description', value: 'Connecting Markets, Connecting People, Providing Opportunities', type: 'textarea', group: 'footer', label: 'Footer Description', description: 'Footer description text', is_public: true, sort_order: 2 }
      ]
      
      settings.value = mockSettings
      
      // Group settings by group
      settingGroups.value.forEach(group => {
        group.settings = mockSettings.filter(setting => setting.group === group.name)
      })
    } else {
      // Use API settings
      settings.value = apiSettings
      
      // Group settings by group
      settingGroups.value.forEach(group => {
        group.settings = apiSettings.filter(setting => setting.group === group.name)
      })
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

const saveSettings = async () => {
  saving.value = true
  errors.value = {}
  
  try {
    // Validate settings
    currentSettings.value.forEach(setting => {
      if (setting.type === 'email' && setting.value && !isValidEmail(setting.value)) {
        errors.value[setting.key] = 'Please enter a valid email address'
      }
      if (setting.type === 'url' && setting.value && !isValidUrl(setting.value)) {
        errors.value[setting.key] = 'Please enter a valid URL'
      }
    })
    
    if (Object.keys(errors.value).length > 0) {
      saving.value = false
      return
    }
    
    // Save settings to API
    const response = await apiFetch('/api/settings/batch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
      },
      body: JSON.stringify(currentSettings.value)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to save settings: ${response.statusText}`)
    }
    
    // Show success message
    console.log('Settings saved successfully')
    
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    saving.value = false
  }
}

const updateSetting = (key: string, value: string) => {
  const setting = settings.value.find(s => s.key === key)
  if (setting) {
    setting.value = value
  }
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const switchGroup = (groupName: string) => {
  activeGroup.value = groupName
}

// Initialize
onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Site Settings
        </h1>
        <p class="mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Manage your website settings and global content
        </p>
      </div>
      
      <button
        @click="saveSettings"
        :disabled="saving"
        class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors"
      >
        <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
        <i v-else class="pi pi-save mr-2"></i>
        {{ saving ? 'Saving...' : 'Save Settings' }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Settings Groups Sidebar -->
      <div class="lg:col-span-1">
        <div class="rounded-lg border p-4" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <h3 class="text-lg font-semibold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Settings Groups
          </h3>
          
          <div class="space-y-2">
            <button
              v-for="group in settingGroups"
              :key="group.name"
              @click="switchGroup(group.name)"
              class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3"
              :class="[
                activeGroup === group.name 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-700',
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              ]"
            >
              <i :class="group.icon" class="w-4 h-4"></i>
              <div>
                <div class="font-medium">{{ group.label }}</div>
                <div class="text-xs opacity-75">{{ group.description }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="lg:col-span-3">
        <div class="rounded-lg border p-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <div class="mb-6">
            <h2 class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ currentGroup?.label }}
            </h2>
            <p class="mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              {{ currentGroup?.description }}
            </p>
          </div>

          <div class="space-y-6">
            <div
              v-for="setting in currentSettings"
              :key="setting.key"
              class="space-y-2"
            >
              <label class="block text-sm font-medium" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                {{ setting.label }}
              </label>
              
              <p v-if="setting.description" class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                {{ setting.description }}
              </p>

              <!-- Text Input -->
              <input
                v-if="setting.type === 'text' || setting.type === 'email' || setting.type === 'url' || setting.type === 'phone'"
                :type="setting.type === 'email' ? 'email' : setting.type === 'url' ? 'url' : setting.type === 'phone' ? 'tel' : 'text'"
                :value="setting.value"
                @input="updateSetting(setting.key, ($event.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="[
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                  errors[setting.key] ? 'border-red-500' : ''
                ]"
                :placeholder="`Enter ${setting.label.toLowerCase()}`"
              />

              <!-- Textarea -->
              <textarea
                v-else-if="setting.type === 'textarea'"
                :value="setting.value"
                @input="updateSetting(setting.key, ($event.target as HTMLTextAreaElement).value)"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                :class="[
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                  errors[setting.key] ? 'border-red-500' : ''
                ]"
                :placeholder="`Enter ${setting.label.toLowerCase()}`"
              ></textarea>

              <!-- Image Input -->
              <div v-else-if="setting.type === 'image'" class="space-y-2">
                <input
                  :value="setting.value"
                  @input="updateSetting(setting.key, ($event.target as HTMLInputElement).value)"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :class="[
                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300',
                    errors[setting.key] ? 'border-red-500' : ''
                  ]"
                  placeholder="Enter image URL or path"
                />
                <div v-if="setting.value" class="mt-2">
                  <img :src="setting.value" :alt="setting.label" class="w-32 h-32 object-cover rounded-lg border" />
                </div>
              </div>

              <!-- Error Message -->
              <p v-if="errors[setting.key]" class="text-sm text-red-600">
                {{ errors[setting.key] }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
