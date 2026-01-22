import axios from '../plugins/axios'

export interface PhotoGallery {
  id: number
  title: string
  slug: string
  description?: string
  category: string
  cover_image?: string
  date?: string
  location?: string
  tags?: string[]
  photo_count: number
  is_featured: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  photos?: GalleryPhoto[]
}

export interface GalleryPhoto {
  id: number
  gallery_id: number
  title?: string
  description?: string
  image_url: string
  thumbnail_url?: string
  photographer?: string
  caption?: string
  tags?: string[]
  sort_order: number
  is_cover: boolean
  created_at: string
  updated_at: string
}

// Public endpoints (for website)
export const getGalleries = async (params?: {
  category?: string
  featured?: boolean
}): Promise<PhotoGallery[]> => {
  const response = await axios.get('/api/galleries', { params })
  return response.data.data
}

export const getGallery = async (id: number): Promise<PhotoGallery> => {
  const response = await axios.get(`/api/galleries/${id}`)
  return response.data.data
}

export const getGalleryBySlug = async (slug: string): Promise<PhotoGallery> => {
  const response = await axios.get(`/api/galleries/slug/${slug}`)
  return response.data.data
}

export const getGalleryPhotos = async (galleryId: number): Promise<GalleryPhoto[]> => {
  const response = await axios.get(`/api/galleries/${galleryId}/photos`)
  return response.data.data
}

// CMS endpoints (protected)
export const getAllGalleries = async (): Promise<PhotoGallery[]> => {
  const token = localStorage.getItem('token')
  const response = await axios.get('/api/cms/galleries', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const createGallery = async (gallery: Partial<PhotoGallery>): Promise<PhotoGallery> => {
  const token = localStorage.getItem('token')
  const response = await axios.post('/api/cms/galleries', gallery, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const updateGallery = async (id: number, gallery: Partial<PhotoGallery>): Promise<PhotoGallery> => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`/api/cms/galleries/${id}`, gallery, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const deleteGallery = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await axios.delete(`/api/cms/galleries/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const addPhotoToGallery = async (galleryId: number, photo: Partial<GalleryPhoto>): Promise<GalleryPhoto> => {
  const token = localStorage.getItem('token')
  const response = await axios.post(`/api/cms/galleries/${galleryId}/photos`, photo, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const updateGalleryPhoto = async (photoId: number, photo: Partial<GalleryPhoto>): Promise<GalleryPhoto> => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`/api/cms/galleries/photos/${photoId}`, photo, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data.data
}

export const deleteGalleryPhoto = async (photoId: number): Promise<void> => {
  const token = localStorage.getItem('token')
  await axios.delete(`/api/cms/galleries/photos/${photoId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export default {
  // Public
  getGalleries,
  getGallery,
  getGalleryBySlug,
  getGalleryPhotos,
  // CMS
  getAllGalleries,
  createGallery,
  updateGallery,
  deleteGallery,
  addPhotoToGallery,
  updateGalleryPhoto,
  deleteGalleryPhoto
}
