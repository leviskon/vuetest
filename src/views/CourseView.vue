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
              <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <span class="progress-text">{{ progressPercentage }}% завершено</span>
          </div>
        </div>
        
        <div class="course-content">
          <CourseMaterials 
            ref="courseMaterialsRef"
            :courseId="courseId"
            :studentId="studentId"
            :initialCompletedMaterialIds="completedMaterialIds"
            @material-completed="handleMaterialCompleted"
            @materials-loaded="handleMaterialsLoaded"
          />
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
import { authService } from '@/services/authService'
import { materialService } from '@/services/api'

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
      error: null,
      studentId: null,
      completedMaterialIds: new Set(),
      totalMaterials: 0,
      currentProgress: 0
    }
  },
  computed: {
    courseId() {
      return parseInt(this.$route.params.id)
    },
    progressPercentage() {
      if (this.totalMaterials === 0) return 0;
      
      const completedCount = this.completedMaterialIds.size;

      console.log('progressPercentage (обновленный):', { completedCount, totalMaterials: this.totalMaterials });

      return Math.round((completedCount / this.totalMaterials) * 100);
    }
  },
  created() {
    console.log('CourseView created, courseId:', this.courseId)
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      this.studentId = currentUser.id;
    } else {
      this.$router.push('/login');
      return;
    }

    this.loadCourse().then(() => {
      this.loadCourseProgress();
    });
  },
  methods: {
    async loadCourse() {
      console.log('Начало загрузки курса, ID:', this.courseId)
      try {
        this.loading = true
        const course = await courseService.getCourseById(this.courseId)
        console.log('Курс успешно загружен:', course)
        this.course = course
        this.totalMaterials = course.materials ? course.materials.length : 0;
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error)
        this.error = 'Не удалось загрузить информацию о курсе'
      } finally {
        this.loading = false
        console.log('Загрузка курса завершена, loading:', this.loading)
      }
    },
    async loadCourseProgress() {
      if (!this.studentId || !this.courseId) return;
      try {
        console.log(`Загрузка прогресса для студента ${this.studentId} и курса ${this.courseId}`);
        const response = await fetch(`http://localhost:8080/api/course-progress/student/${this.studentId}/course/${this.courseId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('Прогресс для студента и курса не найден.');
            this.completedMaterialIds = new Set();
             this.$nextTick(() => {
              if (this.$refs.courseMaterialsRef) {
                this.$refs.courseMaterialsRef.updateCompletedMaterials(this.completedMaterialIds);
              }
            });
            return;
          }
          throw new Error(`Ошибка при загрузке прогресса: ${response.status} ${response.statusText}`);
        }

        const progressData = await response.json();
        console.log('Получены данные прогресса:', progressData);
        
        // Ожидаем массив ID пройденных материалов в поле completedMaterials
        if (progressData && Array.isArray(progressData.completedMaterials)) {
           this.completedMaterialIds = new Set(progressData.completedMaterials);
           console.log('Обновлен completedMaterialIds на основе массива completedMaterials:', Array.from(this.completedMaterialIds));
        } else {
           // Если данные не в ожидаемом формате, сбрасываем
          this.completedMaterialIds = new Set();
           console.log('completedMaterialIds установлен как пустой Set (неожиданный формат данных completedMaterials)');
        }
        
         // Обновляем компонент CourseMaterials с актуальными пройденными материалами
        this.$nextTick(() => {
          if (this.$refs.courseMaterialsRef) {
            this.$refs.courseMaterialsRef.updateCompletedMaterials(this.completedMaterialIds);
            console.log('Вызван updateCompletedMaterials в CourseMaterials');
          }
        });

      } catch (error) {
        console.error('Ошибка при загрузке прогресса:', error);
      }
    },
    async updateCourseProgress(materialId) {
      if (!this.studentId || !this.courseId || !materialId) return;
      
      if (this.completedMaterialIds.has(materialId)) {
        console.log(`Материал ${materialId} уже отмечен как пройденный.`);
        return;
      }
      
      // Сначала добавим материал локально для быстрого обновления UI
      this.completedMaterialIds.add(materialId);
      
      try {
        // Подготавливаем данные для запроса
        const requestData = {
          studentId: this.studentId,
          courseId: this.courseId,
          completedMaterials: Array.from(this.completedMaterialIds)
        };

        console.log('Отправляем запрос на отметку материала:', requestData);

        const progressResponse = await fetch('http://localhost:8080/api/course-progress', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!progressResponse.ok) {
          const errorText = await progressResponse.text();
          throw new Error(`Ошибка при обновлении прогресса: ${progressResponse.status} ${progressResponse.statusText} - ${errorText}`);
        }

        console.log('Прогресс успешно обновлен на сервере.');
      } catch (error) {
        console.error('Ошибка при отправке прогресса:', error);
        this.completedMaterialIds.delete(materialId);
        throw error;
      }
    },
    async handleMaterialCompleted(materialId) {
      await this.loadCourseProgress();
    },
    handleMaterialsLoaded(total) {
      console.log('CourseView: Материалы загружены в CourseMaterials, общее количество:', total);
      this.totalMaterials = total;
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