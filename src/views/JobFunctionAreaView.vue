<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { isDarkMode } from '../utils/darkMode'
import Footer from '../components/Footer.vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const currentPage = ref(1)
const totalPages = 2

// Page 1 content
const page1Content = [
  {
    title: 'Executive Management',
    description: 'Sees to the overall management of all other departments.'
  },
  {
    title: 'Membership and Special Projects',
    description: 'The department is responsible for the acquisition and full integration of new exchange members (producers, traders, processors, buyers, brokers, etc.) from all GCX targeted commodity value chains as well as the retention of current members stimulating them to do more business with the exchange, including the generation of revenue from membership. Lead the exchange in identifying and building productive strategic relationships and partnerships (including but not limited to the government of Ghana, developmental organizations, NGOs, Investors, media, public, etc.) as well as maintaining existing partnerships. Oversee the execution of special projects the Exchange initiates or is a part of.'
  },
  {
    title: 'Corporate Services',
    description: 'The department encompasses four key functions: Human Resources & Administration, Procurement, General Services & Security, and Corporate Affairs & Communication. This department serves as a strategic backbone for organizational effectiveness and stakeholder engagement.',
    subsections: [
      {
        title: 'Human Resources & Administration',
        description: 'This function focuses on critical workforce management areas, including recruitment, training, performance monitoring, employee relations, well-being, and compensation administration. It ensures the development and implementation of human resource policies that promote compliance and align with the organization\'s strategic goals.'
      },
      {
        title: 'General Services & Security',
        description: 'This function plays a pivotal role in maintaining safety, security, and operational efficiency. Its responsibilities include managing health and safety standards, overseeing vehicle and asset maintenance, and coordinating on-site security systems to uphold the highest safety measures for the organization\'s premises, assets, and personnel.'
      },
      {
        title: 'Procurement',
        description: 'As a strategic liaison between the organization and its suppliers, this function facilitates procurement processes by understanding departmental needs and fostering relationships with key suppliers. It ensures supplier performance adheres to contractual obligations and complies with procurement guidelines, supporting the organization\'s operational and strategic objectives.'
      },
      {
        title: 'Corporate Affairs & Communication',
        description: 'The Corporate Affairs & Communication function is central to managing the Exchange\'s internal and external communications. It works collaboratively with internal stakeholders, media, and government entities to effectively implement the GCX communication strategy. This includes: Enhancing stakeholder awareness of GCX operations. Promoting the Exchange\'s image and goodwill. Coordinating agency activities and maintaining strong relationships with stakeholder groups. Additionally, the function raises public awareness of GCX\'s work and ensures a positive corporate image through advertising, social media, and marketing campaigns. These campaigns span multiple platforms, including newspapers, television, radio, SMS applications, and online social media channels.'
      }
    ]
  },
  {
    title: 'Internal Audit',
    description: 'The department is responsible for reviewing the entire operations of the Exchange to assess the effectiveness of internal controls and risk management practices of the Exchange. The department further issues independent, objective, and assurance reports on compliance, performance, and integrity of the financial statements of the Exchange for management and audit committee. The department follows up on both internal and external recommendations to ensure that they are fully implemented by management. The department also mediates between the Exchange and other regulatory bodies.'
  },
  {
    title: 'Information Technology and Information Systems',
    description: 'The department is responsible for providing vision and leadership for developing and implementing information technology initiatives and to direct the planning and implementation of market data in support of Exchange operations, to create and maintain a technology strategy for the Exchange based on an in-depth understanding of the business processes and information flows in a way that ensures that the business strategy and IT investments are aligned.'
  },
  {
    title: 'Operations',
    description: 'The department is responsible for the coordination of the activities of the technical team.'
  },
  {
    title: 'Trading, Central Depository & Market Surveillance',
    description: 'The department is responsible for the Exchange\'s trading activities, processes, data management, transaction reporting, and management of backroom activities. Coordination of deposits and deliveries with the warehouses and the Exchange\'s clearing system, including creation, approval, and management of electronic warehouse receipt accounting, issuing delivery notices to and receiving pick-up notices from Members, and controlling all electronic information flow with the warehouses. Analyze all trading and speculative positions and examine the relationship between trading activity on the Exchange and fundamental factors in the cash market to prevent price distortions or market manipulation. Research commodities traded on the Exchange, review daily trade data, and reports on the fundamental economic factors affecting the trading of each commodity.'
  },
  {
    title: 'Risk, Clearing & Settlement',
    description: 'The Risk, Clearing, and Settlement Department plays a pivotal role in the operations of the Exchange, serving as the medium through which sell members and clients receive monies for commodities sold, and buy members and clients know their net balances after buying commodities from the Exchange. The department is tasked with ensuring the seamless flow of funds between members and clients of the Exchange, thereby fostering trust and transparency in trading activities. The department acts as the Exchange\'s internal bank, managing member and client account updates to reflect trade settlements accurately and efficiently and determines each customer\'s net obligations after each transaction. The department notifies members and clients of their daily net responsibilities, to ensure that there is trade with trust at the Ghana Commodity Exchange.'
  }
]

