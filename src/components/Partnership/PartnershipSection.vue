<template>
  <div v-if="activeCategory === categoryKey">
    <section class="py-12">
      <div class="text-center mb-16">
        <h2 
          class="text-4xl font-bold mb-6 transition-colors duration-300"
          :class="isDarkMode ? 'text-white' : 'text-slate-900'"
        >
          {{ title }}
        </h2>
        <p 
          class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed"
          :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
        >
          {{ description }}
        </p>
      </div>
      
      <!-- Debug Info (remove in production) -->
      <div class="mb-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg text-sm border-2 border-red-300">
        <p><strong>🔍 DEBUG INFO - Partners Section:</strong></p>
        <p>Loading: {{ loading }}</p>
        <p>Error: {{ error || 'None' }}</p>
        <p>API Partners: {{ apiPartners.length }}</p>
        <p>Static Partners: {{ partnershipItems.length }}</p>
        <p>Total Partners: {{ partners.length }}</p>
        <p>Category Key: {{ categoryKey }}</p>
        <p>Active Category: {{ activeCategory }}</p>
        <p>Financial Partners: {{ financialPartners.length }}</p>
        <p>Donor Partners: {{ donorPartners.length }}</p>
        <p>Government Partners: {{ governmentPartners.length }}</p>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-2xl text-green-600"></i>
        <p class="mt-2 text-slate-600 dark:text-slate-400">Loading partners...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <i class="pi pi-exclamation-triangle text-2xl text-red-500"></i>
        <p class="mt-2 text-red-600 dark:text-red-400">{{ error }}</p>
        <p class="mt-2 text-sm text-slate-500">Falling back to static data...</p>
      </div>
      
      <!-- Partnership Cards Grid - Prioritize API data -->
      <div v-else-if="apiPartners.length > 0">
        <p class="text-sm text-green-600 mb-4">✅ Showing {{ apiPartners.length }} partners from API</p>
        <PartnershipGrid 
          :items="apiPartners" 
          :is-dark-mode="isDarkMode" 
        />
      </div>
      
      <!-- Fallback to static data if no API data -->
      <div v-else-if="partnershipItems.length > 0">
        <p class="text-sm text-yellow-600 mb-4">⚠️ Using static fallback data ({{ partnershipItems.length }} partners)</p>
        <PartnershipGrid 
          :items="partnershipItems" 
          :is-dark-mode="isDarkMode" 
        />
      </div>
      
      <!-- No partners message -->
      <div v-else class="text-center py-12">
        <i class="pi pi-handshake text-4xl text-slate-400 mb-4"></i>
        <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No partners found</h3>
        <p class="text-slate-500 dark:text-slate-400">Partners will be displayed here when available.</p>
      </div>
      
      <!-- Category Cards -->
      <div v-if="categoryCards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        <PartnershipCategory
          v-for="card in categoryCards"
          :key="card.title"
          :title="card.title"
          :description="card.description"
          :tags="card.tags"
          :icon-path="card.iconPath"
          :icon-bg-class="card.iconBgClass"
          :tag-classes="card.tagClasses"
          :is-dark-mode="isDarkMode"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import PartnershipGrid from './PartnershipGrid.vue';
import PartnershipCategory from './PartnershipCategory.vue';
import { usePartners } from '../../composables/usePartners'
import { getPartnerLogo } from '../../utils/imageUtils'

interface PartnershipItem {
  imageSrc: string;
  title: string;
}

interface CategoryCard {
  title: string;
  description: string;
  tags: string[];
  iconPath: string;
  iconBgClass: string;
  tagClasses: string;
}

interface Props {
  categoryKey: string;
  activeCategory: string;
  title: string;
  description: string;
  partnershipItems: PartnershipItem[];
  categoryCards?: CategoryCard[];
  isDarkMode: boolean;
}

const props = defineProps<Props>()

// Use partners composable
const { 
  partners, 
  loading, 
  error, 
  financialPartners, 
  donorPartners, 
  governmentPartners, 
  ngoPartners, 
  privatePartners, 
  tenderPartners,
  loadPartnersByCategory 
} = usePartners()

// Get partners for current category
const apiPartners = computed(() => {
  
  let categoryPartners = []
  
  switch (props.categoryKey) {
    case 'partners':
      categoryPartners = financialPartners.value
      break
    case 'donors':
      categoryPartners = donorPartners.value
      break
    case 'government':
      categoryPartners = governmentPartners.value
      break
    case 'ngos':
      categoryPartners = ngoPartners.value
      break
    case 'private':
      categoryPartners = privatePartners.value
      break
    case 'tenders':
      categoryPartners = tenderPartners.value
      break
    default:
      categoryPartners = []
  }
  
  
  return categoryPartners.map(partner => ({
    imageSrc: partner.logo || getDefaultLogo(props.categoryKey),
    title: partner.name
  }))
})

// Helper function to get default logo based on category
const getDefaultLogo = (category: string) => {
  const logoMap: Record<string, string> = {
    'partners': 'Partners/1-ukaid.jpg',
    'donors': 'Donors/1-ukaid.jpg', // Use existing image
    'government': 'government/ghana-exim-bank.jpg', // Use existing image
    'ngos': 'NGO/6-ciag.jpg', // Use existing image
    'private': 'Private/ipmc.jpg', // Use existing image
    'tenders': 'Partners/1-ukaid.jpg' // Use existing image
  }
  return getPartnerLogo(logoMap[category] || 'Partners/1-ukaid.jpg')
}

// Load partners when component mounts
onMounted(() => {
  loadPartnersByCategory(props.categoryKey)
})
</script>
