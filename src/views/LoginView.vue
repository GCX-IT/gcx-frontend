<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { isDarkMode } from '@/utils/darkMode'
import { getBackendURL } from '@/plugins/axios'

const router = useRouter()
const { login, isAuthenticated, error, isLoading } = useAuth()

const email = ref('admin@gcx.com')
const password = ref('admin123')
const showPassword = ref(false)

// Redirect if already logged in
onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/cms')
  }
})

const handleLogin = async () => {
  const result = await login({
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    router.push('/cms')
  }
}

const handleKeypress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center transition-colors duration-300" 
       :class="isDarkMode ? 'bg-slate-900' : 'bg-slate-50'">
    
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-32 w-80 h-80 rounded-full opacity-10"
           :class="isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 rounded-full opacity-10"
           :class="isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'"></div>
    </div>

    <div class="relative max-w-md w-full mx-4">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <img src="/logo_black.png" alt="GCX Logo" class="h-12 w-auto">
        </div>
        <h1 class="text-3xl font-bold mb-2" :class="isDarkMode ? 'text-white' : 'text-slate-900'">
          GCX CMS
        </h1>
        <p class="text-sm" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
          Content Management System
        </p>
      </div>

      <!-- Login Form -->
      <div class="rounded-xl shadow-xl p-8 border" 
           :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
        
        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium mb-2"
                   :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Email Address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              :class="isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
              placeholder="Enter your email"
              @keypress="handleKeypress"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium mb-2"
                   :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                :class="isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'"
                placeholder="Enter your password"
                @keypress="handleKeypress"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <svg v-if="!showPassword" class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Default Credentials -->
        <div class="mt-6 p-4 rounded-lg border" 
             :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
          <p class="text-xs font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            Default Admin Credentials:
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            Email: admin@gcx.com<br>
            Password: admin123
          </p>
        </div>

        <!-- Access Info -->
        <div class="mt-6 p-4 rounded-lg border" 
             :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
          <p class="text-xs font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
            CMS Access:
          </p>
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            After login, you'll be redirected to the CMS dashboard where you can manage blog posts, media, and website content.
          </p>
        </div>

        <!-- Backend Status -->
        <div class="mt-4 text-center">
          <p class="text-xs" :class="isDarkMode ? 'text-slate-500' : 'text-slate-400'">
            Using Go Backend: {{ isLoading ? 'Connecting...' : getBackendURL() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
