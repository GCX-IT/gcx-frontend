<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'

const benefits: string[] = [
  'Access to affordable storage of your commodity for up to nine months.',
  'Access to affordable drying, cleaning, weighing facilities to improve the quality and marketability of your commodity.',
  'Access to grading of your commodities so buyers can be informed of your quality and reward you with a higher price than ungraded commodities.',
  'Guarantee the quality and quantity of your commodity for nine months.',
  'Access to warehouse receipts which is a legal document representing your commodity in the quantity and quality you stored them in GCX warehouse.',
  'Access to GCX guarantees for you to get a loan from banks with your stored commodity.',
  'Access to GCX guarantees for you to get inputs from an Input dealer with your stored commodity.',
  'Access to buyers or sellers of commodities in Ghana, West Africa and Globally.',
  'Access to commodity prices and market information to help you sell your commodity.',
  'Guaranteed payment for your sold commodity within 24hours.',
  'Guaranteed delivery of your bought commodity within 24hours',
  'Free access to GCX trading platform from anywhere including your farms, homes, offices etc',
  'You set the prices you want to sell your commodity with any buyer or buyers with the support of GCX staff',
  'Ongoing training and capacity for market actors on how to work with GCX, use of price data, use of market information, storage, warehouse receipts, warehouse receipts financing.',
  'The proceeds from your sales are sent to you via your own bank or your mobile money merchant.',
  'Access to resolving disputes with market actors at no cost to you.',
  'You can buy or sell commodities or do both.',
  'Free use of GCX name, Logo and other marketing tools to promote your business.',
  'Free use of GCX websites to promote your business.',
  'Free membership certificate and membership ID card.',
  'Free use of GCX research data, publications, documents for the purpose of improving your business.',
  'Protection by the Ghana Securities and Exchange Commission acting as Market Arbitrator.',
]

const midpoint = Math.ceil(benefits.length / 2)
const leftBenefits = benefits.slice(0, midpoint)
const rightBenefits = benefits.slice(midpoint)
</script>

<template>
  <div class="rounded-2xl p-6 lg:p-8 border" :class="isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'">
    <h2 class="text-3xl lg:text-4xl font-extrabold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Membership Benefits</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div class="text-lg leading-relaxed divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
          <div v-for="b in leftBenefits" :key="b" class="py-3 flex items-start gap-3">
            <span class="mt-1 text-yellow-600">›</span>
            <span class="font-semibold">{{ b }}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="text-lg leading-relaxed divide-y" :class="isDarkMode ? 'text-slate-300 divide-slate-700' : 'text-slate-800 divide-slate-200'">
          <div v-for="b in rightBenefits" :key="b" class="py-3 flex items-start gap-3">
            <span class="mt-1 text-yellow-600">›</span>
            <span class="font-semibold">{{ b }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>
