<template>
  <div class="space-y-8 animate-fade-in transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'">
    <!-- Enhanced Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div class="flex-1">
        <div class="flex items-center gap-4 mb-3">
          <div class="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <i class="pi pi-users text-white text-2xl"></i>
          </div>
      <div>
            <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-colors duration-300" :class="isDarkMode ? 'from-white to-slate-200' : 'from-slate-900 to-slate-700'">
              Trader Management
            </h1>
            <p class="text-lg mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              Manage membership list and trader information
            </p>
          </div>
        </div>
      </div>
      
      <div class="flex gap-3">
        <button
          @click="exportTraders"
          class="px-6 py-3 border rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-sm"
          :class="isDarkMode 
            ? 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500' 
            : 'border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'"
        >
          <i class="pi pi-download mr-2"></i>
          Export
        </button>
        
      <button
        @click="openAddModal"
          class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
          <i class="pi pi-plus text-lg"></i>
        Add Trader
      </button>
      </div>
    </div>

    <!-- Enhanced Search and Filters -->
    <div class="shadow-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-blue-200 shadow-blue-100'">
      <div class="flex flex-col lg:flex-row gap-4 items-center">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i class="pi pi-search text-slate-400 dark:text-slate-400"></i>
          </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search traders by name, phone, or email..."
            class="w-full pl-12 pr-4 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white/90 border-blue-300 text-slate-800 placeholder-slate-500 shadow-sm'"
          @input="debouncedSearch"
        />
      </div>
        
        <div class="flex gap-3">
      <select
        v-model="statusFilter"
        @change="loadTraders"
            class="px-4 py-3 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Suspended">Suspended</option>
      </select>
          
          <button
            @click="toggleFilters"
            class="px-4 py-3 border transition-all duration-200"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50 shadow-sm'"
          >
            <i class="pi pi-filter mr-2"></i>
            Filters
          </button>
        </div>
      </div>
      
      <!-- Stats Row -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-blue-50/50 border-blue-200 shadow-blue-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Traders</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ traders.length }}</p>
            </div>
            <i class="pi pi-users text-2xl text-blue-500 dark:text-blue-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-blue-50/50 border-blue-200 shadow-blue-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Active</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ activeTraders }}</p>
            </div>
            <i class="pi pi-check-circle text-2xl text-green-500 dark:text-green-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-blue-50/50 border-blue-200 shadow-blue-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Inactive</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ inactiveTraders }}</p>
            </div>
            <i class="pi pi-clock text-2xl text-orange-500 dark:text-orange-400"></i>
          </div>
        </div>
        
        <div class="p-4 border shadow-sm transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-white to-blue-50/50 border-blue-200 shadow-blue-100'">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Suspended</p>
              <p class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ suspendedTraders }}</p>
            </div>
            <i class="pi pi-ban text-2xl text-red-500 dark:text-red-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Traders Table -->
    <div class="shadow-lg border overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/90 backdrop-blur-sm border-blue-200 shadow-blue-100'">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-user text-slate-500 dark:text-slate-400"></i>
                  Name
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-building text-slate-500 dark:text-slate-400"></i>
                  Industry
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-tag text-slate-500 dark:text-slate-400"></i>
                  Member Type
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-phone text-slate-500 dark:text-slate-400"></i>
                  Phone
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-circle text-slate-500 dark:text-slate-400"></i>
                  Status
                </div>
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-500'">
                <div class="flex items-center gap-2">
                  <i class="pi pi-cog text-slate-500 dark:text-slate-400"></i>
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="trader in traders" :key="trader.id" class="transition-all duration-200 group" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-blue-50/50'">
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                    {{ trader.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ trader.name }}</div>
                    <div class="text-sm flex items-center gap-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                      <i class="pi pi-envelope text-xs"></i>
                      {{ trader.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="text-sm transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ trader.industry || '-' }}
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <i class="pi pi-tag mr-1 text-xs"></i>
                  {{ trader.member_type }}
                </span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="text-sm flex items-center gap-1 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                  <i class="pi pi-phone text-slate-400 text-xs"></i>
                {{ trader.phone_no || '-' }}
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <span :class="getStatusClass(trader.status)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  <i :class="getStatusIcon(trader.status)" class="mr-1 text-xs"></i>
                  {{ trader.status }}
                </span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button
                    @click="editTrader(trader)"
                    class="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                    title="Edit trader"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="deleteTrader(trader.id)"
                    class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Delete trader"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Enhanced Empty State -->
      <div v-if="traders.length === 0 && !loading" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
          <i class="pi pi-users text-4xl text-slate-400"></i>
        </div>
        <h3 class="text-xl font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No traders found</h3>
        <p class="mb-6 max-w-md mx-auto transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
          {{ searchQuery ? 'No traders match your search criteria. Try adjusting your filters.' : 'Get started by adding your first trader to the system.' }}
        </p>
        <button
          v-if="!searchQuery"
          @click="openAddModal"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <i class="pi pi-plus mr-2"></i>
          Add Your First Trader
        </button>
      </div>
    </div>

    <!-- Enhanced Pagination -->
    <div v-if="pagination.totalPages > 0 || traders.length > 0" class="shadow-lg border p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white/80 backdrop-blur-sm border-blue-200 shadow-blue-100'">
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
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                page === pagination.page
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700',
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              ]"
            >
              {{ page }}
            </button>
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

    <!-- Enhanced Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center">
      <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
      </div>
      <h3 class="text-lg font-semibold mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Loading traders...</h3>
      <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">Please wait while we fetch the latest data.</p>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white/95 backdrop-blur-sm border border-blue-200'"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
              {{ editingTrader ? 'Edit Trader' : 'Add New Trader' }}
            </h3>
            <button
              @click="closeModal"
              class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="saveTrader" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Name *
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Industry
                </label>
                <input
                  v-model="form.industry"
                  type="text"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Member Type *
                </label>
                <select
                  v-model="form.member_type"
                  required
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                >
                  <option value="Associates">Associates</option>
                  <option value="Full Members">Full Members</option>
                  <option value="Brokers">Brokers</option>
                  <option value="Warehouse Operators">Warehouse Operators</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Phone Number
                </label>
                <input
                  v-model="form.phone_no"
                  type="tel"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Email
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Address
              </label>
              <textarea
                v-model="form.address"
                rows="3"
                class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                Registration Date
              </label>
              <input
                v-model="form.registration_date"
                type="date"
                class="w-full px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white/90 border-blue-300 text-slate-800 shadow-sm'"
              />
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border transition-colors"
                :class="isDarkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-700' : 'text-blue-700 border-blue-300 hover:bg-blue-50 shadow-sm'"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <i v-if="saving" class="pi pi-spin pi-spinner"></i>
                {{ saving ? 'Saving...' : (editingTrader ? 'Update' : 'Create') }}
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
import { getAllTraders, createTrader, updateTrader, deleteTrader as deleteTraderService, type Trader, type CreateTraderRequest } from '../../services/traderService'
import { isDarkMode } from '../../utils/darkMode'

// State
const traders = ref<Trader[]>([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editingTrader = ref<Trader | null>(null)
const searchQuery = ref('')
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
const form = ref<CreateTraderRequest>({
  name: '',
  industry: '',
  member_type: 'Associates',
  phone_no: '',
  email: '',
  address: '',
  registration_date: '',
  status: 'Active'
})

// Computed properties
const activeTraders = computed(() => 
  traders.value.filter(trader => trader.status === 'Active').length
)

const inactiveTraders = computed(() => 
  traders.value.filter(trader => trader.status === 'Inactive').length
)

const suspendedTraders = computed(() => 
  traders.value.filter(trader => trader.status === 'Suspended').length
)

const visiblePages = computed(() => {
  if (pagination.value.totalPages <= 1) return []
  
  const current = pagination.value.page
  const total = pagination.value.totalPages
  const pages = []
  
  // Show up to 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
const loadTraders = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }
    
    if (searchQuery.value) {
      params.search = searchQuery.value
    }
    
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    
    const response = await getAllTraders(params)
    traders.value = response.data
    if (response.pagination) {
      // Map backend response (snake_case) to frontend (camelCase)
      pagination.value = {
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: (response.pagination as any).total_pages || Math.ceil(response.pagination.total / response.pagination.limit)
      }
    }
  } catch (error) {
    console.error('Failed to load traders:', error)
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
      loadTraders()
    }, 500)
  }
})()

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    loadTraders()
  }
}

