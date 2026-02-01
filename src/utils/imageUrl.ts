import { getBackendURL } from '../plugins/axios'

// Utility function to ensure image URLs are properly formatted for cross-origin access
export const getImageUrl = (src: string): string => {
  // If it's a relative URL, it should work with getBackendURL()
  if (src.startsWith('/')) {
    // On production (empty baseURL for Vercel proxy), return relative path as-is
    // On dev, prepend the VPS URL
    const baseUrl = getBackendURL()
    return baseUrl ? `${baseUrl}${src}` : src
  }

  // If it's an absolute URL to the VPS backend, convert to relative for Vercel proxy
  // e.g., http://188.166.159.42:8081/uploads/... or http://188.166.159.42:8082/uploads/...
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Check if it's a VPS URL that should be proxied
    if (src.includes('188.166.159.42') || src.includes('localhost')) {
      try {
        const url = new URL(src)
        // Return just the path + query string (e.g., /uploads/images/file.jpg)
        return url.pathname + url.search
      } catch {
        // If parsing fails, return as-is
        return src
      }
    }
    // For S3 and other external URLs, return as-is
    return src
  }

  // If it's a data URL (base64), return as is
  if (src.startsWith('data:')) {
    return src
  }

  // Otherwise, assume it's a relative URL and handle based on baseURL
  const baseUrl = getBackendURL()
  return baseUrl ? `${baseUrl}/${src}` : `/${src}`
}

// Utility function to check if an image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return url.startsWith('data:') || url.startsWith('/uploads') || url.startsWith('http')
  }
}

// Utility function to get the correct API base URL
