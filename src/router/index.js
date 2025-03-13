import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Auth.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import AllCourses from '@/views/AllCourses.vue'

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
    component: AllCourses
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user') // Проверяем наличие пользователя в localStorage
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth') // Перенаправляем на страницу авторизации
  } else if (to.path === '/auth' && isAuthenticated) {
    next('/dashboard') // Если пользователь авторизован и пытается зайти на страницу auth, перенаправляем в dashboard
  } else {
    next()
  }
})

export default router