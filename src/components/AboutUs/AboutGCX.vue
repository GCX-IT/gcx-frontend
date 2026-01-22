<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { isDarkMode } from '../../utils/darkMode';
import { usePageContentEditor } from '../../composables/usePageContentEditor';
import { getImageUrl } from '../../utils/imageUrl';

// CMS Content
const { getContent, getImage, loadPageContent, pageContent } = usePageContentEditor('about')

// Reactive computed properties for better reactivity
const aboutTitle = computed(() => getContent('about_title', 'About GCX'))
const aboutDescription = computed(() => getContent('about_description', 'The Ghana Commodity Exchange is a private company limited by shares, structured as a Public-Private Partnership, with the Government of Ghana currently the sole shareholder. The Exchange aims to establish linkages between agricultural and commodity producers and buyers, secure competitive prices for their products, assure the market quantity and quality, and settle trade promptly.'))
const ceoName = computed(() => getContent('ceo_name', 'Ms. Evelyn Abakah'))
const ceoTitle = computed(() => getContent('ceo_title', 'Chief Executive Officer'))
const ceoImage = computed(() => {
  const image = getImage('ceo_image', '/logo_black.png')
  return image.startsWith('/uploads') ? getImageUrl(image) : image
})
const ceoIntro = computed(() => getContent('ceo_intro', 'Ghana Commodity Exchange\'s Management team is led by Ms. Evelyn Abakah, the Chief Executive Officer.'))
const keyGoalTitle = computed(() => getContent('key_goal_title', 'Our Key Goal'))
const keyGoalDescription = computed(() => getContent('key_goal_description', 'To link Ghanaian smallholder farmers to agricultural and financial markets in Ghana and across the West Africa Region to ensure Ghana farmers secure competitive prices for their commodities, as well as supply good quality commodities which meet the nutritional needs of the Ghanaian people.'))

// Error handling for images
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = getImageUrl('/uploads/placeholder-ceo.jpg')
}

// Load CMS content when component mounts
onMounted(async () => {
  await loadPageContent()
})
</script>

