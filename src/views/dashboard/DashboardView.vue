<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div>
    <!-- عنوان الصفحة -->
    <h1 class="text-3xl font-bold text-text-primary mb-6">لوحة التحكم</h1>

    <!-- عرض رسالة الخطأ إذا حدث -->
    <div v-if="error" class="p-4 text-center bg-danger/20 text-red-400 rounded-lg">
      <p>حدث خطأ أثناء تحميل بيانات لوحة التحكم.</p>
      <p class="text-sm mt-1">{{ error }}</p>
    </div>

    <!-- تمرير البيانات وحالة التحميل إلى المكون الفرعي -->
    <DashboardStatsCards :stats="dashboardStats" :is-loading="loading" />

    <!-- يمكنك إضافة مكونات أخرى هنا لاحقًا، مثل الرسوم البيانية -->
  </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import { useAuthStore } from '@/stores/authStore' // 1. استيراد مخزن المصادقة
import { storeToRefs } from 'pinia'

import DashboardStatsCards from './DashboardStatsCards.vue'

const reportStore = useReportStore()
const authStore = useAuthStore() // 2. تهيئة مخزن المصادقة

const { dashboardStats, loading, error } = storeToRefs(reportStore)

// 3. التحقق مما إذا كان المستخدم يملك صلاحية رؤية الإحصائيات
const canViewStats = computed(() => authStore.can('dashboard.view'))

// 4. إنشاء متغير تفاعلي يقرر أي بيانات سيتم عرضها
const displayStats = computed(() => {
  if (canViewStats.value) {
    // إذا كان لديه صلاحية، اعرض البيانات الحقيقية القادمة من الخادم
    return dashboardStats.value
  } else {
    // إذا لم يكن لديه صلاحية، أرسل كائن فارغ.
    // (مكون DashboardStatsCards يجب أن يكون مبرمجاً لعرض صفر 0 إذا لم يجد قيمة)
    return {}
  }
})

onMounted(() => {
  // 5. جلب البيانات من الخادم "فقط" إذا كان المستخدم يملك الصلاحية
  if (canViewStats.value) {
    reportStore.fetchDashboardStats()
  }
})
</script>
