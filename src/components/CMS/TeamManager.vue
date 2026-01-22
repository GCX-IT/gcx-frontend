<template>
  <div class="team-manager min-h-screen transition-colors duration-300" :class="isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'">
    <!-- Header Section -->
    <div class="shadow-sm border-b transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="px-6 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Team Management
            </h1>
            <p class="mt-2 text-lg transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              Manage your organization's leadership and team members
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="px-4 py-2 rounded-lg transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-blue-50'">
              <span class="text-sm font-medium transition-colors duration-300" :class="isDarkMode ? 'text-blue-300' : 'text-blue-700'">Total Members</span>
              <div class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-blue-400' : 'text-blue-600'">
                {{ getTotalMembers() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="shadow-sm border-b transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="px-6">
        <nav class="flex space-x-8">
          <button
            v-for="tab in teamTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 relative group"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : isDarkMode 
                  ? 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="p-2 rounded-lg transition-colors duration-200"
                   :class="activeTab === tab.id 
                     ? 'bg-blue-100' 
                     : isDarkMode 
                       ? 'bg-slate-700 group-hover:bg-slate-600' 
                       : 'bg-slate-100 group-hover:bg-slate-200'">
                <i :class="tab.icon" class="text-lg"></i>
              </div>
              <div class="text-left">
                <div class="font-semibold">{{ tab.name }}</div>
                <div class="text-xs opacity-75">{{ getTeamCount(tab.id) }} members</div>
              </div>
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Board of Directors Tab -->
    <div v-if="activeTab === 'board'" class="p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Board of Directors</h3>
          <p class="mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Governance and strategic oversight leadership</p>
        </div>
        <button
          @click="openAddModal('board')"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <i class="pi pi-plus text-lg"></i>
          <span class="font-semibold">Add Board Member</span>
        </button>
      </div>

      <div class="mb-4 p-4 rounded-lg border" :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'">
        <div class="flex items-center gap-2 text-sm" :class="isDarkMode ? 'text-slate-300' : 'text-blue-700'">
          <i class="pi pi-info-circle"></i>
          <span>Drag and drop board members to reorder them. Chairman will appear first, then CEO, then others by order.</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(member, index) in boardMembers"
          :key="member.id"
          :data-id="member.id"
          :data-index="index"
          draggable="true"
          @dragstart="handleDragStart($event, member, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop($event, index, 'board')"
          @dragenter="handleDragEnter($event)"
          @dragleave="handleDragLeave($event)"
          class="group shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1 cursor-move"
          :class="[
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
              : 'bg-white border-slate-200 hover:border-blue-300',
            draggedIndex === index ? 'opacity-50 border-blue-500' : '',
            dragOverIndex === index ? 'border-blue-500 ring-2 ring-blue-300' : ''
          ]"
        >
          <!-- Image Section - Increased Height -->
          <div class="relative h-64 overflow-hidden">
            <img
              :src="member.image || '/placeholder-avatar.jpg'"
              :alt="member.name"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex space-x-2">
                <button
                  @click="editMember('board', member)"
                  class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="deleteMember('board', member.id)"
                  class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Content Section - More Compact -->
          <div class="p-5">
            <div class="mb-3">
              <h4 class="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ member.name }}
              </h4>
              <div class="flex items-center space-x-2 mb-3">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ member.title }}
                </span>
                <span v-if="member.order_index" class="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                  #{{ member.order_index }}
                </span>
              </div>
            </div>
            
            <p class="text-sm leading-relaxed mb-4 line-clamp-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              {{ member.description }}
            </p>

            <!-- Social Media Links - Compact -->
            <div v-if="hasSocialMedia(member)" class="flex items-center space-x-2 mb-4">
              <span class="text-xs text-slate-500">Connect:</span>
              <div class="flex space-x-1">
                <a
                  v-if="member.linkedin_url"
                  :href="member.linkedin_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <i class="pi pi-linkedin text-xs"></i>
                </a>
                <a
                  v-if="member.twitter_url"
                  :href="member.twitter_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-full flex items-center justify-center transition-colors"
                  title="Twitter"
                >
                  <i class="pi pi-twitter text-xs"></i>
                </a>
                <a
                  v-if="member.facebook_url"
                  :href="member.facebook_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <i class="pi pi-facebook text-xs"></i>
                </a>
                <a
                  v-if="member.instagram_url"
                  :href="member.instagram_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <i class="pi pi-instagram text-xs"></i>
                </a>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-200">
              <div class="flex space-x-2">
                <button
                  @click="editMember('board', member)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  Edit
                </button>
                <button
                  @click="deleteMember('board', member.id)"
                  class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-trash mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Executive Heads Tab -->
    <div v-if="activeTab === 'executive'" class="p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Executive Heads</h3>
          <p class="mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Senior leadership and strategic management</p>
        </div>
        <button
          @click="openAddModal('executive')"
          class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <i class="pi pi-plus text-lg"></i>
          <span class="font-semibold">Add Executive</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          v-for="member in executiveMembers"
          :key="member.id"
          class="group shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1"
          :class="isDarkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-green-500' 
            : 'bg-white border-slate-200 hover:border-green-300'"
        >
          <!-- Image Section - Increased Height -->
          <div class="relative h-64 overflow-hidden">
            <img
              :src="member.image || '/placeholder-avatar.jpg'"
              :alt="member.name"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex space-x-2">
                <button
                  @click="editMember('executive', member)"
                  class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="deleteMember('executive', member.id)"
                  class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Content Section - More Compact -->
          <div class="p-5">
            <div class="mb-3">
              <h4 class="text-lg font-bold mb-2 group-hover:text-green-600 transition-colors" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ member.name }}
              </h4>
              <div class="flex items-center space-x-2 mb-3">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {{ member.title }}
                </span>
              </div>
            </div>
            
            <p class="text-sm leading-relaxed mb-4 line-clamp-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              {{ member.description }}
            </p>

            <!-- Social Media Links - Compact -->
            <div v-if="hasSocialMedia(member)" class="flex items-center space-x-2 mb-4">
              <span class="text-xs text-slate-500">Connect:</span>
              <div class="flex space-x-1">
                <a
                  v-if="member.linkedin_url"
                  :href="member.linkedin_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <i class="pi pi-linkedin text-xs"></i>
                </a>
                <a
                  v-if="member.twitter_url"
                  :href="member.twitter_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-full flex items-center justify-center transition-colors"
                  title="Twitter"
                >
                  <i class="pi pi-twitter text-xs"></i>
                </a>
                <a
                  v-if="member.facebook_url"
                  :href="member.facebook_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <i class="pi pi-facebook text-xs"></i>
                </a>
                <a
                  v-if="member.instagram_url"
                  :href="member.instagram_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <i class="pi pi-instagram text-xs"></i>
                </a>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-200">
              <div class="flex space-x-2">
                <button
                  @click="editMember('executive', member)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  Edit
                </button>
                <button
                  @click="deleteMember('executive', member.id)"
                  class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-trash mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Functional Heads Tab -->
    <div v-if="activeTab === 'functional'" class="p-6">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="text-2xl font-bold transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">Functional Heads</h3>
          <p class="mt-1 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">Department leaders and operational managers</p>
        </div>
        <button
          @click="openAddModal('functional')"
          class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <i class="pi pi-plus text-lg"></i>
          <span class="font-semibold">Add Functional Head</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="member in functionalMembers"
          :key="member.id"
          class="group shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border transform hover:-translate-y-1"
          :class="isDarkMode 
            ? 'bg-slate-800 border-slate-700 hover:border-purple-500' 
            : 'bg-white border-slate-200 hover:border-purple-300'"
        >
          <!-- Image Section - Increased Height -->
          <div class="relative h-64 overflow-hidden">
            <img
              :src="member.image || '/placeholder-avatar.jpg'"
              :alt="member.name"
              class="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              @error="handleImageError"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="flex space-x-2">
                <button
                  @click="editMember('functional', member)"
                  class="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="deleteMember('functional', member.id)"
                  class="p-2 bg-red-500/90 hover:bg-red-500 text-white rounded-full shadow-lg transition-colors"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Content Section - More Compact -->
          <div class="p-5">
            <div class="mb-3">
              <h4 class="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                {{ member.name }}
              </h4>
              <div class="flex items-center space-x-2 mb-3">
                <span class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {{ member.title }}
                </span>
              </div>
            </div>
            
            <p class="text-sm leading-relaxed mb-4 line-clamp-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
              {{ member.description }}
            </p>

            <!-- Social Media Links - Compact -->
            <div v-if="hasSocialMedia(member)" class="flex items-center space-x-2 mb-4">
              <span class="text-xs text-slate-500">Connect:</span>
              <div class="flex space-x-1">
                <a
                  v-if="member.linkedin_url"
                  :href="member.linkedin_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <i class="pi pi-linkedin text-xs"></i>
                </a>
                <a
                  v-if="member.twitter_url"
                  :href="member.twitter_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-full flex items-center justify-center transition-colors"
                  title="Twitter"
                >
                  <i class="pi pi-twitter text-xs"></i>
                </a>
                <a
                  v-if="member.facebook_url"
                  :href="member.facebook_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <i class="pi pi-facebook text-xs"></i>
                </a>
                <a
                  v-if="member.instagram_url"
                  :href="member.instagram_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-full flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <i class="pi pi-instagram text-xs"></i>
                </a>
              </div>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-200">
              <div class="flex space-x-2">
                <button
                  @click="editMember('functional', member)"
                  class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-pencil mr-1"></i>
                  Edit
                </button>
                <button
                  @click="deleteMember('functional', member.id)"
                  class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium transition-colors"
                >
                  <i class="pi pi-trash mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Professional Add/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      @click="closeModal"
    >
      <div
        class="shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transition-colors duration-300" :class="isDarkMode ? 'bg-slate-800' : 'bg-white'"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="p-3 bg-white/20 rounded-xl">
                <i class="pi pi-user text-2xl text-white"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">
                  {{ editingMember ? 'Edit Team Member' : 'Add New Team Member' }}
                </h3>
                <p class="text-blue-100 mt-1">
                  {{ getTeamTypeName(modalType) }} • {{ editingMember ? 'Update information' : 'Create new profile' }}
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <i class="pi pi-times text-xl text-white"></i>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-8 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form @submit.prevent="saveMember" class="space-y-8">
            <!-- Basic Information Section -->
            <div class="p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-50'">
              <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <i class="pi pi-info-circle mr-2 text-blue-600"></i>
                Basic Information
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Full Name *
                  </label>
                  <input
                    v-model="memberForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Job Title *
                  </label>
                  <input
                    v-model="memberForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="Enter job title"
                  />
                </div>
              </div>
            </div>

            <!-- Description Section -->
            <div class="p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-50'">
              <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <i class="pi pi-file-edit mr-2 text-green-600"></i>
                Biography & Description
              </h4>
              <div>
                <label class="block text-sm font-semibold mb-3 text-slate-700">
                  Professional Description *
                </label>
                <textarea
                  v-model="memberForm.description"
                  rows="5"
                  required
                  class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                  placeholder="Enter detailed professional biography and description..."
                ></textarea>
                <p class="text-xs mt-2 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-500'">
                  This will be displayed on the website as the member's bio
                </p>
              </div>
            </div>

            <!-- Profile Image Section -->
            <div class="p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-50'">
              <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <i class="pi pi-image mr-2 text-purple-600"></i>
                Profile Image
              </h4>
              <div class="flex items-start space-x-6">
                <div class="flex-shrink-0">
                  <div class="w-32 h-32 overflow-hidden border-4 transition-colors duration-300" :class="isDarkMode ? 'border-slate-600 bg-slate-600' : 'border-slate-200 bg-slate-100'">
                    <img
                      v-if="memberForm.image"
                      :src="memberForm.image"
                      alt="Profile Preview"
                      class="w-full h-full object-cover object-top"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <i class="pi pi-user text-4xl text-slate-400"></i>
                    </div>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm mb-4 transition-colors duration-300" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
                    Choose a professional headshot or profile photo for this team member. Click on any image to select it.
                  </p>
                  <ImageGallery
                    title="Select Profile Image"
                    :current-image="memberForm.image"
                    @image-selected="(img) => memberForm.image = img.url"
                  />
                </div>
              </div>
            </div>

            <!-- Social Media Section -->
            <div class="p-6 transition-colors duration-300" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-50'">
              <h4 class="text-lg font-semibold mb-4 flex items-center transition-colors duration-300" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
                <i class="pi pi-share-alt mr-2 text-orange-600"></i>
                Social Media Profiles
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    LinkedIn Profile
                  </label>
                  <input
                    v-model="memberForm.linkedin_url"
                    type="url"
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Twitter Profile
                  </label>
                  <input
                    v-model="memberForm.twitter_url"
                    type="url"
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="https://twitter.com/username"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Facebook Profile
                  </label>
                  <input
                    v-model="memberForm.facebook_url"
                    type="url"
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="https://facebook.com/username"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-semibold mb-3 transition-colors duration-300" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
                    Instagram Profile
                  </label>
                  <input
                    v-model="memberForm.instagram_url"
                    type="url"
                    class="w-full px-4 py-3 border-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :class="isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900'"
                    placeholder="https://instagram.com/username"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t transition-colors duration-300" :class="isDarkMode ? 'border-slate-600' : 'border-slate-200'">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-3 font-semibold transition-all duration-200"
                :class="isDarkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <i class="pi pi-spin pi-spinner" v-if="saving"></i>
                <i v-else class="pi pi-check" v-if="!saving"></i>
                <span>{{ saving ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isDarkMode } from '../../utils/darkMode'
import ImageGallery from './ImageGallery.vue'
import axios from '../../plugins/axios'

interface TeamMember {
  id: string
  name: string
  title: string
  description: string
  image?: string
  type: 'board' | 'executive' | 'functional'
  order_index?: number
  // Social Media Handles
  linkedin_url?: string
  twitter_url?: string
  facebook_url?: string
  instagram_url?: string
  created_at?: string
  updated_at?: string
}

interface MemberForm {
  name: string
  title: string
  description: string
  image: string
  // Social Media Handles
  linkedin_url: string
  twitter_url: string
  facebook_url: string
  instagram_url: string
}

// State
const activeTab = ref('board')
const showModal = ref(false)
const modalType = ref<'board' | 'executive' | 'functional'>('board')
const editingMember = ref<TeamMember | null>(null)
const saving = ref(false)

const boardMembers = ref<TeamMember[]>([])
const executiveMembers = ref<TeamMember[]>([])
const functionalMembers = ref<TeamMember[]>([])

// Drag and drop state
const draggedMember = ref<TeamMember | null>(null)
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const memberForm = ref<MemberForm>({
  name: '',
  title: '',
  description: '',
  image: '',
  // Social Media Handles
  linkedin_url: '',
  twitter_url: '',
  facebook_url: '',
  instagram_url: ''
})

// Computed
const teamTabs = [
  { id: 'board', name: 'Board of Directors', icon: 'pi pi-building' },
  { id: 'executive', name: 'Executive Heads', icon: 'pi pi-users' },
  { id: 'functional', name: 'Functional Heads', icon: 'pi pi-briefcase' }
]

const getTeamCount = (type: string) => {
  switch (type) {
    case 'board': return boardMembers.value.length
    case 'executive': return executiveMembers.value.length
    case 'functional': return functionalMembers.value.length
    default: return 0
  }
}

const getTotalMembers = () => {
  return boardMembers.value.length + executiveMembers.value.length + functionalMembers.value.length
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Recently'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-avatar.jpg'
}

const hasSocialMedia = (member: TeamMember) => {
  return member.linkedin_url || member.twitter_url || member.facebook_url || member.instagram_url
}

const getTeamTypeName = (type: string) => {
  switch (type) {
    case 'board': return 'Board Member'
    case 'executive': return 'Executive'
    case 'functional': return 'Functional Head'
    default: return 'Member'
  }
}

// Methods
const loadTeamMembers = async () => {
  try {
    const response = await axios.get('/api/team-members')
    if (response.data.success) {
      const members = response.data.data
      boardMembers.value = members.filter((m: TeamMember) => m.type === 'board')
      executiveMembers.value = members.filter((m: TeamMember) => m.type === 'executive')
      functionalMembers.value = members.filter((m: TeamMember) => m.type === 'functional')
    }
  } catch (error) {
    console.error('Failed to load team members:', error)
  }
}

const openAddModal = (type: 'board' | 'executive' | 'functional') => {
  modalType.value = type
  editingMember.value = null
  memberForm.value = {
    name: '',
    title: '',
    description: '',
    image: ''
  }
  showModal.value = true
}

const editMember = (type: 'board' | 'executive' | 'functional', member: TeamMember) => {
  modalType.value = type
  editingMember.value = member
  memberForm.value = {
    name: member.name,
    title: member.title,
    description: member.description,
    image: member.image || '',
    // Social Media Handles
    linkedin_url: member.linkedin_url || '',
    twitter_url: member.twitter_url || '',
    facebook_url: member.facebook_url || '',
    instagram_url: member.instagram_url || ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingMember.value = null
  memberForm.value = {
    name: '',
    title: '',
    description: '',
    image: '',
    // Social Media Handles
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    instagram_url: ''
  }
}

const saveMember = async () => {
  saving.value = true
  try {
    const memberData = {
      ...memberForm.value,
      type: modalType.value
    }

    if (editingMember.value) {
      // Update existing member
      const response = await axios.put(`/api/team-members/${editingMember.value.id}`, memberData)
      if (response.data.success) {
        await loadTeamMembers()
        closeModal()
      }
    } else {
      // Create new member
      const response = await axios.post('/api/team-members', memberData)
      if (response.data.success) {
        await loadTeamMembers()
        closeModal()
      }
    }
  } catch (error) {
    console.error('Failed to save member:', error)
  } finally {
    saving.value = false
  }
}

const deleteMember = async (type: 'board' | 'executive' | 'functional', id: string) => {
  if (!confirm('Are you sure you want to delete this member?')) return
  
  try {
    const response = await axios.delete(`/api/team-members/${id}`)
    if (response.data.success) {
      await loadTeamMembers()
    }
  } catch (error) {
    console.error('Failed to delete member:', error)
  }
}

// Drag and drop handlers
const handleDragStart = (event: DragEvent, member: TeamMember, index: number) => {
  draggedMember.value = member
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', member.id)
  }
}

const handleDragOver = (event: DragEvent, index: number) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  dragOverIndex.value = index
}

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
}

