<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h2 class="text-3xl lg:text-4xl font-extrabold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        GCX Application Forms
      </h2>
      <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        Choose the appropriate application form based on your membership type. You can either apply online or download the PDF version.
      </p>
    </div>

    <!-- Application Forms Grid -->
    <div class="grid md:grid-cols-2 gap-6">
      
      <!-- Broking Member (Institutional) -->
      <div class="rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-200 hover:border-blue-400'">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-blue-600/20' : 'bg-blue-500/10'">
            <svg class="w-6 h-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Broking Member (Institutional)</h3>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">For institutional brokers</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Can BUY and SELL for themselves and clients</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Net worth requirement: GHC 50,000</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Admission Fee: GH₵4,500 | Annual: GH₵2,250</span>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <a href="https://apps.gcx.com.gh/membership/" target="_blank" 
             class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
             :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Online Form
          </a>
          <a href="/brokering-memberinstitutional.pdf" target="_blank"
             class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border transition-all duration-200"
             :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      <!-- Trading Member -->
      <div class="rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-green-500' : 'bg-white border-slate-200 hover:border-green-400'">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-green-600/20' : 'bg-green-500/10'">
            <svg class="w-6 h-6" :class="isDarkMode ? 'text-green-400' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Trading Member</h3>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">For individual traders</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Can BUY and SELL for self only</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Capital adequacy: GHC 50,000</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Admission Fee: GH₵2,200 | Annual: GH₵1,100</span>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <a href="https://apps.gcx.com.gh/membership/" target="_blank"
             class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
             :class="isDarkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Online Form
          </a>
          <a href="/gcx-online-trading-member.pdf" target="_blank"
             class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border transition-all duration-200"
             :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      <!-- Financial Institutional Member -->
      <div class="rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-400'">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-purple-600/20' : 'bg-purple-500/10'">
            <svg class="w-6 h-6" :class="isDarkMode ? 'text-purple-400' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Financial Institutional Member</h3>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">For financial institutions</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Specialized financial services</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Institutional requirements apply</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Contact for specific fees</span>
          </div>
        </div>

        <div class="mt-6">
          <a href="/financial-institutional-member.pdf" target="_blank"
             class="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
             :class="isDarkMode ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download PDF Application
          </a>
        </div>
      </div>

      <!-- GoG-GCX Free SHS Supplier -->
      <div class="rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg" :class="isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-orange-500' : 'bg-white border-slate-200 hover:border-orange-400'">
        <div class="flex items-center gap-3 mb-4">
          <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-orange-600/20' : 'bg-orange-500/10'">
            <svg class="w-6 h-6" :class="isDarkMode ? 'text-orange-400' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">GoG-GCX Free SHS Supplier</h3>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">For government suppliers</p>
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Government of Ghana partnership</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Free Senior High School program</span>
          </div>
          <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span>Specialized supplier requirements</span>
          </div>
        </div>

        <div class="mt-6">
          <a href="http://188.166.159.42:8012/" target="_blank" rel="noopener noreferrer"
             class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
             :class="isDarkMode ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Apply as Supplier
          </a>
          <p class="text-xs mt-3 text-center" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Special application process applies</p>
        </div>
      </div>

    </div>

    <!-- Important Information Section -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Important Information</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Application Process</h4>
            <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">1.</span>
                <span>Read Terms and Conditions carefully</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">2.</span>
                <span>Complete application with required documents</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-blue-500 font-bold">3.</span>
                <span>Submit to GCX office addresses listed</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Key Notes</h4>
            <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <li class="flex items-start gap-2">
                <span class="text-green-500 font-bold">•</span>
                <span>Approval takes 15 working days after document receipt</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 font-bold">•</span>
                <span>Membership training required after approval</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-green-500 font-bold">•</span>
                <span>GCX ID Card and Certificate provided</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-red-600/20' : 'bg-red-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Contact for Enquiries</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Head of Membership & Special Projects</h4>
          <div class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <p><strong>Ghana Commodity Exchange</strong></p>
            <p>2nd Floor Africa Trade House (Next to British Council)</p>
            <p>Cruickshank Road/ Liberia Road Ridge</p>
            <p>Ridge – Accra</p>
          </div>
        </div>
        <div>
          <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Contact Details</h4>
          <div class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <p><strong>Phone:</strong> +233 – 302- 937677</p>
            <p><strong>Email:</strong> info@gcx.com.gh</p>
            <p><strong>Website:</strong> www.gcx.com.gh</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


