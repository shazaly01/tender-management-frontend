<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <!-- حقل اسم المشروع -->
      <AppInput
        id="project-name"
        label="اسم المشروع"
        v-model="form.name"
        placeholder="ادخل اسم المشروع"
        required
      />

      <!-- القائمة المنسدلة للشركات -->
      <CompaniesDropdown
        id="project-company"
        label="الشركة التابع لها المشروع"
        v-model="form.company_id"
        required
      />

      <!-- حقل قيمة العقد -->
      <AppInput
        id="project-contract-value"
        label="قيمة العقد"
        v-model="form.contract_value"
        type="number"
        step="0.01"
        placeholder="ادخل قيمة العقد بالريال السعودي"
        required
      />

      <!-- حقل تاريخ الترسية -->
      <AppInput
        id="project-award-date"
        label="تاريخ الترسية"
        v-model="form.award_date"
        type="date"
        required
      />

      <!-- حقل الوصف (اختياري) -->
      <AppTextarea
        id="project-description"
        label="وصف المشروع (اختياري)"
        v-model="form.description"
        placeholder="ادخل وصفاً موجزاً للمشروع"
        rows="4"
      />
    </div>

    <!-- أزرار الإجراءات -->
    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

// استيراد مكونات UI الأساسية
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue' // نفترض وجود هذا المكون
import AppButton from '@/components/ui/AppButton.vue'

// استيراد مكون القائمة المنسدلة للشركات
import CompaniesDropdown from '@/components/forms/CompaniesDropdown.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// دالة لإنشاء كائن نموذج فارغ
const createFreshForm = () => ({
  id: null,
  name: '',
  company_id: '',
  contract_value: '',
  award_date: '',
  description: '',
})

const form = ref(createFreshForm())

// مراقبة البيانات الأولية لملء النموذج في حالة التعديل
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      // تحويل التاريخ إلى صيغة YYYY-MM-DD التي يفهمها حقل <input type="date">
      const formattedDate = newData.award_date
        ? new Date(newData.award_date).toISOString().split('T')[0]
        : ''

      form.value = {
        id: newData.id,
        name: newData.name,
        company_id: newData.company_id,
        contract_value: newData.contract_value,
        award_date: formattedDate,
        description: newData.description || '',
      }
    } else {
      // إعادة تعيين النموذج عند الإضافة
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// دالة لإرسال بيانات النموذج عند الحفظ
const handleSubmit = () => {
  emit('submit', { ...form.value })
}

// دالة لإصدار حدث الإلغاء
const handleCancel = () => {
  emit('cancel')
}
</script>
