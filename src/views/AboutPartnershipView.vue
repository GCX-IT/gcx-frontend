<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isDarkMode } from '../utils/darkMode';
import { getPartnersByCategory, type Partner } from '../services/partnerService';

// Router
const route = useRoute();
const router = useRouter();

// Active category
const activeCategory = ref('partners');

// State
const loading = ref(true);
const error = ref<string | null>(null);
const partnersData = ref<Record<string, Partner[]>>({
  partners: [],
  donors: [],
  government: [],
  ngos: [],
  private: [],
  tenders: []
});

// Partnership categories - map display keys to backend category values
const partnershipCategories = [
  { label: 'Financial Institutions', key: 'partners', backendKey: 'financial' },
  { label: 'Donor Agencies', key: 'donors', backendKey: 'donor' },
  { label: 'Government Agencies', key: 'government', backendKey: 'government' },
  { label: 'NGOs', key: 'ngos', backendKey: 'ngo' },
  { label: 'Private Agencies', key: 'private', backendKey: 'private' },
  { label: 'Tenders & Procurement', key: 'tenders', backendKey: 'tender' },
];

// Fetch partners by category
const fetchPartnersByCategory = async (displayKey: string) => {
  const category = partnershipCategories.find(c => c.key === displayKey);
  if (!category) return;

  try {
    loading.value = true;
    error.value = null;
    const data = await getPartnersByCategory(category.backendKey);
    partnersData.value[displayKey] = data;
  } catch (err: any) {
    console.error(`Failed to fetch ${displayKey} partners:`, err);
    error.value = `Failed to load ${category.label}`;
  } finally {
    loading.value = false;
  }
};

// Get partners for current category
const currentPartners = computed(() => {
  return partnersData.value[activeCategory.value] || [];
});

// Donor category cards
const donorCategoryCards = [
  {
    title: 'International Development',
    description: 'Strategic partnerships with major international development agencies providing funding and technical expertise.',
    tags: ['Funding', 'Technical Support'],
    iconPath: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBgClass: 'from-blue-500 to-blue-600',
    tagClasses: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  },
  {
    title: 'Agricultural Development',
    description: 'Collaboration with specialized agricultural development organizations to enhance farming practices and market access.',
    tags: ['Capacity Building', 'Market Access'],
    iconPath: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    iconBgClass: 'from-green-500 to-green-600',
    tagClasses: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  },
  {
    title: 'UN Agencies',
    description: 'Partnerships with United Nations agencies supporting sustainable development goals and humanitarian assistance.',
    tags: ['SDG Support', 'Humanitarian Aid'],
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    iconBgClass: 'from-yellow-500 to-yellow-600',
    tagClasses: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
  }
];

// Government Agencies data
const governmentAgencies = [
  { imageSrc: '/government/youth-in-agriculture-programme-yiap.png', title: 'Youth in Agriculture Programme' },
  { imageSrc: '/government/ghana-incentive-based-risk-sharing-system-for-agricultural-lending-girsal.png', title: 'Ghana Incentive-Based Risk-Sharing System for Agricultural Lending' },
  { imageSrc: '/government/ghana-investment-promotion-centregipc.png', title: 'Ghana Investment Promotion Centre' },
  { imageSrc: '/government/ghana-export-promotion-authority-gepa.png', title: 'Ghana Export Promotion Authority' },
  { imageSrc: '/government/ghana-exim-bank.jpg', title: 'Ghana Export-Import Bank' },
  { imageSrc: '/government/ministry-of-finance-and-economic-planning-100.png', title: 'Ministry of Finance and Economic Planning' },
  { imageSrc: '/government/ministry-of-trade-and-industry-moti-100.png', title: 'Ministry of Trade and Industry' },
];

// NGOs data
const ngos = [
  { imageSrc: '/NGO/ghana-made.png', title: 'Ghana Made' },
  { imageSrc: '/NGO/pef.png', title: 'PEF' },
  { imageSrc: '/NGO/aflasafe2.png', title: 'Aflasafe' },
  { imageSrc: '/NGO/socodevi.jpeg', title: 'Socodevi' },
  { imageSrc: '/NGO/ghana-national-chamber-of-commerce-and-industry.jpg', title: 'Ghana National Chamber of Commerce and Industry' },
  { imageSrc: '/NGO/6-ciag.jpg', title: 'CIAG' },
  { imageSrc: '/NGO/africa-cashew-alliance.png', title: 'Africa Cashew Alliance' },
  { imageSrc: '/NGO/ghana-rice-inter-professional-body-grib.png', title: 'Ghana Rice Inter-Professional Body' },
  { imageSrc: '/NGO/peasant-farmers-association-of-ghana-pfag.jpg', title: 'Peasant Farmers Association of Ghana' },
  { imageSrc: '/NGO/the-john-a-kufuor-foundation.jpg', title: 'The John A. Kufuor Foundation' },
  { imageSrc: '/NGO/iita.png', title: 'IITA' },
];

