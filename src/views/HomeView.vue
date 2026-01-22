<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isDarkMode } from '../utils/darkMode'
import { usePageContent } from '../composables/usePageContent'
import MembershipWidget from '../components/MembershipWidget.vue'
import { getImagePath } from '../utils/imageUtils'

// Import new landing page components
import HeroSection from '../components/Landing/HeroSection.vue'
import ServicesSection from '../components/Landing/ServicesSection.vue'
import MarketDataSection from '../components/Landing/MarketDataSection.vue'
import NewsInsightsSection from '../components/Landing/NewsInsightsSection.vue'
import EventsSection from '../components/Landing/EventsSection.vue'
import CommoditiesCarousel from '../components/Landing/CommoditiesCarousel.vue'
import PartnersSection from '../components/Landing/PartnersSection.vue'
import Footer from '../components/Footer.vue'

// CMS Integration
const { getHomepageSection, getSiteSettings } = usePageContent()

// State for CMS content
const heroContent = ref<any>(null)
const whyJoinContent = ref<any>(null)
const servicesContent = ref<any>(null)
const marketDataContent = ref<any>(null)
const ctaContent = ref<any>(null)
const siteSettings = ref<Record<string, string>>({})

// Static fallback content
const staticWhyJoinContent = {
  section_title: 'Why Join The Ghana Commodity Exchange?',
  section_subtitle: 'Connecting Markets, Connecting People, Providing Opportunities',
  card1_title: 'What is GCX?',
  card1_description: 'Simply put, GCX is a marketplace or a platform for buying and selling listed commodities. Starting with spot contracts for physical products, GCX will later trade in futures and options contracts for the listed commodities.',
  card1_image: '/trading dashboard.jpg',
  card2_title: 'Benefits to Members',
  card2_description: 'As a member, you gain access to a wide range of market actors (buyers and sellers) thereby creating opportunities for you to increase your revenue stream in a simplified manner, and without risk.',
  card2_image: '/crop.jpg',
  card3_title: 'Benefits to Society',
  card3_description: 'GCX drives agricultural economic transformation by creating sustainable opportunities across the value chain. Farmers receive fair prices for quality grains, traders gain access to reliable, certified commodities, and communities benefit from enhanced market efficiency, job creation, and accelerated economic development through transparent, efficient trading.',
  card3_image: '/trading.jpg'
}

