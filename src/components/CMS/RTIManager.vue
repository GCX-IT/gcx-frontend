<template>
  <div class="rti-manager min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-purple-50'">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'">
      <div>
        <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-purple-600'">RTI Management</h2>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-purple-700'">Manage RTI requests and downloadable resources</p>
      </div>
      <div class="flex gap-2">
        <button
          v-if="activeTab === 'documents'"
          @click="openAddDocumentModal"
          class="px-4 py-2 rounded-lg flex items-center gap-2"
          :class="isDarkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
        >
          <i class="pi pi-plus"></i>
          Add Document
        </button>
        <button
          @click="activeTab === 'requests' ? fetchRequests() : fetchDocuments()"
          class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
          :class="isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'"
        >
          <i class="pi pi-refresh"></i>
          Refresh
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 px-6">
      <button
        @click="activeTab = 'requests'"
        class="px-6 py-3 rounded-lg font-medium transition-all"
        :class="activeTab === 'requests' ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700')"
      >
        <i class="pi pi-inbox mr-2"></i>
        Requests
      </button>
      <button
        @click="activeTab = 'documents'"
        class="px-6 py-3 rounded-lg font-medium transition-all"
        :class="activeTab === 'documents' ? 'bg-purple-600 text-white' : (isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700')"
      >
        <i class="pi pi-file-pdf mr-2"></i>
        Documents & Resources
      </button>
    </div>

    <!-- Stats Cards (Requests Tab Only) -->
    <div v-if="activeTab === 'requests'" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 px-6">
      <div class="p-4 rounded-lg border transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'">
        <div class="text-2xl font-bold" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ stats.total_requests || 0 }}</div>
        <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Total Requests</div>
      </div>
      <div class="p-4 rounded-lg border transition-colors duration-300" :class="isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'">
        <div class="text-2xl font-bold text-yellow-600">{{ stats.pending_requests || 0 }}</div>
        <div class="text-sm text-yellow-700">Pending</div>
      </div>
      <div class="p-4 rounded-lg border transition-colors duration-300" :class="isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'">
        <div class="text-2xl font-bold text-blue-600">{{ stats.under_review_requests || 0 }}</div>
        <div class="text-sm text-blue-700">Under Review</div>
      </div>
      <div class="p-4 rounded-lg border transition-colors duration-300" :class="isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'">
        <div class="text-2xl font-bold text-green-600">{{ stats.completed_requests || 0 }}</div>
        <div class="text-sm text-green-700">Completed</div>
      </div>
    </div>

    <!-- REQUESTS TAB -->
    <div v-if="activeTab === 'requests'">
    
    <!-- Filters -->
    <div class="p-4 mb-6 transition-colors duration-300 mx-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, request ID..."
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-purple-300 text-slate-800 placeholder-slate-500'"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Status</label>
          <select
            v-model="statusFilter"
            @change="fetchRequests"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-purple-300 text-slate-800'"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Priority</label>
          <select
            v-model="priorityFilter"
            @change="fetchRequests"
            class="w-full px-3 py-2 border rounded-lg"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-purple-300 text-slate-800'"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 border rounded-lg"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-purple-300 text-purple-700 hover:bg-purple-50'"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl text-purple-600"></i>
      <p class="mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-purple-600'">Loading RTI requests...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 mb-6 mx-6" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
        <p :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ error }}</p>
      </div>
    </div>

    <!-- Requests Table -->
    <div v-else class="overflow-hidden transition-colors duration-300 mx-6" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-purple-200'">
          <thead :class="isDarkMode ? 'bg-slate-700' : 'bg-purple-100'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Request ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Requester</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Subject</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Priority</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-purple-200'">
            <tr v-for="request in requests" :key="request.id" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50/50'">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-purple-600">{{ request.request_id }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ request.full_name }}</div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ request.email }}</div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ request.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">{{ request.subject }}</div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ request.organization || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">{{ request.request_type }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="getStatusColor(request.status)">
                  {{ request.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="getPriorityColor(request.priority)">
                  {{ request.priority }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">{{ formatDate(request.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button @click="viewRequest(request)" class="text-blue-600 hover:text-blue-900" title="View Details">
                    <i class="pi pi-eye"></i>
                  </button>
                  <button @click="respondToRequest(request)" class="text-green-600 hover:text-green-900" title="Respond">
                    <i class="pi pi-reply"></i>
                  </button>
                  <button @click="deleteRequest(request)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex justify-between items-center p-4 border-t" :class="isDarkMode ? 'border-slate-700' : 'border-purple-200'">
        <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} requests
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="px-3 py-1 border rounded disabled:opacity-50"
            :class="isDarkMode ? 'border-slate-600 text-slate-300' : 'border-purple-300 text-purple-700'"
          >
            <i class="pi pi-chevron-left"></i>
          </button>
          <span class="px-3 py-1">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50"
            :class="isDarkMode ? 'border-slate-600 text-slate-300' : 'border-purple-300 text-purple-700'"
          >
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
    </div><!-- END Requests Tab -->

    <!-- DOCUMENTS TAB -->
    <div v-if="activeTab === 'documents'" class="mx-6">
      <!-- Documents Table -->
      <div v-if="loadingDocuments" class="text-center py-12">
        <i class="pi pi-spin pi-spinner text-2xl text-purple-600"></i>
        <p class="mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-purple-600'">Loading documents...</p>
      </div>

      <div v-else class="overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-purple-200'">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-purple-200'">
            <thead :class="isDarkMode ? 'bg-slate-700' : 'bg-purple-100'">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Document</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">File</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Downloads</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Featured</th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-purple-700'">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-purple-200'">
              <tr v-for="doc in documents" :key="doc.id" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-purple-50/50'">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <i :class="doc.icon" class="text-2xl text-red-600 mr-3"></i>
                    <div>
                      <div class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ doc.title }}</div>
                      <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ doc.description }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="getCategoryColor(doc.category)">
                    {{ doc.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">{{ doc.file_name || 'Document' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">{{ doc.download_count }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="doc.is_featured" class="text-yellow-600">★ Featured</span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex gap-2">
                    <button @click="editDocument(doc)" class="text-blue-600 hover:text-blue-900" title="Edit">
                      <i class="pi pi-pencil"></i>
                    </button>
                    <a :href="doc.file_path" target="_blank" class="text-green-600 hover:text-green-900" title="Download">
                      <i class="pi pi-download"></i>
                    </a>
                    <button @click="deleteDocument(doc)" class="text-red-600 hover:text-red-900" title="Delete">
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div><!-- END Documents Tab -->

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
