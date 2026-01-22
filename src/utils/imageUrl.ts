import { getBackendURL } from '../plugins/axios'

// Utility function to ensure image URLs are properly formatted for cross-origin access
export const getImageUrl = (src: string): string => {
  // If it's already a full URL (starts with http), return as is
  if (src.startsWith('http')) {
    return src
  }
  
  // If it's a relative URL starting with /uploads, prepend backend URL
  if (src.startsWith('/uploads')) {
    return `${getBackendURL()}${src}`
  }
  
  // If it's a data URL (base64), return as is
  if (src.startsWith('data:')) {
    return src
  }
  
  // Otherwise, assume it's a relative URL and prepend backend URL
  return `${getBackendURL()}${src.startsWith('/') ? src : '/' + src}`
}

// Utility function to check if an image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return url.startsWith('data:') || url.startsWith('/uploads')
  }
}

// Utility function to get the correct API base URL
export const getApiBaseUrl = (): string => {
  return getBackendURL()
}
