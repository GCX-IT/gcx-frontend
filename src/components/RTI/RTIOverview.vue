<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
</script>

<template>
  <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Right to Information Act, 2019
        </h2>
        <p class="text-xl max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
          Understanding your constitutional right to access information
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Constitutional Right -->
        <div class="space-y-8">
          <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
                <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  Constitutional Right
                </h3>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  Article 21 (1) (f) of the Constitution of Ghana
                </p>
              </div>
            </div>
            
            <blockquote class="text-lg leading-relaxed mb-6 p-4 rounded-lg" :class="isDarkMode ? 'bg-slate-700/50 text-slate-200' : 'bg-slate-50 text-slate-700'">
              "All persons shall have the right to information, subject to such qualifications and laws as are necessary in a democratic society."
            </blockquote>
            
            <p class="text-lg leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              This means every person in the jurisdiction of Ghana, citizen or non-citizen has the right to information. It is in line with this regulation that Ghana Commodity Exchange has set up the Right to Information (RTI) Unit.
            </p>
          </div>
        </div>

        <!-- GCX RTI Unit -->
        <div class="space-y-8">
          <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <div class="flex items-start gap-4 mb-6">
              <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
                <svg class="w-6 h-6" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  GCX RTI Unit
                </h3>
                <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  Professional Service & Support
                </p>
              </div>
            </div>
            
            <p class="text-lg leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Ghana Commodity Exchange has established the Right to Information (RTI) Unit, spearheaded by the Communications and Corporate Affairs Department, assisted by an RTI officer who have been trained to process applications for access to information.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></div>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Trained RTI officers for professional service
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></div>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Streamlined application processing
                </span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="isDarkMode ? 'bg-green-400' : 'bg-green-500'"></div>
                <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Transparent and accountable processes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Principles -->
      <div class="mt-16">
        <h3 class="text-3xl font-bold text-center mb-12" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          Key Principles
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-2xl" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
              <svg class="w-8 h-8" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Transparency
            </h4>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Open and clear processes for information access
            </p>
          </div>
          
          <div class="text-center p-6 rounded-2xl" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" :class="isDarkMode ? 'bg-green-600' : 'bg-green-100'">
              <svg class="w-8 h-8" :class="isDarkMode ? 'text-white' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Accountability
            </h4>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Responsible handling of information requests
            </p>
          </div>
          
          <div class="text-center p-6 rounded-2xl" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" :class="isDarkMode ? 'bg-red-600' : 'bg-red-100'">
              <svg class="w-8 h-8" :class="isDarkMode ? 'text-white' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Protection
            </h4>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Safeguarding public interest and privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
