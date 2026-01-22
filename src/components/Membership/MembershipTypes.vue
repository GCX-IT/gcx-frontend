<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { isDarkMode } from '../../utils/darkMode'

type Membership = {
  code: string
  title: string
  scope: string[]
  requirements: string[]
}

type MembershipWithImage = Membership & { image: string }

const spotTypes: MembershipWithImage[] = [
  {
    code: 'TM',
    title: 'Trading Member (TM)',
    scope: [
      'Can buy and sell all commodities for self only',
      'Can settle all commodities for self only',
    ],
    requirements: [
      'Company registration certificate',
      'Tax clearance certificate / VAT registration certificate',
      'Latest Auditor report',
      'Net worth of GHC 50,000',
      'Signed GCX Risk Disclosure form',
      'GCX Basic membership training certificate',
      'At least one (1) Floor representative',
    ],
    image: '/crop.jpg',
  },
  {
    code: 'BM',
    title: 'Broker Member (BM)',
    scope: [
      'Can buy and sell all commodities for self and other exchange members and non-members (clients)',
      'Can settle all commodities for self and others',
    ],
    requirements: [
      'Company registration certificate',
      'Tax clearance certificate / VAT registration certificate',
      'Latest Auditor report',
      'Net worth of GHC 80,000',
      'Signed GCX Risk Disclosure form',
      'GCX Basic membership training certificate',
      'At least one (1) Floor representative',
      'Member–client agreement for each client (if any)',
    ],
    image: '/trading.jpg',
  },
  {
    code: 'AS',
    title: 'Associate Member (AS)',
    scope: [
      'Special membership for smallholder farmers and traders',
      'Can buy or sell for self only two non-complex commodities (Maize, Rice, Soya, Millet, Sorghum)',
      'Can settle commodities for self only',
      'Trading right for twelve (12) months only; upgraded to TM or BM thereafter',
    ],
    requirements: [
      'Business registration certificate',
      'Tax clearance certificate (TIN number)',
      'Residential address / postal address',
      'National ID card (Voter ID, Passport, etc.)',
      'Signed GCX Risk Disclosure form',
      'GCX Basic membership training certificate',
      'At least one (1) Floor representative',
    ],
    image: '/black man in the farm.jpg',
  },
  {
    code: 'IM',
    title: 'Institutional Member (IM)',
    scope: [
      'Special membership for non-commercial organizations providing services to GCX (e.g., WFP, NAFCO, GGC, MOFA)',
      'Can buy or sell all commodities for self only',
      'Can settle commodities for self only',
    ],
    requirements: [
      'Company registration certificate',
      'Latest Audit/Financial report',
      'Residential address / postal address',
      'Directors National ID card (Voter ID, Passport, etc.)',
      'Signed GCX Risk Disclosure form',
      'GCX Basic membership training certificate',
      'At least one (1) Floor representative',
    ],
    image: '/Picture3.png',
  },
  {
    code: 'FIM',
    title: 'Financial Institutional Member (FIM)',
    scope: [
      'Special membership for financial institutions providing financial services',
      'Cannot buy or sell commodities on the exchange by self',
      'Cannot settle commodities for self on the exchange',
      'Can only buy/sell commodities through BM',
    ],
    requirements: [
      'Company registration certificate',
      'Tax clearance certificate / VAT registration',
      'ID of two Directors',
      'Signed GCX Risk Disclosure form',
      'GCX Basic membership training certificate',
      'At least one (1) Floor representative',
    ],
    image: '/b(1).jpg',
  },
]

const fshs: Membership = {
  code: 'FSHSS',
  title: 'Free SHS Supplier (FSHSS)',
  scope: [
    'Can source and supply GoG Free SHS commodities on behalf of GCX to designated delivery centers nationwide',
  ],
  requirements: [
    'Business registration documents',
    'Tax clearance certificate (TIN number)',
    'Proof of residence (e.g., water bill, light bill)',
    'National ID card (Voter ID, Passport, etc.)',
    'PPA Supplier/Contractor/Consultant Registration Certificate',
    'Certificate / Confirmation of Registration with FDA',
  ],
}
const activeSub = ref<'spot' | 'fshs'>('spot')
const { t } = useI18n()
</script>