const openAddModal = () => {
  editingTrader.value = null
  form.value = {
    name: '',
    industry: '',
    member_type: 'Associates',
    phone_no: '',
    email: '',
    address: '',
    registration_date: '',
    status: 'Active'
  }
  showModal.value = true
}

const editTrader = (trader: Trader) => {
  editingTrader.value = trader
  form.value = {
    name: trader.name,
    industry: trader.industry,
    member_type: trader.member_type,
    phone_no: trader.phone_no,
    email: trader.email,
    address: trader.address,
    registration_date: trader.registration_date || '',
    status: trader.status
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingTrader.value = null
}

const saveTrader = async () => {
  saving.value = true
  try {
    if (editingTrader.value) {
      await updateTrader(editingTrader.value.id, form.value)
    } else {
      await createTrader(form.value)
    }
    closeModal()
    loadTraders()
  } catch (error) {
    console.error('Failed to save trader:', error)
  } finally {
    saving.value = false
  }
}

const deleteTrader = async (id: number) => {
  if (confirm('Are you sure you want to delete this trader?')) {
    try {
      await deleteTraderService(id)
      loadTraders()
    } catch (error) {
      console.error('Failed to delete trader:', error)
    }
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    case 'Inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    case 'Suspended':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Active':
      return 'pi pi-check-circle'
    case 'Inactive':
      return 'pi pi-clock'
    case 'Suspended':
      return 'pi pi-ban'
    default:
      return 'pi pi-circle'
  }
}

const exportTraders = () => {
  // Implement export functionality
}

const toggleFilters = () => {
  // Implement advanced filters
}

const viewTrader = (trader: Trader) => {
  // Implement view trader details
}

// Lifecycle
onMounted(() => {
  loadTraders()
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

/* Custom scrollbar for better dark mode support */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-800;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-600 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-500;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradient text animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
