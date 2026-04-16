<template>
  <div class="rti-manager min-h-screen transition-all duration-500 animate-in fade-in" :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Header with Modern Design -->
    <div class="mb-8 p-8 rounded-3xl border transition-all duration-500 shadow-xl" 
         :class="isDarkMode ? 'bg-slate-800/50 border-slate-700 shadow-slate-950/20' : 'bg-white border-slate-200 shadow-slate-200/50'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div class="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-500 mb-2">
            <i class="pi pi-file-check"></i>
            <span>Compliance & Transparency</span>
          </div>
          <h2 class="text-4xl font-black tracking-tight" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            RTI Management
          </h2>
          <p class="mt-2 text-sm font-medium" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
            Process Right to Information requests and manage public transparency resources.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="activeTab === 'documents'"
            @click="openAddDocumentModal"
            class="px-6 py-3 bg-green-600 hover:bg-green-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-green-600/20 active:scale-95"
          >
            <i class="pi pi-plus-circle"></i>
            <span>Add Document</span>
          </button>
          <button
            @click="activeTab === 'requests' ? fetchRequests() : fetchDocuments()"
            class="p-3 rounded-2xl transition-all duration-300 active:scale-95 shadow-md"
            :class="isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modern Tabs Navigation -->
    <div class="flex p-1.5 rounded-2xl mb-8 w-fit mx-auto md:mx-0" 
         :class="isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'">
      <button
        @click="activeTab = 'requests'"
        class="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3"
        :class="activeTab === 'requests' 
          ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
          : 'text-gray-500 hover:text-green-500'"
      >
        <i class="pi pi-inbox"></i>
        <span>Requests</span>
      </button>
      <button
        @click="activeTab = 'documents'"
        class="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3"
        :class="activeTab === 'documents' 
          ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
          : 'text-gray-500 hover:text-green-500'"
      >
        <i class="pi pi-file-pdf"></i>
        <span>Documents</span>
      </button>
    </div>

    <!-- Stats Dashboard (Requests Tab) -->
    <div v-if="activeTab === 'requests'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="p-6 rounded-3xl border transition-all duration-300 shadow-sm" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'">
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Total Inbound</p>
        <div class="flex items-center justify-between">
          <h3 class="text-3xl font-black tracking-tighter" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
            {{ stats.total_requests || 0 }}
          </h3>
          <div class="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
            <i class="pi pi-list text-slate-500"></i>
          </div>
        </div>
      </div>
      <div class="p-6 rounded-3xl border transition-all duration-300 shadow-sm" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'">
        <p class="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-2">Pending Action</p>
        <div class="flex items-center justify-between">
          <h3 class="text-3xl font-black tracking-tighter text-yellow-500">
            {{ stats.pending_requests || 0 }}
          </h3>
          <div class="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <i class="pi pi-clock text-yellow-500"></i>
          </div>
        </div>
      </div>
      <div class="p-6 rounded-3xl border transition-all duration-300 shadow-sm" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'">
        <p class="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Under Review</p>
        <div class="flex items-center justify-between">
          <h3 class="text-3xl font-black tracking-tighter text-blue-500">
            {{ stats.under_review_requests || 0 }}
          </h3>
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <i class="pi pi-search text-blue-500"></i>
          </div>
        </div>
      </div>
      <div class="p-6 rounded-3xl border transition-all duration-300 shadow-sm" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'">
        <p class="text-[10px] font-black uppercase tracking-widest text-green-500 mb-2">Resolution Rate</p>
        <div class="flex items-center justify-between">
          <h3 class="text-3xl font-black tracking-tighter text-green-500">
            {{ stats.completed_requests || 0 }}
          </h3>
          <div class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <i class="pi pi-check-circle text-green-500"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="space-y-6">
      <!-- Search & Filters Bar -->
      <div v-if="activeTab === 'requests'" 
           class="p-6 rounded-3xl border transition-all duration-500" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="relative">
            <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search ID, Name, Email..."
              class="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-green-500/20 outline-none"
              :class="isDarkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'"
              @input="debouncedSearch"
            />
          </div>
          <select
            v-model="statusFilter"
            @change="fetchRequests"
            class="w-full px-4 py-3 rounded-2xl border text-sm font-bold uppercase tracking-widest transition-all duration-300 focus:ring-2 focus:ring-green-500/20 outline-none cursor-pointer"
            :class="isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <select
            v-model="priorityFilter"
            @change="fetchRequests"
            class="w-full px-4 py-3 rounded-2xl border text-sm font-bold uppercase tracking-widest transition-all duration-300 focus:ring-2 focus:ring-green-500/20 outline-none cursor-pointer"
            :class="isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button
            @click="clearFilters"
            class="w-full px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            :class="isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <!-- Table/List View -->
      <div class="rounded-3xl border overflow-hidden transition-all duration-500" 
           :class="isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200 shadow-sm'">
        
        <!-- Loading Spinner -->
        <div v-if="loading || loadingDocuments" class="flex flex-col items-center justify-center py-24 space-y-4">
          <div class="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
          <p class="text-xs font-black text-gray-500 uppercase tracking-widest">Synchronizing...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="(activeTab === 'requests' && requests.length === 0) || (activeTab === 'documents' && documents.length === 0)" 
             class="flex flex-col items-center justify-center py-24 text-center">
          <div class="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <i class="pi pi-inbox text-3xl text-gray-400"></i>
          </div>
          <h4 class="text-lg font-black" :class="isDarkMode ? 'text-white' : 'text-slate-900'">No records found</h4>
          <p class="text-sm font-medium text-gray-500 mt-2 max-w-xs">Try adjusting your search or filters to find what you're looking for.</p>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr :class="isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'">
                <template v-if="activeTab === 'requests'">
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Reference</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Requester</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Priority</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </template>
                <template v-else>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Document</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Category</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Stats</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </template>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-slate-100'">
              <template v-if="activeTab === 'requests'">
                <tr v-for="request in requests" :key="request.id" class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-300">
                  <td class="px-8 py-5">
                    <span class="text-xs font-black text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg">
                      #{{ request.request_id }}
                    </span>
                    <p class="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{{ formatDate(request.created_at) }}</p>
                  </td>
                  <td class="px-8 py-5">
                    <p class="text-sm font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ request.full_name }}</p>
                    <p class="text-xs font-medium text-gray-500 mt-0.5">{{ request.email }}</p>
                  </td>
                  <td class="px-8 py-5 max-w-xs">
                    <p class="text-sm font-medium truncate" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">{{ request.subject }}</p>
                    <p class="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{{ request.request_type }}</p>
                  </td>
                  <td class="px-8 py-5">
                    <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest" :class="getStatusColor(request.status)">
                      {{ request.status.replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="px-8 py-5">
                    <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest" :class="getPriorityColor(request.priority)">
                      {{ request.priority }}
                    </span>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button @click="viewRequest(request)" class="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-eye text-xs"></i>
                      </button>
                      <button @click="respondToRequest(request)" class="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-reply text-xs"></i>
                      </button>
                      <button @click="deleteRequest(request)" class="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="doc in documents" :key="doc.id" class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-300">
                  <td class="px-8 py-5">
                    <div class="flex items-center space-x-4">
                      <div class="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i :class="doc.icon" class="text-xl text-red-500"></i>
                      </div>
                      <div>
                        <p class="text-sm font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ doc.title }}</p>
                        <p class="text-xs font-medium text-gray-500 mt-0.5 truncate max-w-[200px]">{{ doc.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-5">
                    <span class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest" :class="getCategoryColor(doc.category)">
                      {{ doc.category }}
                    </span>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <div class="inline-flex flex-col items-center">
                      <span class="text-sm font-black" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ doc.download_count }}</span>
                      <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Downloads</span>
                    </div>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <div class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button @click="editDocument(doc)" class="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-pencil text-xs"></i>
                      </button>
                      <a :href="doc.file_path" target="_blank" class="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-download text-xs"></i>
                      </a>
                      <button @click="deleteDocument(doc)" class="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300">
                        <i class="pi pi-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Modern Pagination -->
        <div v-if="pagination.totalPages > 1" 
             class="px-8 py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4" 
             :class="isDarkMode ? 'border-slate-700 bg-slate-900/30' : 'border-slate-100 bg-slate-50/30'">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Showing <span class="text-green-500">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> to 
            <span class="text-green-500">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of 
            <span class="text-green-500">{{ pagination.total }}</span> entries
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="p-2.5 rounded-xl border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-white'"
            >
              <i class="pi pi-chevron-left text-xs"></i>
            </button>
            <div class="flex items-center space-x-1">
              <span class="text-xs font-black px-4 py-2 rounded-xl bg-green-500 text-white shadow-lg shadow-green-600/20">
                {{ pagination.page }}
              </span>
              <span class="text-xs font-bold text-gray-400 px-2">of</span>
              <span class="text-xs font-black px-4 py-2 rounded-xl border" :class="isDarkMode ? 'border-slate-700 text-white' : 'border-slate-200 text-slate-900'">
                {{ pagination.totalPages }}
              </span>
            </div>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="p-2.5 rounded-xl border transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              :class="isDarkMode ? 'border-slate-700 text-slate-400 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-white'"
            >
              <i class="pi pi-chevron-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Request Modal -->
    <Dialog v-model:visible="showViewModal" modal header="RTI Request Details" :style="{ width: '800px' }">
      <div v-if="selectedRequest" class="space-y-6">
        <!-- Request Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Request ID</label>
            <div class="text-lg font-bold text-purple-600">{{ selectedRequest.request_id }}</div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <div>
              <span class="px-3 py-1 text-sm font-semibold rounded-full capitalize" :class="getStatusColor(selectedRequest.status)">
                {{ selectedRequest.status.replace('_', ' ') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Requester Info -->
        <div>
          <h3 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Requester Information</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div><strong>Name:</strong> {{ selectedRequest.full_name }}</div>
            <div><strong>Email:</strong> {{ selectedRequest.email }}</div>
            <div><strong>Phone:</strong> {{ selectedRequest.phone }}</div>
            <div><strong>Ghana Card Number/National ID:</strong> {{ selectedRequest.id_number || 'N/A' }}</div>
            <div><strong>Address:</strong> {{ selectedRequest.address || 'N/A' }}</div>
            <div><strong>Organization:</strong> {{ selectedRequest.organization || 'N/A' }}</div>
          </div>
        </div>

        <!-- Request Details -->
        <div>
          <h3 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Request Details</h3>
          <div class="space-y-2 text-sm">
            <div><strong>Type:</strong> {{ selectedRequest.request_type }}</div>
            <div><strong>Subject:</strong> {{ selectedRequest.subject }}</div>
            <div><strong>Description:</strong><br/>{{ selectedRequest.description }}</div>
            <div><strong>Preferred Format:</strong> {{ selectedRequest.preferred_format }}</div>
          </div>
        </div>

        <!-- Response (if available) -->
        <div v-if="selectedRequest.response_text">
          <h3 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Response</h3>
          <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p class="text-sm">{{ selectedRequest.response_text }}</p>
            <div v-if="selectedRequest.response_file" class="mt-3">
              <a :href="selectedRequest.response_file" target="_blank" class="text-blue-600 hover:underline">
                <i class="pi pi-file-pdf mr-1"></i> View Response Document
              </a>
            </div>
            <div class="mt-2 text-xs text-gray-600">
              Responded by: {{ selectedRequest.responded_by }} on {{ formatDate(selectedRequest.response_date) }}
            </div>
          </div>
        </div>

        <!-- Status Actions -->
        <div>
          <h3 class="font-semibold mb-2" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Change Status</h3>
          <div class="flex gap-2">
            <button
              v-if="selectedRequest.status === 'pending'"
              @click="updateStatus(selectedRequest.id, 'under_review')"
              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
            >
              Mark as Under Review
            </button>
            <button
              v-if="selectedRequest.status === 'under_review'"
              @click="updateStatus(selectedRequest.id, 'approved')"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              Approve
            </button>
            <button
              v-if="selectedRequest.status !== 'rejected'"
              @click="rejectRequest(selectedRequest)"
              class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          @click="showViewModal = false"
          class="px-4 py-2 border rounded-lg"
          :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'"
        >
          Close
        </button>
      </template>
    </Dialog>

    <!-- Respond Modal -->
    <Dialog v-model:visible="showRespondModal" modal header="Respond to RTI Request" :style="{ width: '700px' }">
      <div v-if="selectedRequest" class="space-y-4">
        <div>
          <p class="text-sm mb-2"><strong>Request ID:</strong> {{ selectedRequest.request_id }}</p>
          <p class="text-sm mb-4"><strong>Subject:</strong> {{ selectedRequest.subject }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Response *</label>
          <textarea
            v-model="responseForm.response_text"
            rows="6"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            placeholder="Enter your response here..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Response Document (Optional)</label>
          <div v-if="responseForm.response_file">
            <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
              <span class="text-sm">Document uploaded</span>
              <button
                @click="responseForm.response_file = ''"
                class="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                Remove
              </button>
            </div>
          </div>
          <div v-else>
            <div class="border-2 border-dashed rounded-lg p-4" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
              <ImageGallery
                :current-image="responseForm.response_file"
                @image-selected="(image) => { responseForm.response_file = image.url }"
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Your Name *</label>
          <input
            v-model="responseForm.responded_by"
            type="text"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            placeholder="Enter your name"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showRespondModal = false"
            class="px-4 py-2 border rounded-lg"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'"
          >
            Cancel
          </button>
          <button
            @click="submitResponse"
            :disabled="!responseForm.response_text || !responseForm.responded_by"
            class="px-4 py-2 rounded-lg text-white"
            :class="!responseForm.response_text || !responseForm.responded_by ? 'bg-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'"
          >
            Submit Response
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Document Add/Edit Modal -->
    <Dialog v-model:visible="showDocumentModal" modal :header="editingDocument ? 'Edit RTI Document' : 'Add RTI Document'" :style="{ width: '600px' }">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title *</label>
          <input
            v-model="documentForm.title"
            type="text"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Description</label>
          <textarea
            v-model="documentForm.description"
            rows="3"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Category *</label>
            <select
              v-model="documentForm.category"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            >
              <option value="manual">Manual</option>
              <option value="form">Form</option>
              <option value="guide">Guide</option>
              <option value="policy">Policy</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Icon</label>
            <select
              v-model="documentForm.icon"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            >
              <option value="pi-file-pdf">PDF Icon</option>
              <option value="pi-book">Book Icon</option>
              <option value="pi-file-edit">Form Icon</option>
              <option value="pi-info-circle">Info Icon</option>
              <option value="pi-shield">Shield Icon</option>
              <option value="pi-file">File Icon</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Document File (PDF) *</label>
          <div v-if="documentForm.file_path">
            <div class="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800 mb-2">
              <div class="flex items-center gap-2">
                <i class="pi pi-file-pdf text-red-600"></i>
                <span class="text-sm">{{ documentForm.file_name || 'Document uploaded' }}</span>
              </div>
              <button
                type="button"
                @click="documentForm.file_path = ''; documentForm.file_name = ''"
                class="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>
            <button
              type="button"
              @click="triggerDocumentUpload"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              <i class="pi pi-upload mr-1"></i>Replace File
            </button>
          </div>
          <div v-else>
            <button
              type="button"
              @click="triggerDocumentUpload"
              :disabled="uploadingFile"
              class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg"
            >
              <i v-if="uploadingFile" class="pi pi-spin pi-spinner mr-2"></i>
              <i v-else class="pi pi-upload mr-2"></i>
              {{ uploadingFile ? 'Uploading...' : 'Upload PDF File' }}
            </button>
          </div>
        </div>

        <div>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="documentForm.is_featured" class="rounded" />
            <span class="text-sm font-medium">Featured Document</span>
          </label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showDocumentModal = false"
            class="px-4 py-2 border rounded-lg"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'"
          >
            Cancel
          </button>
          <button
            @click="saveDocument"
            :disabled="!documentForm.title || !documentForm.category || !documentForm.file_path"
            class="px-4 py-2 rounded-lg text-white"
            :class="!documentForm.title || !documentForm.category || !documentForm.file_path ? 'bg-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'"
          >
            {{ editingDocument ? 'Update' : 'Create' }}
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Hidden file input for document upload -->
    <input
      ref="documentFileInput"
      type="file"
      accept=".pdf,.doc,.docx"
      @change="handleDocumentUpload"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import rtiService, { type RTIRequest, type RTIDocument } from '../../services/rtiService'
import documentService from '../../services/documentService'
import Dialog from 'primevue/dialog'
import ImageGallery from './ImageGallery.vue'

// Active tab
const activeTab = ref('requests')

// State for Requests
const requests = ref<RTIRequest[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const stats = ref<any>({})

// State for Documents
const documents = ref<RTIDocument[]>([])
const loadingDocuments = ref(false)
const uploadingFile = ref(false)
const showDocumentModal = ref(false)
const editingDocument = ref<RTIDocument | null>(null)
const documentFileInput = ref<HTMLInputElement | null>(null)

// Modals for Requests
const showViewModal = ref(false)
const showRespondModal = ref(false)
const selectedRequest = ref<RTIRequest | null>(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Response form
const responseForm = ref({
  response_text: '',
  response_file: '',
  responded_by: ''
})

// Document form
const documentForm = ref({
  title: '',
  description: '',
  category: 'manual',
  file_path: '',
  file_name: '',
  icon: 'pi-file-pdf',
  is_featured: false,
  is_active: true,
  sort_order: 0
})

// Methods
const fetchRequests = async () => {
  try {
    loading.value = true
    error.value = null
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error.value = 'Authentication required'
      return
    }

    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value) params.status = statusFilter.value
    if (priorityFilter.value) params.priority = priorityFilter.value

    const response = await rtiService.getAllRequests(token, params)
    requests.value = response.data

    if (response.pagination) {
      pagination.value = {
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        totalPages: response.pagination.total_pages || Math.ceil(response.pagination.total / response.pagination.limit)
      }
    }

    // Fetch stats
    const statsData = await rtiService.getStats(token)
    stats.value = statsData
  } catch (err: any) {
    console.error('Failed to fetch RTI requests:', err)
    error.value = 'Failed to load RTI requests'
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
      fetchRequests()
    }, 500)
  }
})()

const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchRequests()
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  fetchRequests()
}

const viewRequest = (request: RTIRequest) => {
  selectedRequest.value = request
  showViewModal.value = true
}

const respondToRequest = (request: RTIRequest) => {
  selectedRequest.value = request
  responseForm.value = {
    response_text: '',
    response_file: request.response_file || '',
    responded_by: ''
  }
  showRespondModal.value = true
}

const submitResponse = async () => {
  if (!selectedRequest.value) return

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await rtiService.respondToRequest(token, selectedRequest.value.id, {
      response_text: responseForm.value.response_text,
      response_file: responseForm.value.response_file || undefined,
      responded_by: responseForm.value.responded_by
    })

    showRespondModal.value = false
    await fetchRequests()
    alert('Response submitted successfully!')
  } catch (err: any) {
    console.error('Failed to submit response:', err)
    alert('Failed to submit response')
  }
}

