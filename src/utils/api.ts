import { getBackendURL } from '@/plugins/axios'

// Helper function to get the full API URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getBackendURL()
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${baseUrl}/${cleanEndpoint}`
}

// Helper function for fetch requests with proper headers
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint)
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token')
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }
  
  return fetch(url, mergedOptions)
}
