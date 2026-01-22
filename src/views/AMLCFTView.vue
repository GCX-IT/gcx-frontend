<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'

type Tab = { label: string; key: string }
const tabs: Tab[] = [
  { label: 'Requirements', key: 'requirements' },
  { label: 'Self Assessment Forms', key: 'assessment-forms' },
  { label: 'Client Guidelines', key: 'client-guidelines' },
]

const route = useRoute()
const router = useRouter()
const activeTab = ref<string>('requirements')

const setActiveFromHash = () => {
  const hash = (route.hash || '').replace('#', '')
  if (tabs.some(t => t.key === hash)) {
    activeTab.value = hash
  } else {
    activeTab.value = 'requirements'
  }
}

const switchTab = async (key: string) => {
  activeTab.value = key
  router.replace({ hash: `#${key}` })
  await nextTick()
  const el = document.getElementById(`tab-${key}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(() => setActiveFromHash())
watch(() => route.hash, setActiveFromHash)
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section -->
    <section class="relative py-14 lg:py-20 overflow-hidden"
      :class="isDarkMode
        ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-yellow-100 via-white to-yellow-50'">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
        <div class="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-20"></div>
        <div class="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-30"></div>
      </div>

      <div class="relative max-w-[1600px] mx-auto px-4 text-center">
        <h1 class="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-sm">
          AML/CFT Supervisory
        </h1>
        <p class="text-lg lg:text-2xl max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
          Anti-Money Laundering and Counter Financing of Terrorism compliance and guidelines
        </p>
      </div>
    </section>

    <!-- Tabs Navigation -->
    <section class="sticky top-20 z-40 border-b shadow-sm transition-colors duration-300"
      :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-wrap gap-2 overflow-x-auto py-4">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="switchTab(tab.key)"
            class="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap"
            :class="activeTab === tab.key
              ? isDarkMode
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'bg-yellow-500 text-black shadow-lg'
              : isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Tab Content -->
    <section class="py-12" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
      <div class="max-w-7xl mx-auto px-4">
        
        <!-- Requirements Tab -->
        <div id="tab-requirements" v-show="activeTab === 'requirements'" class="space-y-6">
          <div class="rounded-2xl p-8 shadow-lg border transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
            <h2 class="text-3xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              AML/CFT Requirements
            </h2>
            
            <div class="space-y-6">
              <div class="prose max-w-none" :class="isDarkMode ? 'prose-invert' : ''">
                <p class="text-lg leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  The Ghana Commodity Exchange (GCX) is committed to maintaining the highest standards of compliance with Anti-Money Laundering (AML) and Counter Financing of Terrorism (CFT) regulations. All members and participants are required to adhere to the following requirements:
                </p>

                <div class="space-y-4">
                  <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                    <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                      1. Customer Due Diligence (CDD)
                    </h3>
                    <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      <li>Verify the identity of all customers before establishing a business relationship</li>
                      <li>Maintain up-to-date customer identification records</li>
                      <li>Conduct ongoing monitoring of customer transactions</li>
                      <li>Perform enhanced due diligence for high-risk customers</li>
                    </ul>
                  </div>

                  <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                    <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                      2. Transaction Monitoring
                    </h3>
                    <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      <li>Monitor all transactions for suspicious activities</li>
                      <li>Report suspicious transactions to the Financial Intelligence Centre (FIC)</li>
                      <li>Maintain transaction records for a minimum of 5 years</li>
                      <li>Implement automated monitoring systems where applicable</li>
                    </ul>
                  </div>

                  <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                    <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                      3. Record Keeping
                    </h3>
                    <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      <li>Maintain comprehensive records of all customer transactions</li>
                      <li>Keep identification documents and verification records</li>
                      <li>Store records securely and ensure accessibility for regulatory inspections</li>
                      <li>Retain records as required by law</li>
                    </ul>
                  </div>

                  <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                    <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                      4. Training and Awareness
                    </h3>
                    <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      <li>Provide regular AML/CFT training to all staff members</li>
                      <li>Ensure staff are aware of their obligations and responsibilities</li>
                      <li>Keep abreast of regulatory changes and updates</li>
                      <li>Maintain training records and certifications</li>
                    </ul>
                  </div>

                  <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                    <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                      5. Compliance Officer
                    </h3>
                    <ul class="list-disc list-inside space-y-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      <li>Appoint a designated Compliance Officer</li>
                      <li>Ensure the Compliance Officer has appropriate authority and resources</li>
                      <li>Regular reporting to senior management on compliance matters</li>
                      <li>Liaison with regulatory authorities as required</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Self Assessment Forms Tab -->
        <div id="tab-assessment-forms" v-show="activeTab === 'assessment-forms'" class="space-y-6">
          <div class="rounded-2xl p-8 shadow-lg border transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
            <h2 class="text-3xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Self Assessment Forms
            </h2>
            
            <div class="space-y-6">
              <p class="text-lg leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Use these self-assessment forms to evaluate your organization's AML/CFT compliance. Download, complete, and submit the relevant forms as required.
              </p>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                  :class="isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-300'">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                      :class="isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    AML/CFT Compliance Assessment Form
                  </h3>
                  <p class="mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Comprehensive self-assessment form covering all AML/CFT requirements and compliance measures.
                  </p>
                  <button class="px-4 py-2 rounded-lg font-medium transition-all"
                    :class="isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'">
                    Download PDF
                  </button>
                </div>

                <div class="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                  :class="isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-300'">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                      :class="isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    Risk Assessment Form
                  </h3>
                  <p class="mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Evaluate your organization's risk profile and identify areas requiring enhanced due diligence.
                  </p>
                  <button class="px-4 py-2 rounded-lg font-medium transition-all"
                    :class="isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'">
                    Download PDF
                  </button>
                </div>

                <div class="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                  :class="isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-300'">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                      :class="isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    Training Record Form
                  </h3>
                  <p class="mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Document AML/CFT training sessions and staff certifications for compliance records.
                  </p>
                  <button class="px-4 py-2 rounded-lg font-medium transition-all"
                    :class="isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'">
                    Download PDF
                  </button>
                </div>

                <div class="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
                  :class="isDarkMode ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-white border-gray-200 hover:border-yellow-300'">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                      :class="isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'">
                      <svg class="w-6 h-6" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    Suspicious Transaction Report Form
                  </h3>
                  <p class="mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Standard form for reporting suspicious transactions to the Financial Intelligence Centre.
                  </p>
                  <button class="px-4 py-2 rounded-lg font-medium transition-all"
                    :class="isDarkMode ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-yellow-500 hover:bg-yellow-600 text-black'">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Guidelines Tab -->
        <div id="tab-client-guidelines" v-show="activeTab === 'client-guidelines'" class="space-y-6">
          <div class="rounded-2xl p-8 shadow-lg border transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'">
            <h2 class="text-3xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Client Guidelines
            </h2>
            
            <div class="space-y-6">
              <p class="text-lg leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                These guidelines provide essential information for clients and members regarding AML/CFT compliance requirements and best practices.
              </p>

              <div class="space-y-4">
                <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                  <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                    Know Your Customer (KYC) Procedures
                  </h3>
                  <p class="mb-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    All clients must provide the following documentation:
                  </p>
                  <ul class="list-disc list-inside space-y-2 ml-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    <li>Valid government-issued identification (National ID, Passport, or Driver's License)</li>
                    <li>Proof of address (utility bill, bank statement, or lease agreement not older than 3 months)</li>
                    <li>Business registration documents (for corporate clients)</li>
                    <li>Tax identification number (TIN)</li>
                    <li>Source of funds declaration</li>
                  </ul>
                </div>

                <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                  <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                    Transaction Limits and Reporting
                  </h3>
                  <ul class="list-disc list-inside space-y-2 ml-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    <li>Transactions exceeding GHS 10,000 require enhanced due diligence</li>
                    <li>Cash transactions above GHS 5,000 must be reported</li>
                    <li>Unusual or suspicious patterns will trigger compliance review</li>
                    <li>Clients must cooperate with compliance investigations</li>
                  </ul>
                </div>

                <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                  <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                    Prohibited Activities
                  </h3>
                  <ul class="list-disc list-inside space-y-2 ml-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    <li>Transactions with sanctioned individuals or entities</li>
                    <li>Structuring transactions to avoid reporting requirements</li>
                    <li>Use of the platform for money laundering or terrorist financing</li>
                    <li>Providing false or misleading information</li>
                    <li>Failure to comply with AML/CFT requirements</li>
                  </ul>
                </div>

                <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                  <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                    Client Responsibilities
                  </h3>
                  <ul class="list-disc list-inside space-y-2 ml-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    <li>Keep your account information up to date</li>
                    <li>Report any changes in circumstances that may affect your risk profile</li>
                    <li>Respond promptly to requests for additional information</li>
                    <li>Notify GCX immediately of any suspicious activity</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </div>

                <div class="p-6 rounded-xl border" :class="isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-yellow-50 border-yellow-200'">
                  <h3 class="text-xl font-semibold mb-3" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
                    Contact Information
                  </h3>
                  <p class="mb-3" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    For questions or concerns regarding AML/CFT compliance:
                  </p>
                  <ul class="list-none space-y-2 ml-4" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    <li class="flex items-center">
                      <svg class="w-5 h-5 mr-2" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Email: compliance@gcx.com.gh
                    </li>
                    <li class="flex items-center">
                      <svg class="w-5 h-5 mr-2" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Phone: +233 XXX XXX XXXX
                    </li>
                    <li class="flex items-center">
                      <svg class="w-5 h-5 mr-2" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Address: Ghana Commodity Exchange, Accra, Ghana
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

