<template>
  <header class="header">
    <div class="header__container">
      <div class="burger-menu" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <nav class="header__nav" :class="{ active: isMenuOpen }">
        <ul>
          <li><a href="#courses">Мои курсы</a></li>
          <li><a href="#assignments">Задания</a></li>
          <li><a href="#calendar">Календарь</a></li>
        </ul>
      </nav>
      <div class="header__user">
        <div class="notifications" @click="toggleNotifications">
          <span class="notification-icon">🔔</span>
          <span v-if="notifications.length > 0" class="notification-badge">{{ notifications.length }}</span>
          <div class="notifications-dropdown" v-if="showNotifications">
            <h3>Уведомления</h3>
            <div v-if="notifications.length === 0" class="empty-notifications">
              У вас нет новых уведомлений
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
          <span class="user-name">{{ user.name }}</span>
          <div class="user-menu" v-if="showUserMenu">
            <div class="user-menu-item" @click="$router.push('/profile')">
              <span>Мой профиль</span>
            </div>
            <div class="user-menu-item" @click="$router.push('/settings')">
              <span>Настройки</span>
            </div>
            <div class="user-menu-item logout" @click="logout">
              <span>Выйти</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isMenuOpen: false,
      showNotifications: false,
      showUserMenu: false,
      user: {
        id: 1,
        name: 'Иван Петров',
        avatar: '/images/student_icon.png',
        email: 'ivan@example.com'
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
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.header__nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.header__nav a:hover {
  color: var(--primary-color);
}

.burger-menu {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.burger-menu span {
  display: block;
  width: 30px;
  height: 3px;
  background-color: var(--text-color);
  transition: var(--transition);
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
  font-size: 1.4rem;
  transition: var(--transition);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.notifications-dropdown {
  position: absolute;
  top: 120%;
  right: -100px;
  width: 350px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  z-index: 100;
  padding: 1rem;
  animation: fadeIn 0.3s;
}

.notifications-dropdown h3 {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.notification-item {
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  gap: 1rem;
  transition: var(--transition);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9f9f9;
}

.notification-content h4 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.notification-content p {
  font-size: 0.9rem;
  color: #6c757d;
}

.notification-time {
  font-size: 0.8rem;
  color: #adb5bd;
  white-space: nowrap;
}

.empty-notifications {
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-name {
  font-weight: 600;
}

.user-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  z-index: 100;
  overflow: hidden;
  animation: fadeIn 0.3s;
}

.user-menu-item {
  padding: 0.75rem 1.25rem;
  transition: var(--transition);
  cursor: pointer;
}

.user-menu-item:hover {
  background-color: #f5f5f5;
}

.user-menu-item.logout {
  border-top: 1px solid #f1f1f1;
  color: #dc3545;
}

@media (max-width: 768px) {
  .burger-menu {
    display: flex;
  }
  
  .header__nav {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 250px;
    height: calc(100vh - 70px);
    background-color: white;
    box-shadow: var(--box-shadow);
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
}

@media (max-width: 576px) {
  .user-name {
    display: none;
  }
  
  .notifications-dropdown {
    width: 300px;
    right: -140px;
  }
}
</style> 