<template>
  <div class="space-y-16">
    <!-- Hero Content Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div class="space-y-8">
        <div>
          <h2 class="text-5xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ aboutTitle }}
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mb-6"></div>
          <p class="text-xl transition-colors duration-300 leading-relaxed mb-6" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            {{ aboutDescription }}
          </p>
          <p class="text-xl transition-colors duration-300 leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            {{ ceoIntro }}
          </p>
        </div>
        
        <div class="rounded-2xl p-8 border transition-colors duration-300" :class="isDarkMode ? 'bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-yellow-800' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300'">
          <h3 class="text-3xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-yellow-200' : 'text-yellow-900'">
            {{ keyGoalTitle }}
          </h3>
          <p class="text-lg transition-colors duration-300 leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-800'">
            {{ keyGoalDescription }}
          </p>
        </div>
      </div>
      
      <div class="relative">
        <img 
          :src="ceoImage" 
          :alt="ceoName + ' - ' + ceoTitle" 
          class="rounded-2xl shadow-2xl w-full"
          @error="handleImageError"
        />
        <div class="absolute -bottom-6 -left-6 rounded-2xl p-6 shadow-xl border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <div class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ ceoName }}
          </div>
          <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            {{ ceoTitle }}
          </div>
        </div>
      </div>
    </div>

    <!-- Core Services Section -->
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Our Core Services</h2>
      <p class="text-xl transition-colors duration-300 max-w-3xl mx-auto" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        Ghana Commodity Exchange provides comprehensive trading solutions for agricultural commodities
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-yellow-600' : 'bg-white border-slate-200 hover:border-yellow-500'">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-8">
          <div class="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl mb-6 flex items-center justify-center">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <div class="w-8 h-8 bg-white rounded-lg"></div>
            </div>
          </div>
          <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Regulated Trading</h3>
          <p class="text-lg transition-colors duration-300 leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            National and regional market linking buyers and sellers under established rules with transparent pricing and secure settlement.
          </p>
        </div>
      </div>
      
      <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-green-600' : 'bg-white border-slate-200 hover:border-green-500'">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-8">
          <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 flex items-center justify-center">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <div class="w-8 h-8 bg-white rounded-lg"></div>
            </div>
          </div>
          <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Price Discovery</h3>
          <p class="text-lg transition-colors duration-300 leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Transparent price discovery mechanism ensuring competitive pricing for commodities through real-time market data.
          </p>
        </div>
      </div>
      
      <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-blue-600' : 'bg-white border-slate-200 hover:border-blue-500'">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-8">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 flex items-center justify-center">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <div class="w-8 h-8 bg-white rounded-lg"></div>
            </div>
          </div>
          <h3 class="text-2xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Quality Assurance</h3>
          <p class="text-lg transition-colors duration-300 leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Assured market quantity and quality with timely delivery and settlement through rigorous standards.
          </p>
        </div>
      </div>
    </div>

    <!-- Business Operations Section -->
    <div class="text-center mb-16">
      <h2 class="text-4xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Business Operations</h2>
      <p class="text-xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        GCX business operations consist of a trading platform powered by a provider Trading system, and warehouse storage 
        operations linked to the exchange through an electronic warehouse receipt system (e-WRS), backed by collateral management services.
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Trading Platform -->
      <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-yellow-600' : 'bg-white border-slate-200 hover:border-yellow-500'">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-8">
          <div class="flex items-center gap-6 mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
              <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <div class="w-12 h-12 bg-white rounded-lg"></div>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Trading Platform</h3>
              <p class="text-yellow-600 dark:text-yellow-400 font-semibold text-xl">Electronic Trading System</p>
            </div>
          </div>
          <p class="transition-colors duration-300 leading-relaxed mb-8 text-xl" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            One of the primary advantages of the GCX trading system is to enable all users (farmers, cooperatives, buyers, 
            brokers, merchants etc.) to trade anywhere in the country, region and the world.
          </p>
          <div class="flex flex-wrap gap-3">
            <span class="px-4 py-2 bg-yellow-500 text-white dark:bg-yellow-900/40 dark:text-yellow-200 text-sm font-semibold rounded-lg shadow-sm">Global Access</span>
            <span class="px-4 py-2 bg-green-500 text-white dark:bg-green-900/40 dark:text-green-200 text-sm font-semibold rounded-lg shadow-sm">Real-time Trading</span>
            <span class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-900/40 dark:text-blue-200 text-sm font-semibold rounded-lg shadow-sm">Price Discovery</span>
          </div>
        </div>
      </div>
      
      <!-- Warehouse Operations -->
      <div class="group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl" :class="isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-green-600' : 'bg-white border-slate-200 hover:border-green-500'">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="relative p-8">
          <div class="flex items-center gap-6 mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <div class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <div class="w-12 h-12 bg-white rounded-lg"></div>
              </div>
            </div>
            <div>
              <h3 class="text-3xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Warehouse Operations</h3>
              <p class="text-green-600 dark:text-green-400 font-semibold text-xl">Electronic Warehouse Receipt System</p>
            </div>
          </div>
          <p class="transition-colors duration-300 leading-relaxed mb-8 text-xl" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            The warehousing operations linked to the exchange provide much needed value-added services including secure storage, 
            product drying and grading, and re-packaging.
          </p>
          <div class="flex flex-wrap gap-3">
            <span class="px-4 py-2 bg-green-500 text-white dark:bg-green-900/40 dark:text-green-200 text-sm font-semibold rounded-lg shadow-sm">Secure Storage</span>
            <span class="px-4 py-2 bg-purple-500 text-white dark:bg-purple-900/40 dark:text-purple-200 text-sm font-semibold rounded-lg shadow-sm">Quality Grading</span>
            <span class="px-4 py-2 bg-red-500 text-white dark:bg-red-900/40 dark:text-red-200 text-sm font-semibold rounded-lg shadow-sm">Collateral Management</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
