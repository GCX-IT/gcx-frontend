<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section -->
    <section class="relative py-14 lg:py-20 overflow-hidden"
      :class="isDarkMode
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-yellow-100 via-white to-yellow-50'">
      <!-- Map Line Design Element -->
      <div class="absolute inset-0 overflow-hidden">
         <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
         <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-20"></div>
         <div class="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
        
        <!-- Vertical Lines -->
         <div class="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-20"></div>
         <div class="absolute top-0 left-1/2 h-full w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-30"></div>
         <div class="absolute top-0 left-3/4 h-full w-px bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-20"></div>
      </div>

      <div class="relative max-w-[1600px] mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-sm">
          Services | Ghana Commodity Exchange
        </h1>

        <p class="text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
          Comprehensive solutions for secure, transparent, and efficient commodity trading
        </p>
      </div>
    </section>

         <!-- Services Section -->
     <section class="py-16" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
         <div class="max-w-7xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl lg:text-4xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
             Core Services
           </h2>
           <p class="text-lg max-w-2xl mx-auto" :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">
             Comprehensive solutions for secure, transparent, and efficient commodity trading
           </p>
         </div>

         <div class="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-10">
            <div
             v-for="(item, idx) in paginatedServices"
             :key="idx"
             class="group rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border overflow-hidden"
             :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'"
           >
             <div class="relative w-full h-56 md:h-72">
               <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
               <div class="absolute inset-0"
                    :class="isDarkMode
                      ? 'bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent'
                      : 'bg-gradient-to-t from-black/50 via-black/5 to-transparent'">
               </div>
                <h3 class="absolute bottom-4 left-4 right-4 text-white text-2xl md:text-3xl font-semibold drop-shadow">
                 {{ item.title }}
               </h3>
             </div>
              <div class="p-7 lg:p-9">
                <p class="text-lg leading-relaxed" :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">
                 {{ item.description }}
               </p>
             </div>
           </div>
         </div>

         <!-- Pagination -->
         <div class="flex items-center justify-center gap-2 mt-12">
           <button
             class="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             :disabled="currentPage === 1"
             @click="goToPage(currentPage - 1)"
           >
             Prev
           </button>
           <button
             v-for="page in totalPages"
             :key="page"
             @click="goToPage(page as number)"
             class="px-4 py-2.5 rounded-lg border text-base"
             :class="[
               currentPage === (page as number)
                 ? 'bg-yellow-500 border-yellow-500 text-white'
                 : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
             ]"
           >
             {{ page }}
           </button>
           <button
             class="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
             :disabled="currentPage === totalPages"
             @click="goToPage(currentPage + 1)"
           >
             Next
           </button>
         </div>
       </div>
     </section>

     <!-- Why Choose GCX -->
      <section class="py-14" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
       <div class="max-w-[1600px] mx-auto px-4">
          <div class="text-center mb-10">
            <h2 class="text-3xl lg:text-4xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Why Choose GCX</h2>
            <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">Built for trust, efficiency, and market integrity across Ghana’s commodity value chains.</p>
         </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div class="rounded-2xl p-6" :class="isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-300'">
              <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">T+1 Settlement</h3>
              <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">Prompt, reliable settlement ensures liquidity and confidence for both sellers and buyers.</p>
           </div>
            <div class="rounded-2xl p-6" :class="isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-300'">
              <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Transparent Markets</h3>
              <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">Rules-based trading and standardized contracts support fair price discovery.</p>
           </div>
            <div class="rounded-2xl p-6" :class="isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-300'">
              <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Assured Quality</h3>
              <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-800'">Certified warehousing, grading, and collateral management guarantee product integrity.</p>
           </div>
         </div>
       </div>
     </section>

     <!-- Call to Action -->
     <section class="py-14">
       <div class="max-w-7xl mx-auto px-4">
         <div class="rounded-3xl p-10 bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg text-center">
           <h3 class="text-2xl lg:text-3xl font-extrabold text-white mb-3">Ready to trade with confidence?</h3>
           <p class="text-yellow-100 mb-6">Join GCX to access secure storage, transparent markets, and T+1 settlement.</p>
           <div class="flex items-center justify-center gap-4">
             <a href="/membership/apply" class="px-6 py-3 bg-white text-yellow-700 font-semibold rounded-xl hover:bg-yellow-50 transition">Get Started</a>
             <a href="/contact" class="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-yellow-500/20 transition">Contact Us</a>
           </div>
         </div>
       </div>
     </section>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'

type ServiceItem = {
  title: string
  description: string
  image: string
}

const services = ref<ServiceItem[]>([
  {
    title: 'Secured Storage with Grain Testing & Grain Quality Improvement Facilities',
    description:
      'GCX operates certified warehouses nationwide to receive, clean, dry, grade, re-bag, weigh, and securely store grains. Comprehensive stock, risk, and quality controls ensure full traceability and market-ready commodities throughout storage.',
    image: '/Service/testing.jpg',
  },
  {
    title: 'Food Safety Guarantees',
    description:
      "GCX guarantees product safety during storage against infestation and contamination. Where grade or quality changes occur, GCX ensures buyers are made whole under its assurance framework.",
    image: '/Service/safety.jpg',
  },
  {
    title: 'Reliable, Fair and Transparent Price Discovery Process',
    description:
      'Our secure, automated electronic trading platform and central depository provide transparent price discovery with seamless access from offices, homes, or GCX trading terminals.',
    image: '/Service/Reliable.jpg',
  },
  {
    title: 'Secured and Prompt Trade Settlement',
    description:
      'With commodities secured in advance and pre-trade cash deposits held by settlement banks, GCX ensures T+1 settlement: sellers are paid and buyers receive full delivery within 24 hours after trade.',
    image: '/Service/Secured and prompt trade settlement.png',
  },
  // Page 2 content requested
  {
    title: 'Provision of Daily Commodity Prices to Facilitate Trade',
    description:
      "GCX will disseminate real-time price information and market prices to traders through SMS, websites, newspapers and other media. This empowers all market participants with stronger negotiating positions and enables policymakers to identify surpluses to combat food shortages nationally and regionally.",
    image: '/Service/Provision of Daily.jpg',
  },
  {
    title: 'Secured and Reliable Delivery Locations',
    description:
      'GCX warehouses are equipped to deliver commodities within two days of ownership transfer. Transport is arranged and commodities are verified pre-dispatch. Certificates of delivery are issued and a clear dispute-resolution mechanism ensures conformity with traded goods.',
    image: '/Service/Secured and reliable.jpg',
  },
  {
    title: 'Capacity Building for Farmers, Traders, and Market Actors',
    description:
      'GCX provides needs-based training to build capacity across market participants—covering commodity marketing and pricing, standards, contract-based trading, quality and safety, and assurance practices to increase effective use of Exchange products.',
    image: '/Service/Capacity Building for farmers.jpg',
  },
  {
    title: 'Linkages to Source Grain Across Africa and Global Markets',
    description:
      "The GCX trading platform connects buyers and sellers across Africa. Buyers source quality grains that meet GCX standards at competitive prices; sellers list to reach broader demand. As central counterparty to trades and a provider of transparent real-time pricing, GCX reduces counterparty risk and price asymmetry common in African markets.",
    image: '/Service/LINKAGES TO SOURCE GRAIN FROM THE.jpg',
  },
])

const itemsPerPage = 4
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(services.value.length / itemsPerPage))
const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return services.value.slice(start, start + itemsPerPage)
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // Scroll to top of services section for better UX
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>
