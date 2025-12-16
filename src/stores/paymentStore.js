// src/stores/paymentStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import paymentService from '@/services/paymentService'

export const usePaymentStore = defineStore('payment', () => {
  // --- State ---
  const payments = ref([])
  const pagination = ref({})
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchPayments(page = 1, filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await paymentService.get(page, filters)
      payments.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch payments.'
      console.error(err)
      payments.value = []
    } finally {
      loading.value = false
    }
  }

  async function createPayment(payload) {
    loading.value = true
    error.value = null
    try {
      await paymentService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create payment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePayment(id, payload) {
    loading.value = true
    error.value = null
    try {
      await paymentService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update payment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePayment(id) {
    loading.value = true
    error.value = null
    try {
      await paymentService.delete(id)
    } catch (err) {
      error.value = 'Failed to delete payment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    payments,
    pagination,
    loading,
    error,
    fetchPayments,
    createPayment,
    updatePayment,
    deletePayment,
  }
})
