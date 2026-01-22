import axios from '../plugins/axios'

export interface Partner {
  id: number
  name: string
  description?: string
  category: 'financial' | 'donor' | 'government' | 'ngo' | 'private' | 'tender'
  logo?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export interface CreatePartnerRequest {
  name: string
  description?: string
  category: 'financial' | 'donor' | 'government' | 'ngo' | 'private' | 'tender'
  logo?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  status?: 'active' | 'inactive' | 'suspended'
}

export interface PartnersResponse {
  success: boolean
  data: Partner[]
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface PartnerResponse {
  success: boolean
  data: Partner
}

// Get all partners (public)
export const getAllPartners = async (): Promise<Partner[]> => {
  const response = await axios.get<PartnersResponse>('/api/partners')
  return response.data.data
}

// Get partners by category (public)
export const getPartnersByCategory = async (category: string): Promise<Partner[]> => {
  const response = await axios.get<PartnersResponse>(`/api/partners/category/${category}`)
  return response.data.data
}

// Get single partner (public)
export const getPartner = async (id: number): Promise<Partner> => {
  const response = await axios.get<PartnerResponse>(`/api/partners/${id}`)
  return response.data.data
}

// CMS: Get all partners with pagination and filtering
export const getCMSPartners = async (params: {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
} = {}): Promise<PartnersResponse> => {
  const response = await axios.get<PartnersResponse>('/api/cms/partners', { params })
  return response.data
}

// CMS: Create partner
export const createPartner = async (partner: CreatePartnerRequest): Promise<Partner> => {
  const response = await axios.post<PartnerResponse>('/api/cms/partners', partner)
  return response.data.data
}

// CMS: Update partner
export const updatePartner = async (id: number, partner: CreatePartnerRequest): Promise<Partner> => {
  const response = await axios.put<PartnerResponse>(`/api/cms/partners/${id}`, partner)
  return response.data.data
}

// CMS: Delete partner
export const deletePartner = async (id: number): Promise<void> => {
  await axios.delete(`/api/cms/partners/${id}`)
}

// CMS: Get single partner
export const getCMSPartner = async (id: number): Promise<Partner> => {
  const response = await axios.get<PartnerResponse>(`/api/cms/partners/${id}`)
  return response.data.data
}
