import { defineStore } from 'pinia'
import { ref } from 'vue'
import calculationOptionService from '@/services/calculationOptionService'

export const useCalculationOptionStore = defineStore('calculationOption', () => {
  // --- State ---
  const options = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchOptions() {
    // إذا كانت البيانات محملة مسبقاً، لا داعي لطلبها مرة أخرى (Caching بسيط)
    if (options.value.length > 0) return

    loading.value = true
    error.value = null
    try {
      const response = await calculationOptionService.get()
      options.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch calculation options.'
      console.error(err)
      options.value = []
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    options,
    loading,
    error,
    fetchOptions,
  }
})
