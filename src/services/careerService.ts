import axios from '../plugins/axios';

export interface Career {
  id: number;
  title: string;
  description: string;
  category: 'Job Openings' | 'Internship' | 'Job Functional Areas';
  department: string;
  location: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience_level: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
  requirements: string;
  responsibilities: string;
  benefits: string;
  salary_range: string;
  application_deadline: string;
  start_date: string;
  status: 'Open' | 'Closed' | 'On Hold';
  application_count: number;
  image_path: string;
  file_path: string;
  file_name: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

export interface CareerFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  department?: string;
  employment_type?: string;
  experience_level?: string;
}

export interface CareerResponse {
  success: boolean;
  data: Career[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all careers with pagination and filters
export const getAllCareers = async (filters: CareerFilters = {}): Promise<CareerResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.department) params.append('department', filters.department);
  if (filters.employment_type) params.append('employment_type', filters.employment_type);
  if (filters.experience_level) params.append('experience_level', filters.experience_level);

  const response = await axios.get(`/api/careers?${params.toString()}`);
  return response.data;
};

// Get single career by ID
export const getCareerById = async (id: number): Promise<{ success: boolean; data: Career }> => {
  const response = await axios.get(`/api/careers/${id}`);
  return response.data;
};

// Create new career
export const createCareer = async (careerData: Partial<Career>): Promise<{ success: boolean; data: Career }> => {
  const response = await axios.post('/api/careers', careerData);
  return response.data;
};

// Update existing career
export const updateCareer = async (id: number, careerData: Partial<Career>): Promise<{ success: boolean; data: Career }> => {
  const response = await axios.put(`/api/careers/${id}`, careerData);
  return response.data;
};

// Delete career
export const deleteCareer = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/api/careers/${id}`);
  return response.data;
};