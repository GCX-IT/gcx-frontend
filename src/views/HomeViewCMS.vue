<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePageContent } from '../composables/usePageContent'
import { isDarkMode } from '../utils/darkMode'
import MembershipWidget from '../components/MembershipWidget.vue'

// Import new landing page components
import HeroSection from '../components/Landing/HeroSection.vue'
import ServicesSection from '../components/Landing/ServicesSection.vue'
import MarketDataSection from '../components/Landing/MarketDataSection.vue'
import NewsInsightsSection from '../components/Landing/NewsInsightsSection.vue'
import EventsSection from '../components/Landing/EventsSection.vue'
import PartnersSection from '../components/Landing/PartnersSection.vue'
import Footer from '../components/Footer.vue'

// CMS Integration
const { getPageContent, loading: cmsLoading } = usePageContent()
const pageContent = ref<any>(null)

// Static fallback content
const staticContent = {
  title: 'Ghana Commodity Exchange - Home',
  content: `
    <div class="hero-section">
      <h1>Ghana's Premier Commodity Exchange</h1>
      <p>Connecting markets, empowering traders, and driving Ghana's agricultural transformation through innovative trading solutions.</p>
    </div>
    
    <div class="why-join-section">
      <h2>Why Join The Ghana Commodity Exchange?</h2>
      <p>Connecting Markets, Connecting People, Providing Opportunities</p>
      
      <div class="benefits-grid">
        <div class="benefit-card">
          <h3>What is GCX?</h3>
          <p>Simply put, GCX is a marketplace or a platform for buying and selling listed commodities. Starting with spot contracts for physical products, GCX will later trade in futures and options contracts for the listed commodities.</p>
        </div>
        
        <div class="benefit-card">
          <h3>Benefits to Members</h3>
          <p>As a member, you gain access to a wide range of market actors (buyers and sellers) thereby creating opportunities for you to increase your revenue stream in a simplified manner, and without risk.</p>
        </div>
        
        <div class="benefit-card">
          <h3>Benefits to Society</h3>
          <p>Apart from job creation, agricultural economic transformation will occur through the myriad of opportunities for value chain actors to achieve high levels of sustainable and equitable growth.</p>
        </div>
      </div>
    </div>
  `,
  excerpt: 'Ghana\'s premier commodity exchange connecting markets and empowering traders through innovative trading solutions.',
  meta_title: 'Ghana Commodity Exchange - Home',
  meta_description: 'Ghana\'s premier commodity exchange connecting markets, empowering traders, and driving agricultural transformation.',
  meta_keywords: 'Ghana, commodity exchange, trading, agriculture, market data'
}

// Load page content
onMounted(async () => {
  try {
    const content = await getPageContent('home', staticContent)
    pageContent.value = content
  } catch (error) {
    console.warn('Failed to load CMS content, using static content:', error)
    pageContent.value = staticContent
  }
})

// Computed properties for dynamic content
const pageTitle = computed(() => pageContent.value?.title || staticContent.title)
const pageDescription = computed(() => pageContent.value?.excerpt || staticContent.excerpt)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- CMS Content Overlay (for editing) -->
    <div v-if="cmsLoading" class="fixed top-4 right-4 z-50">
      <div class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
        <i class="pi pi-spin pi-spinner mr-2"></i>
        Loading CMS content...
      </div>
    </div>

    <!-- 1. Market Slider - Live Market Data -->
    <HeroSection />
    
    <!-- 2. Why Join Us Section - Now CMS-enabled -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-white to-yellow-50'">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ pageContent?.content ? 'Why Join The Ghana Commodity Exchange?' : 'Why Join The Ghana Commodity Exchange?' }}
          </h2>
          <p class="text-xl mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ pageContent?.content ? 'Connecting Markets, Connecting People, Providing Opportunities' : 'Connecting Markets, Connecting People, Providing Opportunities' }}
          </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- What is GCX -->
          <div class="rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100 hover:shadow-xl'">
            <div class="w-full h-48 mb-6 rounded-xl overflow-hidden">
              <img src="/trading dashboard.jpg" alt="Trading Platform" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">What is GCX?</h3>
            <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Simply put, GCX is a marketplace or a platform for buying and selling listed commodities. Starting with spot contracts for physical products, GCX will later trade in futures and options contracts for the listed commodities.
            </p>
          </div>
          
          <!-- Benefits to Members -->
          <div class="rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100 hover:shadow-xl'">
            <div class="w-full h-48 mb-6 rounded-xl overflow-hidden">
              <img src="/maize.jpg" alt="Membership Benefits" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Benefits to Members</h3>
            <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              As a member, you gain access to a wide range of market actors (buyers and sellers) thereby creating opportunities for you to increase your revenue stream in a simplified manner, and without risk.
            </p>
          </div>
          
          <!-- Benefits to Society -->
          <div class="rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100 hover:shadow-xl'">
            <div class="w-full h-48 mb-6 rounded-xl overflow-hidden">
              <img src="/crop.jpg" alt="Society Benefits" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Benefits to Society</h3>
            <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Apart from job creation, agricultural economic transformation will occur through the myriad of opportunities for value chain actors to achieve high levels of sustainable and equitable growth, from farmers who receive a premium on quality grains to traders who are guaranteed the right quality, with cash and contract settlement within a few days.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Services Section -->
    <ServicesSection />
    
    <!-- 4. Market Data Section -->
    <MarketDataSection />
    
    <!-- 5. Membership Section -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="max-w-7xl mx-auto px-6">
        <MembershipWidget />
      </div>
    </section>
    
    <!-- 6. News & Insights Section -->
    <NewsInsightsSection />
    
    <!-- 7. Events Section -->
    <EventsSection />
    
    <!-- 8. Partners Section -->
    <PartnersSection />
    
    <!-- 9. Footer -->
    <Footer />
  </div>
</template>

<style scoped>
/* Custom styles for the home page */
</style>
