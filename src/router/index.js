import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Auth from '../views/Auth.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import AllCourses from '@/views/AllCourses.vue'
import CourseView from '@/views/CourseView.vue'
import AssignmentPage from '@/views/AssignmentPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import EditCourse from '@/views/EditCourse.vue'
import TeacherCalendar from '@/components/TeacherCalendar.vue'

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
    name: 'CourseView',
    component: CourseView,
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
    meta: { requiresAuth: true, requiresTeacher: true }
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
  },
  {
    path: '/teacher/profile',
    name: 'TeacherProfile',
    component: ProfilePage,
    meta: { requiresAuth: true, requiresTeacher: true }
  },
  {
    path: '/teacher/calendar',
    name: 'TeacherCalendar',
    component: TeacherCalendar,
    meta: { requiresAuth: true, requiresTeacher: true }
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
    // Получаем роль пользователя
    let userRole = user.role;
    if (typeof userRole === 'object' && userRole.name) {
      userRole = userRole.name;
    }
    userRole = String(userRole).toUpperCase();
    console.log('User role in router:', userRole); // Добавляем логирование
    
    // Перенаправляем на соответствующий dashboard в зависимости от роли
    next(userRole === 'TEACHER' ? '/teacher/dashboard' : '/dashboard');
  } else if (to.meta.requiresTeacher) {
    // Получаем роль пользователя
    let userRole = user?.role;
    if (typeof userRole === 'object' && userRole.name) {
      userRole = userRole.name;
    }
    userRole = String(userRole).toUpperCase();
    console.log('User role in teacher check:', userRole); // Добавляем логирование
    
    if (userRole !== 'TEACHER') {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router