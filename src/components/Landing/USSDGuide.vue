<script setup lang="ts">
import { ref } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import { 
  PhoneIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  UserIcon, 
  LockClosedIcon, 
  ShoppingCartIcon 
} from '@heroicons/vue/24/outline'

const activeTab = ref(0)
const heroImageLoaded = ref(false)

const steps = [
  {
    id: 1,
    title: 'Register',
    description: 'Create your GCX USSD account',
    instruction: 'Dial *920*23# and select "Register"',
    details: 'Start your registration by dialing the USSD code on your mobile phone. You will be guided through the account creation process. Make sure you have an active mobile network connection.',
    icon: PhoneIcon,
    image: '/USSD/Register.png'
  },
  {
    id: 2,
    title: 'How to Register',
    description: 'Follow the step-by-step registration process',
    instruction: 'Enter your personal details and create a PIN',
    details: 'Provide your full name, phone number, and email address. Create a secure 4-digit PIN for your account. This information will be used for account verification and trading activities.',
    icon: UserIcon,
    image: '/USSD/how%20to%20register.png'
  },
  {
    id: 3,
    title: 'Sell Commodity',
    description: 'List your commodities for sale',
    instruction: 'Select option: "Sell Commodity" from the menu',
    details: 'Choose the type of commodity you want to sell (maize, rice, soya, etc.), enter the quantity and price. Your listing will be visible to other traders on the platform.',
    icon: CheckCircleIcon,
    image: '/USSD/Sell%20Commodity.png'
  },
  {
    id: 4,
    title: 'Buy Commodity',
    description: 'Purchase commodities from other traders',
    instruction: 'Select option: "Buy Commodity" from the menu',
    details: 'Browse available commodities, select the ones you want to purchase, confirm the quantity and price. Your order will be matched with sellers on the platform.',
    icon: ShoppingCartIcon,
    image: '/USSD/Buy%20Commodoity.png'
  },
  {
    id: 5,
    title: 'Become a Member',
    description: 'Upgrade to full membership and unlock premium features',
    instruction: 'Select option: "Become a Member" to upgrade',
    details: 'As a member, you get access to premium features, higher trading limits, priority support, and exclusive market insights. Complete the membership process to unlock all benefits.',
    icon: LockClosedIcon,
    image: '/USSD/Become%20A%20Member.png'
  }
]

const setActiveTab = (index: number) => {
  activeTab.value = index
}
</script>

