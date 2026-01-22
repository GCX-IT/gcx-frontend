<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h2 class="text-3xl lg:text-4xl font-extrabold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        GCX Membership Program
      </h2>
      <p class="text-lg max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        GCX is a membership-based organization. All buyers, sellers and stakeholders are required to subscribe to GCX Membership Program prior to trading or working with the Exchange.
      </p>
    </div>

    <!-- Application Process Steps -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-blue-600/20' : 'bg-blue-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Application Process</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Step 1 -->
        <div class="relative">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500">
              1
            </div>
            <div class="flex-1">
              <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Download Application Form</h4>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Application forms are available from the GCX office or can be downloaded using the link on the GCX website (www.gcx.com.gh/membershipforms).
              </p>
            </div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="relative">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500">
              2
            </div>
            <div class="flex-1">
              <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Complete & Submit Application</h4>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Complete the membership application form and submit it along with required documents and an Application Processing Fee of GHC 50.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="relative">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500">
              3
            </div>
            <div class="flex-1">
              <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Application Review</h4>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                All applicants will be notified within 30 days of submission about the outcome. Successful applicants will be required to pay GCX Membership fees.
              </p>
            </div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="relative">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-blue-500">
              4
            </div>
            <div class="flex-1">
              <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Training & Onboarding</h4>
              <p class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                All successful GCX members will undergo initial training on Exchange products and services, rules and regulations, and trading through the Exchange.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Membership Requirements -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-green-600/20' : 'bg-green-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-green-400' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Required Documents</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Certified copy of Company / Cooperative Registration Certificate</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Certified copy of Companies Regulations</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Board Resolution on appointing authorized signatories</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Education qualification certificates of authorized signatories</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Proof of experience of authorized signatories (CVs)</span>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Bank account details and current Bank Statement (6 months)</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Copy of tax clearance certificate / VAT registration</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Two latest passport-size colored photographs</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Current police report of authorized signatories</span>
          </div>
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Latest Auditors Report</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Membership Fees -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-yellow-600/20' : 'bg-yellow-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership Fees</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b-2" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <th class="text-left py-3 px-4 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Member Type</th>
              <th class="text-left py-3 px-4 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Admission Fee</th>
              <th class="text-left py-3 px-4 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Annual Renewal Fee</th>
              <th class="text-left py-3 px-4 font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Processing Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4 font-semibold text-green-600">GHC 50</td>
            </tr>
            <tr class="border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4 font-semibold text-green-600">GHC 50</td>
            </tr>
            <tr class="border-b" :class="isDarkMode ? 'border-slate-700' : 'border-slate-200'">
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">TBD</td>
              <td class="py-3 px-4 font-semibold text-green-600">GHC 50</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-sm mt-4 italic" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
        * Special arrangements available for traders with payment difficulties. Contact the Exchange for details.
      </p>
    </div>

    <!-- Member Benefits -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-purple-600/20' : 'bg-purple-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-purple-400' : 'text-purple-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Member Benefits</h3>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Quality & Quantity Guarantee -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-green-500/10">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Quality & Quantity Guarantee</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Guarantee of quality & quantity of commodities traded</li>
            <li>• Facilities for grain enhancement (drying, cleaning, weighing)</li>
            <li>• Grading of grains for quality-based pricing</li>
            <li>• World-class collateral management backing</li>
          </ul>
        </div>

        <!-- Warehouse Receipting -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-blue-500/10">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Warehouse Receipting</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Convert crops into tradable electronic form</li>
            <li>• Transfer ownership to multiple buyers</li>
            <li>• Use crops as collateral for bank loans</li>
          </ul>
        </div>

        <!-- Electronic Trading Platform -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-purple-500/10">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Electronic Trading Platform</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Trade from anywhere in the world</li>
            <li>• Direct buyer-seller price negotiation</li>
            <li>• Real-time price information</li>
            <li>• Payment within 5 days via bank transfer</li>
          </ul>
        </div>

        <!-- Market Access -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-orange-500/10">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Market Access</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Direct partnership with producers</li>
            <li>• Exchange-certified warehouses</li>
            <li>• Network expansion across West Africa</li>
            <li>• 1:3 seller-to-buyer ratio target</li>
          </ul>
        </div>

        <!-- Financing Access -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-emerald-500/10">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Financing Access</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Liaison between banks and farmers</li>
            <li>• Improved financial inclusion</li>
            <li>• Working capital assistance</li>
          </ul>
        </div>

        <!-- Capacity Building -->
        <div class="p-4 rounded-xl border" :class="isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-indigo-500/10">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h4 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Capacity Building</h4>
          </div>
          <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            <li>• Modern grain-handling training</li>
            <li>• Quality improvement programs</li>
            <li>• Reduced lending risks for banks</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div class="rounded-2xl p-6 lg:p-8 border-2" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 rounded-xl" :class="isDarkMode ? 'bg-red-600/20' : 'bg-red-500/10'">
          <svg class="w-6 h-6" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Contact Information</h3>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership & Business Development Manager</h4>
            <div class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <p><strong>Office:</strong> 2nd Floor - Africa Trade House</p>
              <p>Ambassadorial Enclave Off Liberia Road Ridge</p>
              <p>Accra Ghana - West Africa</p>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Contact Details</h4>
            <div class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <p><strong>Phone:</strong> 0302-690670 / 0302-690674 / 0302-690675</p>
              <p><strong>Email:</strong> richard@gcx.com.gh / membership@gcx.com.gh</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Important Notes</h4>
            <div class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              <p>• Prior to trading, all new members must be approved by the Ghana Securities and Exchange Commission (SEC)</p>
              <p>• All GCX members will be assigned a GCX Identification Number (ID number), GCX ID card, and GCX Membership Certificate</p>
              <p>• Membership shall be subject to renewal every two years at the GCX applicable rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


