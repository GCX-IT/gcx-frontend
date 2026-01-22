<template>
  <div v-if="isOpen" class="subscription-modal fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50" @click="closeModal">
    <div class="modal-content rounded-2xl shadow-2xl w-11/12 max-w-4xl h-5/6 flex flex-col transform transition-all duration-300 ease-out" 
         :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
         @click.stop>
      
      <!-- Header -->
      <div class="modal-header p-6 border-b flex items-center justify-between" :class="isDarkMode ? 'border-slate-700' : 'border-gray-200'">
        <div>
          <h2 class="text-3xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            Choose Your Plan
          </h2>
          <p class="text-sm mt-1" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
            Unlock premium market data and advanced trading tools
          </p>
        </div>
        <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" :class="isDarkMode ? 'hover:bg-slate-700' : ''">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Content -->
      <div class="modal-body flex-1 overflow-y-auto p-6">
        <!-- Pricing Cards -->
        <div class="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          <!-- Free Plan -->
          <div class="rounded-xl border p-6 transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Free</h3>
              <div class="mb-2">
                <span class="text-3xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">GHC 0</span>
                <span class="text-gray-600">/year</span>
              </div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Basic market data access with limitations</p>
            </div>
            
            <ul class="space-y-3 mb-6">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Limited market data access</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Historical data download (1 year)</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Basic commodity information</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-sm text-gray-500">No live data</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-sm text-gray-500">No alerts system</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="text-sm text-gray-500">No API access</span>
              </li>
            </ul>
            
            <button class="w-full py-3 px-4 rounded-xl font-medium transition-all duration-200" :class="isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
              Current Plan
            </button>
          </div>

          <!-- Premium Plan (Popular) -->
          <div class="relative rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-xl" :class="isDarkMode ? 'border-yellow-500 bg-slate-800' : 'border-yellow-500 bg-white'">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div class="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                Recommended
              </div>
            </div>
            
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Premium</h3>
              <div class="mb-2">
                <span class="text-3xl font-bold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">GHC 299</span>
                <span class="text-gray-600">/year</span>
              </div>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Full access to all market data features</p>
            </div>
            
            <ul class="space-y-3 mb-6">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Live market data</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Historical data (3 years)</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Alert system creation</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">API access</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Data export (CSV, Excel)</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Priority support</span>
              </li>
            </ul>
            
            <button 
              @click="redirectToMarketData"
              class="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
            >
              Subscribe Now
            </button>
          </div>
        </div>

        <!-- Features Breakdown -->
        <div class="mt-8">
          <h3 class="text-2xl font-bold mb-6 text-center" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
            What You Get With Premium
          </h3>
          
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Market Data Features -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold mb-4 flex items-center gap-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                Market Data Access
              </h4>
              <ul class="space-y-3">
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Historical data (3 years)</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Historical data (3 years)</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Delivery centre information</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Commodity grades & details</span>
                </li>
              </ul>
            </div>

            <!-- Trading Features -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold mb-4 flex items-center gap-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <div class="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                Trading Tools
              </h4>
              <ul class="space-y-3">
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Alert system creation</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Price notifications</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">API access for developers</span>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Data export (CSV, Excel)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer p-6 border-t flex items-center justify-between" :class="isDarkMode ? 'border-slate-700' : 'border-gray-200'">
        <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-500'">
          One-time yearly payment • No setup fees • Full access to market data platform
        </div>
        <div class="flex items-center gap-3">
          <button @click="closeModal" class="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200" :class="isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'">
            Maybe Later
          </button>
          <button 
            @click="redirectToMarketData"
            class="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDarkMode } from '../utils/darkMode'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const closeModal = () => {
  emit('close')
}

const redirectToMarketData = () => {
  // Redirect to the production market data app
  window.open('https://gcx-marketdata-teg2.vercel.app', '_blank')
}
</script>

<style scoped>
.subscription-modal {
  backdrop-filter: blur(6px) saturate(150%);
  background: rgba(255, 255, 255, 0.05);
}

.modal-content {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
