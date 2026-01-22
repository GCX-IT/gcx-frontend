<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import eventService, { type Event } from '../services/eventService'
import { emailService, type EventRegistrationData, type EventData } from '../services/emailService'

const route = useRoute()
const router = useRouter()

// Event data
const event = ref<Event | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Store mock events for backwards compatibility if needed
const mockEvents = [
  // Upcoming Events
  {
    id: 'gcx-annual-conference-2025',
    title: 'GCX Annual Conference 2025',
    date: 'December 15, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Accra, Ghana',
    venue: 'Kempinski Hotel Gold Coast City',
    address: 'Ridge, Accra, Ghana',
    type: 'Conference',
    status: 'upcoming',
    description: 'The Ghana Commodity Exchange Annual Conference will bring together industry leaders, farmers, and stakeholders to discuss the future of commodity trading in Ghana. This year\'s conference focuses on digital transformation, sustainable agriculture, and market innovation.',
    fullDescription: `The Ghana Commodity Exchange Annual Conference 2024 is our flagship event that brings together over 500 industry leaders, farmers, traders, policymakers, and stakeholders from across Ghana and the West African region. This year's conference focuses on three key themes:

**Digital Transformation in Agriculture**
- Leveraging technology to improve commodity trading
- Digital platforms for farmer-market connectivity
- Blockchain and traceability in agricultural supply chains

**Sustainable Agriculture Practices**
- Climate-smart farming techniques
- Sustainable commodity production
- Environmental impact reduction strategies

**Market Innovation and Development**
- New trading mechanisms and instruments
- International market integration
- Policy frameworks for commodity exchange growth

The conference will feature keynote presentations from industry experts, panel discussions, networking sessions, and practical workshops. Attendees will have the opportunity to learn about the latest developments in commodity trading, connect with potential business partners, and contribute to shaping the future of Ghana's agricultural economy.`,
    attendees: 500,
    image: '/Picture3.png',
    registrationOpen: true,
    registrationDeadline: 'December 10, 2025',
    price: 'Free',
    category: 'Conference',
    speakers: [
      { name: 'Dr. Kofi Adomakoh', title: 'CEO, Ghana Commodity Exchange', image: '/Picture3.png' },
      { name: 'Hon. Dr. Owusu Afriyie Akoto', title: 'Minister of Food and Agriculture', image: '/Picture3.png' },
      { name: 'Ms. Elizabeth Ohene', title: 'Board Chair, GCX', image: '/Picture3.png' }
    ],
    agenda: [
      { time: '9:00 AM', session: 'Registration and Welcome Coffee' },
      { time: '9:30 AM', session: 'Opening Ceremony and Keynote Address' },
      { time: '10:30 AM', session: 'Panel Discussion: Digital Agriculture' },
      { time: '12:00 PM', session: 'Networking Lunch' },
      { time: '1:30 PM', session: 'Workshop: Trading Strategies' },
      { time: '3:00 PM', session: 'Panel Discussion: Sustainable Practices' },
      { time: '4:30 PM', session: 'Closing Remarks and Awards' }
    ],
    requirements: [
      'Valid government-issued ID',
      'Business card for networking',
      'Laptop or tablet for workshops (optional)'
    ]
  },
  {
    id: 'agricultural-tech-summit-2025',
    title: 'Agricultural Technology Summit 2025',
    date: 'November 20, 2025',
    time: '8:00 AM - 6:00 PM',
    location: 'Kumasi, Ghana',
    venue: 'Golden Tulip Kumasi City',
    address: 'Asokore Mampong, Kumasi, Ghana',
    type: 'Summit',
    status: 'upcoming',
    description: 'Exploring cutting-edge agricultural technologies and their impact on commodity trading and market development.',
    fullDescription: `The Agricultural Technology Summit 2024 is a comprehensive event focused on the intersection of technology and agriculture in Ghana. This summit brings together tech innovators, agricultural experts, and commodity traders to explore how emerging technologies can revolutionize the agricultural sector.

**Key Focus Areas:**
- Precision agriculture and IoT applications
- Mobile technology for farmers
- Data analytics in commodity trading
- AI and machine learning in agriculture
- Fintech solutions for agricultural finance

The summit will feature live demonstrations, technology showcases, and hands-on workshops where participants can interact with the latest agricultural technologies.`,
    attendees: 300,
    image: '/Picture3.png',
    registrationOpen: true,
    registrationDeadline: 'November 15, 2025',
    price: 'GHS 50',
    category: 'Summit',
    speakers: [
      { name: 'Dr. Kwame Asante', title: 'Director, CSIR-Crops Research Institute', image: '/Picture3.png' },
      { name: 'Ms. Ama Serwaa', title: 'CEO, AgriTech Solutions', image: '/Picture3.png' }
    ],
    agenda: [
      { time: '8:00 AM', session: 'Registration and Technology Showcase' },
      { time: '9:00 AM', session: 'Opening Keynote: Future of AgTech' },
      { time: '10:30 AM', session: 'Panel: IoT in Agriculture' },
      { time: '12:00 PM', session: 'Lunch and Networking' },
      { time: '1:30 PM', session: 'Workshop: Mobile Apps for Farmers' },
      { time: '3:00 PM', session: 'Panel: Data Analytics' },
      { time: '4:30 PM', session: 'Closing and Awards' }
    ],
    requirements: [
      'Valid ID',
      'Smartphone for app demonstrations',
      'Interest in agricultural technology'
    ]
  },
  {
    id: 'youth-agriculture-program-2025',
    title: 'Youth in Agriculture Program 2025',
    date: 'October 25, 2025',
    time: '9:00 AM - 4:00 PM',
    location: 'Takoradi, Ghana',
    venue: 'Takoradi Technical University',
    address: 'Takoradi, Western Region, Ghana',
    type: 'Program',
    status: 'upcoming',
    description: 'Engaging young people in agriculture and commodity trading through education, mentorship, and practical training.',
    fullDescription: `The Youth in Agriculture Program 2025 is designed to inspire and educate the next generation of agricultural leaders and commodity traders in Ghana. This comprehensive program combines theoretical knowledge with hands-on practical experience to prepare young people for successful careers in agriculture and commodity trading.

**Program Highlights:**
- Interactive workshops on modern farming techniques
- Commodity trading simulation exercises
- Mentorship sessions with industry professionals
- Field visits to successful farms and trading facilities
- Networking opportunities with peers and industry leaders

**Learning Objectives:**
- Understand the fundamentals of commodity trading
- Learn about modern agricultural practices and technologies
- Develop business and entrepreneurship skills
- Build professional networks in the agricultural sector
- Gain practical experience through hands-on activities

The program is open to students, recent graduates, and young professionals aged 18-35 who are interested in pursuing careers in agriculture or commodity trading.`,
    attendees: 100,
    image: '/Picture3.png',
    registrationOpen: true,
    registrationDeadline: 'October 20, 2025',
    price: 'Free',
    category: 'Program',
    speakers: [
      { name: 'Dr. Kwame Asante', title: 'Director of Youth Programs, GCX', image: '/Picture3.png' },
      { name: 'Ms. Akosua Mensah', title: 'Successful Young Farmer', image: '/Picture3.png' },
      { name: 'Mr. Kofi Boateng', title: 'Commodity Trader', image: '/Picture3.png' }
    ],
    agenda: [
      { time: '9:00 AM', session: 'Registration and Welcome' },
      { time: '9:30 AM', session: 'Introduction to Commodity Trading' },
      { time: '10:30 AM', session: 'Modern Farming Techniques Workshop' },
      { time: '12:00 PM', session: 'Lunch and Networking' },
      { time: '1:00 PM', session: 'Trading Simulation Exercise' },
      { time: '2:30 PM', session: 'Field Visit to Local Farm' },
      { time: '4:00 PM', session: 'Mentorship Session and Q&A' }
    ],
    requirements: [
      'Valid student ID or age verification',
      'Interest in agriculture or trading',
      'Notebook for taking notes',
      'Comfortable clothing for field visit'
    ]
  },
  // Past Events
  {
    id: 'gcx-annual-conference-2023',
    title: 'GCX Annual Conference 2023',
    date: 'December 15, 2023',
    time: '9:00 AM - 5:00 PM',
    location: 'Accra, Ghana',
    venue: 'Kempinski Hotel Gold Coast City',
    address: 'Ridge, Accra, Ghana',
    type: 'Conference',
    status: 'completed',
    description: 'The Ghana Commodity Exchange Annual Conference brought together industry leaders, farmers, and stakeholders to discuss the future of commodity trading in Ghana.',
    fullDescription: `The 2023 GCX Annual Conference was a resounding success, bringing together over 500 participants from across Ghana and the West African region. The conference focused on building resilience in commodity trading and exploring new opportunities for market growth.

**Key Achievements:**
- Launched new digital trading platform
- Signed 5 new international partnerships
- Announced expansion to 3 new regions
- Recognized outstanding farmers and traders

The event featured engaging panel discussions, practical workshops, and valuable networking opportunities that contributed to the growth of Ghana's commodity trading ecosystem.`,
    attendees: 500,
    image: '/Picture3.png',
    registrationOpen: false,
    category: 'Conference',
    speakers: [
      { name: 'Dr. Kofi Adomakoh', title: 'CEO, Ghana Commodity Exchange', image: '/Picture3.png' },
      { name: 'Hon. Dr. Owusu Afriyie Akoto', title: 'Former Minister of Food and Agriculture', image: '/Picture3.png' }
    ],
    agenda: [
      { time: '9:00 AM', session: 'Registration and Welcome' },
      { time: '9:30 AM', session: 'Opening Ceremony' },
      { time: '10:30 AM', session: 'Keynote: Market Resilience' },
      { time: '12:00 PM', session: 'Networking Lunch' },
      { time: '1:30 PM', session: 'Panel: Digital Transformation' },
      { time: '3:00 PM', session: 'Awards Ceremony' },
      { time: '4:30 PM', session: 'Closing Remarks' }
    ],
    requirements: [
      'Valid government-issued ID',
      'Business card for networking'
    ]
  }
];

