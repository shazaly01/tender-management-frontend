// src/services/reportService.js
import apiClient from './apiClient'

export default {
  getDashboardStats() {
    return apiClient.get('/dashboard')
  },
  // --- [جديد] ---
  getCompanyStatement(companyId) {
    return apiClient.get(`/reports/company-statement/${companyId}`)
  },
}
