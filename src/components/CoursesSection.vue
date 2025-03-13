<template>
  <section class="courses-section" id="courses">
    <h2>Мои курсы</h2>
    <div class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
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
            <button 
              class="btn btn-primary" 
              @click="$router.push(`/course/${course.id}`)"
            >
              Продолжить
            </button>
          </div>
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
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.courses-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

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

.course-card__footer {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.course-card__footer .btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.course-card__footer .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style> 