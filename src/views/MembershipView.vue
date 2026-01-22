<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'

// Import actual components
import MembershipTypes from '../components/Membership/MembershipTypes.vue'
import MembershipBenefits from '../components/Membership/MembershipBenefits.vue'
import RightsObligations from '../components/Membership/RightsObligations.vue'
import MembershipList from '../components/Membership/MembershipList.vue'
import Brokers from '../components/Membership/Brokers.vue'

type Section = { label: string; key: string }
const sections: Section[] = [
  { label: 'Membership Types', key: 'types' },
  { label: 'Membership Benefits', key: 'benefits' },
  { label: 'Rights & Obligations', key: 'rights' },
  { label: 'Membership List', key: 'list' },
  { label: 'Brokers', key: 'brokers' },
]

const route = useRoute()
const { t } = useI18n()
const router = useRouter()
const active = ref<string>('types')

const setActiveFromHash = () => {
  const hash = (route.hash || '').replace('#', '')
  if (sections.some(s => s.key === hash)) {
    active.value = hash
  } else {
    active.value = 'types'
  }
}

const go = async (key: string) => {
  active.value = key
  router.replace({ hash: `#${key}` })
  await nextTick()
  const el = document.getElementById(`m-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const navigateToApplication = () => {
  router.push('/membership/application')
}

onMounted(() => setActiveFromHash())
watch(() => route.hash, setActiveFromHash)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero with background image -->
    <section class="relative py-14 lg:py-20 overflow-hidden">
      <div class="absolute inset-0">
        <img src="/maize.jpg" alt="{{ t('navigation.menu.membership') }}" class="w-full h-full object-cover" />
        <div class="absolute inset-0"
             :class="isDarkMode ? 'bg-slate-900/50' : 'bg-black/25'">
        </div>
      </div>
      <div class="relative max-w-[1600px] mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-5xl font-extrabold mb-3 text-white">Membership Information</h1>
        <p class="text-lg max-w-3xl mx-auto mb-8" :class="isDarkMode ? 'text-slate-300' : 'text-white'">Learn about types, benefits, rights & obligations, membership list, and brokers.</p>
        
        <!-- Quick Access Links -->
        <div class="flex flex-wrap justify-center gap-4 mt-8">
          <button 
            @click="navigateToApplication"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
            :class="isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Apply for Membership
          </button>
          <router-link 
            to="/membership/application#forms"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all transform hover:scale-105"
            :class="isDarkMode ? 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black' : 'border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            Download Forms
          </router-link>
          <router-link 
            to="/membership/application#rules"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold border-2 transition-all transform hover:scale-105"
            :class="isDarkMode ? 'border-slate-400 text-slate-300 hover:bg-slate-400 hover:text-black' : 'border-slate-600 text-slate-700 hover:bg-slate-600 hover:text-white'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Rules & Regulations
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section Nav -->
    <div class="max-w-[1600px] mx-auto px-4 mt-8">
      <div class="border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
        <nav class="flex justify-center">
          <div class="flex space-x-1 overflow-x-auto">
            <button
              v-for="s in sections"
              :key="s.key"
              @click="go(s.key)"
              class="relative py-3 px-4 text-sm font-medium rounded-t-md transition-colors"
              :class="[
                active === s.key
                  ? (isDarkMode ? 'text-yellow-400 bg-slate-800 border-b-2 border-yellow-400' : 'text-yellow-700 bg-white border-b-2 border-yellow-600')
                  : (isDarkMode ? 'text-slate-300 hover:text-yellow-400' : 'text-slate-600 hover:text-yellow-700')
              ]"
            >
              {{ s.label }}
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Content Sections (one at a time) with page-wide background image -->
    <section class="relative py-12 overflow-hidden">
      <!-- Background layer -->
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <img src="/maize.jpg" alt="Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/30' : 'bg-white/60'"></div>
      </div>
      <div class="max-w-[1600px] mx-auto px-4">
        <div v-if="active === 'types'" id="m-types"><MembershipTypes /></div>
        <div v-else-if="active === 'benefits'" id="m-benefits"><MembershipBenefits /></div>
        <div v-else-if="active === 'rights'" id="m-rights"><RightsObligations /></div>
        <div v-else-if="active === 'list'" id="m-list"><MembershipList /></div>
        <div v-else-if="active === 'brokers'" id="m-brokers"><Brokers /></div>
      </div>
    </section>
  </div>
  <Footer />
</template>


