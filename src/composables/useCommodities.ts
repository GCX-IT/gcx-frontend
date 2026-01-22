import { ref, computed } from 'vue';
import * as commodityService from '../services/commodityService';
import type { Commodity, CommodityFilters } from '../services/commodityService';

export function useCommodities() {
  const commodities = ref<Commodity[]>([]);
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
  const statusFilter = ref('');

  // Computed properties
  const filteredCommodities = computed(() => commodities.value);
  const hasCommodities = computed(() => commodities.value.length > 0);
  const totalPages = computed(() => pagination.value.totalPages);

  // Fetch commodities
  const fetchCommodities = async (filters: CommodityFilters = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await commodityService.getAllCommodities({
        page: filters.page || pagination.value.page,
        limit: filters.limit || pagination.value.limit,
        search: filters.search || searchQuery.value,
        category: filters.category || categoryFilter.value,
        status: filters.status || statusFilter.value
      });
      
      commodities.value = response.data;
      pagination.value = response.pagination;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to fetch commodities';
      console.error('Error fetching commodities:', err);
    } finally {
      loading.value = false;
    }
  };

  // Search commodities
  const searchCommodities = async (query: string) => {
    searchQuery.value = query;
    pagination.value.page = 1; // Reset to first page
    await fetchCommodities();
  };

  // Filter by category
  const filterByCategory = async (category: string) => {
    categoryFilter.value = category;
    pagination.value.page = 1; // Reset to first page
    await fetchCommodities();
  };

  // Filter by status
  const filterByStatus = async (status: string) => {
    statusFilter.value = status;
    pagination.value.page = 1; // Reset to first page
    await fetchCommodities();
  };

  // Clear filters
  const clearFilters = async () => {
    searchQuery.value = '';
    categoryFilter.value = '';
    statusFilter.value = '';
    pagination.value.page = 1;
    await fetchCommodities();
  };

  // Pagination
  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.value.totalPages) {
      pagination.value.page = page;
      await fetchCommodities();
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
  const createCommodity = async (commodityData: Partial<Commodity>) => {
    try {
      const response = await commodityService.createCommodity(commodityData);
      if (response.success) {
        await fetchCommodities(); // Refresh the list
        return response;
      }
      throw new Error('Failed to create commodity');
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to create commodity';
      throw err;
    }
  };

  const updateCommodity = async (id: number, commodityData: Partial<Commodity>) => {
    try {
      const response = await commodityService.updateCommodity(id, commodityData);
      if (response.success) {
        await fetchCommodities(); // Refresh the list
        return response;
      }
      throw new Error('Failed to update commodity');
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to update commodity';
      throw err;
    }
  };

  const deleteCommodity = async (id: number) => {
    try {
      const response = await commodityService.deleteCommodity(id);
      if (response.success) {
        await fetchCommodities(); // Refresh the list
        return response;
      }
      throw new Error('Failed to delete commodity');
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Failed to delete commodity';
      throw err;
    }
  };

  return {
    // State
    commodities,
    loading,
    error,
    pagination,
    searchQuery,
    categoryFilter,
    statusFilter,
    
    // Computed
    filteredCommodities,
    hasCommodities,
    totalPages,
    
    // Methods
    fetchCommodities,
    searchCommodities,
    filterByCategory,
    filterByStatus,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    
    // CRUD operations
    createCommodity,
    updateCommodity,
    deleteCommodity
  };
}