<template>
  <div class="rounded-2xl p-6 lg:p-8 border" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
    <!-- Header + Side image -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center mb-6">
      <div class="lg:col-span-2">
        <h2 class="text-3xl lg:text-4xl font-extrabold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">GCX Membership Types</h2>
        <p class="text-lg" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Explore Spot Commodity Contracts and Free SHS Supplier categories.</p>
      </div>
      <div class="hidden lg:block">
        <img src="/trading.jpg" alt="{{ t('navigation.menu.membership') }}" class="w-full h-32 object-cover rounded-xl" loading="lazy" />
      </div>
    </div>

    <!-- Sub navigation -->
    <div class="flex gap-3 mb-6 flex-wrap">
      <button @click="activeSub='spot'"
              class="px-4 py-2 rounded-full text-sm font-semibold border"
              :class="activeSub==='spot' ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300') : (isDarkMode ? 'text-slate-300 border-slate-700 hover:text-yellow-300' : 'text-slate-700 border-slate-300 hover:text-yellow-700')">
        Spot Contracts
      </button>
      <button @click="activeSub='fshs'"
              class="px-4 py-2 rounded-full text-sm font-semibold border"
              :class="activeSub==='fshs' ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300') : (isDarkMode ? 'text-slate-300 border-slate-700 hover:text-yellow-300' : 'text-slate-700 border-slate-300 hover:text-yellow-700')">
        Free SHS Supplier
      </button>
    </div>

    <!-- Spot Types: Alternating image/content layout -->
    <div v-if="activeSub==='spot'" class="space-y-8">
      <div v-for="(m, idx) in spotTypes" :key="m.code"
           class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch rounded-2xl overflow-hidden border"
           :class="isDarkMode ? 'border-slate-700' : 'border-slate-300'">
        <!-- Image side -->
        <div class="relative flex items-center justify-center h-60 lg:h-full"
             :class="[(idx % 2 !== 0) ? 'lg:order-2' : '', isDarkMode ? 'bg-slate-900/5' : 'bg-slate-50']">
          <img :src="m.image" :alt="m.title" class="h-full max-h-80 lg:max-h-full w-auto max-w-full object-contain" loading="lazy" />
        </div>
        <!-- Content side -->
        <div :class="[idx % 2 === 0 ? '' : 'lg:order-1']" class="p-6 lg:p-8"
             :style="{'background': isDarkMode ? 'rgba(2,6,23,0.95)' : 'rgba(255,255,255,0.98)'}">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-2xl lg:text-3xl font-extrabold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ m.title }}</h3>
            <span class="text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide"
                  :class="isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'">{{ m.code }}</span>
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">Scope</h4>
              <div class="text-lg leading-relaxed divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
                <div v-for="s in m.scope" :key="s" class="py-2.5 flex items-start gap-3">
                  <span class="mt-1 text-yellow-600">›</span>
                  <span class="font-semibold">{{ s }}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">Membership requirements</h4>
              <div class="text-lg leading-relaxed divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
                <div v-for="r in m.requirements" :key="r" class="py-2.5 flex items-start gap-3">
                  <span class="mt-1 text-yellow-600">›</span>
                  <span class="font-semibold">{{ r }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Free SHS Supplier -->
    <div v-else class="rounded-xl p-6 border"
         :class="isDarkMode ? 'bg-slate-950 border-slate-700' : 'bg-white border-slate-300'">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-2xl lg:text-3xl font-extrabold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">GCX Membership Types – GoG-GCX Free SHS Supplier Contracts</h3>
      </div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-xl font-bold" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">{{ fshs.title }}</p>
        <span class="text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide"
              :class="isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'">{{ fshs.code }}</span>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">Scope</h4>
          <div class="text-lg divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
            <div v-for="s in fshs.scope" :key="s" class="py-2.5 flex items-start gap-3">
              <span class="mt-1 text-yellow-600">›</span>
              <span class="font-semibold">{{ s }}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 class="text-xl font-extrabold mb-3" :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'">Membership requirement</h4>
          <div class="text-lg divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
            <div v-for="r in fshs.requirements" :key="r" class="py-2.5 flex items-start gap-3">
              <span class="mt-1 text-yellow-600">›</span>
              <span class="font-semibold">{{ r }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>