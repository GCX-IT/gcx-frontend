import { defineStore } from 'pinia'
import axios from 'axios'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'blogger' | 'user'
  avatar?: string
  bio?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isBlogger: (state) => state.user?.role === 'blogger' || state.user?.role === 'admin',
    canManageBlog: (state) => state.user?.role === 'blogger' || state.user?.role === 'admin',
    canManageUsers: (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/auth/login', credentials)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token)
        
        return { success: true, user }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Login failed'
        console.error('Login error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(userData: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/api/auth/register', userData)
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        // Store token in localStorage
        localStorage.setItem('auth_token', token)
        
        return { success: true, user }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Registration failed'
        console.error('Registration error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      if (!this.token) return

      this.loading = true
      
      try {
        const response = await axios.get('/api/user/profile')
        this.user = response.data.user
      } catch (error: any) {
        console.error('Fetch profile error:', error)
        // If token is invalid, logout
        if (error.response?.status === 401) {
          this.logout()
        }
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData: Partial<User>) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put('/api/user/profile', profileData)
        this.user = response.data.user
        return { success: true, user: this.user }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Profile update failed'
        console.error('Update profile error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async changePassword(passwordData: { current_password: string; new_password: string }) {
      this.loading = true
      this.error = null
      
      try {
        await axios.post('/api/user/change-password', passwordData)
        return { success: true }
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Password change failed'
        console.error('Change password error:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      
      // Remove token from localStorage
      localStorage.removeItem('auth_token')
    },

    // Initialize auth state on app start
    async initializeAuth() {
      if (this.token && !this.user) {
        await this.fetchProfile()
      }
    },

    clearError() {
      this.error = null
    }
  }
})
