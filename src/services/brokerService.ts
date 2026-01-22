import axios from '../plugins/axios'

export interface Broker {
  id: number
  name: string
  company: string
  license_number: string
  phone_no: string
  email: string
  address: string
  specialization: string
  experience_years: number
  status: 'Active' | 'Inactive' | 'Suspended'
  created_at: string
  updated_at: string
}

export interface BrokerResponse {
  success: boolean
  data: Broker[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface CreateBrokerRequest {
  name: string
  company?: string
  license_number?: string
  phone_no?: string
  email?: string
  address?: string
  specialization?: string
  experience_years?: number
  status?: 'Active' | 'Inactive' | 'Suspended'
}

// Get all brokers with pagination and search
export const getAllBrokers = async (params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<BrokerResponse> => {
  const response = await axios.get('/api/brokers', { params })
  return response.data
}

// Get broker by ID
export const getBrokerById = async (id: number): Promise<{ success: boolean; data: Broker }> => {
  const response = await axios.get(`/api/brokers/${id}`)
  return response.data
}

// Create new broker
export const createBroker = async (broker: CreateBrokerRequest): Promise<{ success: boolean; data: Broker }> => {
  const response = await axios.post('/api/brokers', broker)
  return response.data
}

// Update broker
export const updateBroker = async (id: number, broker: Partial<CreateBrokerRequest>): Promise<{ success: boolean; data: Broker }> => {
  const response = await axios.put(`/api/brokers/${id}`, broker)
  return response.data
}

// Delete broker
export const deleteBroker = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/api/brokers/${id}`)
  return response.data
}
