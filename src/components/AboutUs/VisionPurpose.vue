<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isDarkMode } from '../../utils/darkMode';
import { usePageContentEditor } from '../../composables/usePageContentEditor';

// CMS Content
const { loadPageContent, getContent } = usePageContentEditor('about');

// Load content on mount
onMounted(async () => {
  await loadPageContent();
});
</script>

<template>
  <div class="space-y-24">
    <div class="text-center mb-20">
      <h2 class="text-5xl font-bold mb-8 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        {{ getContent('vision_purpose_title', 'Our Vision, Purpose & Objectives') }}
      </h2>
      <p class="text-2xl transition-colors duration-300 max-w-4xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
        {{ getContent('vision_purpose_subtitle', 'Driving Ghana\'s economic transformation through innovative commodity trading solutions') }}
      </p>
    </div>
    
    <!-- Vision -->
    <div class="grid lg:grid-cols-3 gap-16 items-center">
      <div class="lg:col-span-1 flex justify-center">
        <div class="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            <div class="w-14 h-14 bg-white rounded-xl"></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2">
        <h2 class="text-4xl font-bold transition-colors duration-300 mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ getContent('vision_title', 'Our Vision') }}
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6"></div>
        <p class="transition-colors duration-300 text-xl leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('vision_description', 'To transform Ghana\'s economy by creating prosperity for all in commodity value chains and become a regional and global trading hub for all commodities.')">
        </p>
      </div>
    </div>

    <!-- Purpose -->
    <div class="grid lg:grid-cols-3 gap-16 items-center">
      <div class="lg:col-span-1 flex justify-center">
        <div class="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <div class="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            <div class="w-14 h-14 bg-white rounded-xl"></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2">
        <h2 class="text-4xl font-bold transition-colors duration-300 mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ getContent('purpose_title', 'Our Purpose') }}
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6"></div>
        <p class="transition-colors duration-300 text-xl leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('purpose_description', 'To connect markets, connect people & provide opportunities through innovation; using the most interactive and appropriate technology that meets the needs of our stakeholders and honouring earth\'s resources through sustainable practices across our business.')">
        </p>
      </div>
    </div>

    <!-- Objectives -->
    <div class="space-y-12">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold transition-colors duration-300 mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          {{ getContent('objectives_title', 'Our Objectives') }}
        </h2>
        <div class="w-20 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto mb-8"></div>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_1', 'Provide liquid, efficient markets for instruments such as auctions, spot, forward, futures and options')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_2', 'Support access to finance through efficient linkages along the value chain')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_3', 'Build capacity of members to use GCX infrastructure')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_4', 'Establish fair and transparent price discovery mechanisms')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_5', 'Ensure market integrity through rigorous surveillance systems')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_6', 'Develop standards, contracts, and dispute mechanisms to reduce risk')">
          </p>
        </div>
        
        <div class="p-8 rounded-2xl border transition-colors duration-300 hover:shadow-xl hover:scale-105 md:col-span-2 lg:col-span-1" :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'">
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-md">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          <p class="transition-colors duration-300 text-lg font-medium leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'" v-html="getContent('objective_7', 'Implement a reliable, efficient, and guaranteed clearing & settlement system')">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
