import { defineStore } from 'pinia'
import { ref } from 'vue'
import documentService from '@/services/documentService'

export const useDocumentStore = defineStore('document', () => {
  const documents = ref([])
  const loading = ref(false)
  const error = ref(null)

  // نمرر المعرف والنوع للجلب الصحيح
  async function fetchDocuments(targetId, targetType) {
    loading.value = true
    error.value = null
    try {
      // نرسل البارامترات للـ API (يجب أن يدعم السيرفر الفلترة بـ target_type)
      const response = await documentService.get(targetId, targetType)
      documents.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch documents.'
      documents.value = []
    } finally {
      loading.value = false
    }
  }

  async function createDocument(payload) {
    loading.value = true
    error.value = null
    try {
      await documentService.create(payload)
      // التحديث بعد الرفع باستخدام البيانات الجديدة
      await fetchDocuments(payload.target_id, payload.target_type)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload document.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocument(docId, targetId, targetType) {
    loading.value = true
    error.value = null
    try {
      await documentService.delete(docId)
      await fetchDocuments(targetId, targetType)
    } catch (err) {
      error.value = 'Failed to delete document.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { documents, loading, error, fetchDocuments, createDocument, deleteDocument }
})
