<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'

// Import CMS Components
import CMSSidebar from '../components/CMS/CMSSidebar.vue'
import CMSNavbar from '../components/CMS/CMSNavbar.vue'
import Dashboard from '../components/CMS/Dashboard.vue'
import CMSBlogView from './CMSBlogView.vue'
import CMSPagesView from './CMSPagesView.vue'
import SettingsManager from '../components/CMS/SettingsManager.vue'
import ContentManager from '../components/CMS/ContentManager.vue'
import TeamManager from '../components/CMS/TeamManager.vue'
import TraderManager from '../components/CMS/TraderManager.vue'
import BrokerManager from '../components/CMS/BrokerManager.vue'
import PartnerManager from '../components/CMS/PartnerManager.vue'
import PublicationManager from '../components/CMS/PublicationManager.vue'
import CareerManager from '../components/CMS/CareerManager.vue'
import CommodityManager from '../components/CMS/CommodityManager.vue'
import EventManager from '../components/CMS/EventManager.vue'
import RTIManager from '../components/CMS/RTIManager.vue'
import ImageManager from '../components/CMS/ImageManager.vue'
import GalleryManager from '../components/CMS/GalleryManager.vue'
import VideoManager from '../components/CMS/VideoManager.vue'
import NewsManager from '../components/CMS/NewsManager.vue'

// Note: user, isAuthenticated are handled by router guard
// const { user, isAuthenticated, logout } = useAuth()

const route = useRoute()
const activeSection = computed(() => route.meta.section || 'dashboard')
const sidebarOpen = ref(true)

// This component will only be accessible if user is authenticated (handled by router guard)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
    <div class="min-h-screen flex transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    
    <!-- Sidebar -->
    <CMSSidebar
      :is-open="sidebarOpen"
      @toggle="toggleSidebar"
    />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col" :class="sidebarOpen ? 'lg:ml-72' : ''">
      <!-- Top Navigation -->
      <CMSNavbar 
        :sidebar-open="sidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />
      
      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <div class="container mx-auto px-6 py-8">
                         <!-- Dashboard Section -->
          <Dashboard v-if="activeSection === 'dashboard'" />

          <!-- Blog Posts Section -->
          <CMSBlogView v-else-if="activeSection === 'posts'" />

          <!-- Pages Section -->
          <CMSPagesView v-else-if="activeSection === 'pages'" />
          
          



          <!-- Content Manager -->
          <ContentManager v-else-if="activeSection === 'content-manager'" />



          <!-- Team Manager -->
          <TeamManager v-else-if="activeSection === 'team-manager'" />

          <!-- Trader Manager -->
          <TraderManager v-else-if="activeSection === 'trader-manager'" />

          <!-- Broker Manager -->
          <BrokerManager v-else-if="activeSection === 'broker-manager'" />
          
          <!-- Partner Manager -->
          <PartnerManager v-else-if="activeSection === 'partner-manager'" />

          <!-- Publication Manager -->
          <PublicationManager v-else-if="activeSection === 'publication-manager'" />

          <!-- Career Manager -->
          <CareerManager v-else-if="activeSection === 'career-manager'" />

          <!-- Commodity Manager -->
          <CommodityManager v-else-if="activeSection === 'commodity-manager'" />

          <!-- Event Manager -->
          <EventManager v-else-if="activeSection === 'event-manager'" />

          <!-- Gallery Manager -->
          <GalleryManager v-else-if="activeSection === 'gallery-manager'" />

          <!-- Video Manager -->
          <VideoManager v-else-if="activeSection === 'video-manager'" />

          <!-- RTI Manager -->
          <RTIManager v-else-if="activeSection === 'rti-manager'" />

          <!-- News Manager -->
          <NewsManager v-else-if="activeSection === 'news-manager'" />

          <!-- Image Manager -->
          <ImageManager v-else-if="activeSection === 'image-manager'" />

          <!-- Settings Section -->
          <SettingsManager v-else-if="activeSection === 'settings'" />




          <!-- Other Sections -->
          <div v-else class="text-center py-12">
            <h2 class="text-2xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ String(activeSection).charAt(0).toUpperCase() + String(activeSection).slice(1) }}
            </h2>
            <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              This section is coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
