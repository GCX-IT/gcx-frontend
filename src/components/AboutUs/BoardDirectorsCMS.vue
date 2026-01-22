<template>
  <div class="space-y-20">
    <!-- Clean Header Section -->
    <div class="text-center">
      <h2 class="text-5xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        Board of Directors
      </h2>
      <div class="w-24 h-0.5 bg-yellow-500 rounded-full mx-auto mb-8"></div>
      <p class="text-lg transition-colors duration-300 max-w-3xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
        Distinguished leaders providing strategic oversight and governance to ensure Ghana Commodity Exchange's continued success.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Loading board members...
        </span>
      </div>
    </div>

    <!-- Professional Board Members Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="member in boardMembers" 
        :key="member.id"
        class="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
        @click="openProfile(member)"
      >
        <!-- Clean Image Container -->
        <div class="relative h-80 overflow-hidden">
          <img 
            :src="member.image || '/placeholder-person.jpg'" 
            :alt="member.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            @error="handleImageError"
          />
          <!-- Subtle Overlay -->
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Clean Content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
            {{ member.name }}
          </h3>
          <p class="text-sm font-medium mb-4 text-yellow-600 dark:text-yellow-400">
            {{ member.position }}
          </p>
          
          <!-- Minimal Social Links -->
          <div class="flex gap-2">
            <a 
              v-if="member.linkedin"
              :href="member.linkedin"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              v-if="member.instagram"
              :href="member.instagram"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
              </svg>
            </a>
            <a 
              v-if="member.facebook"
              :href="member.facebook"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Profile Modal -->
    <div 
      v-if="showProfile && selectedMember"
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      @click="closeProfile"
    >
      <div 
        class="relative max-w-5xl w-full max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200"
        @click.stop
      >
        <!-- Enhanced Close Button -->
        <button 
          @click="closeProfile"
          class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 z-10 border border-slate-200"
        >
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Enhanced Profile Content -->
        <div class="p-10">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <!-- Enhanced Image Section -->
            <div class="relative">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  :src="selectedMember.image" 
                  :alt="selectedMember.name"
                  class="w-full h-[500px] object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              
              <!-- Enhanced Info Card -->
              <div class="absolute -bottom-6 -left-6 right-6 rounded-2xl p-6 bg-white shadow-2xl border border-slate-200">
                <div class="text-2xl font-bold mb-2 text-slate-900">
                  {{ selectedMember.name }}
                </div>
                <div class="text-lg font-semibold text-yellow-600">
                  {{ selectedMember.position }}
                </div>
              </div>
            </div>

            <!-- Enhanced Details Section -->
            <div class="space-y-8">
              <div>
                <h3 class="text-3xl font-bold mb-6 text-slate-900">
                  {{ selectedMember.name }}
                </h3>
                <div class="w-20 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mb-8"></div>
                <div class="prose prose-lg max-w-none">
                  <p class="text-base leading-relaxed text-slate-700 mb-6">
                    {{ selectedMember.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import axios from '../../plugins/axios'

interface BoardMember {
  id: string
  name: string
  position: string
  image: string
  description: string
  linkedin?: string
  facebook?: string
  instagram?: string
}

const loading = ref(false)
const boardMembers = ref<BoardMember[]>([])
const selectedMember = ref<BoardMember | null>(null)
const showProfile = ref(false)

const loadBoardMembers = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/board-members')
    if (response.data.success) {
      boardMembers.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error loading board members:', error)
    // Fallback to default board members if API fails
    boardMembers.value = [
      {
        id: 'yamoah',
        name: 'Mr. Kofi S. Yamoah',
        position: 'Board Chairman',
        image: '/Board of directors/Mr. Kofi S. Yamoah \'Board Chairman\'.png',
        description: `Mr. Yamoah's experience from working at the Ghana Stock Exchange, Central Securities Depository Ltd, Absa Bank Ghana Ltd, Venture Capital Trust Fund and as a Member of the Board of Trustees of the Accra Institute of Technology are key knowledge and skills he brings along and are grounded on years of actual practice from both executive and non-executive roles. They come in especially handy in current times when attention to strategic direction in a post-Covid new normal, challenging and highly competitive environment is very much a necessity. Furthermore, his deep understanding of corporate governance, risk mitigation, regulatory compliance and sustainability issues will be highly beneficial to any entity he may serve whether in an executive role or otherwise, in both private and public sectors.`,
        linkedin: '#',
        facebook: '#',
        instagram: '#'
      },
      {
        id: 'antwi-asimeng',
        name: 'Mr. Stephen Antwi-Asimeng',
        position: 'Non-Executive Director',
        image: '/Board of directors/Mr. Stephen Antwi-Asimeng \' non-excutive director\'.png',
        description: `Mr. Stephen Antwi-Asimeng is an independent financial advisor providing banking, investment, corporate finance, and private equity advisory services to large corporate and SME firms. He has over twenty-eight (28) years' experience in the banking, financial services, and SME business community including over eighteen (18) years in senior executive management positions. Stephen is a valued member and chair of local and international boards of directors, offering strategic leadership and corporate governance support. He served on the board of Africa Venture Capital & Private Equity Association for six (6) years from 2004. Stephen has extensive domain experience in several sectors including banking & financial services, agribusiness, education, pharmaceutical and healthcare. He was selected by the Economic Commission of Africa (ECA) as a member of an ad hoc team of experts on private equity and venture capital as an asset class in SME finance in Africa in 2013 and 2015. Mr. Antwi-Asimeng holds a Master of Arts degree in Banking and Finance from University of Wales, United Kingdom and a Bachelor of Arts degree in Economics and Sociology from the University of Ghana, Legon. He has received executive education from several reputable institutions including INSEAD, Amsterdam Institute of Finance and Harvard Business School.`,
        linkedin: '#',
        facebook: '#',
        instagram: '#'
      },
      {
        id: 'daaku',
        name: 'Mr. Kwame Daaku',
        position: 'Non-Executive Director',
        image: '/Board of directors/Mr. Kwame Daaku \'Non-excutive director\'.jpg',
        description: `Mr. Daaku is a Banker and a financial consultant with over 18 years of experience. He is a Director of Afintek Limited- a financial consulting and management firm. He is also the Executive Director and Cofounder of Nature's Treasure Foods – a food tech startup and an early investor and advisor to Intelocate in Toronto, Canada- a tech company in Toronto in the field of task management. He currently consults on Infrastructure and Project Finance, Derivatives and Mortgage Financing. He began his career with a boutique consulting firm in Accra, Ghana, working with SMEs on strategy and cost optimization. He then joined Ecobank Ghana Limited where he managed credit relationships within the supply chain of regional multinational customers of the bank. He later joined Bank of Nova Scotia in Toronto, Canada in 2006 as a Manager in Special Accounts Management where he helped manage the bank's global corporate credit debt recovery portfolio. He subsequently joined their Global Risk Market team as a Senior Manager managing the Specialized Lending, Asset Managers and Municipal Finance Credit Risk portfolio for the US Market. He then moved to Global Capital Markets Banking as Associate Director for Precious Metals, Base Metals and Foreign Exchange managing an over US$45Bn client relationship portfolio, which involved Asset Managers, Reinsurance, Banks, Sovereign Wealth Funds and Corporates. Kwame is a graduate of the University of Ghana and has an MBA from the Ivey School of Business at Western University in Canada and a Certificate in Emerging Technologies and Renewable Energy from Stanford University. Kwame is an avid volunteer and has raised funds for United Way in Toronto and help establish the United Way GenNEXT on Bay Street, Toronto. He was instrumental in setting up Golden Futures in Canada, an NGO that engaged tutoring young minds in townships in Cape Town together students from the University of Windsor, York University in Toronto as well as Wayne State University in Detroit. He is an avid cyclist and runner. Over the years, he has used his passion for outdoor activities to raise funds for cancer research through the Ride to Conquer Cancer, as well for Juvenile Diabetes Research, Multiple Sclerosis, Becel Ride for Heart for Heart and Stroke Research.`,
        linkedin: '#',
        facebook: '#',
        instagram: '#'
      },
      {
        id: 'dowouna-owoo',
        name: 'Mr. Robert Dowouna Owoo',
        position: 'Acting Chief Executive Officer',
        image: '/Board of directors/Mr. Robert Dowouna Owoo \'Acting Chief Executive officer\'.jpeg',
        description: `Mr. Owoo is a Lawyer by profession and also holds a BSc in Mathematics from the University of Cape Coast, Ghana, and an MSc in Finance and Management from Exeter University, UK. He started his professional career with the Securities and Exchange Commission, Ghana, where he worked in various capacities and has thirteen (13) years' experience in Securities (Capital Market) Regulations and Supervision. Mr. Owoo served as the project director for the Ghana Commodity Exchange project from 2013 and led the Ghana team to design the current Ghana Commodity Exchange (GCX) model for Ghana. One of the founding members of the GCX, he is currently the Acting Chief Executive Officer of the GCX.`,
        linkedin: '#',
        facebook: '#',
        instagram: '#'
      },
      {
        id: 'malm',
        name: 'Mrs. Wendy Malm',
        position: 'Board Secretary',
        image: '/Board of directors/Mrs. Wendy Malm Board Secretary.png',
        description: `Wendy Malm is the head of Trading, Central depository and surveillance at the Ghana Commodity Exchange. In this role she has developed commodity contracts, executed several trading strategies and has continually supervised the processing and execution of all market transactions also ensured that all trades conform to the regulatory requirements of the GCX and the Securities and Exchange Commission. She holds a BA (Hons.) in Economics & Geography from KNUST, Kumasi, Ghana and an MBA in Banking and Finance from the Paris Graduate School of Management, France. She is also certified by the Ghana Stock Exchange as an Authorized Dealing Officer and is a member of the Ghana Stockbrokers Association and a student member of the Institute of Chartered accountants Ghana. Wendy is part of the team that developed the systems and processes towards the setup of the GCX. She represents GCX on the Capital Market Master Plan Group for the development of markets and products. She also serves on the Internal Audit, Health and Safety and Brokers technical Committees at GCX. Prior to joining GCX, she served in several capacities within the SIC group for thirteen years attaining a rank of head of trading. She has Twelve years' experience in Stock trading and operations, Eight (8) years' experience in treasury and fixed income trading and operations and a years' experience in Fund/Portfolio Management. At SIC Brokerage Limited, she also served as a member of the investment committee and shortly as a compliance officer.`,
        linkedin: '#',
        facebook: '#',
        instagram: '#'
      }
    ]
  } finally {
    loading.value = false
  }
}

const openProfile = (member: BoardMember) => {
  selectedMember.value = member
  showProfile.value = true
}

const closeProfile = () => {
  showProfile.value = false
  selectedMember.value = null
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/placeholder-person.jpg'
}

onMounted(() => {
  loadBoardMembers()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