const staticCtaContent = {
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

// Load CMS content
onMounted(async () => {
  try {
    // Load homepage sections
    const [hero, whyJoin, services, marketData, cta, settings] = await Promise.all([
      getHomepageSection('hero'),
      getHomepageSection('why_join', staticWhyJoinContent),
      getHomepageSection('services'),
      getHomepageSection('market_data'),
      getHomepageSection('cta', staticCtaContent),
      getSiteSettings()
    ])

    heroContent.value = hero
    whyJoinContent.value = whyJoin
    servicesContent.value = services
    marketDataContent.value = marketData
    ctaContent.value = cta
    siteSettings.value = settings
  } catch (error) {
    console.warn('Failed to load CMS content, using static content:', error)
    // Use static content as fallback
    whyJoinContent.value = staticWhyJoinContent
    ctaContent.value = staticCtaContent
  }
})

// Computed properties for dynamic content
const whyJoinTitleText = computed(() => whyJoinContent.value?.section_title || staticWhyJoinContent.section_title)
const whyJoinSubtitleText = computed(() => whyJoinContent.value?.section_subtitle || staticWhyJoinContent.section_subtitle)

const ctaTitle = computed(() => ctaContent.value?.main_title || staticCtaContent.main_title)
const ctaSubtitle = computed(() => ctaContent.value?.main_subtitle || staticCtaContent.main_subtitle)
</script>


<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- 1. Market Slider - Live Market Data -->
    <HeroSection />
    
         <!-- 2. Why Join Us Section -->
     <section 
       class="py-12 transition-colors duration-300" 
       :class="isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-white via-white to-yellow-50'"
     >
       <div class="max-w-5xl mx-auto px-4 sm:px-6">
         <div class="text-center mb-12">
          <h2 
            class="text-3xl font-bold mb-4" 
            :class="isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            {{ whyJoinTitleText }}
          </h2>
          <p 
            class="text-lg mb-2"
            :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
          >
            {{ whyJoinSubtitleText }}
          </p>
         </div>
         
         <div 
           ref="cardsStagger.container"
           class="grid lg:grid-cols-3 gap-8"
         >
           <!-- What is GCX -->
           <div 
             class="rounded-2xl p-6 shadow-lg border hover:shadow-xl" 
             :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100'"
           >
             <div class="w-full h-40 mb-4 rounded-xl overflow-hidden">
               <img :src="getImagePath('/trading dashboard.jpg')" alt="Trading Platform" class="w-full h-full object-cover" />
             </div>
             <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ whyJoinContent?.card1_title || 'What is GCX?' }}</h3>
             <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
               {{ whyJoinContent?.card1_description || 'Simply put, GCX is a marketplace or a platform for buying and selling listed commodities. Starting with spot contracts for physical products, GCX will later trade in futures and options contracts for the listed commodities.' }}
             </p>
           </div>
           
           <!-- Benefits to Members -->
           <div 
             class="rounded-2xl p-6 shadow-lg border hover:shadow-xl" 
             :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100'"
           >
             <div class="w-full h-40 mb-4 rounded-xl overflow-hidden">
               <img :src="getImagePath('/crop.jpg')" alt="Agricultural Trading" class="w-full h-full object-cover" />
             </div>
             <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ whyJoinContent?.card2_title || 'Benefits to Members' }}</h3>
             <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
               {{ whyJoinContent?.card2_description || 'As a member, you gain access to a wide range of market actors (buyers and sellers) thereby creating opportunities for you to increase your revenue stream in a simplified manner, and without risk.' }}
             </p>
           </div>
           
           <!-- Benefits to Society -->
           <div 
             class="rounded-2xl p-6 shadow-lg border hover:shadow-xl" 
             :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-yellow-100'"
           >
             <div class="w-full h-40 mb-4 rounded-xl overflow-hidden">
               <img :src="getImagePath('/trading.jpg')" alt="Trading Platform" class="w-full h-full object-cover" />
             </div>
             <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ whyJoinContent?.card3_title || 'Benefits to Society' }}</h3>
             <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
               {{ whyJoinContent?.card3_description || 'Apart from job creation, agricultural economic transformation will occur through the myriad of opportunities for value chain actors to achieve high levels of sustainable and equitable growth, from farmers who receive a premium on quality grains to traders who are guaranteed the right quality, with cash and contract settlement within a few days.' }}
             </p>
           </div>
         </div>
       </div>
     </section>
     
     <!-- 4. Services Section -->
    <ServicesSection />
    
    <!-- 5. Market Data Section with Graphs -->
    <MarketDataSection />
    
    <!-- 6. Join the Exchange Section -->
    <MembershipWidget />
    
    <!-- 7. Commodities Carousel Section -->
    <CommoditiesCarousel />
    
    <!-- 9. Partners Section -->
    <PartnersSection />
    
    <!-- 10. News & Insights Section -->
    <NewsInsightsSection />
    
    <!-- 11. Upcoming Events Section -->
    <EventsSection />
     
     <!-- 12. CTA Section -->
    <section 
      class="py-12 bg-gradient-to-r from-yellow-500 to-yellow-600"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <h1 
            class="text-3xl font-bold text-black mb-4"
          >
            {{ ctaTitle }}
          </h1>
          <p 
            class="text-lg text-black/80 mb-2"
          >
            {{ ctaSubtitle }}
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Register Section -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 class="text-3xl font-bold text-black mb-4">{{ ctaContent?.cta1_title || 'Register to become a member' }}</h2>
            <p class="text-xl text-black/80 mb-6">{{ ctaContent?.cta1_description || 'And be part of a growing network' }}</p>
            <button class="bg-black hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              {{ ctaContent?.cta1_button_text || 'Become a Member' }}
            </button>
          </div>
          
          <!-- Download Forms Section -->
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 class="text-3xl font-bold text-black mb-4">{{ ctaContent?.cta2_title || 'Download Forms and Other resources' }}</h2>
            <p class="text-xl text-black/80 mb-6">{{ ctaContent?.cta2_description || 'Get access to much more information' }}</p>
            <button class="bg-white/20 hover:bg-white/30 text-black font-semibold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              {{ ctaContent?.cta2_button_text || 'Learn More' }}
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template> 