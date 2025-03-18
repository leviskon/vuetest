import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Auth from '../views/Auth.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import AllCourses from '@/views/AllCourses.vue'
import CourseContent from '@/views/CourseContent.vue'
import AssignmentPage from '@/views/AssignmentPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import EditCourse from '@/views/EditCourse.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/dashboard',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-courses',
    name: 'AllCourses',
    component: AllCourses,
    meta: { requiresAuth: true }
  },
  {
    path: '/course/:id',
    name: 'CourseContent',
    component: CourseContent,
    meta: { requiresAuth: true }
  },
  {
    path: '/assignment/:id',
    name: 'AssignmentPage',
    component: AssignmentPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/teacher/dashboard',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/teacher/courses/:id/edit',
    name: 'EditCourse',
    component: EditCourse,
    meta: { requiresAuth: true, requiresTeacher: true }
  },
  {
    path: '/teacher/assignments/:id/check',
    name: 'CheckAssignment',
    component: () => import('../views/CheckAssignment.vue'),
    meta: {
      requiresAuth: true,
      requiresTeacher: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAuthenticated = !!user;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.path === '/auth' && isAuthenticated) {
    // Перенаправляем на соответствующий dashboard в зависимости от роли
    next(user.role === 'TEACHER' ? '/teacher/dashboard' : '/dashboard');
  } else if (to.meta.requiresTeacher && user?.role !== 'TEACHER') {
    // Если маршрут требует роль преподавателя, но пользователь не преподаватель
    next('/dashboard');
  } else {
    next();
  }
});

export default router