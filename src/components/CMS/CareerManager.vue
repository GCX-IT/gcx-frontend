<template>
  <div class="career-manager min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-orange-50'">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'">
      <div>
        <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-red-600'">Careers Manager</h2>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-orange-700'">Manage job openings, internships, and career opportunities</p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300" :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'"
      >
        <i class="pi pi-plus"></i>
        Add Career
      </button>
    </div>

    <!-- Filters -->
    <div class="p-4 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Search</label>
          <input
            v-model="searchQuery"
            @input="searchCareers(searchQuery)"
            type="text"
            placeholder="Search careers..."
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Category</label>
          <select
            v-model="categoryFilter"
            @change="filterByCategory(categoryFilter)"
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
          >
            <option value="">All Categories</option>
            <option value="Job Openings">Job Openings</option>
            <option value="Internship">Internship</option>
            <option value="Job Functional Areas">Job Functional Areas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Status</label>
          <select
            v-model="statusFilter"
            @change="filterByStatus(statusFilter)"
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 transition-colors duration-300" :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-orange-300 text-orange-700 hover:bg-orange-50'"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl transition-colors duration-300" :class="isDarkMode ? 'text-blue-600' : 'text-orange-600'"></i>
      <p class="mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-orange-600'">Loading careers...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ error }}</p>
      </div>
    </div>

    <!-- Careers Table -->
    <div v-else class="overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y transition-colors duration-300" :class="isDarkMode ? 'divide-slate-700' : 'divide-orange-200'">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-orange-100'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Department</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">File</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-orange-200'">
            <tr v-for="career in filteredCareers" :key="career.id" class="transition-all duration-200" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-orange-50/50'">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ career.title }}</div>
                <div class="text-sm truncate max-w-xs transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">{{ career.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ career.department }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ career.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(career.status)">
                  {{ career.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <div v-if="career.file_path && career.file_path.trim() !== ''" class="flex items-center">
                  <i class="pi pi-file-pdf text-red-500"></i>
                </div>
                <div v-else class="flex items-center">
                  <i class="pi pi-file text-gray-400"></i>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editCareer(career)"
                  class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors mr-2"
                  title="Edit Career"
                >
                  <i class="pi pi-pencil mr-1"></i> Edit
                </button>
                <button
                  @click="openSlider(career)"
                  class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors mr-2"
                  title="View Career"
                >
                  <i class="pi pi-eye mr-1"></i> View
                </button>
                <button
                  @click="handleDeleteCareer(career.id)"
                  class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                  title="Delete Career"
                >
                  <i class="pi pi-trash mr-1"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 flex items-center justify-between transition-colors duration-300 sm:px-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-200'">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="pagination.page <= 1"
            class="relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" :class="isDarkMode ? 'border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600' : 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page >= pagination.totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" :class="isDarkMode ? 'border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600' : 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50 shadow-sm'"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="pagination.page <= 1"
                class="relative inline-flex items-center px-2 py-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" :class="isDarkMode ? 'border-slate-600 text-slate-400 bg-slate-700 hover:bg-slate-600' : 'border-orange-300 text-orange-500 bg-white hover:bg-orange-50'"
              >
                <i class="pi pi-chevron-left"></i>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300',
                  page === pagination.page
                    ? isDarkMode 
                      ? 'z-10 bg-blue-900/20 border-blue-400 text-blue-400'
                      : 'z-10 bg-orange-100 border-orange-500 text-orange-700'
                    : isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                      : 'bg-white border-orange-300 text-orange-500 hover:bg-orange-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 text-sm font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" :class="isDarkMode ? 'border-slate-600 text-slate-400 bg-slate-700 hover:bg-slate-600' : 'border-orange-300 text-orange-500 bg-white hover:bg-orange-50'"
              >
                <i class="pi pi-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Career Slider -->
    <CareerSlider
      :is-open="showSlider"
      :career="selectedCareer"
      @close="closeSlider"
    />

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-orange-200'"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ editingCareer ? 'Edit Career' : 'Add New Career' }}
            </h3>
            <button @click="closeModal" class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <form @submit.prevent="saveCareer" class="space-y-6 px-6 pb-6">
          <!-- Basic Information Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-info-circle mr-2 text-blue-600"></i>
              Basic Information
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Title *
                </label>
                <input
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter job title"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Category *
                </label>
                <select
                  v-model="formData.category"
                  required
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                >
                  <option value="">Select Category</option>
                  <option value="Job Openings">Job Openings</option>
                  <option value="Internship">Internship</option>
                  <option value="Job Functional Areas">Job Functional Areas</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Career Image Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-image mr-2 text-blue-600"></i>
              Career Flyer Image
            </h4>
            <div class="space-y-4">
              <div v-if="formData.image_path" class="flex items-center justify-between p-4 transition-colors duration-300" :class="isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'">
                <div class="flex items-center space-x-3">
                  <img :src="formData.image_path" :alt="formData.title" class="w-16 h-16 rounded-lg object-cover">
                  <div>
                    <p class="font-medium transition-colors duration-300" :class="isDarkMode ? 'text-green-200' : 'text-green-800'">Career flyer selected</p>
                    <p class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-green-400' : 'text-green-600'">{{ formData.image_path }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="formData.image_path = ''"
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  <i class="pi pi-times mr-1"></i>
                  Remove
                </button>
              </div>
              <div v-else>
                <p class="text-sm mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  Choose a flyer image for this career posting. This will be displayed in the careers list.
                </p>
                <div class="border-2 border-dashed rounded-lg p-6 transition-colors duration-300" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
                  <ImageGallery
                    :current-image="formData.image_path"
                    @image-selected="(image) => { formData.image_path = image.url }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Department and Location Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-building mr-2 text-green-600"></i>
              Department & Location
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Department
                </label>
                <input
                  v-model="formData.department"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter department"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Location
                </label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          <!-- Employment Details Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-briefcase mr-2 text-purple-600"></i>
              Employment Details
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Employment Type
                </label>
                <select
                  v-model="formData.employment_type"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Experience Level
                </label>
                <select
                  v-model="formData.experience_level"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
                >
                  <option value="">Select Level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-file-edit mr-2 text-orange-600"></i>
              Job Description
            </h4>
            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                Description
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                placeholder="Enter job description"
              ></textarea>
            </div>
          </div>

          <!-- Requirements Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-list mr-2 text-red-600"></i>
              Requirements & Benefits
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Requirements
                </label>
                <textarea
                  v-model="formData.requirements"
                  rows="4"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter job requirements"
                ></textarea>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Benefits
                </label>
                <textarea
                  v-model="formData.benefits"
                  rows="4"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter job benefits"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Salary and Dates Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-calendar mr-2 text-indigo-600"></i>
              Salary & Dates
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Salary Range
                </label>
                <input
                  v-model="formData.salary_range"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter salary range"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Application Deadline
                </label>
                <input
                  v-model="formData.application_deadline"
                  type="date"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Start Date
                </label>
                <input
                  v-model="formData.start_date"
                  type="date"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
                />
              </div>
            </div>
          </div>

          <!-- Status and Contact Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              <i class="pi pi-cog mr-2 text-gray-600"></i>
              Status & Contact
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Status
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-orange-300 text-slate-800'"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-orange-700'">
                  Contact Email
                </label>
                <input
                  v-model="formData.contact_email"
                  type="email"
                  class="w-full px-3 py-2 border rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-orange-300 text-slate-800 placeholder-slate-500'"
                  placeholder="Enter contact email"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 transition-colors duration-300" :class="isDarkMode ? 'border-t border-slate-700' : 'border-t border-slate-200'">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-300 bg-slate-700 border-slate-600 hover:bg-slate-600' : 'text-orange-700 bg-white border-orange-300 hover:bg-orange-50'"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
              {{ saving ? 'Saving...' : (editingCareer ? 'Update Career' : 'Create Career') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCareers } from '../../composables/useCareers';
import type { Career } from '../../services/careerService';
import { isDarkMode } from '../../utils/darkMode';
import CareerSlider from '../Common/CareerSlider.vue';
import ImageGallery from './ImageGallery.vue';

const {
  careers,
  loading,
  error,
  pagination,
  searchQuery,
  categoryFilter,
  statusFilter,
  filteredCareers,
  fetchCareers,
  searchCareers,
  filterByCategory,
  filterByStatus,
  clearFilters,
  goToPage,
  nextPage,
  prevPage,
  createCareer,
  updateCareer,
  deleteCareer
} = useCareers();

// Modal state
const showModal = ref(false);
const editingCareer = ref<Career | null>(null);
const saving = ref(false);

// Form data
const formData = ref({
  title: '',
  description: '',
  category: 'Job Openings', // Default required field
  department: '',
  location: '',
  employment_type: 'Full-time', // Default required field
  experience_level: 'Entry Level', // Default required field
  requirements: '',
  responsibilities: '',
  benefits: '',
  salary_range: '',
  application_deadline: '',
  start_date: '',
  status: 'Open',
  contact_email: '',
  image_path: '',
  file_path: '',
  file_name: ''
});

// Slider state
const showSlider = ref(false);
const selectedCareer = ref<Career | null>(null);

// Computed
const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, pagination.value.page - 2);
  const end = Math.min(pagination.value.totalPages, pagination.value.page + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const openAddModal = () => {
  editingCareer.value = null;
  formData.value = {
    title: '',
    description: '',
    category: 'Job Openings', // Default required field
    department: '',
    location: '',
    employment_type: 'Full-time', // Default required field
    experience_level: 'Entry Level', // Default required field
    requirements: '',
    responsibilities: '',
    benefits: '',
    salary_range: '',
    application_deadline: '',
    start_date: '',
    status: 'Open',
    contact_email: '',
    image_path: '',
    file_path: '',
    file_name: ''
  };
  showModal.value = true;
};

const editCareer = (career: Career) => {
  editingCareer.value = career;
  formData.value = {
    title: career.title,
    description: career.description,
    category: career.category,
    department: career.department,
    location: career.location,
    employment_type: career.employment_type,
    experience_level: career.experience_level,
    requirements: career.requirements,
    responsibilities: career.responsibilities,
    benefits: career.benefits,
    salary_range: career.salary_range,
    application_deadline: career.application_deadline ? career.application_deadline.split('T')[0] : '',
    start_date: career.start_date ? career.start_date.split('T')[0] : '',
    status: career.status,
    contact_email: career.contact_email,
    image_path: career.image_path || '',
    file_path: career.file_path || '',
    file_name: career.file_name || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCareer.value = null;
};

const openSlider = (career: Career) => {
  selectedCareer.value = career;
  showSlider.value = true;
};

const closeSlider = () => {
  showSlider.value = false;
  selectedCareer.value = null;
};

const saveCareer = async () => {
  saving.value = true;
  try {
    console.log('📤 Saving career data:', formData.value);
    
    if (editingCareer.value) {
      console.log('🔄 Updating career ID:', editingCareer.value.id);
      // Remove id from update data to avoid conflicts
      const { id, ...updateData } = formData.value as any;
      console.log('📤 Update data (without id):', updateData);
      await updateCareer(editingCareer.value.id, updateData);
    } else {
      console.log('➕ Creating new career');
      await createCareer(formData.value as any);
    }
    closeModal();
  } catch (error) {
    console.error('❌ Error saving career:', error);
  } finally {
    saving.value = false;
  }
};

const handleDeleteCareer = async (id: number) => {
  if (confirm('Are you sure you want to delete this career?')) {
    try {
      await deleteCareer(id);
    } catch (error) {
      console.error('Error deleting career:', error);
    }
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md';
    case 'Closed':
      return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md';
    case 'On Hold':
      return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md';
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-md';
  }
};

// Lifecycle
onMounted(() => {
  fetchCareers();
});
</script>