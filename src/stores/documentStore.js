// src/stores/documentStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import documentService from '@/services/documentService'

export const useDocumentStore = defineStore('document', () => {
  // --- State ---
  const documents = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchDocuments(companyId) {
    loading.value = true
    error.value = null
    try {
      const response = await documentService.get(companyId)
      documents.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch documents.'
      console.error(err)
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
      // بعد الإنشاء الناجح، أعد تحميل قائمة المستندات لنفس الشركة
      await fetchDocuments(payload.company_id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to upload document.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteDocument(docId, companyId) {
    loading.value = true
    error.value = null
    try {
      await documentService.delete(docId)
      // بعد الحذف الناجح، أعد تحميل قائمة المستندات لنفس الشركة
      await fetchDocuments(companyId)
    } catch (err) {
      error.value = 'Failed to delete document.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    deleteDocument,
  }
})
