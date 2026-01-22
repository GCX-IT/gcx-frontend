import axios from '../plugins/axios'
import type { 
  ApiResponse, 
  LoginCredentials,
  RegisterData,
  User,
  BlogPost,
  CreatePostRequest,
  UpdatePostRequest,
  MediaFile,
  MarketData,
  ChangePasswordData,
  UpdateProfileData
} from '../types/cms'

// Use the configured axios instance from plugins
export const api = axios

// Interceptors are already configured in plugins/axios.ts

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/login', credentials),
    
  register: (data: RegisterData) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/api/auth/register', data),
    
  getProfile: () =>
    api.get<ApiResponse<{ user: User }>>('/api/user/profile'),
    
  updateProfile: (data: UpdateProfileData) =>
    api.put<ApiResponse<{ user: User }>>('/api/user/profile', data),
    
  changePassword: (data: ChangePasswordData) =>
    api.post<ApiResponse<{ message: string }>>('/api/user/change-password', data),
}

// Blog API
export const blogAPI = {
  // Public blog posts (for website)
  getPublicPosts: (skipCache = false) => {
    console.log('🌐 Making API call to: GET /api/posts')
    const params = skipCache ? { _t: Date.now() } : {}
    return api.get<BlogPost[]>('/api/posts', { params })
  },
    
  getPublicPost: (slug: string) =>
    api.get<BlogPost>(`/api/posts/${slug}`),
    
  // CMS blog posts (authenticated)
  getAllPosts: () =>
    api.get<BlogPost[]>('/api/cms/posts'),
    
  getPost: (id: number) =>
    api.get<BlogPost>(`/api/cms/posts/${id}`),
    
  createPost: (data: CreatePostRequest) =>
    api.post<BlogPost>('/api/cms/posts', data),
    
  updatePost: (id: number, data: UpdatePostRequest) =>
    api.put<BlogPost>(`/api/cms/posts/${id}`, data),
    
  deletePost: (id: number) =>
    api.delete<ApiResponse<{ message: string }>>(`/api/cms/posts/${id}`),
}

// Media API
export const mediaAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<ApiResponse<MediaFile>>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  getFiles: () =>
    api.get<MediaFile[]>('/api/cms/media'),
    
  deleteFile: (id: number) =>
    api.delete<ApiResponse<{ message: string }>>(`/api/cms/media/${id}`),
}

// Market Data API
export const marketAPI = {
  getLiveData: () =>
    api.get<MarketData[]>('/api/market/live'),
    
  getHistoricalData: (symbol: string, period: string) =>
    api.get<MarketData[]>(`/api/market/historical/${symbol}?period=${period}`),
    
  // Admin only
  createMarketData: (data: Partial<MarketData>) =>
    api.post<MarketData>('/api/admin/market/data', data),
    
  updateMarketData: (id: number, data: Partial<MarketData>) =>
    api.put<MarketData>(`/api/admin/market/data/${id}`, data),
    
  deleteMarketData: (id: number) =>
    api.delete<ApiResponse<{ message: string }>>(`/api/admin/market/data/${id}`),
}

// Users API (Admin only)
export const usersAPI = {
  getUsers: () =>
    api.get<User[]>('/api/admin/users'),
    
  getUser: (id: number) =>
    api.get<User>(`/api/admin/users/${id}`),
    
  createUser: (data: RegisterData) =>
    api.post<User>('/api/admin/users', data),
    
  updateUser: (id: number, data: Partial<User>) =>
    api.put<User>(`/api/admin/users/${id}`, data),
    
  deleteUser: (id: number) =>
    api.delete<ApiResponse<{ message: string }>>(`/api/admin/users/${id}`),
    
  toggleUserStatus: (id: number) =>
    api.post<User>(`/api/admin/users/${id}/toggle-status`),
}

export default api
