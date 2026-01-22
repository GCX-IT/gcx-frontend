<script setup lang="ts">
import { ref } from 'vue';

const leadershipCategories = [
  { label: 'Board of Directors', key: 'board' },
  { label: 'Executive Management', key: 'executive' },
  { label: 'Senior Management', key: 'senior' },
  { label: 'Department Heads', key: 'heads' },
];

const activeCategory = ref('board');
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
      <div class="absolute inset-0 opacity-30">
        <div class="absolute inset-0 bg-blue-100 dark:bg-blue-900/10 bg-opacity-20"></div>
        <div class="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-0 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 dark:bg-blue-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <div class="mb-8">
          <span class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full mb-6">
            GCX Leadership Team
          </span>
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 bg-clip-text text-transparent">
          Visionary Leadership
          <span class="block">Driving Excellence</span>
        </h1>
        
        <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
          Meet the exceptional leaders who guide GCX's mission to transform agricultural trading across West Africa 
          through strategic vision, innovation, and unwavering commitment to excellence.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Meet Our Team
          </button>
          <button class="px-8 py-4 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
            Leadership Philosophy
          </button>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 py-16">
      <!-- Leadership Categories Navigation -->
      <div class="mb-16">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex justify-center">
            <div class="flex space-x-8 overflow-x-auto">
              <button
                v-for="category in leadershipCategories"
                :key="category.key"
                @click="activeCategory = category.key"
                :class="[
                  'relative py-4 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 focus:outline-none',
                  activeCategory === category.key
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                ]"
              >
                {{ category.label }}
                <span
                  v-if="activeCategory === category.key"
                  class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                ></span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      <!-- Leadership Content -->
      <div class="transition-all duration-300">
        <!-- Board of Directors -->
        <div v-if="activeCategory === 'board'">
          <section class="py-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Board of Directors</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our distinguished Board of Directors provides strategic oversight, governance, and guidance to ensure GCX achieves its mission and maintains the highest standards of corporate excellence.
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Chairman -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-32 h-32 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                  JA
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">John Asante</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold mb-4 text-lg">Chairman</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Former Governor of Bank of Ghana with over 25 years of experience in monetary policy and financial market development.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">Financial Policy</span>
                  <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">Governance</span>
                </div>
              </div>
              
              <!-- Vice Chairman -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                  MO
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mary Osei</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold mb-4 text-lg">Vice Chairman</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  CEO of Ghana Agricultural Development Bank with expertise in agricultural finance and rural development.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">Agriculture</span>
                  <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">Finance</span>
                </div>
              </div>
              
              <!-- Independent Director -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold">
                  KM
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kwame Mensah</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold mb-4 text-lg">Independent Director</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Technology entrepreneur and former CEO of fintech companies across West Africa.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">Technology</span>
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">Innovation</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Executive Management -->
        <div v-if="activeCategory === 'executive'">
          <section class="py-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Executive Management</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our executive leadership team drives day-to-day operations, strategic implementation, and organizational excellence across all facets of GCX.
              </p>
            </div>
            
            <div class="space-y-12">
              <!-- CEO -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                  <div class="w-48 h-48 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                    CEO
                  </div>
                  <div class="text-center lg:text-left flex-1">
                    <h3 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">Dr. Samuel Adjei</h3>
                    <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-xl mb-6">Chief Executive Officer</p>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                      Leading GCX's transformation of agricultural trading in Ghana with over 15 years of experience in commodity markets and financial services. Dr. Adjei holds a PhD in Agricultural Economics and has worked extensively across emerging markets.
                    </p>
                    <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
                      <span class="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">Strategic Leadership</span>
                      <span class="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full">Agricultural Economics</span>
                      <span class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full">Market Development</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- C-Suite Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- CTO -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-6 mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      CTO
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">James Boateng</h3>
                      <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-lg">Chief Technology Officer</p>
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-4">
                    Drives technology innovation and platform development with 12 years in fintech and trading systems.
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">Platform Architecture</span>
                    <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">Trading Systems</span>
                  </div>
                </div>
                
                <!-- CFO -->
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-6 mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                      CFO
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Grace Appiah</h3>
                      <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-lg">Chief Financial Officer</p>
                    </div>
                  </div>
                  <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-4">
                    Manages financial strategy and operations with extensive experience in investment banking and risk management.
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">Financial Strategy</span>
                    <span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full">Risk Management</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Senior Management -->
        <div v-if="activeCategory === 'senior'">
          <section class="py-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Senior Management</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our senior management team ensures operational excellence and strategic execution across all business units and functional areas.
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <!-- Head of Trading -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div class="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Head of Trading Operations</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-center mb-4">Michael Ofori</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-4">
                  Oversees all trading operations, market making, and ensures platform liquidity with 10+ years in commodity trading.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">Trading</span>
                  <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">Operations</span>
                </div>
              </div>
              
              <!-- Head of Risk -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Head of Risk Management</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-center mb-4">Sarah Donkor</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-4">
                  Manages enterprise risk, compliance frameworks, and regulatory adherence across all operations.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full">Risk Management</span>
                  <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">Compliance</span>
                </div>
              </div>
              
              <!-- Head of Business Development -->
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Head of Business Development</h3>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-center mb-4">David Kwarteng</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-center mb-4">
                  Drives strategic partnerships, market expansion, and new product development initiatives.
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full">Partnerships</span>
                  <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">Growth</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Department Heads -->
        <div v-if="activeCategory === 'heads'">
          <section class="py-12">
            <div class="text-center mb-16">
              <h2 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Department Heads</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Our department heads lead specialized teams across key functional areas, ensuring operational excellence and service delivery.
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- Various Department Heads -->
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Member Relations</h4>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm mb-2">Agnes Osei</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Client engagement & satisfaction</p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Market Analytics</h4>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm mb-2">Frank Asiedu</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Data analysis & insights</p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Legal & Compliance</h4>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm mb-2">Victoria Mensah</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Regulatory affairs</p>
              </div>
              
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100 dark:border-gray-700">
                <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Customer Support</h4>
                <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-sm mb-2">Joseph Ankrah</p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">24/7 support services</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>