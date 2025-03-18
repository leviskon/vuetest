<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <div class="dashboard-header">
          <h1>Панель преподавателя</h1>
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

        <div class="dashboard-content">
          <div class="content-section">
            <div class="section-header">
              <h2>Мои курсы</h2>
              <div class="section-actions">
                <button class="action-btn" @click="refreshCourses">
                  <i class="fas fa-sync"></i>
                </button>
                <button class="action-btn" @click="toggleView">
                  <i :class="viewMode === 'grid' ? 'fas fa-list' : 'fas fa-th-large'"></i>
                </button>
              </div>
            </div>
            <CoursesList :courses="courses" :view-mode="viewMode" />
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
      showCreateCourseModal: false
    }
  },
  methods: {
    async loadDashboardData() {
      try {
        // Здесь будет запрос к API
        // Временные данные для демонстрации
        this.stats = {
          activeCourses: 5,
          totalStudents: 120,
          pendingAssignments: 8,
          averageRating: 4.8
        }
        
        this.courses = [
          {
            id: 1,
            title: 'Веб-разработка',
            description: 'Курс по основам веб-разработки',
            students: 45,
            progress: 75,
            rating: 4.9,
            image: '/images/course1.jpg'
          }
        ]
        
        this.pendingAssignments = [
          {
            id: 1,
            courseTitle: 'Веб-разработка',
            studentName: 'Иван Иванов',
            assignmentTitle: 'Создание веб-страницы',
            submittedAt: '2024-02-20T10:30:00',
            status: 'pending'
          },
          {
            id: 2,
            courseTitle: 'Веб-разработка',
            studentName: 'Мария Петрова',
            assignmentTitle: 'Стилизация страницы',
            submittedAt: '2024-02-19T15:45:00',
            status: 'pending'
          }
        ]
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
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
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--box-shadow);
  position: relative;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  color: var(--text-color);
  margin: 0;
  position: relative;
  padding-bottom: 0.75rem;
  text-align: center;
  width: fit-content;
}

.dashboard-header h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
}

.create-course-btn {
  position: absolute;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.2);
}

.create-course-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 201, 240, 0.3);
}

.create-course-btn i {
  font-size: 1.1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat-icon i {
  font-size: 1.5rem;
  color: white;
}

.stat-info h3 {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-color);
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dashboard-content {
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
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 4rem;
  }

  .create-course-btn {
    position: relative;
    right: auto;
    margin-top: 1rem;
    width: 100%;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 3rem;
  }

  .section-actions {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 