// Registration form
const registrationForm = ref({
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  position: '',
  dietaryRequirements: '',
  specialNeeds: ''
})

const isRegistering = ref(false)
const registrationSubmitted = ref(false)
const registrationError = ref(false)
const errorMessage = ref('')

// Computed properties
const isUpcoming = computed(() => {
  return event.value?.status === 'upcoming'
})

const canRegister = computed(() => {
  return isUpcoming.value && event.value?.registration_open
})

// Functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  return status === 'upcoming' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

const getTypeColor = (type: string) => {
  const colors = {
    'Conference': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Summit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Workshop': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Forum': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Program': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Meeting': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const submitRegistration = async () => {
  if (!event.value) return

  isRegistering.value = true
  registrationError.value = false
  errorMessage.value = ''
  
  try {
    // Register for the event
    await eventService.registerForEvent(event.value.id, {
      event_id: event.value.id,
      full_name: registrationForm.value.fullName,
      email: registrationForm.value.email,
      phone: registrationForm.value.phone,
      organization: registrationForm.value.organization,
      position: registrationForm.value.position,
      dietary_requirements: registrationForm.value.dietaryRequirements,
      special_needs: registrationForm.value.specialNeeds
    })

    // Send confirmation emails
    const registrationData: EventRegistrationData = {
      event_id: event.value.id,
      full_name: registrationForm.value.fullName,
      email: registrationForm.value.email,
      phone: registrationForm.value.phone,
      organization: registrationForm.value.organization,
      position: registrationForm.value.position,
      dietary_requirements: registrationForm.value.dietaryRequirements,
      special_needs: registrationForm.value.specialNeeds
    }

    const eventData: EventData = {
      id: event.value.id,
      title: event.value.title,
      date: event.value.date,
      time: event.value.time,
      location: event.value.location,
      venue: event.value.venue,
      address: event.value.address,
      type: event.value.type,
      category: event.value.category,
      description: event.value.description,
      attendees: event.value.attendees,
      price: event.value.price
    }

    // Send emails
    const emailResult = await emailService.sendEventRegistrationEmails(registrationData, eventData)
    
    if (emailResult.success) {
      registrationSubmitted.value = true
      
      // Reset form
      registrationForm.value = {
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        dietaryRequirements: '',
        specialNeeds: ''
      }
    } else {
      // Registration succeeded but emails failed
      registrationSubmitted.value = true
      console.warn('Registration successful but email sending failed:', emailResult.message)
    }
  } catch (err: any) {
    console.error('Registration failed:', err)
    registrationError.value = true
    errorMessage.value = err.response?.data?.error || 'Registration failed. Please try again.'
    
    // Hide error message after 10 seconds
    setTimeout(() => {
      registrationError.value = false
      errorMessage.value = ''
    }, 10000)
  } finally {
    isRegistering.value = false
  }
}

const goBack = () => {
  router.push('/media/archives')
}

// Fetch event by slug
const fetchEvent = async () => {
  const slug = route.params.id as string
  if (!slug) {
    router.push('/media/archives')
    return
  }

  try {
    loading.value = true
    error.value = null
    const data = await eventService.getEventBySlug(slug)
    event.value = data
  } catch (err: any) {
    console.error('Failed to fetch event:', err)
    error.value = 'Event not found'
    // Try to find in mock events as fallback
    const mockEvent = mockEvents.find(e => e.id === slug)
    if (mockEvent) {
      // Convert mock event to Event type
      event.value = mockEvent as any
      error.value = null
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvent()
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-white'">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
        <p class="mt-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading event details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center max-w-md px-4">
        <svg class="mx-auto h-16 w-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Event Not Found</h3>
        <p :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'" class="mb-4">{{ error }}</p>
        <button 
          @click="goBack"
          class="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Back to Events
        </button>
      </div>
    </div>

    <!-- Event Content -->
    <div v-else-if="event">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0">
        <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-800/70 to-green-900/90"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4">
        <div class="flex items-center mb-6">
          <button 
            @click="goBack"
            class="flex items-center text-white/80 hover:text-white transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
        </div>
        
        <div class="max-w-4xl">
          <div class="flex flex-wrap gap-3 mb-6">
            <span class="px-4 py-2 rounded-full text-sm font-semibold" :class="getStatusColor(event.status)">
              {{ event.status }}
            </span>
            <span class="px-4 py-2 rounded-full text-sm font-semibold" :class="getTypeColor(event.type)">
              {{ event.type }}
            </span>
          </div>
          
          <h1 class="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            {{ event.title }}
          </h1>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-white/90">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div class="font-semibold">{{ formatDate(event.date) }}</div>
                <div class="text-sm">{{ event.time }}</div>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div class="font-semibold">{{ event.location }}</div>
                <div class="text-sm">{{ event.venue }}</div>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <div class="font-semibold">{{ event.attendees }} attendees</div>
                <div class="text-sm">Expected capacity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Event Details -->
    <section class="py-16 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-slate-50'">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Description -->
            <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h2 class="text-2xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                About This Event
              </h2>
              <div class="prose prose-lg max-w-none" :class="isDarkMode ? 'prose-invert' : ''">
                <p class="text-lg leading-relaxed whitespace-pre-line" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  {{ event.full_description || event.description }}
                </p>
              </div>
            </div>

            <!-- Speakers -->
            <div v-if="event.speakers && event.speakers.length > 0" class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Featured Speakers
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="speaker in event.speakers" :key="speaker.name" class="flex items-center space-x-4">
                  <img :src="speaker.image" :alt="speaker.name" class="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <h3 class="font-semibold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ speaker.name }}</h3>
                    <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">{{ speaker.title }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Agenda -->
            <div v-if="event.agenda && event.agenda.length > 0" class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Event Agenda
              </h2>
              <div class="space-y-4">
                <div v-for="item in event.agenda" :key="item.time" class="flex items-center space-x-4">
                  <div class="w-20 text-sm font-semibold" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'">
                    {{ item.time }}
                  </div>
                  <div class="flex-1 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    {{ item.session }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Registration Card -->
            <div v-if="canRegister" class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h3 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Register for This Event
              </h3>
              
              <div v-if="!registrationSubmitted" class="space-y-4">
                <div class="text-center p-4 rounded-lg" :class="isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'">
                  <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ event.price }}</div>
                  <div class="text-sm text-green-700 dark:text-green-300">Registration Fee</div>
                </div>
                
                <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  <strong>Registration Deadline:</strong> {{ event.registration_deadline ? formatDate(event.registration_deadline) : 'N/A' }}
                </div>
                
                <form @submit.prevent="submitRegistration" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      Full Name *
                    </label>
                    <input
                      v-model="registrationForm.fullName"
                      type="text"
                      required
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      Email Address *
                    </label>
                    <input
                      v-model="registrationForm.email"
                      type="email"
                      required
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      Phone Number *
                    </label>
                    <input
                      v-model="registrationForm.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      Organization
                    </label>
                    <input
                      v-model="registrationForm.organization"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                      Position
                    </label>
                    <input
                      v-model="registrationForm.position"
                      type="text"
                      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-slate-900'"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    :disabled="isRegistering"
                    class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <span v-if="isRegistering" class="flex items-center justify-center gap-2">
                      <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Registering...
                    </span>
                    <span v-else>Register Now</span>
                  </button>
                </form>
              </div>
              
              <div v-else class="text-center p-6" :class="isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'">
                <svg class="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Registration Successful!</h3>
                <p class="text-green-700 dark:text-green-300">You will receive a confirmation email shortly.</p>
              </div>

              <!-- Error Message -->
              <div v-if="registrationError" class="text-center p-6" :class="isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'">
                <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Registration Failed</h3>
                <p class="text-red-700 dark:text-red-300 mb-4">{{ errorMessage }}</p>
                <p class="text-sm text-red-600 dark:text-red-400">Please try again or contact us directly at contact@gcx.com.gh</p>
              </div>
            </div>

            <!-- Event Info -->
            <div class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h3 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                Event Information
              </h3>
              
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Date & Time</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    {{ formatDate(event.date) }} at {{ event.time }}
                  </p>
                </div>
                
                <div>
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Location</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    {{ event.venue }}<br>
                    {{ event.address }}
                  </p>
                </div>
                
                <div>
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Expected Attendees</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">{{ event.attendees }} participants</p>
                </div>
                
                <div v-if="event.price">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">Registration Fee</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">{{ event.price }}</p>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div v-if="event.requirements && event.requirements.length > 0" class="rounded-2xl p-8 shadow-lg" :class="isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'">
              <h3 class="text-xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                What to Bring
              </h3>
              <ul class="space-y-2">
                <li v-for="requirement in event.requirements" :key="requirement" class="flex items-start">
                  <svg class="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
                  </svg>
                  <span class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ requirement }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
    </div>
  </div>
</template>
