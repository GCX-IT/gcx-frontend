<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import RulesRegulations from '../components/Membership/RulesRegulations.vue'
import ApplicationProcess from '../components/Membership/ApplicationProcess.vue'
import ApplicationForms from '../components/Membership/ApplicationForms.vue'
import Footer from '../components/Footer.vue'

type Section = { label: string; key: string }
const sections: Section[] = [
  { label: 'Rules & Regulations', key: 'rules' },
  { label: 'Application Process', key: 'process' },
  { label: 'Application Forms', key: 'forms' },
]

const route = useRoute()
const router = useRouter()
const active = ref<string>('rules')

const setActiveFromHash = () => {
  const hash = (route.hash || '').replace('#', '')
  if (sections.some(s => s.key === hash)) {
    active.value = hash
  } else {
    active.value = 'rules'
  }
}

const go = async (key: string) => {
  active.value = key
  router.replace({ hash: `#${key}` })
  await Promise.resolve()
  const el = document.getElementById(`ma-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => setActiveFromHash())
watch(() => route.hash, setActiveFromHash)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero with background image -->
    <section class="relative py-14 lg:py-20 overflow-hidden">
      <div class="absolute inset-0">
        <img src="/maize.jpg" alt="Membership Application" class="w-full h-full object-cover" />
        <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/40' : 'bg-white/40'"></div>
      </div>
      <div class="relative max-w-[1600px] mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-5xl font-extrabold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership Application</h1>
        <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Rules & Regulations, Application Process, and Forms.</p>
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

    <!-- Content Sections (one at a time) with background image -->
    <section class="relative py-12 overflow-hidden">
      <div class="absolute inset-0 -z-10 pointer-events-none">
        <img src="/maize.jpg" alt="Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0" :class="isDarkMode ? 'bg-slate-900/30' : 'bg-white/60'"></div>
      </div>
      <div class="max-w-[1600px] mx-auto px-4">
        <div v-if="active === 'rules'" id="ma-rules"><RulesRegulations /></div>
        <div v-else-if="active === 'process'" id="ma-process"><ApplicationProcess /></div>
        <div v-else-if="active === 'forms'" id="ma-forms"><ApplicationForms /></div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>


