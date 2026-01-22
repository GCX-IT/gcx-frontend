<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { isDarkMode } from '../../utils/darkMode';
import { usePageContentEditor } from '../../composables/usePageContentEditor';

interface Executive {
  id: string;
  name: string;
  position: string;
  image: string;
  description: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
}

// CMS Content
const { loadPageContent, getContent } = usePageContentEditor('about');

const selectedExecutive = ref<Executive | null>(null);
const showProfile = ref(false);

// Load content on mount
onMounted(async () => {
  await loadPageContent();
});

// Dynamic executives using CMS content
const executives = computed(() => [
  {
    id: 'dowuona-owoo',
    name: getContent('ceo_name', 'Mr. Robert Dowuona Owoo'),
    position: getContent('ceo_title', 'Acting Chief Executive Officer'),
    image: getContent('ceo_image', '/Mr. Robert Dowuona Owoo.jpeg'),
    description: getContent('ceo_bio', `Robert Dowuona Owoo is a Lawyer by profession and holds a BSc in Mathematics from the University of Cape Coast, Ghana, and an MSc in Finance and Management from Exeter University, UK.

He started his professional career with the Securities and Exchange Commission, Ghana, where he worked in various capacities and has thirteen (13) years' experience in Securities (Capital Market) Regulations and Supervision.

Mr. Robert Dowuona Owoo left his position as Head of Research, Policy, and IT at the Securities and Exchange Commission in 2013 to lead a team of experts as the first project director for the Ghana Commodity Exchange project from 2013 to 2017. He successfully led the Ghana team in designing the current Ghana Commodity Exchange (GCX) model for Ghana.

Being the first of its kind in the West Africa sub-region, the GCX design and model are recognized as an innovative model that is currently being studied by other countries within Africa, and the West Africa sub-region is seeking to establish a functioning commodity exchange. As a founding member of the Ghana Commodity Exchange, Mr. Dowuona Owoo has helped to successfully implement the GCX model, which has helped structure Agricultural Commodity Trading in Ghana.

Mr. Robert Dowuona Owoo is currently the Acting Chief Executive Officer of the GCX, doubling up as the Head of Legal, Compliance, and Enforcement.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  },
  {
    id: 'atoklo',
    name: getContent('deputy_ceo_name', 'Ms. Ophelia Martekuo Atoklo'),
    position: getContent('deputy_ceo_title', 'Acting Deputy Chief Executive Officer'),
    image: getContent('deputy_ceo_image', '/Ms. Ophelia Martekuo Atoklo \'Deputy Chief Executive Officer\'.jpg'),
    description: getContent('deputy_ceo_bio', `Ms. Ophelia Martekuo Atoklo brings to the Ghana Commodity Exchange (GCX) over a decade of experience in human capital management, organizational leadership, and administrative excellence, with a diverse background spanning the healthcare, optical, environmental, and waste management services sectors.

She joins GCX from the Accra Compost & Recycling Plant (a subsidiary of the Jospong Group), where she served as Human Capital and Administrative Manager. In that role, she led strategic initiatives in talent management, compensation, compliance, employee wellness, and administrative operations, driving strong alignment between people strategy and institutional performance in a dynamic industrial environment.

Previously, Ms. Atoklo held senior HR leadership positions at Robert & Sons Ltd and Habana Medical Services. Her responsibilities included managing the full spectrum of HR functions—from recruitment and performance management to employee relations and regulatory compliance. She is credited with designing and implementing critical frameworks such as grading systems, band structures, and business continuity strategies, which significantly enhanced operational efficiency and staff retention.

Ms. Atoklo holds a Bachelor of Arts degree in Sociology and Political Science from the University of Ghana, an Executive MBA, and an MBA in Strategic and Human Resource Management, respectively, from the Kwame Nkrumah University of Science and Technology. She has also earned a Bachelor of Laws (LLB) degree from the University of Professional Studies, Accra. In addition, Ms. Atoklo is trained in Team Leadership and People's Management by the Institute of Leadership and Strategy, and is currently a trainee with the SPHRi (Senior Professional in Human Resources – International) for certification.

Known for her disciplined and collaborative leadership style, she is passionate about inclusive leadership, staff development, and building systems that drive innovation and institutional transformation.

As Acting Deputy Chief Executive Officer of GCX, Ms. Atoklo will support the CEO in the overall management of the Exchange, with specific oversight of operations, corporate services, and capacity-building initiatives. She will play a pivotal role in aligning GCX's operational and human capital strategies with its mission to promote inclusive agricultural trade and market development across Ghana.`),
    linkedin: '#',
    instagram: '#',
    facebook: '#'
  }
]);

const openProfile = (executive: Executive) => {
  selectedExecutive.value = executive;
  showProfile.value = true;
};

const closeProfile = () => {
  showProfile.value = false;
  selectedExecutive.value = null;
};
</script>

<template>
  <div class="space-y-20">
    <!-- Clean Header Section -->
    <div class="text-center">
      <h2 class="text-5xl font-bold mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
        {{ getContent('leadership_title', 'Executive Management') }}
      </h2>
      <div class="w-24 h-0.5 bg-yellow-500 rounded-full mx-auto mb-8"></div>
      <p class="text-lg transition-colors duration-300 max-w-3xl mx-auto leading-relaxed" :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'">
        {{ getContent('leadership_subtitle', 'Experienced leaders driving Ghana Commodity Exchange\'s strategic vision and operational excellence.') }}
      </p>
    </div>

    <!-- Professional Executive Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div 
        v-for="executive in executives" 
        :key="executive.id"
        class="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer"
        @click="openProfile(executive)"
      >
        <!-- Clean Image Container -->
        <div class="relative h-[600px] overflow-hidden">
          <img 
            :src="executive.image" 
            :alt="executive.name"
            class="w-full h-full object-cover object-center object-top transition-transform duration-500 group-hover:scale-105"
          />
          <!-- Subtle Overlay -->
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Clean Content -->
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
            {{ executive.name }}
          </h3>
          <p class="text-sm font-medium mb-4 text-yellow-600 dark:text-yellow-400">
            {{ executive.position }}
          </p>
          
          <!-- Minimal Social Links -->
          <div class="flex gap-2">
            <a 
              v-if="executive.linkedin"
              :href="executive.linkedin"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              v-if="executive.instagram"
              :href="executive.instagram"
              class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200"
              @click.stop
            >
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/>
              </svg>
            </a>
            <a 
              v-if="executive.facebook"
              :href="executive.facebook"
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
      v-if="showProfile && selectedExecutive"
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
          <!-- Image Section -->
          <div class="relative mb-8">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl mx-auto" style="width: 300px;">
              <img 
                :src="selectedExecutive.image" 
                :alt="selectedExecutive.name"
                class="w-full h-[400px] object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
            
            <!-- Info Card -->
            <div class="absolute -bottom-4 -left-4 rounded-2xl p-4 bg-white shadow-xl border border-slate-200">
              <div class="text-lg font-bold mb-1 text-slate-900">
                {{ selectedExecutive.name }}
              </div>
              <div class="text-sm font-semibold text-yellow-600">
                {{ selectedExecutive.position }}
              </div>
            </div>
          </div>

          <!-- Text Content Below Image -->
          <div class="text-justify">
            <div class="w-16 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mb-6"></div>
            <p class="text-base leading-relaxed text-slate-700 whitespace-pre-line max-w-4xl">
              {{ selectedExecutive.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
