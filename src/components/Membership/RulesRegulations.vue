<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h2 class="text-3xl lg:text-4xl font-extrabold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        Rules & Regulations
      </h2>
      <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        Key rules governing membership and exchange operations. Download the complete GCX Rules & Obligations document for detailed information.
      </p>
    </div>

    <!-- Download Card -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">GCX Rules & Obligations</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6 items-center">
        <div class="space-y-4">
          <div class="space-y-3">
            <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Complete membership rules and regulations</span>
            </div>
            <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Trading guidelines and procedures</span>
            </div>
            <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Compliance and conduct standards</span>
            </div>
            <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span>Dispute resolution procedures</span>
            </div>
          </div>
          
          <div class="p-4 rounded-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'">
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <strong>Important:</strong> All members must familiarize themselves with these rules and regulations before engaging in any trading activities on the exchange.
            </p>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div class="mb-4 p-6 rounded-xl border-2 border-dashed" :class="isDarkMode ? 'border-yellow-600/30 bg-yellow-900/10' : 'border-yellow-300 bg-yellow-50'">
            <svg class="w-16 h-16 mx-auto mb-3" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p class="text-center text-sm font-medium" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-700'">Official Document</p>
            <p class="text-center text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">PDF Format</p>
          </div>
          
          <a href="/gcx_rules_obligations.pdf" target="_blank"
             class="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg"
             :class="isDarkMode ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-600/25' : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/25'">
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Download Rules & Obligations</span>
            <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>
      </div>
    </div>

    <!-- Key Rules Overview -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-blue-600/20' : 'bg-blue-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Key Rules Overview</h3>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Trading Rules -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-green-500/10">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Trading Rules</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Standardized trading procedures</li>
            <li>• Price discovery mechanisms</li>
            <li>• Order matching protocols</li>
            <li>• Settlement requirements</li>
          </ul>
        </div>

        <!-- Membership Rules -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-blue-500/10">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership Rules</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Eligibility requirements</li>
            <li>• Application procedures</li>
            <li>• Membership obligations</li>
            <li>• Renewal processes</li>
          </ul>
        </div>

        <!-- Compliance Rules -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-purple-500/10">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Compliance Rules</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Regulatory compliance</li>
            <li>• Reporting requirements</li>
            <li>• Audit procedures</li>
            <li>• Penalty structures</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-orange-600/20' : 'bg-orange-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-orange-400' : 'text-orange-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Additional Information</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Document Updates</h4>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Rules and regulations are periodically updated to reflect changes in market conditions, regulatory requirements, and exchange operations. Members are notified of any changes through official channels.
            </p>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Questions & Clarifications</h4>
            <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              For questions about specific rules or regulations, please contact the GCX compliance department or refer to the contact information provided in the downloadable document.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


