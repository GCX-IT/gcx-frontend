<template>
  <div class="space-y-6 animate-fade-in transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'">
    <!-- Enhanced Header -->
    <div class="shadow-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-green-200 shadow-green-100'">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <i class="pi pi-handshake text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300" :class="isDarkMode ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600'">
              Partner Management
            </h2>
            <p class="mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Manage strategic partnerships and collaborations</p>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="exportPartners"
            class="px-4 py-2 border font-medium transition-all duration-200"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-green-300 text-green-700 hover:bg-green-50 shadow-sm'"
          >
            <i class="pi pi-download mr-2"></i>
            Export
          </button>
          <button
            @click="openAddModal"
            class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
          >
            <i class="pi pi-plus"></i>
            Add Partner
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Search and Filters -->
    <div class="shadow-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-green-200 shadow-green-100'">
      <div class="flex flex-col lg:flex-row gap-4 items-center">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-slate-400 dark:text-slate-400"></i>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search partners by name, description, or email..."
            class="w-full pl-12 pr-4 py-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white/90 border-green-300 text-slate-800 placeholder-slate-500 shadow-sm'"
            @input="debouncedSearch"
          />
        </div>
        
        <div class="flex gap-3">
          <select
            v-model="categoryFilter"
            @change="loadPartners"
            class="px-4 py-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
          >
            <option value="">All Categories</option>
            <option value="financial">Financial Institutions</option>
            <option value="donor">Donor Agencies</option>
            <option value="government">Government Agencies</option>
            <option value="ngo">NGOs</option>
            <option value="private">Private Agencies</option>
            <option value="tender">Tenders & Procurement</option>
          </select>
          
          <select
            v-model="statusFilter"
            @change="loadPartners"
            class="px-4 py-3 border focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <button
            @click="toggleFilters"
            class="px-4 py-3 border transition-all duration-200"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-green-300 text-green-700 hover:bg-green-50 shadow-sm'"
          >
            <i class="pi pi-filter mr-2"></i>
            Filters
          </button>
        </div>
      </div>
      
      <!-- Stats Row -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-green-50/50 border-green-200 shadow-green-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Partners</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ partners.length }}</p>
            </div>
            <i class="pi pi-handshake text-2xl text-green-500 dark:text-green-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-green-50/50 border-green-200 shadow-green-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Active</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ activePartners }}</p>
            </div>
            <i class="pi pi-check-circle text-2xl text-green-500 dark:text-green-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-green-50/50 border-green-200 shadow-green-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Inactive</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ inactivePartners }}</p>
            </div>
            <i class="pi pi-clock text-2xl text-orange-500 dark:text-orange-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-green-50/50 border-green-200 shadow-green-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Suspended</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ suspendedPartners }}</p>
            </div>
            <i class="pi pi-ban text-2xl text-red-500 dark:text-red-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Partners Table -->
    <div class="shadow-lg border overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/90 backdrop-blur-sm border-green-200 shadow-green-100'">
      <div class="overflow-x-auto">
        <table class="w-full table-fixed">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-green-50 to-emerald-50'">
            <tr>
              <th class="w-80 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-building text-slate-500 dark:text-slate-400"></i>
                  Partner & Logo
                </div>
              </th>
              <th class="w-32 px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <i class="pi pi-tag text-slate-500 dark:text-slate-400"></i>
                  Category
                </div>
              </th>
              <th class="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <i class="pi pi-globe text-slate-500 dark:text-slate-400"></i>
                  Website
                </div>
              </th>
              <th class="w-40 px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <i class="pi pi-envelope text-slate-500 dark:text-slate-400"></i>
                  Contact
                </div>
              </th>
              <th class="w-20 px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <i class="pi pi-circle text-slate-500 dark:text-slate-400"></i>
                  Status
                </div>
              </th>
              <th class="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                <div class="flex items-center gap-2">
                  <i class="pi pi-cog text-slate-500 dark:text-slate-400"></i>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="partner in partners" :key="partner.id" class="transition-all duration-200 group" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-green-50/50'">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <!-- Partner Logo -->
                  <div class="w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <img 
                      v-if="partner.logo" 
                      :src="partner.logo" 
                      :alt="partner.name"
                      class="w-full h-full object-contain"
                      @error="handleLogoError"
                    />
                    <div 
                      v-else
                      class="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs"
                    >
                      {{ partner.name.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ partner.name }}</div>
                    <div class="text-xs line-clamp-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                      {{ partner.description ? (partner.description.length > 60 ? partner.description.substring(0, 60) + '...' : partner.description) : 'No description' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 truncate">
                  <i class="pi pi-tag mr-1 text-xs"></i>
                  <span class="truncate">{{ getCategoryLabel(partner.category) }}</span>
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="text-xs">
                  <a 
                    v-if="partner.website" 
                    :href="partner.website" 
                    target="_blank" 
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <i class="pi pi-external-link text-xs"></i>
                    <span class="truncate">Visit</span>
                  </a>
                  <span v-else class="text-slate-400">-</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="text-xs transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  <div v-if="partner.email" class="truncate" :title="partner.email">
                    <i class="pi pi-envelope text-slate-400 text-xs mr-1"></i>
                    {{ partner.email.length > 20 ? partner.email.substring(0, 20) + '...' : partner.email }}
                  </div>
                  <div v-if="partner.phone" class="truncate mt-1" :title="partner.phone">
                    <i class="pi pi-phone text-slate-400 text-xs mr-1"></i>
                    {{ partner.phone }}
                  </div>
                  <span v-if="!partner.email && !partner.phone" class="text-slate-400">-</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span :class="getStatusClass(partner.status)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium">
                  <i :class="getStatusIcon(partner.status)" class="mr-1 text-xs"></i>
                  {{ partner.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    @click="editPartner(partner)"
                    class="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors"
                    title="Edit Partner"
                  >
                    <i class="pi pi-pencil mr-1"></i>
                    Edit
                  </button>
                  <button
                    @click="deletePartner(partner.id)"
                    class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors"
                    title="Delete Partner"
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

      <!-- Enhanced Empty State -->
      <div v-if="partners.length === 0 && !loading" class="text-center py-16">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
          <i class="pi pi-handshake text-3xl text-green-500 dark:text-green-400"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No partners found</h3>
        <p class="mb-6 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Get started by adding your first partner to the system.</p>
        <button
          @click="openAddModal"
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto"
        >
          <i class="pi pi-plus"></i>
          Add Your First Partner
        </button>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div v-if="pagination.totalPages > 0 || partners.length > 0" class="shadow-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-green-200 shadow-green-100'">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
          Showing <span class="font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> to 
          <span class="font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of 
          <span class="font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ pagination.total }}</span> results
        </div>
        
        <!-- Page Numbers -->
        <div v-if="pagination.totalPages > 1" class="flex items-center gap-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
          >
            <i class="pi pi-chevron-left"></i>
          </button>
          
          <!-- Page Numbers -->
          <div class="flex gap-1">
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="changePage(page)"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  page === pagination.page
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700',
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="px-3 py-2 text-sm text-slate-500 dark:text-slate-400"
              >
                ...
              </span>
            </template>
          </div>
          
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
            :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'"
          >
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spin pi-spinner text-2xl text-green-600"></i>
      <p class="mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Loading partners...</p>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-green-200'"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ editingPartner ? 'Edit Partner' : 'Add New Partner' }}
            </h3>
            <button
              @click="closeModal"
              class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="savePartner" class="space-y-4">
            <!-- Logo Upload Section -->
            <div class="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
              <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                <i class="pi pi-image mr-2 text-purple-600"></i>
                Partner Logo
              </h4>
              <div class="flex items-start space-x-6">
                <div class="flex-shrink-0">
                  <div class="w-32 h-32 rounded-xl overflow-hidden border-4 border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800">
                    <img
                      v-if="form.logo"
                      :src="form.logo"
                      alt="Logo Preview"
                      class="w-full h-full object-contain"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="pi pi-image text-4xl text-slate-400"></i>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Choose a logo for this partner. Click on any image to select it.
                  </p>
                  <ImageGallery
                    title="Select Partner Logo"
                    :current-image="form.logo"
                    @image-selected="(img) => form.logo = img.url"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Name *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Category *
                </label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                >
                  <option value="financial">Financial Institutions</option>
                  <option value="donor">Donor Agencies</option>
                  <option value="government">Government Agencies</option>
                  <option value="ngo">NGOs</option>
                  <option value="private">Private Agencies</option>
                  <option value="tender">Tenders & Procurement</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Website
                </label>
                <input
                  v-model="form.website"
                  type="url"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Phone
                </label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-green-300 text-slate-800 shadow-sm'"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Address
              </label>
              <textarea
                v-model="form.address"
                rows="2"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border transition-colors"
                :class="isDarkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-700' : 'text-green-700 border-green-300 hover:bg-green-50 shadow-sm'"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                {{ saving ? 'Saving...' : (editingPartner ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getCMSPartners, createPartner, updatePartner, deletePartner as deletePartnerAPI, type Partner, type CreatePartnerRequest } from '../../services/partnerService'
import { isDarkMode } from '../../utils/darkMode'
import ImageGallery from './ImageGallery.vue'


// State
const partners = ref<Partner[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingPartner = ref<Partner | null>(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const pagination = ref<{
  page: number
  limit: number
  total: number
  totalPages: number
}>({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Form
const form = ref<CreatePartnerRequest>({
  name: '',
  description: '',
  category: 'financial',
  website: '',
  email: '',
  phone: '',
  address: '',
  status: 'active'
})

// Computed properties
const activePartners = computed(() => partners.value.filter(partner => partner.status === 'active').length)
const inactivePartners = computed(() => partners.value.filter(partner => partner.status === 'inactive').length)
const suspendedPartners = computed(() => partners.value.filter(partner => partner.status === 'suspended').length)

const visiblePages = computed(() => {
  if (pagination.value.totalPages <= 1) return []
  
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const pages = []
  
  // Always show first page
  if (total > 0) {
    pages.push(1)
  }
  
  // Calculate range around current page
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  
  // Adjust if we're near the beginning or end
  if (current <= 3) {
    end = Math.min(5, total - 1)
  }
  if (current >= total - 2) {
    start = Math.max(2, total - 4)
  }
  
  // Add ellipsis if there's a gap
  if (start > 2) {
    pages.push('...')
  }
  
  // Add middle pages
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) {
      pages.push(i)
    }
  }
  
  // Add ellipsis if there's a gap
  if (end < total - 1) {
    pages.push('...')
  }
  
  // Always show last page (if more than 1 page)
  if (total > 1) {
    pages.push(total)
  }
  
  return pages
})

// Methods
const loadPartners = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (categoryFilter.value) {
      params.category = categoryFilter.value
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    const response = await getCMSPartners(params)
    partners.value = response.data
    if (response.pagination) {
      // Map backend response (snake_case) to frontend (camelCase)
      const totalPages = (response.pagination as any).total_pages || Math.ceil(response.pagination.total / response.pagination.limit)
      pagination.value = {
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: totalPages
      }
      console.log('📊 Pagination:', pagination.value)
    }
  } catch (error) {
    console.error('Failed to load partners:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = (() => {
  let timeout: number
  return () => {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      pagination.value.page = 1
      loadPartners()
    }, 500)
  }
})()

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadPartners()
  }
}

