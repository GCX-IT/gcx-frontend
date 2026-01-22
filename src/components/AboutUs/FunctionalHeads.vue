<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { isDarkMode } from '../../utils/darkMode';
import { usePageContentEditor } from '../../composables/usePageContentEditor';

interface FunctionalHead {
  id: string;
  name: string;
  position: string;
  image: string;
  description: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}

// CMS Content - only for title and subtitle
const { loadPageContent, getContent } = usePageContentEditor('about');

const selectedHead = ref<FunctionalHead | null>(null);
const showProfile = ref(false);

// Load content on mount
onMounted(async () => {
  await loadPageContent();
});

// Dynamic functional heads using CMS content
const functionalHeads = computed(() => [
  {
    id: 'debrah',
    name: getContent('auditor_name', 'Mr. Opoku Debrah'),
    position: getContent('auditor_title', 'Internal Auditor'),
    image: getContent('auditor_image', '/Functional Heads/Mr. Opoku Debrah (Internal Auditor).jpg'),
    description: getContent('auditor_bio', `Mr. Opoku Debrah joined the Ghana Commodity Exchange in March 2023. Opoku comes on board with six years of experience in internal auditing from the rural banking and financial services industry in Ghana. Since joining the Exchange as the first auditor, Opoku has assisted management in developing an internal audit charter and a risk-based audit plan for the year under review.

Opoku worked with many organizations, with the last one being the head of the internal audit department at Akumadan Rural Bank Plc for five years. Working as head of audit with the bank, he managed to ensure sanity and integrity in the operations of the bank.

Opoku holds an H.N.D. in Accounting from Kumasi Technical University and a BCom. Accounting option from the University of Cape Coast, and an MSc. Accounting and Finance from Kwame Nkrumah University of Science and Technology. Opoku is a full member in good standing with the Institute of Chartered Accountants Ghana (ICAG) and also a member of the Institute of Internal Auditors, Ghana.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'ankrah',
    name: getContent('special_project_name', 'Mr. Richard Ankrah'),
    position: getContent('special_project_title', 'Special Project'),
    image: getContent('special_project_image', '/Functional Heads/Mr. Richard Ankrah ( Special Project).jpg'),
    description: getContent('special_project_bio', `Richard Ankrah is an experienced and highly energetic leader heading the Special Projects Unit. Proven track record of driving membership and clientele-base growth through strategic partnerships and effective communication, and executing high-impact, revenue-generating initiatives.

Richard worked as Membership and Business Development Team Lead, GCX, spearheading membership and business development initiatives, identifying strategic partnerships, and driving growth. He was a team member of the GCX Project Phase in charge of Membership, Partnership, and Communications.

He worked as Business Development Manager, Metropolitan Health Insurance; Country Marketing and Client Relations Manager, iBurst Africa; and held various managerial positions at Internet Ghana Company Limited.

Richard holds a Bachelor of Business Administration (BBA) certificate, Master of Business Administration (MBA) in Marketing, Master of Business Administration (MBA) in Entrepreneurship & Corporate Strategy and he is an Associate Member, Institute of Public Relations (IPR), Ghana and Chartered Institute of Marketing (CIM), Ghana respectively.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'ninfaakang',
    name: getContent('risk_membership_name', 'Mr. Vitus Ninfaakang'),
    position: getContent('risk_membership_title', 'Risk, Membership and Partnership'),
    image: getContent('risk_membership_image', '/Functional Heads/Mr. Vitus Ninfaakang (Risk, Membership and Partnership).jpg'),
    description: getContent('risk_membership_bio', `Mr. Vitus Otto Ninfaakang has over seventeen years of experience working in various leadership positions in the business environment in Ghana and West Africa.

At GCX, he led the processes that culminated in the acquisition of warehouses to serve as Exchange designated warehouses licensed by the Ghana Standards Authority and the Security and Exchanges Commission to store grains and issue warehouse receipts for depositors of these commodities. 

He also helped set up the Central Depository of the Exchange to host electronic warehouse receipts and played a leading role in setting up robust risk management and market surveillance systems for the Exchange.

Vitus has extensive knowledge in Exchange Operations gained on the job from the Ghana Commodity Exchange and from working visits to Commodity Exchanges in New York, Chicago, Dubai, Abu Dhabi, and Mumbai.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'oppong-gyamfi',
    name: getContent('corporate_services_name', 'Mrs. Jemimah Naa Adjeley Oppong-Gyamfi'),
    position: getContent('corporate_services_title', 'Corporate Services'),
    image: getContent('corporate_services_image', '/Functional Heads/Mrs. Jemimah Naa Adjeley Oppong-Gyamfi ( Corporate Services).jpg'),
    description: getContent('corporate_services_bio', `Mrs. Oppong-Gyamfi is a collaborative leader with excellent communication skills, and she is known for her ability to foster effective relationships at all organizational levels. She holds an Associate Membership from the Chartered Institute of Human Resource Management in Ghana and a SHRM Senior Certified Professional certification from the Society of Human Resource Management in the USA. Her educational background includes an MBA in Human Resource Management from Methodist University College, Ghana, and a BA in English from Kwame Nkrumah University of Science and Technology. Before her role as Head of Corporate Services at the Exchange, Jemimah held positions such as HR Manager, West Africa at SMEC International Pty Ltd, HR & Office Manager at Technology Management Group Ltd, Team Leader for Talent Resourcing & Onboarding at UBA Ghana, Human Resource Officer at UT Bank (now GCB), and Marketing Executive at Combert Impressions Ltd.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'malm',
    name: getContent('operations_name', 'Mrs. Wendy Malm'),
    position: getContent('operations_title', 'Operations'),
    image: getContent('operations_image', '/Functional Heads/Mrs. Wendy Malm (Operations).jpg'),
    description: getContent('operations_bio', `Wendy Malm is a seasoned expert in trade and operations, with extensive experience in developing trading contracts and executing trade strategies.

As a key member of the team that established the Ghana Commodity Exchange (GCX), she currently heads operations, leveraging her previous experience as Head of Trading, Central Depository, and Surveillance.

Before joining GCX, Wendy spent 13 years with the SIC group, rising to Head of Trading. Her background includes 12 years in stock trading and operations, 8 years in treasury and fixed income trading, and 1 year in fund/portfolio management.

Wendy is a Chartered Accountant and holds a BA (Hons.) in Economics and Geography from KNUST and an MBA in Banking and Finance from the Paris Graduate School of Management. She's also a certified Authorized Dealing Officer of the Ghana Stock Exchange.

Wendy serves in key roles, including being GCX's Company Secretary, Chair of the Broker's Technical Committee, and member of the Products and Markets working group under Ghana's Capital Market Master Plan Committee.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'nyamekye',
    name: getContent('value_chain_name', 'Mr. Godfred Kofi Nyamekye'),
    position: getContent('value_chain_title', 'Value Chain and Product Development'),
    image: getContent('value_chain_image', '/Functional Heads/Mr. Godfred Kofi Nyamekye (Value Chain and Product Development).jpg'),
    description: getContent('value_chain_bio', `Mr. Godfred Kofi Nyamekye is an Experienced Agricultural and Value chain expert with over ten (10) years of extensive experience with Agriculture development interventions in Ghana. He has worked with several international donor-funded projects, with DPs such as USAID, EU, AFD, and GIZ in various technical and management capacities. He is skilled in capacity building in good agronomic practices, revolving input fund management, value links, value chain analysis, post-harvest management, contract farming, organizational development, and marketing linkages.

Strong consulting professional with a Master of Philosophy (M.Phil.) focused on Post-harvest Technology from the Kwame Nkrumah University of Science and Technology. He currently heads the Value Chains and Product Development at GCX.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'aryeetey',
    name: getContent('warehouse_quality_name', 'Mr. Gabriel Aryeetey'),
    position: getContent('warehouse_quality_title', 'Warehouse & Quality'),
    image: getContent('warehouse_quality_image', '/Functional Heads/Mr. Gabriel Aryeetey (Warehouse & Quality).jpg'),
    description: getContent('warehouse_quality_bio', `Mr. Gabriel Tettey Aryeetey is the Warehouse Operations and Quality Control Manager for Ghana Commodity Exchange and he has held this position since the inception of Ghana Commodity Exchange in 2018. He was sorely responsible for the setting up of all ten warehouses currently being operated by the Exchange across the country.

He is also noted for the establishment of delivery and managerial systems (including sampling, weighing, grading, inventory management, and stock control) for agriculture commodities with a specialization in grain management. He is also responsible for the development of exchange procedures and guidelines regarding the selection and training of warehouse operators and staff.

He has over 15 years of experience in warehouse management. His first four years of working career were at Jandel Limited as a warehouse and cost analysis officer, spent another nine years at Wienco Ghana Limited as the Northern sector warehouse manager and established grain warehouses in Tumu, Tamale, Wa, Kintampo just to name a few before switching to Ghana commodity exchange.

Gabriel T. Aryeetey holds an MBA in Business Administration from KNUST and a Bachelor's degree in Business Management from UCC and is a German-trained and certified fumigator. He is also a Ghana Standard Authority certified grain grader with 5 years of experience.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'okai-tettey',
    name: getContent('it_systems_name', 'Dr. Harold Okai-Tettey'),
    position: getContent('it_systems_title', 'Information Technology and Information System'),
    image: getContent('it_systems_image', '/Functional Heads/Dr. Harold Okai-Tettey ( Information Technology and Information System).jpg'),
    description: getContent('it_systems_bio', `Dr. Harold Okai-Tettey is an avid researcher and practitioner of Computer Science. He holds a PhD degree in Computer Science from Rhodes University, South Africa, where he also obtained BSc and BSc (Hons) degrees in Computer Science and Electronics. Harold's research interest focuses on High Performance Digital Networks; Biometrics and Smart card applications; Automation and Control, and Artificial Intelligence. He contributed to R&D work for Yamaha Corporation (Hamamatsu – Japan), NEC Corporation (Tokyo-Japan), and UMAN GmbH (South Africa), as well as attended and participated in a number of conferences and conventions organized by the Audio Engineering Society.

Harold is also Executive Director of HarTet Technologies Limited, a technology research firm focused on R&D and consultancy in line with systems automation. He was the lead consultant on a number of projects with firms such as Genser Energy, ACDI VOCA Ghana, Ghana Poultry Project, Ghana Grains Council, Ministry of Food and Agriculture, and the Ghana Commodity Exchange. Harold is also the lead solutions architect of SmartSale ERP (a Biometric and Smart card-enabled solution for the retail industry). Harold enjoys teaching courses in Computer Networks, Artificial Intelligence, Embedded Systems, and Software Development. He has over 8 years of teaching experience, he is an advisory member of the National Accreditation Board (under the Ministry of Education) and is a member of the Audio Engineering Society and the IEEE Computer Society.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'tagoe',
    name: getContent('finance_investments_name', 'Mr. Albert Nii Ayi Tagoe'),
    position: getContent('finance_investments_title', 'Finance and Investments'),
    image: getContent('finance_investments_image', '/Functional Heads/Mr. Albert Nii Ayi Tagoe (Finance and Investments).jpg'),
    description: getContent('finance_investments_bio', `Mr. Albert Tagoe is a Chartered Management Accountant and is currently the Head of Finance and Investment at the Ghana Commodity Exchange and has over a decade of experience in Financial Management. Albert was awarded in March 2023 as part of the Top 30 Public Sector Finance Leaders in Ghana. He holds an MBA in Finance with Distinction from Coventry University (UK) and holds a Chartered Professional Membership with the Chartered Institute of Management Accountants (CIMA-UK), and the Institute of Chartered Accountants Ghana (ICAG-GH).

He holds a First-Class Honours degree in Bachelor of Business Administration (Accounting Option) from Valley View University and a certification by the Ghana Stock Exchange for Investment and Securities. Albert joined the Exchange for its implementation in January 2018 and has supported in setting up a robust and dynamic finance and control unit for the business with his expertise in Financial Management and Reporting, Financial Analysis, Budgeting and Financial projections, Treasury Management, Investment, Internal and External Audit, and Financial controls and Taxation. As part of his portfolio, he currently leads the teams' engagement with Financial Institutions to extend financing to smallholder farmers in Ghana under its' Warehouse Receipt and Aggregation Financing programme where the commodities serve as collateral for the financial institutions.

Albert worked for (7) years with Stanbic Bank Ghana in Credit Risk Management and Banking operations and received a Beyond Excellence Award in 2017 for service excellence. He also received an award as the Top Performing Student in Ghana in the CIMA Strategic Case Study Exam and the Top Performing Student in Ghana in the CIMA Performance Strategy Paper in 2014.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  }
]);

const openProfile = (head: FunctionalHead) => {
  selectedHead.value = head;
  showProfile.value = true;
};

const closeProfile = () => {
  showProfile.value = false;
  selectedHead.value = null;
};
</script>

<template>
  <div class="space-y-20">
    <!-- Clean Header Section -->
    <div class="text-center">
      <h2 class="text-5xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        {{ getContent('functional_heads_title', 'Functional Heads') }}
      </h2>
      <div class="w-24 h-0.5 bg-yellow-500 rounded-full mx-auto mb-8"></div>
      <p class="text-lg transition-colors duration-300 max-w-3xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
        {{ getContent('functional_heads_subtitle', 'Our functional leaders ensure operational excellence across all departments.') }}
      </p>
    </div>

    <!-- Professional Functional Heads Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="head in functionalHeads" 
        :key="head.id"
        class="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
        @click="openProfile(head)"
      >
        <!-- Clean Image Container -->
        <div class="relative h-80 overflow-hidden">
          <img 
            :src="head.image" 
            :alt="head.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <!-- Subtle Overlay -->
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Clean Content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
            {{ head.name }}
          </h3>
          <p class="text-sm font-medium mb-4 text-yellow-600 dark:text-yellow-400">
            {{ head.position }}
          </p>
          
          <!-- Minimal Social Links -->
          <div class="flex gap-2">
            <a 
              v-if="head.linkedin"
              :href="head.linkedin"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              v-if="head.instagram"
              :href="head.instagram"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
              </svg>
            </a>
            <a 
              v-if="head.facebook"
              :href="head.facebook"
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
      v-if="showProfile && selectedHead"
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
          <!-- Two Column Layout -->
          <div class="flex gap-10">
            <!-- Left Column - Image -->
            <div class="relative flex-shrink-0" style="width: 300px;">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  :src="selectedHead.image" 
                  :alt="selectedHead.name"
                  class="w-full h-[400px] object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
              
              <!-- Info Card Overlay -->
              <div class="absolute -bottom-4 -left-4 rounded-2xl p-4 bg-white shadow-xl border border-slate-200">
                <div class="text-lg font-bold mb-1 text-slate-900">
                  {{ selectedHead.name }}
                </div>
                <div class="text-sm font-semibold text-yellow-600">
                  {{ selectedHead.position }}
                </div>
              </div>
            </div>

            <!-- Right Column - Text Content -->
            <div class="flex-1">
              <h3 class="text-3xl font-bold mb-4 text-slate-900">
                {{ selectedHead.name }}
              </h3>
              <div class="w-16 h-1 bg-yellow-500 rounded-full mb-6"></div>
              <p class="text-base leading-relaxed text-slate-700 whitespace-pre-line">
                {{ selectedHead.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
