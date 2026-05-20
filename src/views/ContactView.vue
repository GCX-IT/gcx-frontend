<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import { emailService, type ContactFormData } from '../services/emailService'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Type declarations for external libraries
declare global {
  interface Window {
    initMap: () => void
    google: any
  }
  const google: any
  const L: any
}

const { t } = useI18n()

const formData = ref<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)
const errorMessage = ref('')

// Animation state
const heroVisible = ref(false)
const formSectionVisible = ref(false)
const infoSectionVisible = ref(false)
const mapSectionVisible = ref(false)

// Setup intersection observers
onMounted(() => {
  // Observe sections for animation
  const observerOptions = { threshold: 0.1 }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('hero-section')) heroVisible.value = true
        if (entry.target.classList.contains('form-section')) formSectionVisible.value = true
        if (entry.target.classList.contains('info-section')) infoSectionVisible.value = true
        if (entry.target.classList.contains('map-section')) mapSectionVisible.value = true
      }
    })
  }, observerOptions)

  // Find and observe elements
  const heroEl = document.querySelector('.hero-section')
  const formEl = document.querySelector('.form-section')
  const infoEl = document.querySelector('.info-section')
  const mapEl = document.querySelector('.map-section')

  if (heroEl) observer.observe(heroEl)
  if (formEl) observer.observe(formEl)
  if (infoEl) observer.observe(infoEl)
  if (mapEl) observer.observe(mapEl)
})

const handleSubmit = async () => {
  isSubmitting.value = true
  submitError.value = false
  errorMessage.value = ''
  
  try {
    // Send emails using the email service
    const result = await emailService.sendContactFormEmails(formData.value)
    
    if (result.success) {
      submitSuccess.value = true
      
      // Reset form
      formData.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
      
      // Hide success message after 8 seconds
      setTimeout(() => {
        submitSuccess.value = false
      }, 8000)
    } else {
      submitError.value = true
      errorMessage.value = result.message
      
      // Hide error message after 10 seconds
      setTimeout(() => {
        submitError.value = false
        errorMessage.value = ''
      }, 10000)
    }
  } catch (error) {
    submitError.value = true
    errorMessage.value = error instanceof Error ? error.message : 'An unexpected error occurred'
    
    // Hide error message after 10 seconds
    setTimeout(() => {
      submitError.value = false
      errorMessage.value = ''
    }, 10000)
  } finally {
    isSubmitting.value = false
  }
}

