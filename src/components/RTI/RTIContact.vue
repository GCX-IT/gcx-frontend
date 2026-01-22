<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
</script>

<template>
  <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Contact Information
        </h2>
        <p class="text-xl max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Get in touch with our RTI Unit for assistance and support
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Details -->
        <div class="space-y-8">
          <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <h3 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              RTI Unit Contact
            </h3>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    RTI Email
                  </h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    For RTI applications and inquiries
                  </p>
                  <a 
                    href="mailto:rti@gcx.com.gh" 
                    class="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
                  >
                    rti@gcx.com.gh
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    General Contact
                  </h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    For general inquiries and support
                  </p>
                  <a 
                    href="mailto:contact@gcx.com.gh" 
                    class="text-green-600 hover:text-green-800 font-medium transition-colors duration-200"
                  >
                    contact@gcx.com.gh
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-yellow-600' : 'bg-yellow-100'">
                  <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    Headquarters
                  </h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                    Visit us in person for RTI applications
                  </p>
                  <p class="text-sm font-medium" :class="isDarkMode ? 'text-slate-200' : 'text-slate-700'">
                    2nd Floor - Africa Trade House,<br>
                    Ambassadorial Enclave Off Liberia Road<br>
                    Ridge, Accra, Ghana
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Process Information -->
        <div class="space-y-8">
          <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <h3 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Application Process
            </h3>
            
            <p class="text-lg leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              The processes the public/applicant is expected to follow when making an application for access to information in a public institution is specified in Section 18 of the RTI Act 2019, Act 989.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" :class="isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'">
                  1
                </div>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Download and complete the RTI Application Form
                </p>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" :class="isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'">
                  2
                </div>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Submit via email to rti@gcx.com.gh
                </p>
              </div>
              
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" :class="isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'">
                  3
                </div>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Or submit in person at our headquarters
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