// Page 2 content
const page2Content = [
  {
    title: 'Warehouse Operations and Quality Control',
    description: 'The department is responsible for the overall development of the warehouse operator\'s physical delivery management system including sampling, weighing, grading, inventory management, stock controls, treatment of goods, and overall warehouse operations. Assist in the development of Exchange procedures and guidelines concerning Warehouse Operators, joint liability, performance guarantees and monitoring, exception handling, indemnity measures, and other matters. Responsible for the full operations of the warehouse receipts system in all warehouses.'
  },
  {
    title: 'Legal and Compliance',
    description: 'The department is responsible for research and analysis of the Rules of the Exchange and Directives, developing and amending Rules, determining when and appropriateness of introducing new Rules to meet changing circumstances, and drafting and presenting Rules. It is also responsible for reviewing all internal agreements and procedures, including those between warehouse operators, clearing institutions, members, and clients, to determine compliance with rules and regulations governing the Exchange.'
  },
  {
    title: 'Value Chains and Product Development',
    description: 'The department is responsible for identifying productive commodity value chains and supporting them to develop tradable products to be traded on the exchange.'
  },
  {
    title: 'Finance & Investment',
    description: 'The department is responsible for the management and oversight of all financial processes and procedures, including budgeting and budget monitoring, financial procedures and internal controls, contract management, cash flow management, computerized accounting systems and procedures, audits, and line management responsibilities.'
  }
]

const currentContent = computed(() => {
  return currentPage.value === 1 ? page1Content : page2Content
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevious = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const goToNext = () => {
  if (currentPage.value < totalPages) {
    goToPage(currentPage.value + 1)
  }
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'">
    <!-- Hero Section -->
    <section class="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img src="/black man in the farm.jpg" alt="Job Function Areas" class="w-full h-full object-cover" />
      </div>
      
      <!-- Ghana Flag Stripes -->
      <div class="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
      <div class="absolute top-2 left-0 w-full h-2 bg-yellow-500"></div>
      <div class="absolute top-4 left-0 w-full h-2 bg-green-600"></div>
      
      <!-- Pattern Overlay -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml;utf8,<svg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;><circle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/></g></g></svg>');"></div>
      </div>
    
      <div class="relative max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Job Function Areas
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Explore the diverse departments and functions that drive Ghana Commodity Exchange
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Page Content -->
        <div class="space-y-8">
          <div
            v-for="(item, index) in currentContent"
            :key="index"
            class="rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl"
            :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'"
          >
            <h2 class="text-2xl md:text-3xl font-bold mb-4 transition-colors duration-300"
                :class="isDarkMode ? 'text-yellow-400' : 'text-green-700'">
              {{ item.title }}
            </h2>
            <p class="text-lg leading-relaxed mb-6 transition-colors duration-300"
               :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
              {{ item.description }}
            </p>
            
            <!-- Subsections for Corporate Services -->
            <div v-if="item.subsections" class="mt-6 space-y-6">
              <div
                v-for="(subsection, subIndex) in item.subsections"
                :key="subIndex"
                class="pl-6 border-l-4 rounded-r-lg p-4"
                :class="isDarkMode ? 'border-yellow-500 bg-slate-700/50' : 'border-green-500 bg-green-50/50'"
              >
                <h3 class="text-xl font-semibold mb-3 transition-colors duration-300"
                    :class="isDarkMode ? 'text-yellow-300' : 'text-green-800'">
                  {{ subsection.title }}
                </h3>
                <p class="text-base leading-relaxed transition-colors duration-300"
                   :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">
                  {{ subsection.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between mt-12 pt-8 border-t"
             :class="isDarkMode ? 'border-slate-700' : 'border-gray-300'">
          <button
            @click="goToPrevious"
            :disabled="currentPage === 1"
            class="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1
              ? (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400')
              : (isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white')"
          >
            <ChevronLeftIcon class="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium transition-colors duration-300"
                  :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
          </div>

          <button
            @click="goToNext"
            :disabled="currentPage === totalPages"
            class="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === totalPages
              ? (isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400')
              : (isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-green-600 hover:bg-green-700 text-white')"
          >
            <span>Next</span>
            <ChevronRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
