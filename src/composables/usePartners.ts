import { ref, computed } from 'vue'
import { getAllPartners, getPartnersByCategory, type Partner } from '../services/partnerService'

const partners = ref<Partner[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export const usePartners = () => {
  const loadPartners = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await getAllPartners()
      partners.value = data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load partners'
      error.value = errorMessage
      console.error('Error loading partners:', err)
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      })
    } finally {
      loading.value = false
    }
  }

  const loadPartnersByCategory = async (category: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await getPartnersByCategory(category)
      partners.value = data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to load partners'
      error.value = errorMessage
      console.error(`Error loading partners for category ${category}:`, err)
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      })
    } finally {
      loading.value = false
    }
  }

  // Computed properties for different categories
  const financialPartners = computed(() => 
    partners.value.filter(partner => partner.category === 'financial')
  )
  
  const donorPartners = computed(() => 
    partners.value.filter(partner => partner.category === 'donor')
  )
  
  const governmentPartners = computed(() => 
    partners.value.filter(partner => partner.category === 'government')
  )
  
  const ngoPartners = computed(() => 
    partners.value.filter(partner => partner.category === 'ngo')
  )
  
  const privatePartners = computed(() => 
    partners.value.filter(partner => partner.category === 'private')
  )
  
  const tenderPartners = computed(() => 
    partners.value.filter(partner => partner.category === 'tender')
  )

  return {
    partners: computed(() => partners.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    financialPartners,
    donorPartners,
    governmentPartners,
    ngoPartners,
    privatePartners,
    tenderPartners,
    loadPartners,
    loadPartnersByCategory
  }
}
