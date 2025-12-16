<template>
  <AppCard class="mb-6">
    <div class="p-4">
      <h3 class="font-semibold text-md mb-3 text-text-secondary">فلترة حسب الشركة</h3>
      <div class="max-w-sm">
        <CompaniesDropdown
          id="project-company-filter"
          label=""
          :model-value="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          placeholder="عرض كل الشركات"
        />
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import AppCard from '@/components/ui/AppCard.vue'
import CompaniesDropdown from '@/components/forms/CompaniesDropdown.vue'

// هذا المكون يستخدم v-model لتمرير القيمة بينه وبين المكون الأب
defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>
