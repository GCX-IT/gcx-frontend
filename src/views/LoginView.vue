<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { isDarkMode } from '@/utils/darkMode'

const router = useRouter()
const { login, requestOtp, loginWithOtp, isAuthenticated, error, isLoading, clearError } = useAuth()

// 'otp' (passwordless, default) or 'password'
const mode = ref<'otp' | 'password'>('otp')
// OTP sub-steps: 'email' -> enter address, 'code' -> enter the 6-digit code
const otpStep = ref<'email' | 'code'>('email')

const email = ref('')
const code = ref('')
const password = ref('')
const showPassword = ref(false)
const info = ref('')

onMounted(() => {
  if (isAuthenticated.value) router.push('/cms')
})

const switchMode = (m: 'otp' | 'password') => {
  mode.value = m
  otpStep.value = 'email'
  code.value = ''
  info.value = ''
  clearError()
}

const handlePasswordLogin = async () => {
  const result = await login({ email: email.value, password: password.value })
  if (result.success) router.push('/cms')
}

const handleSendCode = async () => {
  info.value = ''
  const result = await requestOtp(email.value)
  if (result.success) {
    otpStep.value = 'code'
    info.value = `We sent a 6-digit code to ${email.value}. It expires in 10 minutes.`
  }
}

const handleVerifyCode = async () => {
  const result = await loginWithOtp(email.value, code.value)
  if (result.success) router.push('/cms')
}

const resetToEmail = () => {
  otpStep.value = 'email'
  code.value = ''
  info.value = ''
  clearError()
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

      <!-- Card -->
      <div class="rounded-xl shadow-xl p-8 border"
           :class="isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">

        <!-- Mode toggle -->
        <div class="flex p-1 mb-6 rounded-lg" :class="isDarkMode ? 'bg-slate-700' : 'bg-slate-100'">
          <button type="button" @click="switchMode('otp')"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
            :class="mode === 'otp'
              ? (isDarkMode ? 'bg-slate-900 text-yellow-400' : 'bg-white text-slate-900 shadow')
              : (isDarkMode ? 'text-slate-400' : 'text-slate-500')">
            Email code
          </button>
          <button type="button" @click="switchMode('password')"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
            :class="mode === 'password'
              ? (isDarkMode ? 'bg-slate-900 text-yellow-400' : 'bg-white text-slate-900 shadow')
              : (isDarkMode ? 'text-slate-400' : 'text-slate-500')">
            Password
          </button>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>
        <!-- Info -->
        <div v-if="info && !error" class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <p class="text-green-700 text-sm">{{ info }}</p>
        </div>

        <!-- ============ OTP MODE ============ -->
        <form v-if="mode === 'otp' && otpStep === 'email'" @submit.prevent="handleSendCode" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Email Address
            </label>
            <input v-model="email" type="email" required placeholder="you@gcx.com.gh"
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'" />
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-3 px-4 rounded-lg transition-colors">
            {{ isLoading ? 'Sending…' : 'Send code' }}
          </button>
        </form>

        <form v-else-if="mode === 'otp' && otpStep === 'code'" @submit.prevent="handleVerifyCode" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Enter the 6-digit code
            </label>
            <input v-model="code" inputmode="numeric" maxlength="6" required placeholder="••••••"
              class="w-full px-4 py-3 rounded-lg border text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'" />
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-3 px-4 rounded-lg transition-colors">
            {{ isLoading ? 'Verifying…' : 'Verify & sign in' }}
          </button>
          <div class="flex items-center justify-between text-sm">
            <button type="button" @click="resetToEmail" class="text-yellow-600 hover:underline">
              Change email
            </button>
            <button type="button" @click="handleSendCode" :disabled="isLoading" class="text-yellow-600 hover:underline">
              Resend code
            </button>
          </div>
        </form>

        <!-- ============ PASSWORD MODE ============ -->
        <form v-else @submit.prevent="handlePasswordLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Email Address
            </label>
            <input v-model="email" type="email" required placeholder="Enter your email"
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
              :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2" :class="isDarkMode ? 'text-slate-300' : 'text-slate-700'">
              Password
            </label>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" required placeholder="Enter your password"
                class="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                :class="isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>
          <button type="submit" :disabled="isLoading"
            class="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-black font-medium py-3 px-4 rounded-lg transition-colors">
            {{ isLoading ? 'Signing in…' : 'Sign In' }}
          </button>
        </form>

        <!-- Access Info -->
        <div class="mt-6 p-4 rounded-lg border"
             :class="isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'">
          <p class="text-xs" :class="isDarkMode ? 'text-slate-400' : 'text-slate-600'">
            <span class="font-medium">Email code</span> sends a one-time code to your inbox — no password needed.
            New users sign in this way.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