// Private Agencies data
const privateAgencies = [
  { imageSrc: '/Private/dmt-collateral.png', title: 'DMT Collateral' },
  { imageSrc: '/Private/intervalle-geneve.png', title: 'Intervalle Geneve' },
  { imageSrc: '/Private/wienco.jpg', title: 'Wienco' },
  { imageSrc: '/Private/tatf.png', title: 'TATF' },
  { imageSrc: '/Private/dess-inc.png', title: 'DESS Inc' },
  { imageSrc: '/Private/ipmc.jpg', title: 'IPMC' },
  { imageSrc: '/Private/ghana-grains-council-ggc.png', title: 'Ghana Grains Council' },
];

// Tender items data - actual procurement opportunities
const tenderItems = [
  { 
    id: 1, 
    title: 'IT Infrastructure Development', 
    tenderId: 'GCX-IT-2024-001', 
    status: 'Open', 
    category: 'Information Technology', 
    deadline: '2024-03-31', 
    budget: 'GH₵ 2,500,000', 
    description: 'Development of comprehensive IT infrastructure including trading platform upgrades, data management systems, and cybersecurity enhancements.' 
  },
  { 
    id: 2, 
    title: 'Market Research & Analytics Services', 
    tenderId: 'GCX-RESEARCH-2024-002', 
    status: 'Closing Soon', 
    category: 'Research & Analytics', 
    deadline: '2024-02-15', 
    budget: 'GH₵ 800,000', 
    description: 'Comprehensive market research services for agricultural commodities, price trend analysis, and market intelligence reports.' 
  },
  { 
    id: 3, 
    title: 'Warehouse Management System', 
    tenderId: 'GCX-WAREHOUSE-2024-003', 
    status: 'Open', 
    category: 'Logistics & Storage', 
    deadline: '2024-04-30', 
    budget: 'GH₵ 1,200,000', 
    description: 'Implementation of warehouse management system for commodity storage facilities across multiple locations in Ghana.' 
  },
  { 
    id: 4, 
    title: 'Legal Advisory Services', 
    tenderId: 'GCX-LEGAL-2024-004', 
    status: 'Open', 
    category: 'Legal Services', 
    deadline: '2024-05-31', 
    budget: 'GH₵ 600,000', 
    description: 'Legal advisory services for regulatory compliance, contract management, and dispute resolution in commodity trading.' 
  },
  { 
    id: 5, 
    title: 'Training & Capacity Building', 
    tenderId: 'GCX-TRAINING-2024-005', 
    status: 'Closing Soon', 
    category: 'Education & Training', 
    deadline: '2024-02-28', 
    budget: 'GH₵ 400,000', 
    description: 'Training programs for traders, farmers, and stakeholders on commodity exchange operations and best practices.' 
  },
  { 
    id: 6, 
    title: 'Financial Audit Services', 
    tenderId: 'GCX-AUDIT-2024-006', 
    status: 'Open', 
    category: 'Financial Services', 
    deadline: '2024-06-30', 
    budget: 'GH₵ 350,000', 
    description: 'Annual financial audit services including internal controls assessment and compliance reporting.' 
  },
];

// Methods
const updateActiveCategory = (category: string) => {
  activeCategory.value = category;
  router.replace({ hash: `#${category}` });
  // Fetch data if not already loaded
  if (partnersData.value[category].length === 0) {
    fetchPartnersByCategory(category);
  }
};

// Hash-based navigation
const setActiveFromHash = () => {
  if (route.hash) {
    const hash = route.hash.substring(1);
    if (partnershipCategories.some(cat => cat.key === hash)) {
      activeCategory.value = hash;
    }
  }
};

// Lifecycle
onMounted(() => {
  setActiveFromHash();
  // Fetch data for initial category
  fetchPartnersByCategory(activeCategory.value);
});

// Watch for route hash changes
watch(() => route.hash, () => {
  setActiveFromHash();
});

