import { ref, computed } from 'vue'
import { authAPI } from '../services/api'
import type { User, LoginCredentials, RegisterData, ChangePasswordData, UpdateProfileData } from '../types/cms'

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {

  // Computed properties
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isBlogger = computed(() => user.value?.role === 'blogger' || user.value?.role === 'admin')

  // Clear error
  const clearError = () => {
    error.value = null
  }

  // Initialize auth from localStorage
  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return false

    try {
      isLoading.value = true
      const response = await authAPI.getProfile()
      
      // Handle different response structures - use type assertion for flexibility
      const responseData = response.data as any
      
      if (responseData?.data?.user) {
        user.value = responseData.data.user
      } else if (responseData?.user) {
        user.value = responseData.user
      } else if (responseData) {
        user.value = responseData
      } else {
        console.error('Unexpected response structure:', responseData)
        throw new Error('Invalid response structure')
      }
      
      return true
    } catch (err) {
      console.error('Failed to initialize auth:', err)
      localStorage.removeItem('auth_token')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.login(credentials)
      
      // Handle different response structures - use type assertion for flexibility
      const responseData = response.data as any
      let token: string, userData: User
      
      if (responseData?.data?.token && responseData?.data?.user) {
        token = responseData.data.token
        userData = responseData.data.user
      } else if (responseData?.token && responseData?.user) {
        token = responseData.token
        userData = responseData.user
      } else {
        console.error('Unexpected login response structure:', responseData)
        throw new Error('Invalid login response structure')
      }
      
      localStorage.setItem('auth_token', token)
      user.value = userData
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Register
  const register = async (data: RegisterData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.register(data)
      
      // Handle different response structures - use type assertion for flexibility
      const responseData = response.data as any
      let token: string, userData: User
      
      if (responseData?.data?.token && responseData?.data?.user) {
        token = responseData.data.token
        userData = responseData.data.user
      } else if (responseData?.token && responseData?.user) {
        token = responseData.token
        userData = responseData.user
      } else {
        console.error('Unexpected register response structure:', responseData)
        throw new Error('Invalid register response structure')
      }
      
      localStorage.setItem('auth_token', token)
      user.value = userData
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('auth_token')
    user.value = null
    // Use window.location instead of router to avoid inject() issues
    window.location.href = '/login'
  }

  // Update profile
  const updateProfile = async (data: UpdateProfileData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authAPI.updateProfile(data)
      
      // Handle different response structures - use type assertion for flexibility
      const responseData = response.data as any
      
      if (responseData?.data?.user) {
        user.value = responseData.data.user
      } else if (responseData?.user) {
        user.value = responseData.user
      } else if (responseData) {
        user.value = responseData
      } else {
        console.error('Unexpected profile update response structure:', responseData)
        throw new Error('Invalid profile update response structure')
      }
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Profile update failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  // Change password
  const changePassword = async (data: ChangePasswordData) => {
    try {
      isLoading.value = true
      error.value = null
      
      await authAPI.changePassword(data)
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Password change failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed
    isAuthenticated,
    isAdmin,
    isBlogger,
    
    // Actions
    initializeAuth,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  }
}
