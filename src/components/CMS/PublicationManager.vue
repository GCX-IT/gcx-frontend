<template>
  <div class="publication-manager transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Publications Manager</h2>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Manage research papers, annual reports, and policy documents</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <i class="pi pi-plus"></i>
        Add Publication
      </button>
    </div>

    <!-- Filters -->
    <div class="rounded-lg p-4 mb-6 shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur-sm border border-blue-200 shadow-blue-100'">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Search</label>
          <input
            v-model="searchQuery"
            @input="searchPublications(searchQuery)"
            type="text"
            placeholder="Search publications..."
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">Category</label>
          <select
            v-model="categoryFilter"
            @change="filterByCategory(categoryFilter)"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
          >
            <option value="">All Categories</option>
            <option value="Research Papers">Research Papers</option>
            <option value="Annual Reports">Annual Reports</option>
            <option value="Policy Documents">Policy Documents</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
      <p class="mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Loading publications...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
        <p class="text-red-800 dark:text-red-200">{{ error }}</p>
      </div>
    </div>

    <!-- Publications Table -->
    <div v-else class="rounded-lg shadow-sm overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-gray-800' : 'bg-white/90 backdrop-blur-sm border border-blue-200 shadow-blue-100'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y transition-colors duration-300" :class="isDarkMode ? 'divide-gray-700' : 'divide-gray-200'">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Title</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Author</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">File</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Downloads</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-500'">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors duration-300" :class="isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'">
            <tr v-for="publication in filteredPublications" :key="publication.id" class="transition-all duration-200" :class="isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50/50'">
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="publication.image_path" class="w-12 h-12 rounded-lg overflow-hidden">
                  <img :src="publication.image_path" :alt="publication.title" class="w-full h-full object-cover">
                </div>
                <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300" :class="isDarkMode ? 'bg-gray-700' : 'bg-gray-200'">
                  <i class="pi pi-image text-gray-400"></i>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ publication.title }}</div>
                <div class="text-sm truncate max-w-xs transition-colors duration-300" :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">{{ publication.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCategoryBadgeClass(publication.category)">
                  {{ publication.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ publication.author }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(publication.status)">
                  {{ publication.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                <div v-if="publication.file_path && publication.file_path.trim() !== ''" class="flex items-center">
                  <i class="pi pi-file-pdf text-red-500"></i>
                </div>
                <div v-else class="flex items-center">
                  <i class="pi pi-file text-gray-400"></i>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                {{ publication.download_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button
                    @click="editPublication(publication)"
                    class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                    title="Edit Publication"
                  >
                    <i class="pi pi-pencil mr-1"></i>
                    Edit
                  </button>
                  <button
                    @click="openSlider(publication)"
                    class="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors"
                    title="View Publication"
                  >
                    <i class="pi pi-eye mr-1"></i>
                    View
                  </button>
                  <button
                    @click="handleDeletePublication(publication.id)"
                    class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                    title="Delete Publication"
                  >
                    <i class="pi pi-trash mr-1"></i>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 flex items-center justify-between border-t transition-colors duration-300 sm:px-6" :class="isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-blue-200'">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="pagination.page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.page >= pagination.totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="prevPage"
                :disabled="pagination.page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="pi pi-chevron-left"></i>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === pagination.page
                    ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="pi pi-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Publication Slider -->
    <PublicationSlider
      :is-open="showSlider"
      :publication="selectedPublication"
      @close="closeSlider"
    />

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-blue-200'"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                  {{ editingPublication ? 'Edit Publication' : 'Add New Publication' }}
                </h3>
            <button @click="closeModal" class="transition-colors duration-300" :class="isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <form @submit.prevent="savePublication" class="space-y-6 px-6 pb-6">
            <!-- Basic Information Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <i class="pi pi-info-circle mr-2 text-blue-600"></i>
                Basic Information
              </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    Title *
                  </label>
                  <input
                    v-model="formData.title"
                    type="text"
                    required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                    placeholder="Enter publication title"
                  />
                </div>
                
                <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    Category *
                  </label>
                  <select
                    v-model="formData.category"
                    required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                  >
                    <option value="">Select Category</option>
                    <option value="Research Papers">Research Papers</option>
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Policy Documents">Policy Documents</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Description Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <i class="pi pi-file-edit mr-2 text-green-600"></i>
                Description
              </h4>
              <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Publication Description
                </label>
                <textarea
                  v-model="formData.description"
                rows="4"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                  placeholder="Enter detailed description of the publication..."
                ></textarea>
              </div>
            </div>

            <!-- Author and Status Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <i class="pi pi-user mr-2 text-purple-600"></i>
                Author & Status
              </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    Author
                  </label>
                  <input
                    v-model="formData.author"
                    type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                    placeholder="Enter author name"
                  />
                </div>
                
                <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
                    Status
                  </label>
                  <select
                    v-model="formData.status"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

          <!-- Publication Image Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              <i class="pi pi-image mr-2 text-blue-600"></i>
              Publication Cover Image
              </h4>
            <div class="space-y-4">
              <div v-if="formData.image_path" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div class="flex items-center space-x-3">
                  <img :src="formData.image_path" :alt="formData.title" class="w-16 h-16 rounded-lg object-cover">
                  <div>
                    <p class="font-medium text-green-800 dark:text-green-200">Cover image selected</p>
                    <p class="text-sm text-green-600 dark:text-green-400">{{ formData.image_path }}</p>
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
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Choose a cover image for this publication. This will be displayed as a thumbnail.
                </p>
                <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                  <ImageGallery
                    :current-image="formData.image_path"
                    @image-selected="(image) => { formData.image_path = image.url }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Publication Document Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              <i class="pi pi-file-pdf mr-2 text-red-600"></i>
              Publication Document (PDF)
            </h4>
            <div class="space-y-4">
              <div v-if="formData.file_path" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div class="flex items-center space-x-3">
                  <i class="pi pi-file-pdf text-red-600 text-2xl"></i>
                  <div>
                    <p class="font-medium text-green-800 dark:text-green-200">Document uploaded</p>
                    <p class="text-sm text-green-600 dark:text-green-400">{{ formData.file_name || 'PDF document' }}</p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    type="button"
                    @click="downloadDocument"
                    class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    <i class="pi pi-download mr-1"></i>
                    Download
                  </button>
                  <button
                    type="button"
                    @click.stop="triggerDocumentUpload"
                    class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                  >
                    <i class="pi pi-upload mr-1"></i>
                    Replace
                  </button>
                  <button
                    type="button"
                    @click="formData.file_path = ''; formData.file_name = ''"
                    class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    <i class="pi pi-times mr-1"></i>
                    Remove
                  </button>
                </div>
              </div>
              <div v-else>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Upload a PDF document for this publication. Users will be able to download this file.
                </p>
                <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center" @click.stop @mousedown.stop>
                  <div class="space-y-4">
                    <i class="pi pi-file-pdf text-4xl text-red-500"></i>
                    <div>
                      <p class="text-lg font-medium text-slate-900 dark:text-white">
                        Click to upload PDF document
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        Only PDF files are allowed (max 10MB)
                      </p>
                    </div>
                    <button
                      type="button"
                      @click.stop="triggerDocumentUpload"
                      :disabled="saving"
                      class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                      <span>{{ saving ? 'Uploading...' : 'Choose PDF File' }}</span>
                    </button>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <!-- Tags Section -->
          <div>
            <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                <i class="pi pi-tags mr-2 text-orange-600"></i>
                Tags
              </h4>
              <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Publication Tags
                </label>
                <input
                  v-model="formData.tags"
                  type="text"
                  placeholder="Enter comma-separated tags (e.g., research, agriculture, policy)"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            :class="isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-blue-300 text-gray-800'"
                />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Separate multiple tags with commas
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeModal"
              class="px-4 py-2 text-sm font-medium border rounded-md transition-colors"
              :class="isDarkMode ? 'text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-600' : 'text-blue-700 bg-white border-blue-300 hover:bg-blue-50 shadow-sm'"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
              <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
              {{ saving ? 'Saving...' : (editingPublication ? 'Update Publication' : 'Create Publication') }}
              </button>
            </div>
          </form>
        </div>
      </div>

    <!-- Hidden file input for document upload -->
    <input
      ref="documentFileInput"
      type="file"
      accept=".pdf"
      @change="handleDocumentUpload"
      @click.stop
      @mousedown.stop
      @keydown.stop
      @keyup.stop
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePublications } from '../../composables/usePublications';
import type { Publication } from '../../services/publicationService';
import { isDarkMode } from '../../utils/darkMode';
import FileUpload from './FileUpload.vue';
import ImageGallery from './ImageGallery.vue';
import documentService from '../../services/documentService';
import PublicationSlider from '../Common/PublicationSlider.vue';

const {
  publications,
  loading,
  error,
  pagination,
  searchQuery,
  categoryFilter,
  filteredPublications,
  fetchPublications,
  searchPublications,
  filterByCategory,
  clearFilters,
  goToPage,
  nextPage,
  prevPage,
  createPublication,
  updatePublication,
  deletePublication
} = usePublications();

// Modal state
const showModal = ref(false);
const editingPublication = ref<Publication | null>(null);
const saving = ref(false);

// Slider state
const showSlider = ref(false);
const selectedPublication = ref<Publication | null>(null);

// Form data
const formData = ref({
  title: '',
  description: '',
  category: '',
  author: '',
  status: 'Published',
  image_path: '',
  file_path: '',
  file_name: '',
  tags: ''
});

// File upload refs
const documentFileInput = ref<HTMLInputElement | null>(null);

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
  editingPublication.value = null;
  formData.value = {
    title: '',
    description: '',
    category: '',
    author: '',
    status: 'Published',
    image_path: '',
    file_path: '',
    file_name: '',
    tags: ''
  };
  showModal.value = true;
};

const editPublication = (publication: Publication) => {
  editingPublication.value = publication;
  formData.value = {
    title: publication.title,
    description: publication.description,
    category: publication.category,
    author: publication.author,
    status: publication.status,
    image_path: publication.image_path || '',
    file_path: publication.file_path,
    file_name: publication.file_name,
    tags: publication.tags
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingPublication.value = null;
};

const openSlider = (publication: Publication) => {
  selectedPublication.value = publication;
  showSlider.value = true;
};

const closeSlider = () => {
  showSlider.value = false;
  selectedPublication.value = null;
};

const savePublication = async () => {
  saving.value = true;
  try {
    if (editingPublication.value) {
      await updatePublication(editingPublication.value.id, formData.value);
    } else {
      await createPublication(formData.value as any);
    }
    closeModal();
  } catch (error) {
    console.error('Error saving publication:', error);
  } finally {
    saving.value = false;
  }
};

const handleDeletePublication = async (id: number) => {
  if (confirm('Are you sure you want to delete this publication?')) {
    try {
      await deletePublication(id);
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  }
};

// Document upload methods
const handleDocumentUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  console.log('📁 File selected:', file);
  
  try {
    const response = await documentService.uploadDocument(file, 'publications');
    
    if (response.success && response.url) {
      formData.value.file_path = response.url;
      formData.value.file_name = response.filename || file.name;
      console.log('✅ Document uploaded successfully:', response.url);
    } else {
      console.error('❌ Document upload failed:', response.error);
      alert('Failed to upload document: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error uploading document:', error);
    alert('Failed to upload document');
  }
  
  // Reset file input
  if (target) {
    target.value = '';
  }
};

const triggerDocumentUpload = () => {
  documentFileInput.value?.click();
};

const downloadDocument = () => {
  if (formData.value.file_path) {
    const link = document.createElement('a');
    link.href = formData.value.file_path;
    link.download = formData.value.file_name || 'publication.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Research Papers':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'Annual Reports':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Policy Documents':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'Archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

// Lifecycle
onMounted(() => {
  fetchPublications();
});
</script>