const updateStatus = async (id: number, status: string) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await rtiService.updateStatus(token, id, status)
    await fetchRequests()
    showViewModal.value = false
  } catch (err: any) {
    console.error('Failed to update status:', err)
    alert('Failed to update status')
  }
}

const rejectRequest = async (request: RTIRequest) => {
  const reason = prompt('Please enter rejection reason:')
  if (!reason) return

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await rtiService.updateStatus(token, request.id, 'rejected', undefined, reason)
    await fetchRequests()
    showViewModal.value = false
  } catch (err: any) {
    console.error('Failed to reject request:', err)
    alert('Failed to reject request')
  }
}

const deleteRequest = async (request: RTIRequest) => {
  if (!confirm(`Are you sure you want to delete request ${request.request_id}?`)) return

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await rtiService.deleteRequest(token, request.id)
    await fetchRequests()
  } catch (err: any) {
    console.error('Failed to delete request:', err)
    alert('Failed to delete request')
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-purple-100 text-purple-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getCategoryColor = (category: string) => {
  const colors = {
    manual: 'bg-blue-100 text-blue-800',
    form: 'bg-green-100 text-green-800',
    guide: 'bg-purple-100 text-purple-800',
    policy: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Document methods
const fetchDocuments = async () => {
  try {
    loadingDocuments.value = true
    const token = localStorage.getItem('auth_token')
    if (!token) return

    documents.value = await rtiService.getAllDocuments(token)
  } catch (err: any) {
    console.error('Failed to fetch RTI documents:', err)
  } finally {
    loadingDocuments.value = false
  }
}

const openAddDocumentModal = () => {
  editingDocument.value = null
  documentForm.value = {
    title: '',
    description: '',
    category: 'manual',
    file_path: '',
    file_name: '',
    icon: 'pi-file-pdf',
    is_featured: false,
    is_active: true,
    sort_order: 0
  }
  showDocumentModal.value = true
}

const editDocument = (doc: RTIDocument) => {
  editingDocument.value = doc
  documentForm.value = { ...doc }
  showDocumentModal.value = true
}

const saveDocument = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    if (editingDocument.value) {
      await rtiService.updateDocument(token, editingDocument.value.id, documentForm.value)
    } else {
      await rtiService.createDocument(token, documentForm.value)
    }

    showDocumentModal.value = false
    await fetchDocuments()
  } catch (err: any) {
    console.error('Failed to save document:', err)
    alert('Failed to save document')
  }
}

const deleteDocument = async (doc: RTIDocument) => {
  if (!confirm(`Are you sure you want to delete "${doc.title}"?`)) return

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    await rtiService.deleteDocument(token, doc.id)
    await fetchDocuments()
  } catch (err: any) {
    console.error('Failed to delete document:', err)
    alert('Failed to delete document')
  }
}

const triggerDocumentUpload = () => {
  documentFileInput.value?.click()
}

const handleDocumentUpload = async (event: any) => {
  const file = event.target?.files?.[0]
  if (!file) return

  try {
    uploadingFile.value = true
    const response = await documentService.uploadDocument(file, 'documents')
    
    if (response.success && response.url) {
      documentForm.value.file_path = response.url
      documentForm.value.file_name = response.filename || file.name
      console.log('✅ Document uploaded successfully:', response.url)
    } else {
      alert('Failed to upload document: ' + (response.error || 'Unknown error'))
    }
  } catch (err: any) {
    console.error('❌ Error uploading document:', err)
    alert('Failed to upload document')
  } finally {
    uploadingFile.value = false
    if (documentFileInput.value) documentFileInput.value.value = ''
  }
}

onMounted(() => {
  fetchRequests()
  fetchDocuments()
})
</script>

<style scoped>
.rti-manager {
  padding: 1rem;
}
</style>
