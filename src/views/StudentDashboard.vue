<template>
    <div class="dashboard">
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
  
      <main class="main">
        <div class="dashboard-container">
          <!-- Блок приветствия и прогресса -->
          <section class="welcome-section">
            <div class="welcome-card">
              <div class="welcome-text">
                <h1>Добро пожаловать, {{ user.name }}!</h1>
                <p>Продолжайте обучение и достигайте новых высот</p>
              </div>
              <div class="overall-progress">
                <div class="progress-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ completedCourses }}</div>
                    <div class="stat-label">Завершено курсов</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ completedAssignments }}</div>
                    <div class="stat-label">Выполнено заданий</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ overallProgress }}%</div>
                    <div class="stat-label">Общий прогресс</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          <!-- Раздел с активными курсами и прогрессом -->
          <section class="courses-section" id="courses">
            <h2>Мои курсы</h2>
            <div class="courses-grid">
              <div v-for="course in enrolledCourses" :key="course.id" class="course-card">
                <img :src="course.image" :alt="course.title">
                <div class="course-card__content">
                  <h3>{{ course.title }}</h3>
                  <p>{{ course.description }}</p>
                  <div class="course-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
                    </div>
                    <div class="progress-text">{{ course.progress }}% завершено</div>
                  </div>
                  <div class="course-card__footer">
                    <button class="btn btn-primary" @click="$router.push(`/course/${course.id}`)">Продолжить</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div class="secondary-content">
            <!-- Раздел с актуальными заданиями -->
            <section class="assignments-section" id="assignments">
              <h2>Текущие задания</h2>
              <div class="assignments-container">
                <div v-for="assignment in currentAssignments" :key="assignment.id" class="assignment-card">
                  <div class="assignment-status" :class="getStatusClass(assignment)">
                    <span v-if="assignment.status === 'pending'" class="status-dot pending"></span>
                    <span v-else-if="assignment.status === 'completed'" class="status-dot completed"></span>
                    <span v-else class="status-dot overdue"></span>
                  </div>
                  <div class="assignment-info">
                    <h3>{{ assignment.title }}</h3>
                    <p>{{ assignment.description }}</p>
                  </div>
                  <div class="assignment-meta">
                    <div class="assignment-course">{{ assignment.courseName }}</div>
                    <div class="assignment-deadline" :class="{ 'deadline-close': isDeadlineClose(assignment) }">
                      Срок: {{ formatDate(assignment.deadline) }}
                    </div>
                  </div>
                  <div class="assignment-actions">
                    <button class="btn btn-primary" @click="$router.push(`/assignment/${assignment.id}`)">
                      Перейти к заданию
                    </button>
                  </div>
                </div>
                <div v-if="currentAssignments.length === 0" class="no-assignments">
                  <p>У вас нет активных заданий</p>
                </div>
              </div>
            </section>
  
            <!-- Календарь -->
            <section class="calendar-section" id="calendar">
              <h2>Календарь</h2>
              <div class="calendar-container">
                <div class="calendar-header">
                  <button class="btn-icon" @click="prevMonth">
                    <span>←</span>
                  </button>
                  <h3>{{ currentMonthName }} {{ currentYear }}</h3>
                  <button class="btn-icon" @click="nextMonth">
                    <span>→</span>
                  </button>
                </div>
                <div class="calendar-weekdays">
                  <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
                </div>
                <div class="calendar-days">
                  <div 
                    v-for="day in calendarDays" 
                    :key="day.date" 
                    class="calendar-day"
                    :class="{ 
                      'other-month': !day.currentMonth, 
                      'has-events': day.events.length > 0,
                      'today': isToday(day.date)
                    }"
                    @click="selectDay(day)"
                  >
                    <span class="day-number">{{ day.dayNumber }}</span>
                    <div v-if="day.events.length > 0" class="event-dot"></div>
                  </div>
                </div>
                <div v-if="selectedDay && selectedDayEvents.length > 0" class="day-events">
                  <h4>События на {{ formatDate(selectedDay) }}</h4>
                  <div v-for="event in selectedDayEvents" :key="event.id" class="event-item">
                    <div class="event-time">{{ formatTime(event.time) }}</div>
                    <div class="event-info">
                      <div class="event-title">{{ event.title }}</div>
                      <div class="event-description">{{ event.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
  
      <footer class="footer">
        <div class="container">
          <div class="footer__content">
            <div>
              <h3>Поддержка</h3>
              <p>Email: support@example.com</p>
              <p>Телефон: +7 (999) 123-45-67</p>
            </div>
            <div>
              <h3>Полезные ссылки</h3>
              <p><a href="#">Справочный центр</a></p>
              <p><a href="#">Часто задаваемые вопросы</a></p>
            </div>
          </div>
          <div class="footer__bottom">
            <p>&copy; 2024 Образовательная платформа. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StudentDashboard',
    data() {
      return {
        isMenuOpen: false,
        showNotifications: false,
        showUserMenu: false,
        user: {
          id: 1,
          name: 'Иван Петров',
          avatar: '/images/user-avatar.jpg',
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
        ],
        enrolledCourses: [
          {
            id: 1,
            title: 'Веб-разработка',
            description: 'HTML, CSS и JavaScript с нуля до профессионала',
            image: '/images/web-dev.jpg',
            progress: 65
          },
          {
            id: 2,
            title: 'Python для начинающих',
            description: 'Основы программирования на Python',
            image: '/images/python.jpg',
            progress: 40
          },
          {
            id: 3,
            title: 'UX/UI Дизайн',
            description: 'Создавайте современные интерфейсы',
            image: '/images/uxui.png',
            progress: 85
          }
        ],
        currentAssignments: [
          {
            id: 1,
            title: 'Итоговый проект по HTML/CSS',
            description: 'Создать адаптивный сайт согласно макету',
            courseName: 'Веб-разработка',
            deadline: new Date(2025, 2, 20),
            status: 'pending'
          },
          {
            id: 2,
            title: 'Алгоритмические задачи',
            description: 'Решить 5 задач на сортировку и поиск',
            courseName: 'Python для начинающих',
            deadline: new Date(2025, 2, 15),
            status: 'pending'
          },
          {
            id: 3,
            title: 'Прототип мобильного приложения',
            description: 'Разработать интерфейс приложения для заказа еды',
            courseName: 'UX/UI Дизайн',
            deadline: new Date(2025, 2, 25),
            status: 'completed'
          }
        ],
        // Календарь
        currentDate: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectedDay: null,
        weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        events: [
          {
            id: 1,
            date: new Date(2025, 2, 15),
            time: '10:00',
            title: 'Вебинар по Python',
            description: 'Практическое занятие по работе с API'
          },
          {
            id: 2,
            date: new Date(2025, 2, 20),
            time: '14:00',
            title: 'Сдача проекта',
            description: 'Дедлайн сдачи итогового проекта по HTML/CSS'
          },
          {
            id: 3,
            date: new Date(2025, 2, 18),
            time: '16:30',
            title: 'Консультация с преподавателем',
            description: 'Обсуждение прогресса по курсу UX/UI Дизайн'
          }
        ]
      }
    },
    computed: {
      completedCourses() {
        return this.enrolledCourses.filter(course => course.progress === 100).length;
      },
      completedAssignments() {
        return this.currentAssignments.filter(assignment => assignment.status === 'completed').length;
      },
      overallProgress() {
        if (this.enrolledCourses.length === 0) return 0;
        
        const totalProgress = this.enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
        return Math.round(totalProgress / this.enrolledCourses.length);
      },
      currentMonthName() {
        const months = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[this.currentMonth];
      },
      calendarDays() {
        const days = [];
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        
        // Получаем день недели первого дня месяца (0 - воскресенье, 6 - суббота)
        let firstDayOfWeek = firstDay.getDay();
        // Преобразуем к формату, где понедельник - 0, воскресенье - 6
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        // Добавляем дни предыдущего месяца
        const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
          days.push({
            date: date,
            dayNumber: date.getDate(),
            currentMonth: false,
            events: this.getEventsForDay(date)
          });
        }
        
        // Добавляем дни текущего месяца
        for (let i = 1; i <= lastDay.getDate(); i++) {
          const date = new Date(this.currentYear, this.currentMonth, i);
          days.push({
            date: date,
            dayNumber: i,
            currentMonth: true,
            events: this.getEventsForDay(date)
          });
        }
        
        // Добавляем дни следующего месяца
        const daysNeeded = 42 - days.length; // 6 строк по 7 дней
        for (let i = 1; i <= daysNeeded; i++) {
          const date = new Date(this.currentYear, this.currentMonth + 1, i);
          days.push({
            date: date,
            dayNumber: i,
            currentMonth: false,
            events: this.getEventsForDay(date)
          });
        }
        
        return days;
      },
      selectedDayEvents() {
        if (!this.selectedDay) return [];
        return this.getEventsForDay(this.selectedDay);
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
        // Очищаем данные пользователя
        localStorage.removeItem('user');
        // Перенаправляем на главную страницу
        this.$router.push('/');
      },
      getStatusClass(assignment) {
        if (assignment.status === 'completed') return 'status-completed';
        if (new Date() > assignment.deadline) return 'status-overdue';
        return 'status-pending';
      },
      isDeadlineClose(assignment) {
        const today = new Date();
        const diffTime = assignment.deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
      },
      formatDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      },
      formatTime(time) {
        return time;
      },
      prevMonth() {
        if (this.currentMonth === 0) {
          this.currentMonth = 11;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
        this.selectedDay = null;
      },
      nextMonth() {
        if (this.currentMonth === 11) {
          this.currentMonth = 0;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
        this.selectedDay = null;
      },
      selectDay(day) {
        this.selectedDay = day.date;
      },
      getEventsForDay(date) {
        if (!date) return [];
        return this.events.filter(event => 
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
        );
      },
      isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }
  
  /* Стили для хедера пользователя */
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
  
  /* Блок приветствия и прогресса */
  .welcome-section {
    margin-bottom: 1rem;
  }
  
  .welcome-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 2rem;
    border-radius: var(--border-radius);
    color: white;
    box-shadow: var(--box-shadow);
  }
  
  .welcome-text h1 {
    margin-bottom: 0.5rem;
    color: white;
  }
  
  .welcome-text p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
  
  .overall-progress {
    margin-top: 1rem;
  }
  
  .progress-stats {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    text-align: center;
  }
  
  .stat-item {
    background: rgba(255, 255, 255, 0.2);
    padding: 1rem;
    border-radius: var(--border-radius);
    flex: 1;
    transition: var(--transition);
  }
  
  .stat-item:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-5px);
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 0.5rem;
  }
  
  /* Раздел с курсами */
  .courses-section, .assignments-section, .calendar-section {
    background: white;
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--box-shadow);
  }
  
  .courses-section h2, .assignments-section h2, .calendar-section h2 {
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .course-progress {
    margin: 1rem 0;
  }
  
  .progress-bar {
    height: 8px;
    background-color: #f1f1f1;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    border-radius: 4px;
    transition: width 0.5s ease;
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #6c757d;
    text-align: right;
  }
  
  /* Раздел с заданиями */
  .assignments-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px; /* Отступ для скроллбара */
  }
  
  /* Стилизация скроллбара */
  .assignments-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .assignments-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .assignments-container::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }
  
  .assignments-container::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-color);
  }
  
  .assignment-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-left: 5px solid #f1f1f1;
    position: relative;
    transition: var(--transition);
  }
  
  .assignment-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .assignment-card.status-completed {
    border-left-color: #4cc9f0;
  }
  
  .assignment-card.status-pending {
    border-left-color: #f77f00;
  }
  
  .assignment-card.status-overdue {
    border-left-color: #e63946;
  }
  
  .assignment-status {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
  .status-dot.pending {
    background-color: #f77f00;
  }
  
  .status-dot.completed {
    background-color: #4cc9f0;
  }
  
  .status-dot.overdue {
    background-color: #e63946;
  }
  
  .assignment-info h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }
  
  .assignment-info p {
    color: #6c757d;
    font-size: 0.95rem;
  }
  
  .assignment-meta {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;
  }
  
  .assignment-course {
    font-size: 0.9rem;
    background-color: #f8f9fa;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    color: var(--secondary-color);
    font-weight: 600;
  }
  
  .assignment-deadline {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .deadline-close {
    color: #e63946;
    font-weight: 600;
  }
  
  .assignment-actions {
    margin-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .no-assignments {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }
  
  /* Стили для календаря */
  .calendar-section {
    background: white;
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--box-shadow);
    height: 600px;
    display: flex;
    flex-direction: column;
  }
  
  .calendar-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0.5rem;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    position: sticky;
    top: 0;
    background: white;
    padding: 0.5rem;
    z-index: 2;
  }
  
  .calendar-header h3 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  .btn-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    border: none;
    background: var(--light-color);
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn-icon:hover {
    background: var(--primary-color);
    color: white;
  }
  
  .calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: 600;
    margin-bottom: 0.5rem;
    position: sticky;
    top: 60px;
    background: white;
    padding: 0.5rem;
    z-index: 2;
  }
  
  .weekday {
    padding: 0.5rem;
    font-size: 0.85rem;
    color: var(--text-color);
  }
  
  .calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    padding: 0.5rem;
  }
  
  .calendar-day {
    aspect-ratio: 1/1;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    position: relative;
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
    background: var(--light-color);
  }
  
  .calendar-day:hover {
    background: rgba(67, 97, 238, 0.1);
  }
  
  .calendar-day.other-month {
    opacity: 0.5;
  }
  
  .calendar-day.today {
    background: rgba(67, 97, 238, 0.15);
    font-weight: 600;
  }
  
  .day-number {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
  
  .event-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--primary-color);
    margin-top: 2px;
  }
  
  .day-events {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    z-index: 1000;
    min-width: 300px;
    max-width: 400px;
    animation: slideIn 0.3s ease;
  }
  
  .day-events h4 {
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f1f1;
    font-size: 1.1rem;
  }
  
  .event-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: var(--border-radius);
    background: var(--light-color);
    animation: fadeInUp 0.3s ease;
    transition: var(--transition);
  }
  
  .event-item:hover {
    transform: translateY(-2px);
    background: rgba(67, 97, 238, 0.1);
  }
  
  .event-time {
    font-weight: 600;
    color: var(--primary-color);
    min-width: 60px;
  }
  
  .event-info {
    flex: 1;
  }
  
  .event-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .event-description {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Стили для карточек курсов */
  .course-card {
    background-color: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: var(--transition);
  }
  
  .course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  .course-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .course-card__content {
    padding: 1.5rem;
  }
  
  .course-card__content h3 {
    margin-bottom: 0.5rem;
  }
  
  .course-card__content p {
    color: #6c757d;
    margin-bottom: 1rem;
  }
  
  .course-card__footer {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  
  /* Общие стили компонентов */
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
  
  .main {
    flex: 1;
    background-color: #f9fafb;
  }
  
  .footer {
    background-color: #2d3748;
    color: white;
    padding: 3rem 0 1.5rem;
  }
  
  .footer__content {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    margin-bottom: 2rem;
  }
  
  .footer h3 {
    color: white;
    margin-bottom: 1rem;
  }
  
  .footer p {
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .footer a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: var(--transition);
  }
  
  .footer a:hover {
    color: white;
  }
  
  .footer__bottom {
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  /* Кнопки */
  .btn {
    padding: 0.5rem 1.25rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    font-size: 0.95rem;
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: var(--primary-color-dark);
    transform: translateY(-2px);
  }
  
  /* Анимации */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Переменные CSS */
  :root {
    --primary-color: #4361ee;
    --primary-color-rgb: 67, 97, 238;
    --primary-color-dark: #3a56d4;
    --secondary-color: #3f37c9;
    --accent-color: #f72585;
    --text-color: #333;
    --border-radius: 8px;
    --box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
  }
  
  /* Адаптивный дизайн */
  @media (max-width: 1024px) {
    .courses-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .progress-stats {
      flex-wrap: wrap;
    }
    
    .stat-item {
      flex-basis: calc(50% - 0.5rem);
    }
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
    
    .courses-grid {
      grid-template-columns: 1fr;
    }
    
    .footer__content {
      flex-direction: column;
      gap: 2rem;
    }
    
    .welcome-card {
      padding: 1.5rem;
    }
    
    .calendar-day {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 576px) {
    .dashboard-container {
      padding: 1rem;
    }
    
    .stat-item {
      flex-basis: 100%;
    }
    
    .user-name {
      display: none;
    }
    
    .notifications-dropdown {
      width: 300px;
      right: -140px;
    }
    
    .assignment-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .calendar-weekdays, .calendar-days {
      font-size: 0.8rem;
    }
    
    .event-item {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .secondary-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }

  .assignments-section,
  .calendar-section {
    background: white;
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--box-shadow);
    height: 600px; /* Фиксированная высота для обоих блоков */
    display: flex;
    flex-direction: column;
  }

  .assignments-container {
    flex: 1;
    overflow-y: auto;
    padding-right: 10px; /* Отступ для скроллбара */
  }

  .calendar-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .calendar-days {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  @media (max-width: 1024px) {
    .secondary-content {
      grid-template-columns: 1fr;
    }
    
    .assignments-section,
    .calendar-section {
      height: 500px; /* Меньшая высота на мобильных устройствах */
    }
  }
  </style>