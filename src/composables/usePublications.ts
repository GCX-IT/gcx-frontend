import { ref, computed } from 'vue';
import * as publicationService from '../services/publicationService';
import type { Publication, PublicationFilters } from '../services/publicationService';

export function usePublications() {
  const publications = ref<Publication[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const searchQuery = ref('');
  const categoryFilter = ref('');

  // Computed properties
  const filteredPublications = computed(() => publications.value);
  const hasPublications = computed(() => publications.value.length > 0);
  const totalPages = computed(() => pagination.value.totalPages);

  // Fetch publications
  const fetchPublications = async (filters: PublicationFilters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await publicationService.getAllPublications({
        page: filters.page || pagination.value.page,
        limit: filters.limit || pagination.value.limit,
        search: filters.search || searchQuery.value,
        category: filters.category || categoryFilter.value
      });
      
      publications.value = response.data;
      pagination.value = response.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch publications';
      console.error('Error fetching publications:', err);
    } finally {
      loading.value = false;
    }
  };

  // Search publications
  const searchPublications = async (query: string) => {
    searchQuery.value = query;
    pagination.value.page = 1; // Reset to first page
    await fetchPublications();
  };

  // Filter by category
  const filterByCategory = async (category: string) => {
    categoryFilter.value = category;
    pagination.value.page = 1; // Reset to first page
    await fetchPublications();
  };

  // Clear filters
  const clearFilters = async () => {
    searchQuery.value = '';
    categoryFilter.value = '';
    pagination.value.page = 1;
    await fetchPublications();
  };

  // Pagination
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page;
      await fetchPublications();
    }
  };

  const nextPage = async () => {
    if (pagination.value.page < pagination.value.totalPages) {
      await goToPage(pagination.value.page + 1);
    }
  };

  const prevPage = async () => {
    if (pagination.value.page > 1) {
      await goToPage(pagination.value.page - 1);
    }
  };

  // CRUD operations
  const createPublication = async (publicationData: Omit<Publication, 'id' | 'created_at' | 'updated_at' | 'download_count'>) => {
    try {
      const response = await publicationService.createPublication(publicationData);
      await fetchPublications(); // Refresh the list
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create publication';
      throw err;
    }
  };

  const updatePublication = async (id: number, publicationData: Partial<Publication>) => {
    try {
      const response = await publicationService.updatePublication(id, publicationData);
      await fetchPublications(); // Refresh the list
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update publication';
      throw err;
    }
  };

  const deletePublication = async (id: number) => {
    try {
      await publicationService.deletePublication(id);
      await fetchPublications(); // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete publication';
      throw err;
    }
  };

  return {
    // State
    publications,
    loading,
    error,
    pagination,
    searchQuery,
    categoryFilter,
    
    // Computed
    filteredPublications,
    hasPublications,
    totalPages,
    
    // Methods
    fetchPublications,
    searchPublications,
    filterByCategory,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    createPublication,
    updatePublication,
    deletePublication
  };
}
