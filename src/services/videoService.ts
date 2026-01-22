import axios from '../plugins/axios'

export interface VideoLibrary {
  id: number
  title: string
  slug: string
  description?: string
  category: string
  cover_image?: string
  date?: string
  location?: string
  tags?: string[]
  video_count: number
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  videos?: LibraryVideo[]
}

export interface LibraryVideo {
  id: number
  library_id: number
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  duration?: string
  file_size?: number
  video_type: string
  resolution?: string
  view_count: number
  is_featured: boolean
  is_cover: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// Public endpoints (for website)
export const getVideoLibraries = async (params?: {
  category?: string
  featured?: boolean
}): Promise<VideoLibrary[]> => {
  const response = await axios.get('/api/video-libraries', { params })
  return response.data.data
}

export const getVideoLibrary = async (id: number): Promise<VideoLibrary> => {
  const response = await axios.get(`/api/video-libraries/${id}`)
  return response.data.data
}

export const getVideoLibraryBySlug = async (slug: string): Promise<VideoLibrary> => {
  const response = await axios.get(`/api/video-libraries/slug/${slug}`)
  return response.data.data
}

export const getLibraryVideos = async (libraryId: number): Promise<LibraryVideo[]> => {
  const response = await axios.get(`/api/video-libraries/${libraryId}/videos`)
  return response.data.data
}

export const trackVideoView = async (videoId: number): Promise<LibraryVideo> => {
  const response = await axios.post(`/api/videos/${videoId}/view`)
  return response.data.data
}

// CMS endpoints (protected)
export const getAllVideoLibraries = async (): Promise<VideoLibrary[]> => {
  const token = localStorage.getItem('token')
  const response = await axios.get('/api/cms/video-libraries', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const createVideoLibrary = async (library: Partial<VideoLibrary>): Promise<VideoLibrary> => {
  const token = localStorage.getItem('token')
  const response = await axios.post('/api/cms/video-libraries', library, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const updateVideoLibrary = async (id: number, library: Partial<VideoLibrary>): Promise<VideoLibrary> => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`/api/cms/video-libraries/${id}`, library, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const deleteVideoLibrary = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await axios.delete(`/api/cms/video-libraries/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const addVideoToLibrary = async (libraryId: number, video: Partial<LibraryVideo>): Promise<LibraryVideo> => {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/cms/video-libraries/${libraryId}/videos`, video, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const updateLibraryVideo = async (videoId: number, video: Partial<LibraryVideo>): Promise<LibraryVideo> => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`/api/cms/video-libraries/videos/${videoId}`, video, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const deleteLibraryVideo = async (videoId: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await axios.delete(`/api/cms/video-libraries/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export default {
  // Public
  getVideoLibraries,
  getVideoLibrary,
  getVideoLibraryBySlug,
  getLibraryVideos,
  trackVideoView,
  // CMS
  getAllVideoLibraries,
  createVideoLibrary,
  updateVideoLibrary,
  deleteVideoLibrary,
  addVideoToLibrary,
  updateLibraryVideo,
  deleteLibraryVideo
}
