<template>
  <section class="welcome-section">
    <div class="welcome-card">
      <div class="welcome-header">
        <div class="user-avatar">
          <img :src="user.avatar" :alt="user.name">
        </div>
        <div class="welcome-text">
          <h1>Добро пожаловать, {{ user.name }}!</h1>
          <p>Продолжайте обучение и достигайте новых высот</p>
        </div>
      </div>
      
      <div class="overall-progress">
        <div class="progress-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ completedCourses }}</div>
              <div class="stat-label">Завершено курсов</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-tasks"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ completedAssignments }}</div>
              <div class="stat-label">Выполнено заданий</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overallProgress }}%</div>
              <div class="stat-label">Общий прогресс</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ userLevel }}</div>
              <div class="stat-label">Уровень</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WelcomeSection',
  props: {
    user: {
      type: Object,
      required: true
    },
    completedCourses: {
      type: Number,
      required: true
    },
    completedAssignments: {
      type: Number,
      required: true
    },
    overallProgress: {
      type: Number,
      required: true
    }
  },
  computed: {
    userLevel() {
      // Определяем уровень пользователя на основе прогресса
      if (this.overallProgress < 20) return 'Новичок';
      if (this.overallProgress < 40) return 'Начинающий';
      if (this.overallProgress < 60) return 'Средний';
      if (this.overallProgress < 80) return 'Продвинутый';
      return 'Эксперт';
    }
  }
}
</script>

<style scoped>
.welcome-section {
  margin-bottom: 1.5rem;
}

.welcome-card {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 2.5rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.welcome-card::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 0;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-text h1 {
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-text p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.overall-progress {
  position: relative;
  z-index: 1;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .progress-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 2rem;
  }
  
  .welcome-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-avatar {
    width: 70px;
    height: 70px;
  }
  
  .welcome-text h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .progress-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 1.25rem;
  }
}
</style> 