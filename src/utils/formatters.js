// src/utils/formatters.js

/**
 * يقوم بتنسيق القيمة الرقمية كعملة بالدينار الليبي (LYD) مع أرقام إنجليزية.
 * يعرض الكسور العشرية فقط إذا كانت موجودة.
 * @param {number | null | undefined} value - القيمة الرقمية المراد تنسيقها.
 * @returns {string} - السلسلة المنسقة، مثال: "LYD 1,500" أو "LYD 1,500.55" أو "N/A".
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return 'N/A'

  // === [التعديل هنا] ===
  // الخيارات الأساسية
  const options = {
    style: 'currency',
    currency: 'LYD',
    // لا نحدد minimumFractionDigits هنا
    // نحدد الحد الأقصى للكسور العشرية
    maximumFractionDigits: 2,
  }

  // إذا كان الرقم صحيحاً (لا يحتوي على كسور عشرية)،
  // قم بتعيين الحد الأقصى للكسور إلى 0 لإزالة الأصفار غير الضرورية.
  // نستخدم (value % 1 !== 0) للتحقق من وجود كسر.
  if (value % 1 === 0) {
    options.maximumFractionDigits = 0
  }
  // === [نهاية التعديل] ===

  // 'en-US' لضمان الأرقام الإنجليزية.
  return new Intl.NumberFormat('en-US', options).format(value)
}

/**
 * يقوم بتنسيق سلسلة التاريخ إلى صيغة ميلادية رقمية (يوم/شهر/سنة).
 * @param {string | null | undefined} dateString - سلسلة التاريخ القادمة من الـ API.
 * @returns {string} - السلسلة المنسقة، مثال: "16/12/2025" أو "N/A".
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }

  return date.toLocaleDateString('en-GB', options)
}
