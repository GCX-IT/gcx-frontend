<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import { useI18n } from '../composables/useI18n'

const router = useRouter()
const { t } = useI18n()

const membershipTypes = ref([
  {
    code: 'TM',
    title: 'Trading Member',
    description: 'Buy and sell all commodities for self only',
    icon: '📈',
    color: 'from-blue-500 to-blue-600',
    requirements: ['GHC 50,000 Net Worth', 'Company Registration', 'Tax Clearance']
  },
  {
    code: 'BM',
    title: 'Broker Member',
    description: 'Trade for self and clients with full settlement rights',
    icon: '🤝',
    color: 'from-green-500 to-green-600',
    requirements: ['GHC 80,000 Net Worth', 'Company Registration', 'Client Agreements']
  },
  {
    code: 'AS',
    title: 'Associate Member',
    description: 'Special membership for smallholder farmers and traders',
    icon: '🌾',
    color: 'from-yellow-500 to-yellow-600',
    requirements: ['Business Registration', 'TIN Number', '12-Month Trading Rights']
  },
  {
    code: 'IM',
    title: 'Institutional Member',
    description: 'For non-commercial organizations providing services',
    icon: '🏛️',
    color: 'from-purple-500 to-purple-600',
    requirements: ['Company Registration', 'Audit Report', 'Service Provider Status']
  }
])

const navigateToMembership = () => {
  router.push('/membership')
}

const navigateToApplication = () => {
  router.push('/membership/application')
}
</script>

<template>
  <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-100'">
    <div class="max-w-[1600px] mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl lg:text-5xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Join the <span class="text-yellow-500">Exchange</span>
        </h2>
        <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Choose the membership type that suits your trading needs and become part of Ghana's premier commodity exchange
        </p>
      </div>

      <!-- Membership Types Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
          v-for="type in membershipTypes"
          :key="type.code"
          class="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          :class="isDarkMode ? 'bg-slate-700' : 'bg-white'"
        >
          <!-- Background Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300"
               :class="type.color"></div>
          
          <!-- Content -->
          <div class="relative p-6 h-full flex flex-col">
            <!-- Icon and Code -->
            <div class="flex items-center justify-between mb-4">
              <div class="text-4xl">{{ type.icon }}</div>
              <div class="text-sm font-bold px-3 py-1 rounded-full bg-yellow-500 text-black">
                {{ type.code }}
              </div>
            </div>
            
            <!-- Title and Description -->
            <h3 class="text-xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ type.title }}
            </h3>
            <p class="text-sm mb-4 flex-grow" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              {{ type.description }}
            </p>
            
            <!-- Requirements -->
            <div class="space-y-2">
              <div class="text-xs font-semibold text-yellow-500">Requirements:</div>
              <ul class="text-xs space-y-1" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                <li v-for="req in type.requirements.slice(0, 2)" :key="req" class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  {{ req }}
                </li>
                <li v-if="type.requirements.length > 2" class="flex items-center gap-2 text-yellow-500">
                  <div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  +{{ type.requirements.length - 2 }} more
                </li>
              </ul>
            </div>
          </div>
          
          <!-- Hover Effect -->
          <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
               :class="type.color"></div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center">
        <div class="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 shadow-2xl">
          <h3 class="text-3xl font-bold text-black mb-4">
            Ready to Start Trading?
          </h3>
          <p class="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of traders and institutions already benefiting from GCX membership. 
            Get access to transparent pricing, secure settlements, and market opportunities.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              @click="navigateToMembership"
              class="inline-flex items-center gap-3 px-8 py-4 bg-black hover:bg-slate-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Learn More About Membership
            </button>
            
            <button
              @click="navigateToApplication"
              class="inline-flex items-center gap-3 px-8 py-4 bg-white/20 hover:bg-white/30 text-black font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg border-2 border-white/30"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Apply Now
            </button>
          </div>
          
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="text-center">
              <div class="text-3xl font-bold text-black">9</div>
              <div class="text-sm text-black/70">Warehouse Network</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-black">6</div>
              <div class="text-sm text-black/70">Active Commodities</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-black">T+1</div>
              <div class="text-sm text-black/70">Settlement Cycle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations */
.group:hover .group-hover\:opacity-20 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
