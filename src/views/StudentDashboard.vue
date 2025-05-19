<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <WelcomeSection 
          :user="user"
          :completed-courses="completedCourses"
          :completed-assignments="completedAssignments"
          :overall-progress="overallProgress"
        />
        
        <CoursesSection :courses="enrolledCourses" />
        
        <div class="secondary-content">
          <AssignmentsSection :assignments="currentAssignments" />
          <CalendarSection :events="events" />
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import WelcomeSection from '@/components/WelcomeSection.vue'
import CoursesSection from '@/components/CoursesSection.vue'
import AssignmentsSection from '@/components/AssignmentsSection.vue'
import CalendarSection from '@/components/CalendarSection.vue'
import Footer from '@/components/Footer.vue'
import { authService } from '@/services/authService'
import { courseService } from '@/services/courseService'

export default {
  name: 'StudentDashboard',
  components: {
    Header,
    WelcomeSection,
    CoursesSection,
    AssignmentsSection,
    CalendarSection,
    Footer
  },
  data() {
    return {
      user: {
        id: null,
        name: '',
        avatar: '/images/student_icon.png',
        email: ''
      },
      enrolledCourses: [],
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
  async created() {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      this.user = {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatarUrl || '/images/student_icon.png',
        email: currentUser.email
      }
      
      // Загружаем курсы студента
      try {
        this.enrolledCourses = await courseService.getEnrolledCourses()
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error)
      }
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
    }
  }
}
</script>

<style>
@import '@/assets/styles/main.css';

.secondary-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .secondary-content {
    grid-template-columns: 1fr;
  }
}
</style>