<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40"
      @click.self="closeModal"
    >
      <div
        class="bg-surface-section rounded-lg shadow-xl p-6 w-full max-w-4xl transform max-h-[90vh] flex flex-col"
      >
        <!-- رأس المودال -->
        <div
          class="flex justify-between items-center border-b border-surface-border pb-3 mb-5 flex-shrink-0"
        >
          <div>
            <h3 class="text-lg font-semibold text-text-primary">إدارة المستندات</h3>
            <p class="text-sm text-text-muted">للشركة: {{ company.name }}</p>
          </div>
          <button
            @click="closeModal"
            class="text-text-muted hover:text-text-primary p-1 rounded-full hover:bg-surface-border"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- المحتوى القابل للتمرير -->
        <div class="overflow-y-auto flex-grow">
          <!-- نموذج الرفع (دائماً ظاهر في الأعلى) -->
          <DocumentForm
            :company-id="company.id"
            :is-saving="loading"
            @submit="handleUploadDocument"
            @cancel="closeModal"
            class="mb-8"
          />

          <hr class="border-surface-border my-6" />

          <!-- قائمة المستندات الحالية -->
          <h4 class="text-md font-semibold text-text-secondary mb-4">المستندات المرفوعة</h4>
          <DocumentsList
            :documents="documents"
            :loading="loading"
            :error="error"
            @delete="openDeleteDialog"
          />
        </div>

        <!-- حوار تأكيد الحذف -->
        <AppConfirmDialog
          v-model="isDeleteDialogOpen"
          title="تأكيد حذف المستند"
          :message="`هل أنت متأكد من حذف مستند '${documentToDelete?.name}'؟ لا يمكن التراجع عن هذا الإجراء.`"
          @confirmed="deleteSelectedDocument"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDocumentStore } from '@/stores/documentStore'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

// استيراد المكونات
import DocumentsList from './DocumentsList.vue'
import DocumentForm from './DocumentForm.vue'
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  company: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

const documentStore = useDocumentStore()
const { documents, loading, error } = storeToRefs(documentStore)
const toast = useToast()

// جلب البيانات عند فتح المودال
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.company) {
      documentStore.fetchDocuments(props.company.id).catch(() => {
        toast.error('حدث خطأ أثناء جلب المستندات.')
      })
    }
  },
)

// --- دوال CRUD ---
const handleUploadDocument = async (formData) => {
  try {
    await documentStore.createDocument(formData)
    toast.success(`تم رفع مستند '${formData.name}' بنجاح.`)
    // لا حاجة لإعادة الجلب يدوياً، الـ store يقوم بذلك
  } catch (err) {
    toast.error(err.response?.data?.message || 'حدث خطأ أثناء رفع المستند.')
  }
}

const isDeleteDialogOpen = ref(false)
const documentToDelete = ref(null)

const openDeleteDialog = (doc) => {
  documentToDelete.value = doc
  isDeleteDialogOpen.value = true
}

const deleteSelectedDocument = async () => {
  if (!documentToDelete.value) return
  try {
    // الـ store يحتاج companyId لإعادة الجلب بعد الحذف
    await documentStore.deleteDocument(documentToDelete.value.id, props.company.id)
    toast.success('تم حذف المستند بنجاح.')
  } catch (err) {
    toast.error('حدث خطأ أثناء الحذف.')
  } finally {
    isDeleteDialogOpen.value = false
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>
