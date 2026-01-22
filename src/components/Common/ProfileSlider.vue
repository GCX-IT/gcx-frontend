<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 overflow-hidden"
      @click="close"
    >
        <!-- Sliding Panel -->
        <div
          class="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
          :class="[
            isOpen ? 'translate-x-0' : 'translate-x-full',
            isDarkMode ? 'dark:bg-slate-800' : 'bg-white'
          ]"
          @click.stop
        >
        <!-- Header -->
        <div 
          class="flex items-center justify-between p-6 border-b transition-colors duration-200"
          :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'"
        >
          <h2 
            class="text-2xl font-bold transition-colors duration-200"
            :class="isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            Profile
          </h2>
          <button
            @click="close"
            class="p-2 rounded-lg transition-colors duration-200"
            :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
          >
            <svg 
              class="w-6 h-6 transition-colors duration-200" 
              :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
          <div class="p-6">
            <!-- Profile Header -->
            <div class="flex flex-col items-center mb-8">
              <!-- Image -->
              <div class="relative mb-6">
                <div class="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    :src="member?.image || '/placeholder-avatar.jpg'"
                    :alt="member?.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                </div>
                <!-- Status indicator -->
                <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
              </div>

              <!-- Name and Title -->
              <div class="text-center">
                <h3 
                  class="text-3xl font-bold mb-2 transition-colors duration-200"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ member?.name }}
                </h3>
                <p 
                  class="text-xl font-semibold mb-4 transition-colors duration-200"
                  :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'"
                >
                  {{ member?.title }}
                </p>
                <div class="w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto"></div>
              </div>
            </div>

            <!-- Social Links -->
            <div v-if="hasSocialMedia(member)" class="mb-8">
              <h4 
                class="text-lg font-semibold mb-4 transition-colors duration-200"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
              >
                Connect
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <a
                  v-if="member?.linkedin_url && member.linkedin_url !== '#'"
                  :href="member.linkedin_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl transition-colors duration-200"
                >
                  <div class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded text-xs font-bold">
                    in
                  </div>
                  <span class="font-medium">LinkedIn</span>
                </a>

                <a
                  v-if="member?.twitter_url && member.twitter_url !== '#'"
                  :href="member.twitter_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-4 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl transition-colors duration-200"
                >
                  <div class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-sky-500 text-white rounded text-xs font-bold">
                    𝕏
                  </div>
                  <span class="font-medium">Twitter</span>
                </a>

                <a
                  v-if="member?.facebook_url && member.facebook_url !== '#'"
                  :href="member.facebook_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-xl transition-colors duration-200"
                >
                  <div class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-blue-700 text-white rounded text-xs font-bold">
                    f
                  </div>
                  <span class="font-medium">Facebook</span>
                </a>

                <a
                  v-if="member?.instagram_url && member.instagram_url !== '#'"
                  :href="member.instagram_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 p-4 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-xl transition-colors duration-200"
                >
                  <div class="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-pink-600 text-white rounded text-xs font-bold">
                    📷
                  </div>
                  <span class="font-medium">Instagram</span>
                </a>
              </div>
            </div>

            <!-- Biography Section -->
            <div 
              v-if="member?.description" 
              class="pt-8 transition-colors duration-200"
              :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
            >
              <h4 
                class="text-lg font-semibold mb-4 transition-colors duration-200"
                :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
              >
                Bio
              </h4>
              <div class="prose max-w-none">
                <p 
                  class="leading-relaxed whitespace-pre-line transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                >
                  {{ member.description }}
                </p>
              </div>
            </div>

            <!-- Contact Information -->
            <div 
              v-if="member?.email || member?.phone" 
              class="pt-8 transition-colors duration-200"
              :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
            >
              <h4 
                class="text-lg font-semibold mb-4 transition-colors duration-200"
                :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
              >
                Contact
              </h4>
              <div class="space-y-3">
                <div v-if="member?.email" class="flex items-center gap-3">
                  <svg 
                    class="w-5 h-5 transition-colors duration-200" 
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <a 
                    :href="`mailto:${member.email}`" 
                    class="transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'"
                  >
                    {{ member.email }}
                  </a>
                </div>
                <div v-if="member?.phone" class="flex items-center gap-3">
                  <svg 
                    class="w-5 h-5 transition-colors duration-200" 
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <a 
                    :href="`tel:${member.phone}`" 
                    class="transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'"
                  >
                    {{ member.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '../../utils/imageUrl'
import { isDarkMode } from '../../utils/darkMode'
import { watch } from 'vue'

interface TeamMember {
  id: number
  name: string
  title: string
  image?: string
  description?: string
  email?: string
  phone?: string
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
}

interface Props {
  isOpen: boolean
  member: TeamMember | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.includes('placeholder-avatar.jpg')) {
    img.src = '/placeholder-avatar.jpg'
  }
}

const hasSocialMedia = (member: TeamMember | null) => {
  if (!member) return false
  console.log('🔍 Social Media Debug:', {
    member: member.name,
    linkedin: member.linkedin_url,
    twitter: member.twitter_url,
    facebook: member.facebook_url,
    instagram: member.instagram_url
  })
  return !!(member.linkedin_url || member.twitter_url || member.facebook_url || member.instagram_url)
}

// Lock body scroll when slider is open
watch(() => props.isOpen, (newValue) => {
  if (typeof document !== 'undefined') {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>
