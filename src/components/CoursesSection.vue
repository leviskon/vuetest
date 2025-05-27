<template>
  <section class="courses-section">
    <h2>Мои курсы</h2>
    <div class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <img :src="course.imageUrl || '/images/default-course.jpg'" :alt="course.name" class="course-image">
        <div class="course-content">
          <h3>{{ course.name }}</h3>
          <p>{{ course.description }}</p>
          <div class="progress-bar">
            <div class="progress" :style="{ width: course.progress + '%' }"></div>
          </div>
          <span class="progress-text">{{ course.progress }}% завершено</span>
          <button class="continue-btn" @click="$router.push(`/course/${course.id}`)">
            Продолжить
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CoursesSection',
  props: {
    courses: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.courses-section {
  padding: 2rem 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.course-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.course-content {
  padding: 1.5rem;
}

.course-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #333;
}

.course-content p {
  margin: 0 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.progress-bar {
  height: 6px;
  background: #eee;
  border-radius: 3px;
  margin-bottom: 0.5rem;
}

.progress {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
}

.continue-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.continue-btn:active {
  transform: translateY(0);
}
</style> 