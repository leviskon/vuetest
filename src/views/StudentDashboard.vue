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
          <AssignmentsSection :assignments="allAssignments" />
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
import { courseService as apiCourseService, materialService } from '@/services/api'

const API_BASE_URL = 'http://localhost:8080'; // Добавляем базовый URL сервера

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
      allAssignments: [],
      events: [] // Будем заполнять динамически
    }
  },
  methods: {
    convertAssignmentsToEvents() {
      // Конвертируем задания в события календаря
      this.events = this.allAssignments.map(assignment => ({
        id: assignment.id,
        date: new Date(assignment.dueDate),
        time: new Date(assignment.dueDate).toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        title: assignment.title,
        description: `Дедлайн для задания по курсу ${assignment.courseName}`
      }));
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
      
      try {
        console.log('Загрузка зачисленных курсов для панели студента...');
        // Сначала получаем базовую информацию о зачисленных курсах
        const enrolledCoursesBasic = await courseService.getEnrolledCourses();
        console.log('Базовая информация о зачисленных курсах получена:', enrolledCoursesBasic);

        if (!enrolledCoursesBasic || enrolledCoursesBasic.length === 0) {
          console.log('Нет зачисленных курсов для отображения.');
          this.enrolledCourses = [];
          this.allAssignments = [];
          return;
        }

        console.log(`Обработка ${enrolledCoursesBasic.length} зачисленных курсов...`);
        // Теперь для каждого курса получаем полную информацию (с материалами) и прогресс
        const coursesWithFullInfoAndProgress = await Promise.all(
          enrolledCoursesBasic.map(async (courseBasic) => {
            console.log(`Получение полной информации, материалов и прогресса для курса ID: ${courseBasic.id}`);
            let progress = 0;
            let totalMaterials = 0;
            let courseFullInfo = null;

            try {
              console.log(`Запрос полной информации о курсе ID: ${courseBasic.id}`);
              // Получаем полную информацию о курсе (для деталей)
              courseFullInfo = await apiCourseService.getCourseById(courseBasic.id);
              console.log(`Полная информация о курсе ID ${courseBasic.id} получена:`, courseFullInfo);

              // Формируем полный URL изображения
              if (courseFullInfo && courseFullInfo.imageUrl && !courseFullInfo.imageUrl.startsWith('http')) {
                 courseFullInfo.imageUrl = `${API_BASE_URL}/uploads/courses/images/${courseFullInfo.imageUrl.replace(/^\/+/, '')}`;
                 console.log(`Сформирован полный URL изображения для курса ID ${courseBasic.id}: ${courseFullInfo.imageUrl}`);
              }

            } catch (e) {
              console.error('Ошибка при загрузке полной информации о курсе', courseBasic.id, e);
              // Если не удалось загрузить полную информацию, используем базовую
              courseFullInfo = courseBasic;
              console.log(`Использование базовой информации для курса ID ${courseBasic.id} из-за ошибки.`);
            }

            try {
               console.log(`Запрос материалов для курса ID: ${courseBasic.id}`);
               const materials = await materialService.getCourseMaterials(courseBasic.id);
               totalMaterials = materials ? materials.length : 0;
               console.log(`Общее количество материалов для курса ID ${courseBasic.id} (из materialService):`, totalMaterials);

            } catch (e) {
               console.error(`Ошибка при получении материалов для курса ID ${courseBasic.id}:`, e);
               totalMaterials = 0;
            }

            try {
              console.log(`Запрос прогресса для студента ${currentUser.id} и курса ID: ${courseBasic.id}`);
              // Получаем данные прогресса для конкретного студента и курса
              const progressResp = await fetch(`http://localhost:8080/api/course-progress/student/${currentUser.id}/course/${courseBasic.id}`, { credentials: 'include' });
              
              if (!progressResp.ok) {
                 console.warn(`Прогресс для студента ${currentUser.id} и курса ID ${courseBasic.id} не найден или ошибка (${progressResp.status}). Устанавливаем прогресс 0.`);
                 progress = 0;
              } else {
                const progressData = await progressResp.json();
                console.log(`Данные прогресса для курса ID ${courseBasic.id} получены:`, progressData);

                if (progressData.completedMaterials && Array.isArray(progressData.completedMaterials)) {
                  const completedCount = progressData.completedMaterials.length;
                  console.log(`Найдено завершенных материалов для курса ID ${courseBasic.id}: ${completedCount}`);
                  
                  if (totalMaterials > 0) {
                     progress = Math.round((completedCount / totalMaterials) * 100);
                     console.log(`Вычисленный прогресс для курса ID ${courseBasic.id} (из ${completedCount}/${totalMaterials}): ${progress}%`);
                  } else {
                     // Если материалов 0, но есть завершенные, считаем 100% завершено (крайний случай)
                     // Или если материалов 0, то прогресс 0
                     progress = completedCount > 0 ? 100 : 0; // Корректировка: если материалов 0, но завершено > 0, то все равно 100%. Иначе 0.
                     console.log(`Прогресс для курса ID ${courseBasic.id} (0 материалов, ${completedCount} завершено): ${progress}%`);
                  }
                } else {
                   console.log(`В данных прогресса для курса ID ${courseBasic.id} нет массива completedMaterials. Прогресс 0.`);
                   progress = 0;
                }
              }
            } catch (e) {
              console.error('Ошибка при получении прогресса курса', courseBasic.id, e);
              // Если ошибка, прогресс остается 0
              progress = 0;
            }
            
            // Объединяем полную информацию о курсе с вычисленным прогрессом
            const finalCourseData = { 
              ...courseFullInfo, 
              progress: progress,
              // Добавляем общее количество материалов в объект курса для полноты данных, если потребуется в будущем
              totalMaterials: totalMaterials
            };
            console.log(`Итоговые данные для курса ID ${courseBasic.id}:`, finalCourseData);
            return finalCourseData;
          })
        );

        this.enrolledCourses = coursesWithFullInfoAndProgress;
        console.log('Загруженные курсы с актуальным прогрессом успешно установлены:', this.enrolledCourses);

        // --- Загрузка всех заданий по всем курсам ---
        const allAssignments = [];
        for (const course of this.enrolledCourses) {
          try {
            console.log(`Запрос заданий для курса ID: ${course.id}`);
            const resp = await fetch(`http://localhost:8080/api/assignments/course/${course.id}/with-files`, { credentials: 'include' });
            if (!resp.ok) {
              console.warn(`Не удалось получить задания для курса ${course.id}`);
              continue;
            }
            const assignments = await resp.json();
            console.log(`Задания для курса ${course.name}:`, assignments);
            assignments.forEach(a => {
              allAssignments.push({
                ...a,
                courseName: course.name,
                status: a.isPublished ? (new Date() > new Date(a.dueDate) ? 'overdue' : 'pending') : 'pending'
              });
            });
          } catch (e) {
            console.error(`Ошибка при получении заданий для курса ${course.id}:`, e);
          }
        }
        this.allAssignments = allAssignments;
        console.log('Все собранные задания:', this.allAssignments);
        
        // Конвертируем задания в события календаря
        this.convertAssignmentsToEvents();
        console.log('События календаря:', this.events);

      } catch (error) {
        console.error('Общая ошибка при загрузке курсов или прогресса в StudentDashboard:', error)
        this.allAssignments = [];
      }
    }
  },
  computed: {
    completedCourses() {
      return this.enrolledCourses.filter(course => course.progress === 100).length;
    },
    completedAssignments() {
      return this.allAssignments.filter(assignment => assignment.status === 'completed').length;
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