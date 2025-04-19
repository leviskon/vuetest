<template>
  <header class="header">
    <div class="header__container">
      <div class="header__brand">
        <img src="/images/skillup-logo.png" alt="SkillUp Logo" class="header__logo">
        <h1 class="header__title">SkillUp</h1>
      </div>

      <div class="burger-menu" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav class="header__nav" :class="{ active: isMenuOpen }">
        <ul>
          <template v-if="isTeacher">
            <li><a @click="openTeacherCalendar" class="cursor-pointer">Календарь</a></li>
          </template>
          <template v-else>
            <li><a @click="goToAllCourses" class="cursor-pointer">Все курсы</a></li>
          </template>
        </ul>
      </nav>

      <div class="header__user">
        <div class="notifications" @click="toggleNotifications">
          <div class="notification-icon">
            <i class="fas fa-bell"></i>
          </div>
          <span v-if="notifications.length > 0" class="notification-badge">{{ notifications.length }}</span>
          <div class="notifications-dropdown" v-if="showNotifications">
            <div class="notifications-header">
              <h3>Уведомления</h3>
              <button class="clear-all" @click="clearNotifications">Очистить все</button>
            </div>
            <div v-if="notifications.length === 0" class="empty-notifications">
              <i class="fas fa-bell-slash"></i>
              <p>У вас нет новых уведомлений</p>
            </div>
            <div v-else class="notifications-list">
              <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
                <div class="notification-content">
                  <h4>{{ notification.title }}</h4>
                  <p>{{ notification.message }}</p>
                </div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="user-profile" @click="toggleUserMenu">
          <img :src="user.avatar" :alt="user.name" class="user-avatar">
          <div class="user-info">
            <span class="user-name">{{ user.name }}</span>
            <span class="user-role">{{ isTeacher ? 'Преподаватель' : 'Студент' }}</span>
          </div>
          <div class="user-menu" v-if="showUserMenu">
            <router-link :to="isTeacher ? '/teacher/profile' : '/profile'" class="menu-item">
              <i class="fas fa-user"></i>
              Мой профиль
            </router-link>
            <router-link :to="isTeacher ? '/teacher/settings' : '/settings'" class="menu-item">
              <i class="fas fa-cog"></i>
              Настройки
            </router-link>
            <div class="menu-divider"></div>
            <a href="#" class="menu-item logout" @click.prevent="logout">
              <i class="fas fa-sign-out-alt"></i>
              Выйти
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { authService } from '@/services/authService';

export default {
  name: 'Header',
  data() {
    return {
      isMenuOpen: false,
      showNotifications: false,
      showUserMenu: false,
      user: {
        name: '',
        avatar: '/images/student_icon.png',
        email: '',
        role: null
      },
      notifications: [
        {
          id: 1,
          title: 'Новое задание',
          message: 'Вам назначено новое задание по курсу "Веб-разработка"',
          time: '1 час назад'
        },
        {
          id: 2,
          title: 'Дедлайн приближается',
          message: 'Осталось 2 дня до сдачи проекта по курсу "Python для начинающих"',
          time: '3 часа назад'
        },
        {
          id: 3,
          title: 'Оценка за тест',
          message: 'Ваша работа по UX/UI дизайну оценена на 95 баллов',
          time: '5 часов назад'
        }
      ]
    }
  },
  computed: {
    isTeacher() {
      return this.user.role === 'TEACHER';
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.showUserMenu = false;
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      if (this.showUserMenu) {
        this.showNotifications = false;
      }
    },
    clearNotifications() {
      this.notifications = [];
      this.showNotifications = false;
    },
    async logout() {
      await authService.logout();
      this.$router.push('/');
    },
    goToAllCourses() {
      this.$router.push('/all-courses');
      this.isMenuOpen = false;
    },
    openTeacherCalendar() {
      this.$router.push('/teacher/calendar');
      this.isMenuOpen = false;
    },
    loadUserData() {
      const currentUser = authService.getCurrentUser()
      if (currentUser) {
        this.user = {
          name: currentUser.name || '',
          avatar: currentUser.avatarUrl || '/images/student_icon.png',
          email: currentUser.email || '',
          role: currentUser.role || null
        }
      }
    }
  },
  mounted() {
    this.loadUserData()
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 1136px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.5rem 0;
}

.header__container {
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.header__title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.header__nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.header__nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
  transition: var(--transition);
}

.header__nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  transition: width 0.3s ease;
}

.header__nav a:hover::after {
  width: 100%;
}

.header__user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.notification-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(67, 97, 238, 0.1);
  color: var(--primary-color);
  transition: var(--transition);
}

.notification-icon i {
  font-size: 1.2rem;
}

.notifications:hover .notification-icon {
  background: var(--primary-color);
  color: white;
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid white;
}

.notifications-dropdown {
  position: absolute;
  top: 120%;
  right: -100px;
  width: 350px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
  animation: fadeIn 0.3s;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f1f1f1;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.clear-all {
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: var(--transition);
}

.clear-all:hover {
  color: var(--secondary-color);
}

.empty-notifications {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
}

.empty-notifications i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
  transition: var(--transition);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-content h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-color);
}

.notification-content p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.notification-time {
  font-size: 0.8rem;
  color: #adb5bd;
  margin-top: 0.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  transition: var(--transition);
  background: rgba(67, 97, 238, 0.05);
}

.user-profile:hover {
  background: rgba(67, 97, 238, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: var(--transition);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.user-role {
  font-size: 0.8rem;
  color: #6c757d;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  transition: var(--transition);
}

.menu-item:hover {
  background-color: #f8f9fa;
  color: var(--primary-color);
}

.menu-item i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.menu-divider {
  height: 1px;
  background-color: #dee2e6;
  margin: 0.5rem 0;
}

.menu-item.logout {
  color: #dc3545;
}

.menu-item.logout:hover {
  background-color: #fff5f5;
  color: #dc3545;
}

.burger-menu {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 0.5rem;
}

.burger-menu span {
  display: block;
  width: 25px;
  height: 3px;
  background: var(--text-color);
  transition: var(--transition);
  border-radius: 3px;
}

.burger-menu:hover span {
  background: var(--primary-color);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header {
    top: 1rem;
    width: 95%;
    padding: 0.3rem 0;
  }

  .header__container {
    padding: 0.3rem 1rem;
    justify-content: space-between;
  }

  .burger-menu {
    display: flex;
  }
  
  .header__nav {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 250px;
    height: calc(100vh - 70px);
    background: white;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: var(--transition);
    z-index: 100;
  }
  
  .header__nav.active {
    left: 0;
  }
  
  .header__nav ul {
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
  }

  .header__nav li {
    width: 100%;
  }
  
  .header__nav a {
    display: block;
    padding: 1rem 2rem;
  }
  
  .header__nav a:hover {
    background-color: #f5f5f5;
  }
  
  .notifications-dropdown {
    width: 300px;
    right: -140px;
  }
}

@media (max-width: 576px) {
  .header {
    top: 0.5rem;
    width: 95%;
    padding: 0.2rem 0;
  }
  
  .header__title {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .notifications-dropdown {
    width: 280px;
    right: -160px;
  }
}
</style> 