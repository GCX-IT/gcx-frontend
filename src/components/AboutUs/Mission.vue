<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Mission Header -->
    <div class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300" 
              :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ missionTitle }}
          </h1>
          <p class="text-xl md:text-2xl font-light max-w-4xl mx-auto transition-colors duration-300" 
             :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ missionSubtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Mission Content -->
    <div class="flex-1 py-16">
      <div class="max-w-6xl mx-auto px-4">
        
        <!-- Our Mission Section -->
        <div class="mb-16">
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 class="text-3xl font-bold mb-6 transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ ourMissionTitle }}
              </h2>
              <div class="space-y-4">
                <p class="text-lg transition-colors duration-300"
                   :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ ourMissionText1 }}
                </p>
                <p class="text-lg transition-colors duration-300"
                   :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ ourMissionText2 }}
                </p>
                <p class="text-lg transition-colors duration-300"
                   :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  {{ ourMissionText3 }}
                </p>
              </div>
            </div>
            <div class="relative">
              <img :src="missionImage" 
                   :alt="missionImageAlt"
                   class="w-full h-80 object-cover rounded-lg shadow-lg"
                   v-if="missionImage" />
              <div v-else class="w-full h-80 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center">
                <span class="text-white text-lg font-medium">Mission Image</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Values Grid -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-center mb-12 transition-colors duration-300"
              :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ valuesTitle }}
          </h2>
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Transparency -->
            <div class="p-8 rounded-xl shadow-lg transition-colors duration-300"
                 :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ transparencyTitle }}
              </h3>
              <p class="transition-colors duration-300"
                 :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ transparencyText }}
              </p>
            </div>

            <!-- Efficiency -->
            <div class="p-8 rounded-xl shadow-lg transition-colors duration-300"
                 :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'">
              <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-3 transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ efficiencyTitle }}
              </h3>
              <p class="transition-colors duration-300"
                 :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ efficiencyText }}
              </p>
            </div>
          </div>
        </div>

        <!-- Statistics Section -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-center mb-12 transition-colors duration-300"
              :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ statisticsTitle }}
          </h2>
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div class="relative">
              <img :src="statisticsImage" 
                   :alt="statisticsImageAlt"
                   class="w-full h-80 object-cover rounded-lg shadow-lg"
                   v-if="statisticsImage" />
              <div v-else class="w-full h-80 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
                <span class="text-white text-lg font-medium">Statistics Image</span>
              </div>
            </div>
            <div class="text-center">
              <div class="text-5xl font-bold text-green-500 mb-2">{{ farmersCount }}</div>
              <div class="text-xl font-medium transition-colors duration-300"
                   :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ farmersLabel }}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { usePageContentEditor } from '../../composables/usePageContentEditor'

// CMS Content Integration
const { loadPageContent, getContent, getImage } = usePageContentEditor('about')

// Mission Content - Computed properties that will reactively update from CMS
const missionTitle = computed(() => getContent('mission_title') || 'Mission')
const missionSubtitle = computed(() => getContent('mission_subtitle') || 'Ghana Commodity Exchange (GCX) is a leading commodity exchange platform dedicated to transforming agricultural trading in Ghana and West Africa.')

const ourMissionTitle = computed(() => getContent('our_mission_title') || 'Our Mission')
const ourMissionText1 = computed(() => getContent('our_mission_text1') || 'We provide innovative solutions for farmers, traders, and stakeholders, ensuring transparency, efficiency, and growth in the agricultural sector.')
const ourMissionText2 = computed(() => getContent('our_mission_text2') || 'Through our regulated marketplace, we connect agricultural producers with buyers, enabling fair pricing and secure transactions.')
const ourMissionText3 = computed(() => getContent('our_mission_text3') || 'Our platform ensures quality assurance, timely delivery, and reliable settlement for all market participants.')

const valuesTitle = computed(() => getContent('values_title') || 'Our Core Values')

const transparencyTitle = computed(() => getContent('transparency_title') || 'Transparency')
const transparencyText = computed(() => getContent('transparency_text') || 'Open and fair trading practices with clear pricing mechanisms')

const efficiencyTitle = computed(() => getContent('efficiency_title') || 'Efficiency')
const efficiencyText = computed(() => getContent('efficiency_text') || 'Streamlined processes for optimal market performance')

const statisticsTitle = computed(() => getContent('statistics_title') || 'Agricultural Trading')
const farmersCount = computed(() => getContent('farmers_count') || '50K+')
const farmersLabel = computed(() => getContent('farmers_label') || 'Farmers Connected')

// Images - will load from CMS or fallback to defaults
const missionImage = computed(() => getImage('mission_image') || '/Service/testing.jpg')
const missionImageAlt = computed(() => getContent('mission_image_alt') || 'GCX Mission')
const statisticsImage = computed(() => getImage('statistics_image') || '/crop.jpg')
const statisticsImageAlt = computed(() => getContent('statistics_image_alt') || 'Agricultural Statistics')

onMounted(() => {
  loadPageContent()
})
</script>
