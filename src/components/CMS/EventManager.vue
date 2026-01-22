<template>
  <div class="event-manager min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-blue-50'">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-200'">
      <div>
        <h2 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-blue-600'">Events Manager</h2>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-blue-700'">Manage events, conferences, and achievements</p>
      </div>
      <button
        @click="openAddModal"
        class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
        :class="isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'"
      >
        <i class="pi pi-plus"></i>
        Add Event
      </button>
    </div>

    <!-- Filters -->
    <div class="p-4 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-200'">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-blue-300 text-slate-800 placeholder-slate-500'"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300 text-slate-800'"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Type</label>
          <select
            v-model="typeFilter"
            class="w-full px-3 py-2 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-blue-300 text-slate-800'"
          >
            <option value="">All Types</option>
            <option value="Conference">Conference</option>
            <option value="Summit">Summit</option>
            <option value="Workshop">Workshop</option>
            <option value="Forum">Forum</option>
            <option value="Program">Program</option>
            <option value="Meeting">Meeting</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full px-4 py-2 border rounded-lg transition-colors duration-300"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl transition-colors duration-300" :class="isDarkMode ? 'text-blue-600' : 'text-blue-600'"></i>
      <p class="mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-blue-600'">Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 mb-6 transition-colors duration-300" :class="isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'">
      <div class="flex items-center">
        <i class="pi pi-exclamation-triangle text-red-600 mr-2"></i>
        <p class="transition-colors duration-300" :class="isDarkMode ? 'text-red-200' : 'text-red-800'">{{ error }}</p>
      </div>
    </div>

    <!-- Events Table -->
    <div v-else class="overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-200'">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y transition-colors duration-300" :class="isDarkMode ? 'divide-slate-700' : 'divide-blue-200'">
          <thead class="transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-blue-100'">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Event</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Registration</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-blue-200'">
            <tr v-for="event in filteredEvents" :key="event.id" class="transition-all duration-200" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-blue-50/50'">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <img 
                    :src="event.image || '/Picture3.png'" 
                    :alt="event.title" 
                    class="h-10 w-10 rounded object-cover mr-3"
                    @error="handleImageError"
                  />
                  <div>
                    <div class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-slate-900'">{{ event.title }}</div>
                    <div class="text-sm text-slate-500">{{ event.attendees }} attendees</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">{{ formatDate(event.date) }}</div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ event.time || 'TBD' }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-slate-900'">{{ event.location }}</div>
                <div class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-500'">{{ event.venue || 'TBD' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getTypeColor(event.type)">
                  {{ event.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize" :class="getStatusColor(event.status)">
                  {{ event.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span v-if="event.registration_open" class="text-green-600 font-semibold">Open</span>
                <span v-else class="text-slate-500">Closed</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button @click="editEvent(event)" class="text-blue-600 hover:text-blue-900" title="Edit">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button @click="deleteEvent(event)" class="text-red-600 hover:text-red-900" title="Delete">
                    <i class="pi pi-trash"></i>
                  </button>
                  <button @click="viewRegistrations(event)" class="text-green-600 hover:text-green-900" title="View Registrations">
                    <i class="pi pi-users"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Event Modal -->
    <Dialog v-model:visible="showModal" modal :header="isEditing ? 'Edit Event' : 'Add Event'" :style="{ width: '800px' }" class="event-modal">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">Title *</label>
            <input
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Date *</label>
            <input
              v-model="formData.date"
              type="date"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Time</label>
            <input
              v-model="formData.time"
              type="text"
              placeholder="e.g., 9:00 AM - 5:00 PM"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Location *</label>
            <input
              v-model="formData.location"
              type="text"
              placeholder="e.g., Accra, Ghana"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Venue</label>
            <input
              v-model="formData.venue"
              type="text"
              placeholder="e.g., Kempinski Hotel"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Type *</label>
            <select
              v-model="formData.type"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            >
              <option value="Conference">Conference</option>
              <option value="Summit">Summit</option>
              <option value="Workshop">Workshop</option>
              <option value="Forum">Forum</option>
              <option value="Program">Program</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Status *</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Expected Attendees</label>
            <input
              v-model.number="formData.attendees"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Price</label>
            <input
              v-model="formData.price"
              type="text"
              placeholder="e.g., Free or GHS 50"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div class="col-span-2">
            <h4 class="text-lg font-semibold mb-4 flex items-center" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
              <i class="pi pi-image mr-2 text-blue-600"></i>
              Event Cover Image
            </h4>
            <div class="space-y-4">
              <div v-if="formData.image" class="flex items-center justify-between p-4 rounded-lg border" :class="isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'">
                <div class="flex items-center space-x-3">
                  <img :src="formData.image" :alt="formData.title" class="w-16 h-16 rounded-lg object-cover" @error="handleImageError">
                  <div>
                    <p class="font-medium" :class="isDarkMode ? 'text-green-200' : 'text-green-800'">Cover image selected</p>
                    <p class="text-sm" :class="isDarkMode ? 'text-green-400' : 'text-green-600'">{{ formData.image }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="formData.image = ''"
                  class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  <i class="pi pi-times mr-1"></i>
                  Remove
                </button>
              </div>
              <div v-else>
                <p class="text-sm mb-4" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                  Choose a cover image for this event. This will be displayed as a thumbnail.
                </p>
                <div class="border-2 border-dashed rounded-lg p-6" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
                  <ImageGallery
                    :current-image="formData.image"
                    @image-selected="(image) => { formData.image = image.url }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            ></textarea>
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              v-model="formData.full_description"
              rows="6"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            ></textarea>
          </div>

          <div class="col-span-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="formData.registration_open" class="rounded" />
              <span class="text-sm font-medium">Registration Open</span>
            </label>
          </div>

          <div v-if="formData.registration_open">
            <label class="block text-sm font-medium mb-2">Registration Deadline</label>
            <input
              v-model="formData.registration_deadline"
              type="date"
              class="w-full px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
          </div>

          <div class="col-span-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="formData.is_featured" class="rounded" />
              <span class="text-sm font-medium">Featured Event</span>
            </label>
          </div>
        </div>

        <!-- Speakers Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium">Speakers</label>
            <button
              type="button"
              @click="addSpeaker"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              <i class="pi pi-plus mr-1"></i>
              Add Speaker
            </button>
          </div>
          
          <div v-if="speakers.length === 0" class="text-sm text-gray-500 italic">
            No speakers added yet
          </div>
          
          <div v-for="(speaker, index) in speakers" :key="index" class="mb-4 p-4 border rounded-lg" :class="isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-slate-50'">
            <div class="flex justify-between items-start mb-3">
              <span class="text-sm font-medium">Speaker {{ index + 1 }}</span>
              <button
                type="button"
                @click="removeSpeaker(index)"
                class="text-red-600 hover:text-red-700"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs mb-1">Name *</label>
                <input
                  v-model="speaker.name"
                  type="text"
                  placeholder="e.g., Dr. Kofi Adomakoh"
                  class="w-full px-2 py-1 text-sm border rounded"
                  :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-300 text-slate-900'"
                />
              </div>
              <div>
                <label class="block text-xs mb-1">Title *</label>
                <input
                  v-model="speaker.title"
                  type="text"
                  placeholder="e.g., CEO, Ghana Commodity Exchange"
                  class="w-full px-2 py-1 text-sm border rounded"
                  :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-300 text-slate-900'"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-xs mb-1">Speaker Image</label>
                <div v-if="speaker.image" class="flex items-center justify-between p-2 rounded border" :class="isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'">
                  <div class="flex items-center space-x-2">
                    <img :src="speaker.image" class="w-12 h-12 rounded object-cover" @error="handleImageError" />
                    <p class="text-xs font-medium" :class="isDarkMode ? 'text-green-200' : 'text-green-800'">Image selected</p>
                  </div>
                  <button
                    type="button"
                    @click="speaker.image = ''"
                    class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                  >
                    <i class="pi pi-times"></i>
                  </button>
                </div>
                <div v-else>
                  <div class="border border-dashed rounded p-3" :class="isDarkMode ? 'border-slate-600' : 'border-slate-300'">
                    <ImageGallery
                      :current-image="speaker.image"
                      :compact="true"
                      @image-selected="(image) => { speaker.image = image.url }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Agenda Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium">Event Agenda</label>
            <button
              type="button"
              @click="addAgendaItem"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              <i class="pi pi-plus mr-1"></i>
              Add Item
            </button>
          </div>
          
          <div v-if="agenda.length === 0" class="text-sm text-gray-500 italic">
            No agenda items added yet
          </div>
          
          <div v-for="(item, index) in agenda" :key="index" class="mb-3 p-3 border rounded-lg" :class="isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-slate-300 bg-slate-50'">
            <div class="flex gap-3 items-start">
              <div class="w-32">
                <label class="block text-xs mb-1">Time</label>
                <input
                  v-model="item.time"
                  type="text"
                  placeholder="e.g., 9:00 AM"
                  class="w-full px-2 py-1 text-sm border rounded"
                  :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-300 text-slate-900'"
                />
              </div>
              <div class="flex-1">
                <label class="block text-xs mb-1">Session</label>
                <input
                  v-model="item.session"
                  type="text"
                  placeholder="e.g., Opening Ceremony"
                  class="w-full px-2 py-1 text-sm border rounded"
                  :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-slate-300 text-slate-900'"
                />
              </div>
              <button
                type="button"
                @click="removeAgendaItem(index)"
                class="mt-5 text-red-600 hover:text-red-700"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Requirements Section -->
        <div class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium">What to Bring (Requirements)</label>
            <button
              type="button"
              @click="addRequirement"
              class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              <i class="pi pi-plus mr-1"></i>
              Add Requirement
            </button>
          </div>
          
          <div v-if="requirements.length === 0" class="text-sm text-gray-500 italic">
            No requirements added yet
          </div>
          
          <div v-for="(requirement, index) in requirements" :key="index" class="mb-2 flex gap-2">
            <input
              v-model="requirements[index]"
              type="text"
              placeholder="e.g., Valid government-issued ID"
              class="flex-1 px-3 py-2 border rounded-lg"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            />
            <button
              type="button"
              @click="removeRequirement(index)"
              class="px-3 py-2 text-red-600 hover:text-red-700"
            >
              <i class="pi pi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showModal = false"
            class="px-4 py-2 border rounded-lg"
            :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'"
          >
            Cancel
          </button>
          <button
            @click="saveEvent"
            class="px-4 py-2 rounded-lg text-white"
            :class="saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </template>
    </Dialog>

    <!-- Registrations Modal -->
    <Dialog v-model:visible="showRegistrationsModal" modal header="Event Registrations" :style="{ width: '1000px' }" class="registrations-modal">
      <div v-if="loadingRegistrations" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-2xl text-blue-600"></i>
        <p class="mt-2" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">Loading registrations...</p>
      </div>

      <div v-else-if="currentEventRegistrations.length === 0" class="text-center py-8">
        <i class="pi pi-users text-4xl mb-4" :class="isDarkMode ? 'text-slate-500' : 'text-gray-400'"></i>
        <p :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">No registrations yet for this event.</p>
      </div>

      <div v-else>
        <!-- Registration Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 rounded-lg border" :class="isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'">
            <div class="text-2xl font-bold text-blue-600">{{ currentEventRegistrations.length }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-blue-400' : 'text-blue-700'">Total Registrations</div>
          </div>
          <div class="p-4 rounded-lg border" :class="isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'">
            <div class="text-2xl font-bold text-green-600">{{ confirmedCount }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-green-400' : 'text-green-700'">Confirmed</div>
          </div>
          <div class="p-4 rounded-lg border" :class="isDarkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'">
            <div class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</div>
            <div class="text-sm" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-700'">Pending</div>
          </div>
        </div>

        <!-- Registrations Table -->
        <div class="overflow-x-auto rounded-lg border" :class="isDarkMode ? 'border-slate-700' : 'border-gray-200'">
          <table class="min-w-full divide-y" :class="isDarkMode ? 'divide-slate-700' : 'divide-gray-200'">
            <thead :class="isDarkMode ? 'bg-slate-700' : 'bg-gray-50'">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Phone</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Organization</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Position</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Registered</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" :class="isDarkMode ? 'text-slate-300' : 'text-gray-700'">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y" :class="isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'">
              <tr v-for="registration in currentEventRegistrations" :key="registration.id" :class="isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium" :class="isDarkMode ? 'text-white' : 'text-gray-900'">{{ registration.full_name }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ registration.email }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ registration.phone }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ registration.organization || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ registration.position || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full capitalize" :class="getRegistrationStatusColor(registration.registration_status)">
                    {{ registration.registration_status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-gray-600'">{{ formatDateTime(registration.created_at) }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <button
                    @click="updateRegistrationStatus(registration)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-700"
                    :title="registration.registration_status === 'pending' ? 'Confirm Registration' : 'Mark as Pending'"
                  >
                    {{ registration.registration_status === 'pending' ? '✓ Confirm' : '⟲ Pending' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Export Button -->
        <div class="mt-6 flex justify-end">
          <button
            @click="exportRegistrations"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <i class="pi pi-download mr-2"></i>
            Export to CSV
          </button>
        </div>
      </div>

      <template #footer>
        <button
          @click="showRegistrationsModal = false"
          class="px-4 py-2 border rounded-lg"
          :class="isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'"
        >
          Close
        </button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import eventService, { type Event } from '../../services/eventService'
import Dialog from 'primevue/dialog'
import ImageGallery from './ImageGallery.vue'

// State
const events = ref<Event[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)

// Dynamic fields for speakers, agenda, and requirements
const speakers = ref<Array<{ name: string; title: string; image: string }>>([])
const agenda = ref<Array<{ time: string; session: string }>>([])
const requirements = ref<string[]>([])
const currentSpeakerIndex = ref<number | null>(null)

// Registrations
const showRegistrationsModal = ref(false)
const loadingRegistrations = ref(false)
const currentEventRegistrations = ref<any[]>([])
const currentEvent = ref<Event | null>(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')

// Form data
const formData = ref<Partial<Event>>({
  title: '',
  slug: '',
  date: '',
  time: '',
  location: '',
  venue: '',
  address: '',
  type: 'Conference',
  category: 'Conference',
  status: 'upcoming',
  description: '',
  full_description: '',
  attendees: 0,
  image: '',
  registration_open: false,
  registration_deadline: '',
  price: '',
  speakers: [],
  agenda: [],
  requirements: [],
  is_active: true,
  is_featured: false,
  sort_order: 0
})

// Computed
const filteredEvents = computed(() => {
  let filtered = events.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      (event.description && event.description.toLowerCase().includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(event => event.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(event => event.type === typeFilter.value)
  }

  return filtered
})

const confirmedCount = computed(() => {
  return currentEventRegistrations.value.filter(r => r.registration_status === 'confirmed').length
})

const pendingCount = computed(() => {
  return currentEventRegistrations.value.filter(r => r.registration_status === 'pending').length
})

// Methods
const fetchEvents = async () => {
  try {
    loading.value = true
    error.value = null
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error.value = 'Authentication required'
      return
    }
    events.value = await eventService.getAllEvents(token)
  } catch (err: any) {
    console.error('Failed to fetch events:', err)
    error.value = 'Failed to load events. Please try again.'
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    title: '',
    slug: '',
    date: '',
    time: '',
    location: '',
    venue: '',
    address: '',
    type: 'Conference',
    category: 'Conference',
    status: 'upcoming',
    description: '',
    full_description: '',
    attendees: 0,
    image: '',
    registration_open: false,
    registration_deadline: '',
    price: '',
    is_active: true,
    is_featured: false,
    sort_order: 0
  }
  // Reset arrays
  speakers.value = []
  agenda.value = []
  requirements.value = []
  showModal.value = true
}

const editEvent = (event: Event) => {
  isEditing.value = true
  formData.value = { ...event }
  
  // Parse JSON fields
  try {
    speakers.value = Array.isArray(event.speakers) ? event.speakers : JSON.parse(event.speakers as any || '[]')
  } catch {
    speakers.value = []
  }
  
  try {
    agenda.value = Array.isArray(event.agenda) ? event.agenda : JSON.parse(event.agenda as any || '[]')
  } catch {
    agenda.value = []
  }
  
  try {
    requirements.value = Array.isArray(event.requirements) ? event.requirements : JSON.parse(event.requirements as any || '[]')
  } catch {
    requirements.value = []
  }
  
  showModal.value = true
}

const saveEvent = async () => {
  try {
    saving.value = true
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error.value = 'Authentication required'
      return
    }

    // Ensure category matches type
    formData.value.category = formData.value.type
    
    // Convert arrays to JSON for saving
    formData.value.speakers = speakers.value as any
    formData.value.agenda = agenda.value as any
    formData.value.requirements = requirements.value as any

    if (isEditing.value && formData.value.id) {
      await eventService.updateEvent(token, formData.value.id, formData.value)
    } else {
      await eventService.createEvent(token, formData.value)
    }

    showModal.value = false
    await fetchEvents()
  } catch (err: any) {
    console.error('Failed to save event:', err)
    alert('Failed to save event. Please try again.')
  } finally {
    saving.value = false
  }
}

const deleteEvent = async (event: Event) => {
  if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
    return
  }

  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error.value = 'Authentication required'
      return
    }

    await eventService.deleteEvent(token, event.id)
    await fetchEvents()
  } catch (err: any) {
    console.error('Failed to delete event:', err)
    alert('Failed to delete event. Please try again.')
  }
}

const viewRegistrations = async (event: Event) => {
  currentEvent.value = event
  loadingRegistrations.value = true
  showRegistrationsModal.value = true
  
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      error.value = 'Authentication required'
      return
    }

    currentEventRegistrations.value = await eventService.getEventRegistrations(token, event.id)
  } catch (err: any) {
    console.error('Failed to fetch registrations:', err)
    currentEventRegistrations.value = []
  } finally {
    loadingRegistrations.value = false
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
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
    upcoming: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getTypeColor = (type: string) => {
  const colors = {
    'Conference': 'bg-blue-100 text-blue-800',
    'Summit': 'bg-purple-100 text-purple-800',
    'Workshop': 'bg-orange-100 text-orange-800',
    'Forum': 'bg-pink-100 text-pink-800',
    'Program': 'bg-green-100 text-green-800',
    'Meeting': 'bg-indigo-100 text-indigo-800'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const handleImageError = (e: any) => {
  const img = e.target as HTMLImageElement
  img.src = '/Picture3.png'
}

// Speaker methods
const addSpeaker = () => {
  speakers.value.push({ name: '', title: '', image: '' })
}

const removeSpeaker = (index: number) => {
  speakers.value.splice(index, 1)
}

// Agenda methods
const addAgendaItem = () => {
  agenda.value.push({ time: '', session: '' })
}

const removeAgendaItem = (index: number) => {
  agenda.value.splice(index, 1)
}

// Requirements methods
const addRequirement = () => {
  requirements.value.push('')
}

const removeRequirement = (index: number) => {
  requirements.value.splice(index, 1)
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRegistrationStatusColor = (status: string) => {
  const colors = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const updateRegistrationStatus = async (registration: any) => {
  const newStatus = registration.registration_status === 'pending' ? 'confirmed' : 'pending'
  
  try {
    // Update in database (you'll need to add this endpoint to the backend)
    // For now, just update locally
    registration.registration_status = newStatus
    
    // Optionally send to backend if you add the endpoint
    // const token = localStorage.getItem('auth_token')
    // await axios.put(`/api/cms/registrations/${registration.id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` }})
  } catch (err: any) {
    console.error('Failed to update registration status:', err)
    alert('Failed to update status')
  }
}

const exportRegistrations = () => {
  if (!currentEvent.value || currentEventRegistrations.value.length === 0) return

  // Create CSV content
  const headers = ['Name', 'Email', 'Phone', 'Organization', 'Position', 'Status', 'Registered Date']
  const rows = currentEventRegistrations.value.map(reg => [
    reg.full_name,
    reg.email,
    reg.phone,
    reg.organization || '',
    reg.position || '',
    reg.registration_status,
    new Date(reg.created_at).toLocaleString()
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${currentEvent.value.slug}-registrations.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.event-manager {
  padding: 1rem;
}
</style>