// Google Maps integration
onMounted(() => {
  // Check if we have a valid API key
  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'
  
  if (apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    // Load Google Maps API with valid key
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Initialize map function
    window.initMap = () => {
      const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 5.5841, lng: -0.1935 }, // Kanda, Accra coordinates
        zoom: 15,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#1e293b' : '#f8fafc' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: isDarkMode.value ? '#1e293b' : '#f8fafc' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#94a3b8' : '#64748b' }]
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#fbbf24' : '#f59e0b' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#fbbf24' : '#f59e0b' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#334155' : '#e2e8f0' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#86efac' : '#22c55e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#475569' : '#e2e8f0' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: isDarkMode.value ? '#334155' : '#cbd5e1' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#cbd5e1' : '#64748b' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#fbbf24' : '#f59e0b' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: isDarkMode.value ? '#f59e0b' : '#d97706' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#1e293b' : '#0f172a' }]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#475569' : '#e2e8f0' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#fbbf24' : '#f59e0b' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: isDarkMode.value ? '#1e40af' : '#3b82f6' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: isDarkMode.value ? '#93c5fd' : '#60a5fa' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: isDarkMode.value ? '#1e40af' : '#3b82f6' }]
          }
        ]
      })

      // Add marker for GCX office
      new google.maps.Marker({
        position: { lat: 5.5841, lng: -0.1935 },
        map: map,
        title: 'Ghana Commodity Exchange',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#F59E0B"/>
              <path d="M20 8L24.5 16H15.5L20 8Z" fill="white"/>
              <path d="M20 32L15.5 24H24.5L20 32Z" fill="white"/>
              <path d="M8 20L16 15.5V24.5L8 20Z" fill="white"/>
              <path d="M32 20L24 24.5V15.5L32 20Z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40)
        }
      })

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; color: #1e293b; font-weight: bold;">Ghana Commodity Exchange</h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">
              Ministry of Finance Complex,<br>
              Tower 1, 5th Floor<br>
              Tumu Avenue, Kanda<br>
              Accra
            </p>
          </div>
        `
      })

      // Add click listener to marker
      google.maps.event.addListener(map, 'click', () => {
        infoWindow.close()
      })

      // Show info window on marker click
      google.maps.event.addListener(map, 'idle', () => {
        infoWindow.open(map, map.getMarkers()[0])
      })
    }
  } else {
    // Use Leaflet with OpenStreetMap (free, no API key required)
    initLeafletMap()
  }
})

// Initialize Leaflet map
const initLeafletMap = () => {
  // Load Leaflet CSS
  const leafletCSS = document.createElement('link')
  leafletCSS.rel = 'stylesheet'
  leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
  leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
  leafletCSS.crossOrigin = ''
  document.head.appendChild(leafletCSS)

  // Load Leaflet JS
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
  script.crossOrigin = ''
  script.onload = () => {
    // Initialize map after Leaflet is loaded
    const map = L.map('map').setView([5.5841, -0.1935], 15)

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Custom GCX marker icon
    const gcxIcon = L.divIcon({
      html: `
        <div style="
          width: 40px; 
          height: 40px; 
          background: #F59E0B; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" fill="white"/>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })

    // Add marker
    const marker = L.marker([5.5841, -0.1935], { icon: gcxIcon }).addTo(map)

    // Add popup<br>
         
    marker.bindPopup(`
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0; color: #1e293b; font-weight: bold;">Ghana Commodity Exchange</h3>
        <p style="margin: 0; color: #64748b; font-size: 14px;">
          Ministry of Finance Complex, Tower 1, 5th Floor<br>
          Tumu Avenue, Kanda<br>
          Accra
        </p>
        <p style="margin: 5px 0 0 0; color: #f59e0b; font-size: 12px; font-weight: bold;">
          Digital Address: GV-002-6511
        </p>
      </div>
    `)

    // Open popup by default
    marker.openPopup()
  }
  document.head.appendChild(script)
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Hero Section -->
    <section class="hero-section relative py-20 transition-all duration-700 ease-out" 
      :class="[
        isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      ]">
      <div class="absolute inset-0 bg-black/5"></div>
      <div class="relative max-w-7xl mx-auto px-6">
        <div class="text-center">
          <h1 class="text-5xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Get in Touch
          </h1>
          <p class="text-xl max-w-3xl mx-auto transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            Connect with Ghana Commodity Exchange. We're here to help you navigate the world of commodity trading and answer any questions you might have.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Form -->
        <section class="form-section space-y-8 transition-all duration-700 ease-out"
          :class="[
            formSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          ]">
          <div>
            <h2 class="text-3xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Send us a Message
            </h2>
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Full Name
                </label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors placeholder-slate-500 resize-none"
                  :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors placeholder-slate-500 resize-none"
                  :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Subject
              </label>
              <input
                id="subject"
                v-model="formData.subject"
                type="text"
                required
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors placeholder-slate-500 resize-none"
                :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Message
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                rows="6"
                required
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors placeholder-slate-500 resize-none"
                :class="isDarkMode ? 'border-slate-600 bg-slate-800 text-white placeholder-slate-400' : 'border-slate-300 bg-white text-slate-900 placeholder-slate-500'"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="isSubmitting">Sending Message...</span>
              <span v-else>Send Message</span>
            </button>
          </form>

          <!-- Success Message -->
          <div
            v-if="submitSuccess"
            class="p-4 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'bg-green-900/30 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-700'"
          >
            <div class="flex items-center">
              <CheckCircleIcon class="w-5 h-5 mr-2" />
              <div>
                <p class="font-semibold">Message sent successfully!</p>
                <p class="text-sm mt-1">We've sent your message to our team and a confirmation email to your inbox. We'll get back to you within 24 hours.</p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div
            v-if="submitError"
            class="p-4 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'bg-red-900/30 border-red-600 text-red-300' : 'bg-red-100 border-red-400 text-red-700'"
          >
            <div class="flex items-start">
              <ExclamationTriangleIcon class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p class="font-semibold">Failed to send message</p>
                <p class="text-sm mt-1">{{ errorMessage }}</p>
                <p class="text-sm mt-2">Please try again or contact us directly at info@gcx.com.gh</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Information -->
        <section class="info-section space-y-8 transition-all duration-700 ease-out"
          :class="[
            infoSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          ]">
          <div>
            <h2 class="text-3xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              Contact Information
            </h2>
            <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
              Reach out to us through any of these channels. We're here to help you succeed in commodity trading.
            </p>
          </div>

          <div class="space-y-6">
            <!-- Address -->
            <div class="flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300" :class="isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'">
                <MapPinIcon class="w-6 h-6 transition-colors duration-300" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" />
              </div>
              <div>
                <h3 class="font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Office Address</h3>
                <p class="leading-relaxed transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  Ministry of Finance Complex,<br>
                  Tower 1, 5th Floor<br>
                  Tumu Avenue, Kanda<br>
                  Accra
                </p>
                <p class="text-sm mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  Digital Address: GV-002-6511
                </p>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300" :class="isDarkMode ? 'bg-green-900/30' : 'bg-green-100'">
                <PhoneIcon class="w-6 h-6 transition-colors duration-300" :class="isDarkMode ? 'text-green-400' : 'text-green-600'" />
              </div>
              <div>
                <h3 class="font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Phone</h3>
                <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <a href="tel:+233594164465" class="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                    +233 59 416 4465
                  </a>
                </p>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300" :class="isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'">
                <EnvelopeIcon class="w-6 h-6 transition-colors duration-300" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'" />
              </div>
              <div>
                <h3 class="font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Email</h3>
                <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <a href="mailto:info@gcx.com.gh" class="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                    info@gcx.com.gh
                  </a>
                </p>
              </div>
            </div>

            <!-- WhatsApp -->
            <div class="flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300" :class="isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'">
                <!-- WhatsApp Official Icon -->
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" :class="isDarkMode ? 'text-emerald-400' : 'text-emerald-600'">
                  <path d="M12.031 2c-5.518 0-9.972 4.454-9.972 9.973 0 1.579.37 3.12 1.071 4.5l-1.13 4.135 4.232-1.11a9.92 9.92 0 004.8 1.229h0c5.517 0 9.972-4.454 9.972-9.973 0-2.668-1.036-5.176-2.924-7.062A9.914 9.914 0 0012.031 2zM17.51 14.382c-.297-.149-1.758-.867-2.03-.967s-.47-.148-.67.15c-.197.297-.767.966-.94 1.164s-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52s.198-.298.298-.497c.099-.198.05-.371-.025-.52s-.669-1.612-.916-2.207c-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074s2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413s-.272-.198-.57-.347z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">WhatsApp</h3>
                <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <a href="https://wa.me/233594164491" target="_blank" rel="noopener noreferrer" class="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                    +233 59 416 4491
                  </a>
                </p>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="flex items-start space-x-4 p-6 rounded-xl shadow-sm border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
              <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300" :class="isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'">
                <ClockIcon class="w-6 h-6 transition-colors duration-300" :class="isDarkMode ? 'text-purple-400' : 'text-purple-600'" />
              </div>
              <div>
                <h3 class="font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Business Hours</h3>
                <div class="space-y-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
                  <div class="grid grid-cols-[1fr_auto] items-center gap-x-6">
                    <span>Monday - Friday</span>
                    <span class="font-medium text-right">8:00 AM - 5:00 PM</span>
                  </div>
                  <div class="grid grid-cols-[1fr_auto] items-center gap-x-6">
                    <span>Saturday</span>
                    <span class="font-medium text-right">Closed</span>
                  </div>
                  <div class="grid grid-cols-[1fr_auto] items-center gap-x-6">
                    <span>Sunday</span>
                    <span class="font-medium text-right transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Google Map Section -->
      <section class="map-section mt-20 transition-all duration-700 ease-out"
        :class="[
          mapSectionVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        ]">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            Find Us
          </h2>
          <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
            Visit our office in the heart of Accra's business district
          </p>
        </div>
        
        <div class="rounded-xl shadow-lg border overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
          <!-- Interactive Map Container -->
          <div id="map" class="w-full h-96"></div>
        </div>
      </section>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
/* Custom styles for the map */
#map {
  min-height: 400px;
}

/* Smooth transitions for dark mode */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style> 