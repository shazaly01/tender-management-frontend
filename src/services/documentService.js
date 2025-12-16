// src/services/documentService.js
import apiClient from './apiClient'

const resource = '/documents'

export default {
  get(companyId) {
    // المستندات مرتبطة بالشركة
    return apiClient.get(`/companies/${companyId}/documents`)
  },
  create(payload) {
    // يجب إرسال البيانات كـ FormData
    const formData = new FormData()
    formData.append('company_id', payload.company_id)
    formData.append('name', payload.name)
    formData.append('file', payload.file)

    return apiClient.post(resource, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
