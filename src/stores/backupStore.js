import { defineStore } from 'pinia'
import backupService from '@/services/backupService'

export const useBackupStore = defineStore('backup', {
  state: () => ({
    backups: [],
    loading: false, // لحالة جلب القائمة
    creating: false, // لحالة زر "إنشاء نسخة"
  }),

  actions: {
    // جلب البيانات
    async fetchBackups() {
      this.loading = true
      try {
        const response = await backupService.getAll()
        this.backups = response.data.data
      } catch (error) {
        console.error('Failed to fetch backups', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // إنشاء نسخة جديدة
    async createBackup() {
      this.creating = true
      try {
        await backupService.create()
        // تحديث القائمة فوراً بعد الإنشاء الناجح
        await this.fetchBackups()
      } catch (error) {
        console.error('Failed to create backup', error)
        throw error
      } finally {
        this.creating = false
      }
    },

    // حذف نسخة
    async deleteBackup(fileName) {
      try {
        await backupService.delete(fileName)
        // حذف العنصر محلياً لتحديث الواجهة بسرعة
        this.backups = this.backups.filter((item) => item.name !== fileName)
      } catch (error) {
        console.error('Failed to delete backup', error)
        throw error
      }
    },

    // منطق تحميل الملف للمتصفح
    async downloadBackup(fileName) {
      try {
        const response = await backupService.download(fileName)

        // إنشاء رابط وهمي في الذاكرة لتنزيل الملف
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()

        // تنظيف الذاكرة
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to download backup', error)
        throw error
      }
    },
  },
})