const openAddModal = () => {
  editingPartner.value = null
  form.value = {
    name: '',
    description: '',
    category: 'financial',
    website: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  }
  showModal.value = true
}

const editPartner = (partner: Partner) => {
  editingPartner.value = partner
  form.value = {
    name: partner.name,
    description: partner.description,
    category: partner.category,
    website: partner.website,
    email: partner.email,
    phone: partner.phone,
    address: partner.address,
    status: partner.status
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingPartner.value = null
}

const savePartner = async () => {
  saving.value = true
  try {
    if (editingPartner.value) {
      await updatePartner(editingPartner.value.id, form.value)
    } else {
      await createPartner(form.value)
    }
    closeModal()
    loadPartners()
  } catch (error) {
    console.error('Failed to save partner:', error)
  } finally {
    saving.value = false
  }
}

const deletePartner = async (id: number) => {
  if (confirm('Are you sure you want to delete this partner?')) {
    try {
      await deletePartnerAPI(id)
      loadPartners()
    } catch (error) {
      console.error('Failed to delete partner:', error)
    }
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'suspended':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return 'pi pi-check-circle'
    case 'inactive':
      return 'pi pi-clock'
    case 'suspended':
      return 'pi pi-ban'
    default:
      return 'pi pi-circle'
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    financial: 'Financial Institutions',
    donor: 'Donor Agencies',
    government: 'Government Agencies',
    ngo: 'NGOs',
    private: 'Private Agencies',
    tender: 'Tenders & Procurement'
  }
  return labels[category] || category
}

const exportPartners = () => {
  // Export functionality can be implemented here
}

const toggleFilters = () => {
  // Toggle filters functionality
}

const viewPartner = (partner: Partner) => {
  // View partner functionality
}

const handleLogoError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // You could add a placeholder image here
  img.src = '/Partners/1-ukaid.jpg'
}


// Lifecycle
onMounted(async () => {
  await loadPartners()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Dark mode scrollbar */
.dark .overflow-x-auto::-webkit-scrollbar-track {
  background: #334155;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
