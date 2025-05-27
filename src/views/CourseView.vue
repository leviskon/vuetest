<template>
  <div class="course-view">
    <Header />
    
    <!-- Кнопка "Назад", расположенная перед основным контентом -->
    <button @click="$router.back()" class="back-button">
      <i class="fas fa-arrow-left"></i>
      Назад
    </button>

    <main class="main">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка курса...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="course-container">
        <div class="course-header">
          <div class="course-info">
            <h1>{{ course.name }}</h1>
            <p class="course-description">{{ course.description }}</p>
            <div class="course-meta">
              <span class="course-category">{{ course.category }}</span>
              <span class="course-level">{{ course.level }}</span>
            </div>
          </div>
          <div class="course-progress">
            <div class="progress-bar">
              <div class="progress" :style="{ width: course.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ course.progress }}% завершено</span>
          </div>
        </div>
        
        <div class="course-content">
          <CourseMaterials :courseId="courseId" />
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CourseMaterials from '@/components/CourseMaterials.vue'
import { courseService } from '@/services/api'

export default {
  name: 'CourseView',
  components: {
    Header,
    Footer,
    CourseMaterials
  },
  data() {
    return {
      course: null,
      loading: true,
      error: null
    }
  },
  computed: {
    courseId() {
      return parseInt(this.$route.params.id)
    }
  },
  created() {
    console.log('CourseView created, courseId:', this.courseId)
    this.loadCourse()
  },
  methods: {
    async loadCourse() {
      console.log('Начало загрузки курса, ID:', this.courseId)
      try {
        this.loading = true
        const course = await courseService.getCourseById(this.courseId)
        console.log('Курс успешно загружен:', course)
        this.course = course
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error)
        this.error = 'Не удалось загрузить информацию о курсе'
      } finally {
        this.loading = false
        console.log('Загрузка курса завершена, loading:', this.loading)
      }
    }
  }
}
</script>

<style scoped>
.course-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: 2rem;
  padding-top: 4rem;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #dc3545;
}

.course-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.course-header {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-info h1 {
  margin: 0 0 1rem;
  font-size: 2rem;
  color: #333;
}

.course-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.course-category,
.course-level {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.course-category {
  background: rgba(76, 201, 240, 0.1);
  color: #4cc9f0;
}

.course-level {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.course-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
}

.course-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.back-button {
  position: fixed;
  top: 1.8rem;
  left: 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: var(--primary-color-dark);
}

.back-button i {
  font-size: 1rem;
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .main {
    padding: 1rem;
  }
  
  .course-container {
    padding: 0 1rem;
  }
  
  .course-header {
    padding: 1.5rem;
  }
  
  .course-info h1 {
    font-size: 1.5rem;
  }
  
  .course-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .back-button {
    top: 1.5rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .back-button i {
    font-size: 1rem;
  }
}
</style> 