import apiClient from './apiClient'

const resource = '/backups'

export default {
  // جلب كل النسخ
  getAll() {
    return apiClient.get(resource)
  },

  // إنشاء نسخة جديدة
  create() {
    return apiClient.post(resource)
  },

  // حذف نسخة (نرسل اسم الملف كـ parameter)
  delete(fileName) {
    return apiClient.delete(resource, {
      params: {
        file_name: fileName,
      },
    })
  },

  // تحميل النسخة (مهم جداً: responseType: 'blob')
  download(fileName) {
    return apiClient.get(`${resource}/download`, {
      params: {
        file_name: fileName,
      },
      responseType: 'blob', // ضروري لكي يفهم المتصفح أنه ملف وليس نص JSON
    })
  },
}
