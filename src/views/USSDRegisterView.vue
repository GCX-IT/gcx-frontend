<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import USSDGuide from '../components/Landing/USSDGuide.vue'
import { PhoneIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()

onMounted(() => {
  // Scroll to top when component mounts
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="min-h-screen flex flex-col" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <Navbar />
    
    <!-- USSD Guide Component -->
    <USSDGuide />

    <Footer />
  </div>
</template>

