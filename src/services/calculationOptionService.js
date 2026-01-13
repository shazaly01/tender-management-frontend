import apiClient from './apiClient'

const resource = '/calculation-options'

export default {
  // جلب القائمة (Backend يرجع الكل حالياً بدون Paginator حسب الكود السابق)
  get() {
    return apiClient.get(resource)
  },
}
