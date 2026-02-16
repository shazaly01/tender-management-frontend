import { defineStore } from 'pinia'
import { ref } from 'vue'
// استدعاء السيرفس الجديد الذي أنشأناه في الخطوة 1
import projectTypeService from '@/services/projectTypeService'

export const useProjectTypeStore = defineStore('projectType', () => {
  // --- State ---
  const projectTypes = ref([]) // القائمة
  const pagination = ref({})
  const currentProjectType = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchProjectTypes(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await projectTypeService.get(page, search)
      // حسب هيكلة الـ Resource في لارافيل (data داخل data)
      projectTypes.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch project types.'
      console.error(err)
      projectTypes.value = []
    } finally {
      loading.value = false
    }
  }

  // دوال الـ CRUD الأخرى (نحتاجها إذا كنا سنبني شاشة إدارة للأنواع)
  async function createProjectType(payload) {
    loading.value = true
    error.value = null
    try {
      await projectTypeService.create(payload)
      // قد ترغب في إعادة تحميل القائمة هنا
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create project type.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    projectTypes,
    pagination,
    loading,
    error,
    fetchProjectTypes,
    createProjectType,
  }
})
