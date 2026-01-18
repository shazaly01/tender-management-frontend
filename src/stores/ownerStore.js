import { defineStore } from 'pinia'
import { ref } from 'vue'
import ownerService from '@/services/ownerService'

export const useOwnerStore = defineStore('owner', () => {
  // --- State ---
  const owners = ref([])
  const pagination = ref({})
  const currentOwner = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchOwners(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await ownerService.get(page, search)
      owners.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'فشل في جلب بيانات الجهات المالكة.'
      console.error(err)
      owners.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchOwner(id) {
    loading.value = true
    error.value = null
    currentOwner.value = null
    try {
      const response = await ownerService.find(id)
      currentOwner.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب بيانات الجهة المالكة.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createOwner(payload) {
    loading.value = true
    error.value = null
    try {
      await ownerService.create(payload)
    } catch (err) {
      // قراءة رسالة الخطأ من السيرفر إذا وجدت
      error.value = err.response?.data?.message || 'فشل في إضافة الجهة المالكة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateOwner(id, payload) {
    loading.value = true
    error.value = null
    try {
      await ownerService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في تعديل بيانات الجهة المالكة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteOwner(id) {
    loading.value = true
    error.value = null
    try {
      await ownerService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'فشل في حذف الجهة المالكة.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    owners,
    pagination,
    currentOwner,
    loading,
    error,
    fetchOwners,
    fetchOwner,
    createOwner,
    updateOwner,
    deleteOwner,
  }
})