// Watch for category changes
watch(activeCategory, (newCategory) => {
  if (partnersData.value[newCategory].length === 0) {
    fetchPartnersByCategory(newCategory);
  }
});
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 transition-colors duration-300 overflow-hidden" :class="isDarkMode ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-yellow-50 via-white to-yellow-50'">
      <!-- Background Elements -->
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-10 left-10 w-72 h-72 bg-yellow-200 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
        <div class="absolute top-0 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-400 dark:bg-yellow-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div class="relative max-w-[1600px] mx-auto px-4">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Badge -->
          <div class="mb-6">
            <span class="inline-block px-4 py-2 transition-colors duration-300 rounded-full text-sm font-semibold shadow-lg" :class="isDarkMode ? 'bg-yellow-900/80 text-yellow-200' : 'bg-yellow-100/90 text-yellow-800'">
              Strategic Partnerships
            </span>
          </div>
          
          <!-- Main Heading -->
          <h1 class="text-4xl lg:text-6xl font-bold mb-6 transition-colors duration-300 drop-shadow-lg" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            <span class="block bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 bg-clip-text text-transparent">
              Partnerships
            </span>
          </h1>
          
          <!-- Description -->
          <p class="text-lg lg:text-xl font-bold transition-colors duration-300 leading-relaxed mb-8 drop-shadow-lg" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Building strong collaborative relationships with financial institutions, donor agencies, government bodies, and private sector organizations to drive sustainable agricultural development and market growth in Ghana.
          </p>
        </div>
      </div>
    </section>
    
    <!-- Partnership Tabs -->
    <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-20 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap gap-2 py-4 overflow-x-auto">
          <button
            v-for="category in partnershipCategories"
            :key="category.key"
            @click="updateActiveCategory(category.key)"
            :class="[
              'px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap',
              activeCategory === category.key
                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            ]"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Partnership Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <!-- Financial Institutions Section -->
      <div v-if="activeCategory === 'partners'" class="py-12">
        <section class="py-12">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Financial Institutions
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Strategic partnerships with major financial institutions providing funding, risk management, and financial services to support agricultural development and market growth.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600">{{ error }}</p>
          </div>

          <!-- No Partners State -->
          <div v-else-if="currentPartners.length === 0" class="text-center py-12">
            <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">No partners available in this category</p>
          </div>

          <!-- Partnership Cards Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            <div 
              v-for="item in currentPartners"
              :key="item.id"
              class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 mb-4 flex items-center justify-center">
                  <img :src="item.logo" :alt="item.name" class="max-w-full max-h-full object-contain" @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'" />
                </div>
                <h4 
                  class="text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.name }}
                </h4>
                <p v-if="item.description" class="text-xs mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Donor Agencies Section -->
      <div v-if="activeCategory === 'donors'" class="py-12">
        <section class="py-12">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Donor Agencies
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Collaborative partnerships with international donor agencies providing funding, technical expertise, and capacity building support for sustainable development initiatives.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
          </div>

          <!-- Partnership Cards Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            <div 
              v-for="item in currentPartners"
              :key="item.id"
              class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 mb-4 flex items-center justify-center">
                  <img :src="item.logo" :alt="item.name" class="max-w-full max-h-full object-contain" @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'" />
                </div>
                <h4 
                  class="text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.name }}
                </h4>
                <p v-if="item.description" class="text-xs mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
          
          
          <!-- Category Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="card in donorCategoryCards"
              :key="card.title"
              class="transition-colors duration-300 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'"
            >
              <div class="w-20 h-20 bg-gradient-to-br rounded-2xl mx-auto mb-6 flex items-center justify-center"
                   :class="card.iconBgClass">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.iconPath" />
                </svg>
              </div>
              <h3 
                class="text-xl font-bold transition-colors duration-300 mb-4 text-center"
                :class="isDarkMode ? 'text-white' : 'text-slate-900'"
              >
                {{ card.title }}
              </h3>
              <p 
                class="transition-colors duration-300 text-center mb-4"
                :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              >
                {{ card.description }}
              </p>
              <div class="flex flex-wrap gap-2 justify-center">
                <span 
                  v-for="tag in card.tags" 
                  :key="tag"
                  class="px-3 py-1 text-xs rounded-full"
                  :class="card.tagClasses"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Government Agencies Section -->
      <div v-if="activeCategory === 'government'" class="py-12">
        <section class="py-12">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Government Agencies
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Collaborative partnerships with government institutions to support policy development and regulatory compliance.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
          </div>

          <!-- Partnership Cards Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            <div 
              v-for="item in currentPartners"
              :key="item.id"
              class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 mb-4 flex items-center justify-center">
                  <img :src="item.logo" :alt="item.name" class="max-w-full max-h-full object-contain" @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'" />
                </div>
                <h4 
                  class="text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.name }}
                </h4>
                <p v-if="item.description" class="text-xs mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- NGOs Section -->
      <div v-if="activeCategory === 'ngos'" class="py-12">
        <section class="py-12">
                     <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Non-Governmental Organizations
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Partnerships with NGOs focused on community development, capacity building, and sustainable agricultural practices.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
          </div>

          <!-- Partnership Cards Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            <div 
              v-for="item in currentPartners"
              :key="item.id"
              class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 mb-4 flex items-center justify-center">
                  <img :src="item.logo" :alt="item.name" class="max-w-full max-h-full object-contain" @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'" />
                </div>
                <h4 
                  class="text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.name }}
                </h4>
                <p v-if="item.description" class="text-xs mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Private Agencies Section -->
      <div v-if="activeCategory === 'private'" class="py-12">
        <section class="py-12">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Private Agencies
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Collaborations with private sector organizations to drive innovation, investment, and market development.
            </p>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
          </div>

          <!-- Partnership Cards Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            <div 
              v-for="item in currentPartners"
              :key="item.id"
              class="transition-colors duration-300 rounded-2xl p-6 shadow-lg border hover:shadow-xl hover:scale-105 transform transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 mb-4 flex items-center justify-center">
                  <img :src="item.logo" :alt="item.name" class="max-w-full max-h-full object-contain" @error="(e) => (e.target as HTMLImageElement).src = '/Picture3.png'" />
                </div>
                <h4 
                  class="text-sm font-semibold transition-colors duration-300"
                  :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                >
                  {{ item.name }}
                </h4>
                <p v-if="item.description" class="text-xs mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <!-- Tenders & Procurement Section -->
      <div v-if="activeCategory === 'tenders'" class="py-12">
        <section class="py-12">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Tenders & Procurement
            </h2>
            <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Current procurement opportunities and tenders. Submit your proposals to provide goods and services supporting our operations and development initiatives.
            </p>
          </div>
          
          <!-- Procurement Opportunities Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div 
              v-for="tender in tenderItems"
              :key="tender.id"
              class="transition-colors duration-300 rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300"
              :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-100 hover:bg-slate-50'"
            >
              <!-- Tender Header -->
              <div class="flex items-start justify-between mb-6">
                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                    {{ tender.title }}
                  </h3>
                  <p class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Tender ID: {{ tender.tenderId }}
                  </p>
                </div>
                <div class="ml-4">
                  <span 
                    class="px-3 py-1 text-xs font-semibold rounded-full"
                    :class="tender.status === 'Open' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 
                           tender.status === 'Closing Soon' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                           'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'"
                  >
                    {{ tender.status }}
                  </span>
                </div>
              </div>
              
              <!-- Tender Details -->
              <div class="space-y-4 mb-6">
                <div class="flex items-center text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span class="font-medium">Category:</span>
                  <span class="ml-2">{{ tender.category }}</span>
                </div>
                
                <div class="flex items-center text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">Deadline:</span>
                  <span class="ml-2">{{ tender.deadline }}</span>
                </div>
                
                <div class="flex items-center text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="font-medium">Budget:</span>
                  <span class="ml-2">{{ tender.budget }}</span>
                </div>
                
                <div class="flex items-start text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <svg class="w-4 h-4 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div class="flex-1">
                    <span class="font-medium">Description:</span>
                    <p class="mt-1">{{ tender.description }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button 
                  class="flex-1 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors duration-300 text-sm"
                >
                  Download Tender Document
                </button>
                <button 
                  class="flex-1 px-4 py-2 border border-yellow-500 text-yellow-600 dark:text-yellow-400 font-semibold rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors duration-300 text-sm"
                >
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
          
          <!-- Procurement Guidelines -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-700">
            <h3 class="text-2xl font-bold mb-4 text-center" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Procurement Guidelines
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-700'">
                  How to Submit Proposals
                </h4>
                <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Download the complete tender document
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Review all requirements and specifications
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Prepare your proposal according to guidelines
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Submit before the deadline via our portal
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-700'">
                  Important Information
                </h4>
                <ul class="space-y-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Late submissions will not be considered
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    All documents must be in English
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Financial proposals must be in GHS
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Contact procurement@ghana-commodity-exchange.com for queries
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
