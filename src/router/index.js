import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
// (هذه تبقى كما هي)
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- استيراد صفحات الكيانات الجديدة ---
// سنقوم بإنشاء هذه المكونات لاحقًا، ولكننا نجهز المسارات لها الآن.
// من الأفضل استخدام الاستيراد الديناميكي (dynamic import) لتحسين الأداء.
const CompaniesList = () => import('@/views/companies/CompaniesList.vue')
const ProjectsList = () => import('@/views/projects/ProjectsList.vue')
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')

// --- استيراد صفحات التقارير ---
const CompanyStatementReport = () => import('@/views/reports/CompanyStatementReport.vue')
const CompaniesSummaryReport = () => import('@/views/reports/CompaniesSummaryReport.vue')
const PrintSummary = () => import('@/views/reports/PrintSummary.vue')

const routes = [
  // --- المسارات العامة (لا تتطلب مصادقة) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      // إعادة توجيه المسار الجذري إلى صفحة تسجيل الدخول
      { path: '', redirect: '/login' },
    ],
  },

  // --- المسارات المحمية (تتطلب مصادقة) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // --- مسارات إدارة النظام ---
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },

      // --- مسارات إدارة بيانات العطاءات ---
      {
        path: 'companies',
        name: 'CompaniesList',
        component: CompaniesList,
        meta: { permission: 'company.view' },
      },
      {
        path: 'projects',
        name: 'ProjectsList',
        component: ProjectsList,
        meta: { permission: 'project.view' },
      },
      // ملاحظة: الدفعات والمستندات غالبًا ما يتم عرضها داخل صفحات الشركة أو المشروع،
      // لذلك قد لا تحتاج إلى مسارات مستقلة خاصة بها في القائمة الرئيسية.
      // يمكننا إضافتها لاحقًا إذا احتجنا إليها.

      // --- مسارات التقارير ---
      {
        path: 'reports/companies-summary', // المسار الجديد
        name: 'CompaniesSummaryReport',
        component: CompaniesSummaryReport,
        meta: { permission: 'company.view' },
      },
      {
        path: 'reports/company-statement',
        name: 'CompanyStatementReport',
        component: CompanyStatementReport,
        meta: { permission: 'company.view' }, // نستخدم نفس صلاحية عرض الشركات
      },

      // إعادة توجيه المسار الرئيسي للتطبيق إلى لوحة التحكم
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  {
    path: '/print/companies-summary',
    name: 'PrintSummary',
    component: PrintSummary,
    meta: { requiresAuth: true }, // لضمان أمان البيانات
  },
  // مسار للتعامل مع الصفحات غير الموجودة (يبقى كما هو)
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل العام (Global Navigation Guard) ---
// (هذا الجزء يبقى كما هو تمامًا، فهو مكتوب بشكل ممتاز)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        // يمكنك توجيهه إلى صفحة "غير مصرح به" بدلاً من لوحة التحكم
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
