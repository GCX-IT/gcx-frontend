import axios from '../plugins/axios';

export interface Publication {
  id: number;
  title: string;
  description: string;
  category: 'Research Papers' | 'Annual Reports' | 'Policy Documents';
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  publication_date: string;
  author: string;
  tags: string;
  status: 'Published' | 'Draft' | 'Archived';
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface PublicationFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface PublicationResponse {
  success: boolean;
  data: Publication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Get all publications with pagination and filters
export const getAllPublications = async (filters: PublicationFilters = {}): Promise<PublicationResponse> => {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);

  const response = await axios.get(`/api/publications?${params.toString()}`);
  return response.data;
};

// Get single publication by ID
export const getPublicationById = async (id: number): Promise<{ success: boolean; data: Publication }> => {
  const response = await axios.get(`/api/publications/${id}`);
  return response.data;
};

// Create new publication
export const createPublication = async (publication: Omit<Publication, 'id' | 'created_at' | 'updated_at' | 'download_count'>): Promise<{ success: boolean; data: Publication }> => {
  const response = await axios.post(`/api/publications`, publication);
  return response.data;
};

// Update publication
export const updatePublication = async (id: number, publication: Partial<Publication>): Promise<{ success: boolean; data: Publication }> => {
  const response = await axios.put(`/api/publications/${id}`, publication);
  return response.data;
};

// Delete publication
export const deletePublication = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/api/publications/${id}`);
  return response.data;
};
