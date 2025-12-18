// src/services/reportService.js
import apiClient from './apiClient'

export default {
  /**
   * جلب إحصائيات لوحة التحكم
   */
  getDashboardStats() {
    return apiClient.get('/dashboard')
  },

  /**
   * [جديد] جلب التقرير العام (ملخص كل الشركات)
   */
  getCompaniesSummary() {
    return apiClient.get('/reports/companies-summary')
  },

  /**
   * جلب كشف حساب تفصيلي لشركة محددة
   * @param {String|Number} companyId - المعرف (DECIMAL 18)
   */
  getCompanyStatement(companyId) {
    return apiClient.get(`/reports/company-statement/${companyId}`)
  },
}
