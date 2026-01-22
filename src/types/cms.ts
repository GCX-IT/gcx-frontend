// CMS Related Types
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'blogger' | 'user'
  avatar?: string
  bio?: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_login?: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  tags: string[]
  status: 'draft' | 'published' | 'private'
  author_id: number
  author?: User
  published_at?: string
  created_at: string
  updated_at: string
  // SEO metadata
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  canonical_url?: string
  author_notes?: string
}

export interface CreatePostRequest {
  title: string
  content: string
  excerpt: string
  featured_image?: string
  tags: string[]
  status: 'draft' | 'published' | 'private'
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: number
}

export interface MediaFile {
  id: number
  filename: string
  original_name: string
  mime_type: string
  size: number
  url: string
  thumbnail_url?: string
  uploaded_by: number
  created_at: string
}

export interface MarketData {
  id: number
  commodity: string
  symbol: string
  price: number
  change: number
  change_percent: number
  volume: number
  high: number
  low: number
  last_updated: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Navigation Types
export interface NavigationItem {
  id: string
  label: string
  icon: string
  route?: string
  children?: NavigationItem[]
  permissions?: string[]
}

// Form Types
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

export interface ChangePasswordData {
  current_password: string
  new_password: string
}

export interface UpdateProfileData {
  name: string
  bio?: string
  avatar?: string
}
