<template>
  <div class="commodity-manager min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-green-50'">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-green-200'">
      <div>
        <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">Commodities Manager</h2>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-700'">Manage commodity trading information and market data</p>
      </div>
      <div class="flex gap-3">
        <button
          @click="activeTab = 'contract-types'"
          :class="activeTab === 'contract-types' 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : isDarkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-green-100 hover:bg-green-200 text-green-700'"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <i class="pi pi-list"></i>
          Manage Contract Types
        </button>
        <button
          @click="openAddModal"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'"
        >
          <i class="pi pi-plus"></i>
          Add Commodity
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6 p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-green-200'">
      <div class="border-b transition-colors duration-300" :class="isDarkMode ? 'border-slate-700' : 'border-green-200'">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'commodities'"
            :class="activeTab === 'commodities'
              ? isDarkMode ? 'border-green-400 text-green-400' : 'border-green-500 text-green-600'
              : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300' : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            Commodities
          </button>
          <button
            @click="activeTab = 'contract-types'"
            :class="activeTab === 'contract-types'
              ? isDarkMode ? 'border-green-400 text-green-400' : 'border-green-500 text-green-600'
              : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300' : 'border-transparent text-green-500 hover:text-green-700 hover:border-green-300'"
            class="whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors"
          >
            Contract Types
          </button>
        </nav>
      </div>
    </div>

    <!-- Commodities Tab Content -->
    <div v-if="activeTab === 'commodities'">
      <!-- Filters -->
      <div class="p-6 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-green-200'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Search</label>
          <input
            v-model="searchQuery"
            @input="searchCommodities(searchQuery)"
            type="text"
            placeholder="Search commodities..."
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Category</label>
          <select
            v-model="categoryFilter"
            @change="filterByCategory(categoryFilter)"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
          >
            <option value="">All Categories</option>
            <option value="Grains">Grains</option>
            <option value="Oilseeds">Oilseeds</option>
            <option value="Legumes">Legumes</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Status</label>
          <select
            v-model="statusFilter"
            @change="filterByStatus(statusFilter)"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 rounded-lg transition-colors"
            :class="isDarkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-green-100 hover:bg-green-200 text-green-700'"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl transition-colors duration-300" :class="isDarkMode ? 'text-green-400' : 'text-green-600'"></i>
      <p class="mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-green-600'">Loading commodities...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ error }}</p>
      </div>
    </div>

    <!-- Commodities Table -->
    <div v-else class="overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'">
      <div class="overflow-x-auto">
        <table class="min-w-full transition-colors duration-300" :class="isDarkMode ? 'divide-slate-700' : 'divide-green-200'">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-green-50'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Commodity</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Current Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Change</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Image</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Actions</th>
            </tr>
          </thead>
          <tbody class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-green-200'">
            <tr v-for="commodity in filteredCommodities" :key="commodity.id" class="transition-colors duration-300" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-green-50/50'">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ commodity.name }}</div>
                <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">{{ commodity.origin_country }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ commodity.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getCategoryBadgeClass(commodity.category)">
                  {{ commodity.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <div class="font-medium">{{ commodity.price_unit }} {{ commodity.current_price.toLocaleString() }}</div>
                <div class="text-xs transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">{{ commodity.contract_size }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center">
                  <span :class="commodity.price_change >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')">
                    {{ commodity.price_change >= 0 ? '+' : '' }}{{ commodity.price_change.toFixed(2) }}
                  </span>
                  <span class="ml-1 text-xs" :class="commodity.price_change_percent >= 0 ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-red-400' : 'text-red-600')">
                    ({{ commodity.price_change_percent >= 0 ? '+' : '' }}{{ commodity.price_change_percent.toFixed(2) }}%)
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusBadgeClass(commodity.market_status)">
                  {{ commodity.market_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <div v-if="commodity.image_path && commodity.image_path.trim() !== ''" class="flex items-center">
                  <i class="pi pi-image text-green-500"></i>
                </div>
                <div v-else class="flex items-center">
                  <i class="pi pi-image transition-colors duration-300" :class="isDarkMode ? 'text-slate-500' : 'text-gray-400'"></i>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editCommodity(commodity)"
                  class="mr-3 transition-colors duration-300"
                  :class="isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'"
                >
                  Edit
                </button>
                <button
                  @click="handleDeleteCommodity(commodity.id)"
                  class="transition-colors duration-300"
                  :class="isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="prevPage"
            :disabled="pagination.page <= 1"
            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600' : 'border-green-300 text-green-700 bg-white hover:bg-green-50'"
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
            <p class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
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
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-300',
                  page === pagination.page
                    ? isDarkMode ? 'z-10 bg-blue-900/20 border-blue-400 text-blue-400' : 'z-10 bg-green-50 border-green-500 text-green-600'
                    : isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600' : 'bg-white border-green-300 text-green-500 hover:bg-green-50'
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
    </div>

    <!-- Contract Types Tab Content -->
    <div v-if="activeTab === 'contract-types'" class="space-y-6">
      <!-- Commodity Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Commodity</h3>
        <div class="flex gap-4 items-end">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Commodity</label>
            <select
              v-model="selectedCommodityForContractTypes"
              @change="loadContractTypes"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
            >
              <option value="">Select a commodity to manage contract types</option>
              <option v-for="commodity in commodities" :key="commodity.id" :value="commodity.id">
                {{ commodity.name }}
              </option>
            </select>
          </div>
          <button
            v-if="selectedCommodityForContractTypes"
            @click="openAddContractTypeModal"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <i class="pi pi-plus"></i>
            Add Contract Type
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingContractTypes" class="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-sm">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading contract types...</p>
      </div>

      <!-- Contract Types List -->
      <div v-else-if="selectedCommodityForContractTypes && contractTypes.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Contract Types for {{ getSelectedCommodityName() }}
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sort Order</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="contractType in contractTypes" :key="contractType.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img v-if="contractType.image_path" :src="contractType.image_path" :alt="contractType.name" class="h-10 w-10 rounded-lg object-cover">
                      <div v-else class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <i class="pi pi-image text-gray-400"></i>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ contractType.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ contractType.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ contractType.code }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="contractType.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ contractType.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ contractType.sort_order }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editContractType(contractType)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                    Edit
                  </button>
                  <button @click="deleteContractType(contractType.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="selectedCommodityForContractTypes && contractTypes.length === 0" class="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow-sm">
        <div class="text-gray-400 dark:text-gray-500 mb-4">
          <i class="pi pi-list text-4xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Contract Types</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">No contract types have been created for this commodity yet.</p>
        <button @click="openAddContractTypeModal" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto">
          <i class="pi pi-plus"></i>
          Add First Contract Type
        </button>
      </div>
    </div>

    <!-- Add/Edit Contract Type Modal -->
    <div v-if="showContractTypeModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeContractTypeModal">
      <div class="relative top-5 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ editingContractType ? 'Edit Contract Type' : 'Add New Contract Type' }}
            </h3>
            <button @click="closeContractTypeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveContractType" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Name *</label>
                <input
                  v-model="contractTypeFormData.name"
                  type="text"
                  required
                  placeholder="e.g., Paddy Rice, Milled Rice"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Code *</label>
                <input
                  v-model="contractTypeFormData.code"
                  type="text"
                  required
                  placeholder="e.g., PADDY, MILLED, PARBOILED"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Description</label>
              <textarea
                v-model="contractTypeFormData.description"
                rows="3"
                placeholder="Brief description of this contract type..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Full Description</label>
              <textarea
                v-model="contractTypeFormData.full_description"
                rows="4"
                placeholder="Detailed description for the slider panel..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Contract Size</label>
                <input
                  v-model="contractTypeFormData.contract_size"
                  type="text"
                  placeholder="e.g., 50kg bags"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Trading Hours</label>
                <input
                  v-model="contractTypeFormData.trading_hours"
                  type="text"
                  placeholder="e.g., Monday-Friday 9:00-17:00"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Price Unit</label>
                <input
                  v-model="contractTypeFormData.price_unit"
                  type="text"
                  placeholder="e.g., GHC per bag"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Delivery Months</label>
              <input
                v-model="contractTypeFormData.delivery_months"
                type="text"
                placeholder="e.g., March, May, July, September"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Specifications</label>
              <textarea
                v-model="contractTypeFormData.specifications"
                rows="3"
                placeholder="Trading specifications and requirements..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Storage Requirements</label>
              <textarea
                v-model="contractTypeFormData.storage_requirements"
                rows="2"
                placeholder="Storage and handling requirements..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Quality Standards</label>
              <textarea
                v-model="contractTypeFormData.quality_standards"
                rows="2"
                placeholder="Quality standards and certifications..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Sort Order</label>
                <input
                  v-model="contractTypeFormData.sort_order"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div class="flex items-center">
                <label class="flex items-center">
                  <input
                    v-model="contractTypeFormData.is_active"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Active (visible in frontend)</span>
                </label>
              </div>
            </div>

            <!-- Contract Type Image -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i class="pi pi-image text-blue-600 mr-2"></i>
                Contract Type Image
              </h4>
              <div class="space-y-4">
                <div v-if="contractTypeFormData.image_path" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <img :src="contractTypeFormData.image_path" :alt="contractTypeFormData.name" class="w-12 h-12 rounded-lg object-cover">
                    <div>
                      <p class="font-medium text-green-800 dark:text-green-200">Image selected</p>
                      <p class="text-sm text-green-600 dark:text-green-400">{{ contractTypeFormData.image_path }}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="contractTypeFormData.image_path = ''"
                    class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                  >
                    <i class="pi pi-times mr-1"></i>
                    Remove
                  </button>
                </div>
                <div v-else>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Choose an image for this contract type. This will be displayed in the slider panel.
                  </p>
                  <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    <ImageGallery
                      :current-image="contractTypeFormData.image_path"
                      @image-selected="(image) => { contractTypeFormData.image_path = image.url }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Contract Type File -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i class="pi pi-file-pdf text-red-600 mr-2"></i>
                Contract File (PDF)
              </h4>
              <div class="space-y-4">
                <div v-if="contractTypeFormData.contract_file" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <i class="pi pi-file-pdf text-red-600 text-2xl"></i>
                    <div>
                      <p class="font-medium text-green-800 dark:text-green-200">Contract file uploaded</p>
                      <p class="text-sm text-green-600 dark:text-green-400">PDF contract file ready for download</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      @click="downloadContractTypeFile"
                      class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-download mr-1"></i>
                      Download
                    </button>
                    <button
                      type="button"
                      @click.stop="triggerContractTypeFileUpload"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-upload mr-1"></i>
                      Replace
                    </button>
                    <button
                      type="button"
                      @click="contractTypeFormData.contract_file = ''"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-times mr-1"></i>
                      Remove
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Upload a PDF contract file for this contract type. Users will be able to download this file.
                  </p>
                  <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center" @click.stop @mousedown.stop>
                    <div class="space-y-4">
                      <i class="pi pi-file-pdf text-4xl text-red-500"></i>
                      <div>
                        <p class="text-lg font-medium text-gray-900 dark:text-white">
                          Click to upload contract PDF
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Only PDF files are allowed (max 10MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        @click.stop="triggerContractTypeFileUpload"
                        :disabled="savingContractType"
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i v-if="savingContractType" class="pi pi-spin pi-spinner"></i>
                        <span>{{ savingContractType ? 'Uploading...' : 'Choose PDF File' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hidden file input for contract type -->
            <input
              ref="contractTypeFileInput"
              type="file"
              accept=".pdf"
              @change="handleContractTypeFileUpload"
              @click.stop
              @mousedown.stop
              @keydown.stop
              @keyup.stop
              class="hidden"
            />

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                @click="closeContractTypeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="savingContractType"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="savingContractType" class="pi pi-spin pi-spinner mr-2"></i>
                {{ editingContractType ? 'Update Contract Type' : 'Create Contract Type' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click="closeModal">
      <div class="shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[90vh] overflow-y-auto transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-green-200'" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-green-600'">
              {{ editingCommodity ? 'Edit Commodity' : 'Add New Commodity' }}
            </h3>
            <button @click="closeModal" class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-green-400 hover:text-green-600'">
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <!-- Hidden file input outside form to prevent form submission conflicts -->
          <input
            ref="contractFileInput"
            type="file"
            accept=".pdf"
            @change="handleContractFileUpload"
            @click.stop
            @mousedown.stop
            @keydown.stop
            @keyup.stop
            class="hidden"
          />

          <form @submit.prevent="saveCommodity" class="space-y-4 px-6 pb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Name *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Code *</label>
                <input
                  v-model="formData.code"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Description</label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Full Description</label>
              <textarea
                v-model="formData.full_description"
                rows="4"
                placeholder="Detailed description for the modal view..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Category</label>
                <select
                  v-model="formData.category"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                >
                  <option value="">Select Category</option>
                  <option value="Grains">Grains</option>
                  <option value="Oilseeds">Oilseeds</option>
                  <option value="Legumes">Legumes</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Origin Country</label>
                <input
                  v-model="formData.origin_country"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Harvest Season</label>
                <input
                  v-model="formData.harvest_season"
                  type="text"
                  placeholder="e.g., June-September"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Delivery Months</label>
                <input
                  v-model="formData.delivery_months"
                  type="text"
                  placeholder="e.g., March, May, July, September"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Trading Hours</label>
                <input
                  v-model="formData.trading_hours"
                  type="text"
                  placeholder="e.g., Monday-Friday 9:00-17:00"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Contract Size</label>
                <input
                  v-model="formData.contract_size"
                  type="text"
                  placeholder="e.g., 50kg bags"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Current Price *</label>
                <input
                  v-model.number="formData.current_price"
                  type="number"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Price Unit</label>
                <input
                  v-model="formData.price_unit"
                  type="text"
                  placeholder="e.g., GHC per bag"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Market Status</label>
                <select
                  v-model="formData.market_status"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Minimum Price</label>
                <input
                  v-model.number="formData.minimum_price"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Maximum Price</label>
                <input
                  v-model.number="formData.maximum_price"
                  type="number"
                  step="0.01"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Specifications</label>
              <textarea
                v-model="formData.specifications"
                rows="3"
                placeholder="Trading specifications and requirements..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Storage Requirements</label>
              <textarea
                v-model="formData.storage_requirements"
                rows="2"
                placeholder="Storage and handling requirements..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-green-700'">Quality Standards</label>
              <textarea
                v-model="formData.quality_standards"
                rows="2"
                placeholder="Quality standards and certifications..."
                class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-300"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-green-300 text-slate-800'"
              ></textarea>
            </div>

            <!-- Commodity Image Section -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i class="pi pi-image text-blue-600 mr-2"></i>
                Commodity Image
              </h4>
              <div class="space-y-4">
                <div v-if="formData.image_path" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <img :src="formData.image_path" :alt="formData.name" class="w-16 h-16 rounded-lg object-cover">
                    <div>
                      <p class="font-medium text-green-800 dark:text-green-200">Image selected</p>
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
                    Choose an image for this commodity. This will be displayed in the commodities list.
                  </p>
                  <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                    <ImageGallery
                      title="Select Commodity Image"
                      :current-image="formData.image_path"
                      @image-selected="(image) => { formData.image_path = image.url }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Contract File Section -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <i class="pi pi-file-pdf text-red-600 mr-2"></i>
                Contract File (PDF)
              </h4>
              <div class="space-y-4">
                <div v-if="formData.contract_file" class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <i class="pi pi-file-pdf text-red-600 text-2xl"></i>
                    <div>
                      <p class="font-medium text-green-800 dark:text-green-200">Contract file uploaded</p>
                      <p class="text-sm text-green-600 dark:text-green-400">PDF contract file ready for download</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      type="button"
                      @click="downloadContract"
                      class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-download mr-1"></i>
                      Download
                    </button>
                    <button
                      type="button"
                      @click.stop="triggerFileUpload"
                      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-upload mr-1"></i>
                      Replace
                    </button>
                    <button
                      type="button"
                      @click="formData.contract_file = ''"
                      class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      <i class="pi pi-times mr-1"></i>
                      Remove
                    </button>
                  </div>
                </div>
                <div v-else>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Upload a PDF contract file for this commodity. Users will be able to download this file.
                  </p>
                  <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center" @click.stop @mousedown.stop>
                    <div class="space-y-4">
                      <i class="pi pi-file-pdf text-4xl text-red-500"></i>
                      <div>
                        <p class="text-lg font-medium text-gray-900 dark:text-white">
                          Click to upload contract PDF
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          Only PDF files are allowed (max 10MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        @click.stop="triggerFileUpload"
                        :disabled="saving"
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                        <span>{{ saving ? 'Uploading...' : 'Choose PDF File' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border rounded-lg transition-colors"
                :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-green-300 text-green-700 hover:bg-green-50'"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner mr-2"></i>
                {{ editingCommodity ? 'Update' : 'Create' }} Commodity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCommodities } from '../../composables/useCommodities';
import type { Commodity } from '../../services/commodityService';
import type { CMSCommodityContractType } from '../../services/commoditiesService';
import { isDarkMode } from '../../utils/darkMode';
import ImageGallery from './ImageGallery.vue';
import FileUpload from './FileUpload.vue';
import documentService from '../../services/documentService';
import commoditiesService from '../../services/commoditiesService';
import axios from '../../plugins/axios';

const {
  commodities,
  loading,
  error,
  pagination,
  searchQuery,
  categoryFilter,
  statusFilter,
  filteredCommodities,
  fetchCommodities,
  searchCommodities,
  filterByCategory,
  filterByStatus,
  clearFilters,
  goToPage,
  nextPage,
  prevPage,
  createCommodity,
  updateCommodity,
  deleteCommodity
} = useCommodities();

// Tab state
const activeTab = ref('commodities');

// Contract Types state
const selectedCommodityForContractTypes = ref<number | null>(null);
const contractTypes = ref<CMSCommodityContractType[]>([]);
const loadingContractTypes = ref(false);
const showContractTypeModal = ref(false);
const editingContractType = ref<CMSCommodityContractType | null>(null);
const savingContractType = ref(false);
const contractTypeFileInput = ref<HTMLInputElement | null>(null);

// Contract Type form data
const contractTypeFormData = ref({
  name: '',
  code: '',
  description: '',
  full_description: '',
  specifications: '',
  trading_hours: '',
  contract_size: '',
  price_unit: '',
  image_path: '',
  contract_file: '',
  delivery_months: '',
  storage_requirements: '',
  quality_standards: '',
  is_active: true,
  sort_order: 0
});

// Modal state
const showModal = ref(false);
const editingCommodity = ref<Commodity | null>(null);
const saving = ref(false);
const contractFileInput = ref<HTMLInputElement | null>(null);

// Form data
const formData = ref({
  name: '',
  code: '',
  description: '',
  full_description: '',
  category: '',
  origin_country: '',
  harvest_season: '',
  delivery_months: '',
  trading_hours: '',
  contract_size: '',
  current_price: 0,
  price_unit: '',
  minimum_price: 0,
  maximum_price: 0,
  market_status: 'Open' as 'Open' | 'Closed' | 'Suspended',
  specifications: '',
  storage_requirements: '',
  quality_standards: '',
  image_path: '',
  contract_file: ''
});

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
  editingCommodity.value = null;
  formData.value = {
    name: '',
    code: '',
    description: '',
    full_description: '',
    category: '',
    origin_country: '',
    harvest_season: '',
    delivery_months: '',
    trading_hours: '',
    contract_size: '',
    current_price: 0,
    price_unit: '',
    minimum_price: 0,
    maximum_price: 0,
    market_status: 'Open' as 'Open' | 'Closed' | 'Suspended',
    specifications: '',
    storage_requirements: '',
    quality_standards: '',
    image_path: '',
    contract_file: ''
  };
  showModal.value = true;
};

const editCommodity = (commodity: Commodity) => {
  editingCommodity.value = commodity;
  formData.value = {
    name: commodity.name,
    code: commodity.code,
    description: commodity.description,
    full_description: commodity.full_description || '',
    category: commodity.category,
    origin_country: commodity.origin_country,
    harvest_season: commodity.harvest_season,
    delivery_months: commodity.delivery_months || '',
    trading_hours: commodity.trading_hours,
    contract_size: commodity.contract_size,
    current_price: commodity.current_price,
    price_unit: commodity.price_unit,
    minimum_price: commodity.minimum_price,
    maximum_price: commodity.maximum_price,
    market_status: commodity.market_status,
    specifications: commodity.specifications,
    storage_requirements: commodity.storage_requirements,
    quality_standards: commodity.quality_standards,
    image_path: commodity.image_path,
    contract_file: commodity.contract_file || ''
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingCommodity.value = null;
};

const saveCommodity = async () => {
  saving.value = true;
  try {
    if (editingCommodity.value) {
      await updateCommodity(editingCommodity.value.id, formData.value);
    } else {
      await createCommodity(formData.value as any);
    }
    closeModal();
  } catch (error) {
    console.error('Error saving commodity:', error);
  } finally {
    saving.value = false;
  }
};

const handleDeleteCommodity = async (id: number) => {
  if (confirm('Are you sure you want to delete this commodity?')) {
    try {
      await deleteCommodity(id);
    } catch (error) {
      console.error('Error deleting commodity:', error);
    }
  }
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Grains':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'Oilseeds':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Legumes':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'Suspended':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
};

// Contract file handlers
const handleContractFileUpload = async (event: Event) => {
  // Prevent any form submission or navigation
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) {
    // Clear the input if no file selected
    target.value = '';
    return;
  }
  
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please select a PDF file');
    return;
  }
  
  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File is too large. Maximum size is 10MB');
    return;
  }
  
  try {
    // Show loading state
    saving.value = true;
    
    // Add a small delay to prevent any immediate navigation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Upload to S3
    const response = await documentService.uploadDocument(file, 'contracts');
    
    if (response.success && response.url) {
      // Save the S3 URL to the form
      formData.value.contract_file = response.url;
      console.log('✅ Contract file uploaded successfully');
    } else {
      alert('Failed to upload contract file: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error uploading contract file:', error);
    alert('Failed to upload contract file');
  } finally {
    saving.value = false;
    // Clear the input
    if (target) target.value = '';
  }
};

const downloadContract = () => {
  if (formData.value.contract_file) {
    documentService.downloadDocument(
      formData.value.contract_file,
      `${formData.value.name}-Contract.pdf`
    );
  }
};

// Separate function to handle file upload without form interference
const triggerFileUpload = () => {
  // Use setTimeout to ensure this runs after any other event handlers
  setTimeout(() => {
    contractFileInput.value?.click();
  }, 50);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
  // Show fallback icon
  const parent = img.parentElement;
  if (parent) {
    parent.innerHTML = '<i class="pi pi-image text-4xl text-slate-400"></i>';
  }
};

// Contract Types Methods
const loadContractTypes = async () => {
  if (!selectedCommodityForContractTypes.value) {
    console.log('❌ No commodity selected for contract types');
    return;
  }
  
  try {
    loadingContractTypes.value = true;
    console.log('🔄 Loading contract types for commodity ID:', selectedCommodityForContractTypes.value);
    
    const contractTypesData = await commoditiesService.getContractTypes(selectedCommodityForContractTypes.value);
    console.log('✅ Contract types loaded:', contractTypesData);
    
    contractTypes.value = contractTypesData;
  } catch (error) {
    console.error('❌ Error loading contract types:', error);
    contractTypes.value = [];
  } finally {
    loadingContractTypes.value = false;
  }
};

const getSelectedCommodityName = () => {
  const commodity = commodities.value.find(c => c.id === selectedCommodityForContractTypes.value);
  return commodity?.name || 'Unknown';
};

const openAddContractTypeModal = () => {
  editingContractType.value = null;
  // Reset form data
  contractTypeFormData.value = {
    name: '',
    code: '',
    description: '',
    full_description: '',
    specifications: '',
    trading_hours: '',
    contract_size: '',
    price_unit: '',
    image_path: '',
    contract_file: '',
    delivery_months: '',
    storage_requirements: '',
    quality_standards: '',
    is_active: true,
    sort_order: 0
  };
  showContractTypeModal.value = true;
};

const editContractType = (contractType: CMSCommodityContractType) => {
  editingContractType.value = contractType;
  // Populate form data
  contractTypeFormData.value = {
    name: contractType.name,
    code: contractType.code,
    description: contractType.description,
    full_description: contractType.full_description,
    specifications: contractType.specifications,
    trading_hours: contractType.trading_hours,
    contract_size: contractType.contract_size,
    price_unit: contractType.price_unit,
    image_path: contractType.image_path,
    contract_file: contractType.contract_file,
    delivery_months: contractType.delivery_months,
    storage_requirements: contractType.storage_requirements,
    quality_standards: contractType.quality_standards,
    is_active: contractType.is_active,
    sort_order: contractType.sort_order
  };
  showContractTypeModal.value = true;
};

const closeContractTypeModal = () => {
  showContractTypeModal.value = false;
  editingContractType.value = null;
};

const saveContractType = async () => {
  if (!selectedCommodityForContractTypes.value) return;
  
  try {
    savingContractType.value = true;
    
    const contractTypeData = {
      ...contractTypeFormData.value,
      commodity_id: selectedCommodityForContractTypes.value
    };
    
    if (editingContractType.value) {
      // Update existing contract type
      const response = await axios.put(`/api/contract-types/${editingContractType.value.id}`, contractTypeData);
      console.log('✅ Contract type updated successfully:', response.data);
    } else {
      // Create new contract type
      const response = await axios.post('/api/contract-types', contractTypeData);
      console.log('✅ Contract type created successfully:', response.data);
    }
    
    closeContractTypeModal();
    await loadContractTypes(); // Reload the list
  } catch (error) {
    console.error('Error saving contract type:', error);
    alert('Failed to save contract type: ' + error.message);
  } finally {
    savingContractType.value = false;
  }
};

const deleteContractType = async (id: number) => {
  if (confirm('Are you sure you want to delete this contract type?')) {
    try {
      const response = await axios.delete(`/api/contract-types/${id}`);
      console.log('✅ Contract type deleted successfully:', response.data);
      await loadContractTypes(); // Reload the list
    } catch (error) {
      console.error('Error deleting contract type:', error);
      alert('Failed to delete contract type: ' + (error.response?.data?.error || error.message));
    }
  }
};

const handleContractTypeFileUpload = async (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  if (file.type !== 'application/pdf') {
    alert('Please select a PDF file');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB');
    return;
  }
  
  try {
    savingContractType.value = true;
    const response = await documentService.uploadDocument(file, 'contracts');
    
    if (response.success && response.url) {
      contractTypeFormData.value.contract_file = response.url;
      console.log('✅ Contract type file uploaded successfully');
    } else {
      alert('Failed to upload file: ' + (response.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('❌ Error uploading contract type file:', error);
    alert('Failed to upload file');
  } finally {
    savingContractType.value = false;
    // Clear the input
    if (target) target.value = '';
  }
};

const triggerContractTypeFileUpload = () => {
  setTimeout(() => {
    contractTypeFileInput.value?.click();
  }, 50);
};

const downloadContractTypeFile = () => {
  if (contractTypeFormData.value.contract_file) {
    documentService.downloadDocument(
      contractTypeFormData.value.contract_file,
      `${contractTypeFormData.value.name}-Contract.pdf`
    );
  }
};

// Lifecycle
onMounted(() => {
  fetchCommodities();
});
</script>
