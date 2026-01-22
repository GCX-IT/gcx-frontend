import { ref, onMounted } from 'vue'
import { getAllBrokers, type Broker } from '../services/brokerService'

export function useBrokers() {
  const brokers = ref<Broker[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadBrokers = async (params?: {
    page?: number
    limit?: number
    search?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await getAllBrokers(params)
      brokers.value = response.data
    } catch (err) {
      console.error('Failed to load brokers:', err)
      error.value = 'Failed to load brokers'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadBrokers()
  })

  return {
    brokers,
    loading,
    error,
    loadBrokers
  }
}
