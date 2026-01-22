import { ref, onMounted } from 'vue'
import { getAllTraders, type Trader } from '../services/traderService'

export function useTraders() {
  const traders = ref<Trader[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadTraders = async (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getAllTraders(params)
      traders.value = response.data
    } catch (err) {
      console.error('Failed to load traders:', err)
      error.value = 'Failed to load traders'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadTraders()
  })

  return {
    traders,
    loading,
    error,
    loadTraders
  }
}
