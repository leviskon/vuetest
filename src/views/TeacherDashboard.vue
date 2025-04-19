<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div class="header-top">
            <h1>Панель управления курсами</h1>
            <button class="create-course-btn" @click="showCreateCourseModal = true">
              <i class="fas fa-plus"></i>
              Создать новый курс
            </button>
          </div>

          <div class="dashboard-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-book"></i>
              </div>
              <div class="stat-info">
                <h3>Активные курсы</h3>
                <p class="stat-number">{{ stats.activeCourses }}</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <h3>Студенты</h3>
                <p class="stat-number">{{ stats.totalStudents }}</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-tasks"></i>
              </div>
              <div class="stat-info">
                <h3>Задания на проверку</h3>
                <p class="stat-number">{{ stats.pendingAssignments }}</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class="fas fa-star"></i>
              </div>
              <div class="stat-info">
                <h3>Средняя оценка</h3>
                <p class="stat-number">{{ stats.averageRating }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-content">
          <div class="content-section">
            <div class="section-header">
              <h2>Мои курсы</h2>
              <div class="section-actions">
                <button class="action-btn" @click="refreshCourses" :disabled="isLoading">
                  <i class="fas fa-sync"></i>
                </button>
                <button class="action-btn" @click="toggleView">
                  <i :class="viewMode === 'grid' ? 'fas fa-list' : 'fas fa-th-large'"></i>
                </button>
              </div>
            </div>
            
            <div v-if="isLoading" class="loading-state">
              <i class="fas fa-spinner fa-spin"></i>
              <p>Загрузка курсов...</p>
            </div>
            
            <div v-else-if="error" class="error-state">
              <i class="fas fa-exclamation-circle"></i>
              <p>{{ error }}</p>
            </div>
            
            <div v-else-if="courses.length === 0" class="empty-state">
              <i class="fas fa-book"></i>
              <p>У вас пока нет созданных курсов</p>
            </div>
            
            <CoursesList 
              v-else 
              :courses="courses" 
              :view-mode="viewMode"
              @course-deleted="handleCourseDeleted" 
            />
          </div>

          <div class="content-section">
            <div class="section-header">
              <h2>Задания на проверку</h2>
              <button class="action-btn" @click="refreshAssignments">
                <i class="fas fa-sync"></i>
              </button>
            </div>
            <PendingAssignments :assignments="pendingAssignments" />
          </div>
        </div>
      </div>
    </main>

    <Footer />
    
    <!-- Модальное окно создания курса -->
    <CreateCourseModal 
      v-if="showCreateCourseModal"
      @close="showCreateCourseModal = false"
      @create="handleCourseCreation"
    />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import CoursesList from '@/components/teacher/CoursesList.vue'
import PendingAssignments from '@/components/teacher/PendingAssignments.vue'
import CreateCourseModal from '@/components/teacher/CreateCourseModal.vue'

export default {
  name: 'TeacherDashboard',
  components: {
    Header,
    Footer,
    CoursesList,
    PendingAssignments,
    CreateCourseModal
  },
  data() {
    return {
      stats: {
        activeCourses: 0,
        totalStudents: 0,
        pendingAssignments: 0,
        averageRating: 0
      },
      courses: [],
      pendingAssignments: [],
      viewMode: 'grid',
      showCreateCourseModal: false,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async loadDashboardData() {
      try {
        this.isLoading = true;
        const response = await fetch('http://localhost:8080/api/courses/my-courses', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            this.$router.push('/auth');
            return;
          }
          if (response.status === 403) {
            throw new Error('У вас нет доступа к этой странице');
          }
          throw new Error('Ошибка при загрузке данных');
        }

        const data = await response.json();
        console.log('Данные курсов с сервера:', data);

        this.courses = data.map(course => {
          console.log('Обработка курса:', course);
          const imageUrl = course.imageUrl 
            ? course.imageUrl.startsWith('http') 
              ? course.imageUrl 
              : course.imageUrl.startsWith('/uploads')
                ? `http://localhost:8080${course.imageUrl}`
                : `http://localhost:8080/uploads/courses/images/${course.imageUrl.replace(/^\/+/, '')}`
            : null;
          console.log('URL изображения:', imageUrl);
          
          return {
            id: course.id,
            title: course.name,
            description: course.description,
            students: course.totalStudents || 0,
            progress: 0,
            rating: 0,
            image: imageUrl,
            level: course.level,
            category: course.category,
            isPublished: course.isPublished,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
            userId: course.userId,
            userName: course.userName
          };
        });
        
        this.stats = {
          activeCourses: this.courses.length,
          totalStudents: this.courses.reduce((sum, course) => sum + course.students, 0),
          pendingAssignments: 0,
          averageRating: 0
        };
        
        this.pendingAssignments = [];
        this.isLoading = false;
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        this.isLoading = false;
        if (error.message === 'Failed to fetch') {
          this.error = 'Не удалось подключиться к серверу. Убедитесь, что сервер запущен на порту 8080.';
        } else {
          this.error = error.message;
        }
      }
    },
    toggleView() {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid'
    },
    refreshCourses() {
      this.loadDashboardData()
    },
    refreshAssignments() {
      this.loadDashboardData()
    },
    handleCourseCreation(courseData) {
      // Здесь будет логика создания курса
      console.log('Создание курса:', courseData)
      this.showCreateCourseModal = false
      this.refreshCourses()
    },
    handleCourseDeleted(courseId) {
      this.courses = this.courses.filter(course => course.id !== courseId)
      this.stats.activeCourses = this.courses.length
      this.stats.totalStudents = this.courses.reduce((sum, course) => sum + course.students, 0)
    }
  },
  mounted() {
    this.loadDashboardData()
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  margin-top: 5rem;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: var(--border-radius);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-top: 1rem;
  color: white;
  overflow: hidden;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.dashboard-header::before {
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

.dashboard-header::after {
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

.dashboard-header h1 {
  font-size: 1.75rem;
  color: white;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-course-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  backdrop-filter: blur(5px);
  z-index: 1;
}

.create-course-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.create-course-btn i {
  font-size: 1.1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  color: white;
  margin: 0;
}

.dashboard-content {
  margin-top: 2rem;
  display: grid;
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0;
  position: relative;
  padding-bottom: 0.75rem;
  text-align: center;
  width: fit-content;
  margin: 0 auto;
}

.section-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
}

.section-actions {
  display: flex;
  gap: 0.75rem;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #f8f9fa;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.action-btn:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.2);
}

.refresh-btn {
  background: #f8f9fa;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
}

.refresh-btn:hover {
  background: #e9ecef;
  transform: rotate(180deg);
}

.secondary-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .secondary-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main {
    padding: 1rem;
  }

  .dashboard-header {
    padding: 1.5rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .create-course-btn {
    width: 100%;
    justify-content: center;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 45px;
    height: 45px;
  }
  
  .stat-icon i {
    font-size: 1.25rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  text-align: center;
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.error-state i {
  color: #dc3545;
}

.empty-state i {
  color: #6c757d;
}

.loading-state p,
.error-state p,
.empty-state p {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>