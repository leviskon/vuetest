<template>
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
  }
}
</script>

<style scoped>
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

@media (max-width: 1024px) {
  .progress-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex-basis: calc(50% - 0.5rem);
  }
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .stat-item {
    flex-basis: 100%;
  }
}
</style> 