<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5 bg-surface-ground p-4 rounded-md">
      <h4 class="text-md font-semibold text-text-secondary border-b border-surface-border pb-2">
        رفع مستند جديد
      </h4>

      <!-- حقل اسم المستند -->
      <AppInput
        id="document-name"
        label="اسم المستند"
        v-model="form.name"
        placeholder="مثال: شهادة السجل التجاري"
        required
      />

      <!-- حقل رفع الملف -->
      <div>
        <label
          for="document-file"
          class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1"
        >
          ملف المستند (PDF, JPG, PNG)
        </label>
        <input
          id="document-file"
          type="file"
          @change="handleFileChange"
          required
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-surface-ground dark:border-surface-border dark:placeholder-gray-400"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <p v-if="fileError" class="text-sm text-danger mt-1">{{ fileError }}</p>
      </div>
    </div>

    <!-- أزرار الإجراءات -->
    <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving || !form.file">
        <span v-if="isSaving">جاري الرفع...</span>
        <span v-else>رفع وحفظ</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  companyId: {
    type: Number,
    required: true,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// دالة لإنشاء نموذج فارغ
const createFreshForm = () => ({
  company_id: props.companyId,
  name: '',
  file: null, // سيحتوي على كائن الملف
})

const form = ref(createFreshForm())
const fileError = ref(null)

// دالة لمعالجة تغيير الملف
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) {
    form.value.file = null
    return
  }

  // يمكنك إضافة تحقق من حجم الملف هنا إذا أردت
  // const maxSize = 5 * 1024 * 1024; // 5MB
  // if (file.size > maxSize) {
  //   fileError.value = 'حجم الملف كبير جداً (الحد الأقصى 5MB).';
  //   form.value.file = null;
  //   event.target.value = ''; // إعادة تعيين حقل الإدخال
  //   return;
  // }

  fileError.value = null
  form.value.file = file
}

const handleSubmit = () => {
  if (!form.value.file) {
    fileError.value = 'الرجاء اختيار ملف أولاً.'
    return
  }
  // لا حاجة لإنشاء FormData هنا، المكون الأب سيفعل ذلك
  // لأن documentService يتوقع payload وليس FormData مباشرة
  emit('submit', form.value)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
