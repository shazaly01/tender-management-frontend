// src/services/paymentService.js
import apiClient from './apiClient'

const resource = '/payments'

export default {
  get(page = 1, filters = {}) {
    const params = new URLSearchParams({ page, ...filters })
    return apiClient.get(`${resource}?${params.toString()}`)
  },
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },
  create(payload) {
    return apiClient.post(resource, payload)
  },
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
