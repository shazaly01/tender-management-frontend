// src/stores/authStore.js
import { defineStore } from 'pinia'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    returnUrl: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    permissions: (state) => {
      if (state.user && state.user.roles) {
        const allPermissions = state.user.roles.flatMap((role) =>
          role.permissions.map((p) => p.name),
        )
        return [...new Set(allPermissions)]
      }
      return []
    },
  },

  actions: {
    async login(credentials) {
      const response = await authService.login(credentials)
      const { access_token, user } = response.data

      this.token = access_token
      this.user = user

      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    async logout() {
      try {
        // استدعاء الـ API أولاً
        await authService.logout()
      } catch (error) {
        console.error('Logout API call failed, but clearing local state anyway:', error)
      } finally {
        // [التعديل هنا]: دائمًا قم بتنظيف الحالة المحلية، حتى لو فشل استدعاء الـ API
        this.user = null
        this.token = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // التوجيه يجب أن يتم من المكون الذي يستدعي هذه الدالة
      }
    },

    can(permissionName) {
      if (this.user && this.user.roles.some((role) => role.name === 'Super Admin')) {
        return true
      }
      return this.permissions.includes(permissionName)
    },
  },
})
