<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity duration-300 overflow-hidden"
      @click="close"
    >
        <!-- Sliding Panel -->
        <div
          class="fixed right-0 top-0 h-full w-full max-w-4xl shadow-2xl transform transition-transform duration-300 ease-in-out"
          :class="[
            isOpen ? 'translate-x-0' : 'translate-x-full',
            isDarkMode 
              ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800' 
              : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50'
          ]"
          @click.stop
        >
        <!-- Header -->
        <div 
          class="flex items-center justify-between p-6 border-b transition-colors duration-200"
          :class="isDarkMode 
            ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-900/50' 
            : 'border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50'"
        >
          <h2 
            class="text-2xl font-bold transition-colors duration-200"
            :class="isDarkMode ? 'text-white' : 'text-slate-900'"
          >
            {{ career?.title }}
          </h2>
          <button
            @click="close"
            class="p-2 rounded-lg transition-colors duration-200"
            :class="isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
          >
            <svg 
              class="w-6 h-6 transition-colors duration-200" 
              :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-hide">
          <div class="p-6">
            <!-- Career Image -->
            <div v-if="career?.image_path" class="mb-8">
              <div class="w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  :src="career.image_path" 
                  :alt="career.title"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- Career Info -->
            <div class="space-y-6">
              <!-- Title and Department -->
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <h1 
                    class="text-3xl font-bold transition-colors duration-200"
                    :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                  >
                    {{ career?.title }}
                  </h1>
                  <span 
                    class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="getDepartmentBadgeClass(career?.department)"
                  >
                    {{ career?.department }}
                  </span>
                </div>
                
                <div class="flex items-center gap-4 text-sm"
                     :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{{ career?.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>{{ career?.salary_range }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span 
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(career?.status)"
                    >
                      {{ career?.status }}
                    </span>
                  </div>
                  <div v-if="career?.application_deadline" class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Apply by {{ formatDate(career.application_deadline) }}</span>
                  </div>
                </div>
              </div>

              <!-- Job Description -->
              <div 
                v-if="career?.description" 
                class="pt-6 transition-colors duration-200"
                :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
              >
                <h4 
                  class="text-lg font-semibold mb-4 transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
                >
                  Job Description
                </h4>
                <div class="prose max-w-none">
                  <p 
                    class="leading-relaxed whitespace-pre-line transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                  >
                    {{ career.description }}
                  </p>
                </div>
              </div>

              <!-- Requirements -->
              <div 
                v-if="career?.requirements" 
                class="pt-6 transition-colors duration-200"
                :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
              >
                <h4 
                  class="text-lg font-semibold mb-4 transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
                >
                  Requirements
                </h4>
                <div class="prose max-w-none">
                  <p 
                    class="leading-relaxed whitespace-pre-line transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                  >
                    {{ career.requirements }}
                  </p>
                </div>
              </div>

              <!-- Benefits -->
              <div 
                v-if="career?.benefits" 
                class="pt-6 transition-colors duration-200"
                :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
              >
                <h4 
                  class="text-lg font-semibold mb-4 transition-colors duration-200"
                  :class="isDarkMode ? 'text-slate-200' : 'text-slate-800'"
                >
                  Benefits
                </h4>
                <div class="prose max-w-none">
                  <p 
                    class="leading-relaxed whitespace-pre-line transition-colors duration-200"
                    :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                  >
                    {{ career.benefits }}
                  </p>
                </div>
              </div>

              <!-- Application Info -->
              <div 
                class="pt-6 transition-colors duration-200"
                :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'"
              >
                <div class="flex items-center justify-between p-4 rounded-lg"
                     :class="isDarkMode 
                       ? 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-slate-600' 
                       : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'">
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div>
                      <p 
                        class="font-semibold transition-colors duration-200"
                        :class="isDarkMode ? 'text-white' : 'text-slate-900'"
                      >
                        Ready to Apply?
                      </p>
                      <p 
                        class="text-sm transition-colors duration-200"
                        :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'"
                      >
                        Send your application to {{ career?.contact_email || 'careers@gcx.com' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-6 border-t transition-colors duration-200"
             :class="isDarkMode 
               ? 'border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-900/50' 
               : 'border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50'">
          <div class="flex flex-col sm:flex-row gap-4">
            <button 
              @click="applyForJob"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Apply for This Position
            </button>
            <button 
              @click="close"
              class="flex-1 border-2 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              :class="isDarkMode 
                ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
                : 'border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400'"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDarkMode } from '../../utils/darkMode'
import type { Career } from '../../services/careerService'

interface Props {
  isOpen: boolean
  career: Career | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const close = () => {
  emit('close')
}

const applyForJob = () => {
  if (props.career?.contact_email) {
    const subject = encodeURIComponent(`Application for ${props.career.title}`)
    const body = encodeURIComponent(`Dear Hiring Manager,\n\nI am writing to express my interest in the ${props.career.title} position at GCX.\n\nPlease find my resume and cover letter attached.\n\nBest regards,`)
    window.open(`mailto:${props.career.contact_email}?subject=${subject}&body=${body}`)
  } else {
    window.open('mailto:careers@gcx.com?subject=Job Application')
  }
}

const getDepartmentBadgeClass = (department: string) => {
  switch (department?.toLowerCase()) {
    case 'trading operations':
    case 'trading':
      return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
    case 'technology':
    case 'information technology':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
    case 'finance':
      return 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
    case 'operations':
      return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
    case 'marketing':
      return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg'
    case 'hr':
    case 'human resources':
      return 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
    case 'market research':
      return 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg'
  }
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
    case 'Closed':
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md'
    case 'On Hold':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md'
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
