// src/stores/reportStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // --- State ---
  const dashboardStats = ref(null)
  const companyStatement = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchDashboardStats() {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getDashboardStats()
      dashboardStats.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch dashboard stats.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyStatement(companyId) {
    loading.value = true
    error.value = null
    companyStatement.value = null // أفرغ التقرير القديم قبل جلب الجديد
    try {
      const response = await reportService.getCompanyStatement(companyId)
      companyStatement.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch company statement.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    dashboardStats,
    companyStatement,
    loading,
    error,
    fetchDashboardStats,
    fetchCompanyStatement,
  }
})
