<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
// Professional footer for Ghana Commodity Exchange
</script>

<template>
  <footer class="bg-slate-900 dark:bg-slate-800 text-white">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        <!-- Company Info & Social Media -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-6">
            <img src="/logo_black.png" alt="GCX Logo" class="h-12 w-auto" />
          </div>
          <p class="text-white mb-8 leading-relaxed">
            The Ghana Commodity Exchange (GCX) is a licensed commodity exchange providing 
            transparent, efficient, and regulated marketplace for agricultural commodities in Ghana.
          </p>
          
          <!-- Social Media Icons -->
          <div class="flex space-x-4">
            <!-- Facebook -->
            <a href="https://www.facebook.com/GCXGhana" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <svg class="w-5 h-5 text-white group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            
            <!-- X (Twitter) -->
            <a href="https://x.com/gcx_official" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-slate-800 hover:bg-black rounded-lg flex items-center justify-center transition-all duration-300 group">
              <svg class="w-5 h-5 text-white group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            <!-- Instagram -->
            <a href="https://www.instagram.com/gcx_official/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-slate-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <svg class="w-5 h-5 text-white group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
              </svg>
            </a>
            
            <!-- LinkedIn -->
            <a href="https://gh.linkedin.com/company/ghana-commodity-exchange" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 group">
              <svg class="w-5 h-5 text-white group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Menu Links -->
        <div>
          <h3 class="text-lg font-bold mb-6 text-yellow-500">Menu</h3>
          <ul class="space-y-3">
            <li><router-link to="/" class="text-white transition-colors hover:text-yellow-400">{{ t('navigation.menu.home') }}</router-link></li>
            <li><router-link to="/about" class="text-white transition-colors hover:text-yellow-400">About Us</router-link></li>
            <li><router-link to="/services" class="text-white transition-colors hover:text-yellow-400">Our Services</router-link></li>
            <li><router-link to="/membership" class="text-white transition-colors hover:text-yellow-400">{{ t('navigation.menu.membership') }}</router-link></li>
            <li><router-link to="/market-data" class="text-white transition-colors hover:text-yellow-400">{{ t('navigation.menu.marketData') }}</router-link></li>
            <li><router-link to="/commodities" class="text-white transition-colors hover:text-yellow-400">Commodities</router-link></li>
            <li><router-link to="/about" class="text-white transition-colors hover:text-yellow-400">GCX Certification Program</router-link></li>
            <li><router-link to="/careers" class="text-white transition-colors hover:text-yellow-400">Careers</router-link></li>
            <li><router-link to="/blog" class="text-white transition-colors hover:text-yellow-400">Media</router-link></li>
            <li><router-link to="/contact" class="text-white transition-colors hover:text-yellow-400">Contact Us</router-link></li>
          </ul>
        </div>

        <!-- Useful Links -->
        <div>
          <h3 class="text-lg font-bold mb-6 text-yellow-500">Useful Links</h3>
          <ul class="space-y-3">
            <li><router-link to="/commodities" class="text-white transition-colors hover:text-yellow-400">Commodities</router-link></li>
            <li><router-link to="/membership" class="text-white transition-colors hover:text-yellow-400">Membership Types</router-link></li>
            <li><router-link to="/membership/application" class="text-white transition-colors hover:text-yellow-400">Membership Application Process</router-link></li>
            <li><router-link to="/about" class="text-white transition-colors hover:text-yellow-400">GCX Certification Program</router-link></li>
            <li><router-link to="/membership/application" class="text-white transition-colors hover:text-yellow-400">Application Forms</router-link></li>
            <li><router-link to="/resources" class="text-white transition-colors hover:text-yellow-400">GCX Resources</router-link></li>
            <li><router-link to="/careers" class="text-white transition-colors hover:text-yellow-400">Careers</router-link></li>
            <li><router-link to="/about" class="text-white transition-colors hover:text-yellow-400">Rules & Regulations</router-link></li>
            <li><router-link to="/about" class="text-white transition-colors hover:text-yellow-400">Procurement</router-link></li>
            <li><router-link to="/blog" class="text-white transition-colors hover:text-yellow-400">News</router-link></li>
            <li><router-link to="/contact" class="text-white transition-colors hover:text-yellow-400">Location</router-link></li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div>
          <h3 class="text-lg font-bold mb-6 text-yellow-500">Contact Us</h3>
          <div class="space-y-4">
            <!-- Address -->
            <div class="flex items-start">
              <svg class="w-5 h-5 mt-1 mr-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div class="text-white">
                <p class="font-medium text-white mb-1">Location</p>
                <p class="text-sm leading-relaxed">
                  2nd Floor - Africa Trade House,<br/>
                  Ambassadorial Enclave Off Liberia Road<br/>
                  Ridge, Accra<br/>
                  Ghana - West Africa<br/>
                  <span class="text-yellow-500 font-medium">Digital Address: GA-077-0681</span>
                </p>
              </div>
            </div>
            
            <!-- Phone -->
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <div>
                <p class="font-medium text-white">Phone</p>
                <a href="tel:+233594164465" class="text-white transition-colors hover:text-yellow-400 text-sm">
                  +233 59 416 4465
                </a>
              </div>
            </div>
            
            <!-- Email -->
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div>
                <p class="font-medium text-white">Email</p>
                <a href="mailto:contact@gcx.com.gh" class="text-white transition-colors hover:text-yellow-400 text-sm">
                  contact@gcx.com.gh
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-slate-700 mt-12 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-white text-sm mb-4 md:mb-0">
            <p>&copy; 2018 - 2025 Ghana Commodity Exchange. All Rights Reserved</p>
          </div>
          <div class="flex space-x-6 text-sm">
            <router-link to="/about" class="text-white transition-colors hover:text-yellow-400">
              Privacy Policy
            </router-link>
            <router-link to="/about" class="text-white transition-colors hover:text-yellow-400">
              Terms of Service
            </router-link>
            <router-link to="/" class="text-white transition-colors hover:text-yellow-400">
              Sitemap
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>