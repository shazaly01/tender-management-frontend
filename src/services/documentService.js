// src/services/documentService.js
import apiClient from './apiClient'

const resource = '/documents'

export default {
  get(companyId) {
    // ❌ الخطأ القديم: رابط غير موجود في الباك إند
    // return apiClient.get(`/companies/${companyId}/documents`)

    // ✅ التصحيح: طلب رابط المستندات مع تمرير company_id كفلتر
    // سيتحول الرابط تلقائياً إلى: /api/documents?company_id=123
    return apiClient.get(resource, {
      params: {
        company_id: companyId,
      },
    })
  },

  create(payload) {
    // يجب إرسال البيانات كـ FormData
    const formData = new FormData()
    formData.append('company_id', payload.company_id)
    formData.append('name', payload.name)
    // التأكد من أن الملف موجود قبل إضافته
    if (payload.file) {
      formData.append('file', payload.file)
    }

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
