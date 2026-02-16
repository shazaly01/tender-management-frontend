import apiClient from './apiClient'

// هذا هو الرابط الذي أنشأناه في لارافيل (تأكد من وجوده في api.php)
const resource = '/project-types'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  // جلب عنصر واحد (للتعديل مثلاً)
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