<template>
  <section 
    class="transition-colors duration-300" 
    :class="isDarkMode ? 'bg-slate-900' : 'bg-white'"
  >
    <!-- Hero Section -->
    <div class="relative w-full h-64 md:h-80 lg:h-96 -mt-1 overflow-hidden bg-slate-800">
      <!-- Placeholder blur while loading -->
      <div 
        v-show="!heroImageLoaded"
        class="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse"
      ></div>
      
      <!-- Actual image -->
      <img 
        src="/USSD/hero-ussd.jpg" 
        alt="USSD Trading Hero"
        class="w-full h-full object-cover transition-opacity duration-500"
        :class="heroImageLoaded ? 'opacity-100' : 'opacity-0'"
        loading="lazy"
        @load="heroImageLoaded = true"
      />
      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-black/60"></div>
      
      <!-- Hero Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center px-3 sm:px-4">
        <h1 class="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4">USSD Trading Registration</h1>
        <p class="text-xs sm:text-sm md:text-lg text-gray-200 mb-1 sm:mb-2">Follow the simple steps below to register and start trading commodities via USSD.</p>
        <p class="text-xs sm:text-sm text-gray-300 mb-3 md:mb-4">No internet connection required - just dial <span class="font-bold text-yellow-400">*920*23#</span> on your mobile phone.</p>
        <div class="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-4 text-gray-200 text-xs sm:text-sm">
          <div class="flex items-center gap-1 sm:gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Available 24/7
          </div>
          <div class="flex items-center gap-1 sm:gap-2">
            <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Works on Any Phone
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-[1300px] mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-16 mt-6 sm:mt-12">
      <!-- Tabs Navigation -->
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            v-for="(step, index) in steps"
            :key="step.id"
            @click="setActiveTab(index)"
            class="group relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
            :class="activeTab === index 
              ? 'bg-green-600 text-white shadow-lg scale-105' 
              : isDarkMode 
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'"
          >
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300"
                :class="activeTab === index 
                  ? 'bg-white text-green-600' 
                  : isDarkMode 
                    ? 'bg-slate-600 text-slate-300' 
                    : 'bg-slate-300 text-slate-700'">
                {{ step.id }}
              </span>
              <span class="hidden sm:inline">{{ step.title }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <transition name="fade" mode="out-in">
        <div class="rounded-lg shadow-xl p-4 sm:p-6 lg:p-12 border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'" :key="activeTab">
          <!-- Image Frame -->
          <div class="mb-6 sm:mb-8 w-full mx-auto">
            <div class="relative w-full overflow-hidden shadow-xl bg-white" style="min-height: clamp(200px, 40vh, 600px);">
              <img 
                :src="steps[activeTab].image" 
                :alt="steps[activeTab].title"
                class="w-full h-full object-contain"
              />
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start">
            <!-- Left: Icon and Step Info -->
            <div class="flex-shrink-0 w-full sm:w-auto">
              <div 
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center shadow-lg transition-colors duration-300"
                :class="isDarkMode ? 'bg-green-900/30 border-2 border-green-600' : 'bg-green-100 border-2 border-green-300'"
              >
                <component 
                  :is="steps[activeTab].icon" 
                  class="w-10 h-10 transition-colors duration-300"
                  :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
                />
              </div>
              <div class="mt-2 sm:mt-4 text-center">
                <div 
                  class="text-xs sm:text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'"
                >
                  Step {{ activeTab + 1 }} of {{ steps.length }}
                </div>
              </div>
            </div>

            <!-- Right: Content -->
            <div class="flex-1">
              <h3 
                class="text-lg sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 transition-colors duration-300"
                :class="isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                {{ steps[activeTab].title }}
              </h3>
              
              <p 
                class="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 transition-colors duration-300"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              >
                {{ steps[activeTab].description }}
              </p>

              <!-- Instruction Box -->
              <div 
                class="rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 transition-colors duration-300"
                :class="isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-300'"
              >
                <div class="flex items-start gap-3 sm:gap-4">
                  <ArrowRightIcon 
                    class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-1 transition-colors duration-300"
                    :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
                  />
                  <div>
                    <div 
                      class="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 transition-colors duration-300"
                      :class="isDarkMode ? 'text-green-400' : 'text-green-700'"
                    >
                      What to do:
                    </div>
                    <div 
                      class="text-sm sm:text-lg lg:text-xl font-bold transition-colors duration-300"
                      :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                    >
                      {{ steps[activeTab].instruction }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Details -->
              <div 
                class="rounded-xl p-4 sm:p-6 transition-colors duration-300"
                :class="isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'"
              >
                <div 
                  class="text-xs sm:text-sm font-semibold mb-2 transition-colors duration-300"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
                >
                  Additional Information:
                </div>
                <p 
                  class="text-xs sm:text-sm lg:text-base leading-relaxed transition-colors duration-300"
                  :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
                >
                  {{ steps[activeTab].details }}
                </p>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t transition-colors duration-300" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
                <button
                  v-if="activeTab > 0"
                  @click="setActiveTab(activeTab - 1)"
                  class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300"
                  :class="isDarkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                >
                  <ArrowRightIcon class="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                  Previous
                </button>
                <div v-else class="w-full sm:w-auto"></div>

                <button
                  v-if="activeTab < steps.length - 1"
                  @click="setActiveTab(activeTab + 1)"
                  class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Next
                  <ArrowRightIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div
                  v-else
                  class="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl text-sm sm:text-base font-semibold"
                >
                  <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                  Complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Quick Tips -->
      <div class="mt-8 grid sm:grid-cols-3 gap-4">
        <div 
          class="p-4 rounded-xl border transition-colors duration-300"
          :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        >
          <div 
            class="text-sm font-semibold mb-1 transition-colors duration-300"
            :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
          >
            No Internet Required
          </div>
          <p 
            class="text-xs transition-colors duration-300"
            :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
          >
            USSD works on any mobile phone without internet connection
          </p>
        </div>
        <div 
          class="p-4 rounded-xl border transition-colors duration-300"
          :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        >
          <div 
            class="text-sm font-semibold mb-1 transition-colors duration-300"
            :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
          >
            Secure & Safe
          </div>
          <p 
            class="text-xs transition-colors duration-300"
            :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
          >
            All transactions are secured with your PIN
          </p>
        </div>
        <div 
          class="p-4 rounded-xl border transition-colors duration-300"
          :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        >
          <div 
            class="text-sm font-semibold mb-1 transition-colors duration-300"
            :class="isDarkMode ? 'text-green-400' : 'text-green-600'"
          >
            Available 24/7
          </div>
          <p 
            class="text-xs transition-colors duration-300"
            :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
          >
            Access trading services anytime, anywhere
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>