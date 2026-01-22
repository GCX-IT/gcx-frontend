import axios from '../plugins/axios'

export interface Trader {
  id: number
  name: string
  industry: string
  member_type: 'Associates' | 'Full Members' | 'Brokers' | 'Warehouse Operators'
  phone_no: string
  email: string
  address: string
  registration_date?: string
  status: 'Active' | 'Inactive' | 'Suspended'
  created_at: string
  updated_at: string
}

export interface TraderResponse {
  success: boolean
  data: Trader[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateTraderRequest {
  name: string
  industry?: string
  member_type: 'Associates' | 'Full Members' | 'Brokers' | 'Warehouse Operators'
  phone_no?: string
  email?: string
  address?: string
  registration_date?: string
  status?: 'Active' | 'Inactive' | 'Suspended'
}

// Get all traders with pagination and search
export const getAllTraders = async (params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<TraderResponse> => {
  const response = await axios.get('/api/traders', { params })
  return response.data
}

// Get trader by ID
export const getTraderById = async (id: number): Promise<{ success: boolean; data: Trader }> => {
  const response = await axios.get(`/api/traders/${id}`)
  return response.data
}

// Create new trader
export const createTrader = async (trader: CreateTraderRequest): Promise<{ success: boolean; data: Trader }> => {
  const response = await axios.post('/api/traders', trader)
  return response.data
}

// Update trader
export const updateTrader = async (id: number, trader: Partial<CreateTraderRequest>): Promise<{ success: boolean; data: Trader }> => {
  const response = await axios.put(`/api/traders/${id}`, trader)
  return response.data
}

// Delete trader
export const deleteTrader = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/api/traders/${id}`)
  return response.data
}
