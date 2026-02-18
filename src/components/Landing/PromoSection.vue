<script setup lang="ts">
import { computed } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { useI18n } from '../../composables/useI18n'
import { PhoneIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'
import { getImagePath } from '../../utils/imageUtils'

const { t } = useI18n()

// Three main promotional sections
const promoCards = [
  {
    id: 'ussd',
    title: 'USSD Trading App',
    subtitle: 'Mobile Trading Platform',
    description: 'Trade Anywhere with Our USSD App',
    details: 'Buy and sell commodities directly from your mobile phone using our simple USSD platform. No internet required - just dial *920*23# and start trading.',
    cta: 'Register Now',
    ctaLink: '/ussd-register',
    icon: PhoneIcon,
    highlights: [
      'Easy Registration',
      'Buy & Sell Commodities',
      'Secure Transactions',
      'Works on Any Phone'
    ],
    bgImage: getImagePath('/USSD/Register.png'),
    bgGradient: 'from-blue-600 to-blue-800',
    accentColor: 'text-blue-400'
  },
  {
    id: 'freeshs',
    title: 'Free SHS Feeding Program',
    subtitle: 'Social Impact Initiative',
    description: 'Supporting Ghana\'s Education Sector',
        details: 'Supporting Ghana\'s education sector by providing quality food supplies to Senior High Schools. Suppliers can apply to participate in this impactful program.',
    cta: 'Apply as Supplier',
    ctaLink: 'https://freeshs.gcxapps.net/',
    isExternal: true,
    icon: AcademicCapIcon,
    highlights: [
      'Quick Application Process',
      'Fill out the form on our portal',
      'Support Education',
      'Grow Your Business'
    ],
    bgImage: getImagePath('/crop.jpg'),
    bgGradient: 'from-green-600 to-green-800',
    accentColor: 'text-green-400'
  },
  {
    id: 'membership',
    title: 'Membership',
    subtitle: 'Join the Exchange',
    description: 'Choose Your Trading Level',
    details: 'Choose the membership type that suits your trading needs and become part of Ghana\'s premier commodity exchange.',
    cta: 'Apply Now',
    ctaLink: 'https://apps.gcx.com.gh/membership/',
    isExternal: true,
    icon: UserGroupIcon,
    highlights: [
      'Trading Member',
      'Broker Member',
      'Associate Member',
      'Institutional Member'
    ],
    bgImage: getImagePath('/trading.jpg'),
    bgGradient: 'from-orange-600 to-orange-800',
    accentColor: 'text-orange-400'
  }
]
</script>

<template>
  <section 
    class="py-16 md:py-24 transition-colors duration-300" 
    :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-100'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Explore More Opportunities
        </h2>
        <p class="text-lg" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Discover multiple ways to participate in Ghana's commodity exchange
        </p>
      </div>

      <!-- Three Column Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Promo Card -->
        <div
          v-for="card in promoCards"
          :key="card.id"
          class="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-2xl"
        >
          <!-- Card Background Image -->
          <div 
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${card.bgImage})` }"
          ></div>

          <!-- Fallback Gradient -->
          <div :class="`absolute inset-0 bg-gradient-to-br ${card.bgGradient}`" v-if="!card.bgImage"></div>

          <!-- Dark Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/75 to-black/60 group-hover:from-black/92 group-hover:via-black/80 transition-all duration-300"></div>

          <!-- Content -->
          <div class="relative z-10 p-8 h-full flex flex-col min-h-[600px]">
            <!-- Icon -->
            <div class="mb-4 flex-shrink-0">
              <component
                :is="card.icon"
                class="w-10 h-10 text-white"
              />
            </div>

            <!-- Title -->
            <h3 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {{ card.title }}
            </h3>

            <!-- Subtitle -->
            <p :class="`text-base font-semibold mb-4 drop-shadow-md ${card.accentColor}`">
              {{ card.subtitle }}
            </p>

            <!-- Description -->
            <p class="text-white text-base mb-6 flex-grow drop-shadow-md font-semibold">
              {{ card.description }}
            </p>

            <!-- Details -->
            <p class="text-white/95 text-sm mb-6 leading-relaxed drop-shadow-md">
              {{ card.details }}
            </p>

            <!-- Highlights -->
            <div class="space-y-2 mb-8">
              <div
                v-for="(highlight, index) in card.highlights"
                :key="index"
                class="flex items-center text-white/90 text-sm"
              >
                <span class="w-1.5 h-1.5 rounded-full mr-2" :class="`bg-${card.id === 'ussd' ? 'blue' : card.id === 'freeshs' ? 'green' : 'orange'}-300`"></span>
                {{ highlight }}
              </div>
            </div>

            <!-- CTA Button -->
            <div class="mt-auto">
              <RouterLink
                v-if="!card.isExternal"
                :to="card.ctaLink"
                class="w-full inline-flex items-center justify-center bg-white text-slate-900 font-bold py-4 px-8 rounded-lg text-base transition-all hover:bg-slate-50 shadow-xl hover:shadow-2xl"
              >
                {{ card.cta }}
              </RouterLink>
              <a
                v-else
                :href="card.ctaLink"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full inline-flex items-center justify-center bg-white text-slate-900 font-bold py-4 px-8 rounded-lg text-base transition-all hover:bg-slate-50 shadow-xl hover:shadow-2xl"
              >
                {{ card.cta }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions */
:deep(.group:hover) {
  transform: translateY(-4px);
}
</style>