const handleDragLeave = (event: DragEvent) => {
  dragOverIndex.value = null
}

const handleDrop = async (event: DragEvent, dropIndex: number, type: 'board' | 'executive' | 'functional') => {
  event.preventDefault()
  dragOverIndex.value = null
  
  if (!draggedMember.value || draggedIndex.value === null) return
  
  const members = type === 'board' ? boardMembers.value : type === 'executive' ? executiveMembers.value : functionalMembers.value
  
  // Reorder the array
  const newMembers = [...members]
  const [removed] = newMembers.splice(draggedIndex.value, 1)
  newMembers.splice(dropIndex, 0, removed)
  
  // Update local state immediately for better UX
  if (type === 'board') {
    boardMembers.value = newMembers
  } else if (type === 'executive') {
    executiveMembers.value = newMembers
  } else {
    functionalMembers.value = newMembers
  }
  
  // Update order_index for all members
  const reorderData = newMembers.map((member, index) => ({
    id: parseInt(member.id),
    order_index: index + 1
  }))
  
  try {
    const response = await axios.put('/api/team-members/reorder', {
      team_type: type,
      members: reorderData
    })
    
    if (response.data.success) {
      // Reload to ensure consistency with backend sorting
      await loadTeamMembers()
    } else {
      throw new Error(response.data.error || 'Failed to reorder')
    }
  } catch (error: any) {
    console.error('Failed to reorder members:', error)
    // Revert on error
    await loadTeamMembers()
    alert('Failed to save order. Please try again.')
  }
  
  draggedMember.value = null
  draggedIndex.value = null
}

// Lifecycle
onMounted(() => {
  loadTeamMembers()
})
</script>

<style scoped>
.team-manager {
  @apply w-full;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for modal */
.max-h-\[calc\(90vh-120px\)\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[calc\(90vh-120px\)\]::-webkit-scrollbar-track {
  @apply bg-slate-100 dark:bg-slate-700 rounded-full;
}

.max-h-\[calc\(90vh-120px\)\]::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-500 rounded-full;
}

.max-h-\[calc\(90vh-120px\)\]::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-400;
}

/* Smooth animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Drag and drop styles */
[draggable="true"] {
  cursor: move;
}

[draggable="true"]:active {
  cursor: grabbing;
}

/* Gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
