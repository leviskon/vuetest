<template>
  <div class="edit-course">
    <div class="edit-course-container">
      <!-- Добавляем кнопку "Назад" -->
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Назад
      </button>

      <!-- Заголовок и основная информация -->
      <div class="course-header">
        <div class="course-info">
          <input 
            type="text" 
            v-model="course.title" 
            class="course-title-input"
            placeholder="Название курса"
          >
          <textarea 
            v-model="course.description" 
            class="course-description-input"
            placeholder="Описание курса"
          ></textarea>
        </div>
        <div class="course-actions">
          <button class="save-btn" @click="saveCourse">
            <i class="fas fa-save"></i>
            Сохранить изменения
          </button>
          <button class="preview-btn" @click="previewCourse">
            <i class="fas fa-eye"></i>
            Предпросмотр
          </button>
        </div>
      </div>

      <div class="course-content">
        <!-- Левая панель с содержимым курса -->
        <div class="content-panel">
          <div class="panel-header">
            <h2>Содержание курса</h2>
            <div class="panel-actions">
              <button class="add-btn" @click="showAddContentModal = true">
                <i class="fas fa-plus"></i>
                Добавить контент
              </button>
            </div>
          </div>

          <div class="content-list">
            <div ref="modulesList" class="modules-list">
              <div v-for="module in course.modules" :key="module.id" class="module-item">
                <div class="module-header">
                  <i class="fas fa-grip-vertical handle"></i>
                  <input 
                    v-model="module.title" 
                    class="module-title-input"
                    placeholder="Название модуля"
                  >
                  <div class="module-actions">
                    <button @click="deleteModule(module.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div ref="lessonsList" class="lessons-list">
                  <div v-for="lesson in module.lessons" :key="lesson.id" class="lesson-item">
                    <div class="lesson-content">
                      <i class="fas fa-grip-vertical handle"></i>
                      <i :class="getLessonIcon(lesson.type)"></i>
                      <span>{{ lesson.title }}</span>
                    </div>
                    <div class="lesson-actions">
                      <button @click="editLesson(lesson, module.id)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="deleteLesson(module.id, lesson.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая панель со статистикой -->
        <div class="stats-panel">
          <div class="panel-header">
            <h2>Статистика курса</h2>
            <button class="refresh-btn" @click="refreshStats">
              <i class="fas fa-sync"></i>
            </button>
          </div>

          <div class="stats-cards">
            <div class="stat-card">
              <i class="fas fa-users"></i>
              <div class="stat-info">
                <h3>Активные студенты</h3>
                <p>{{ course.stats.activeStudents }}</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-chart-line"></i>
              <div class="stat-info">
                <h3>Средний прогресс</h3>
                <p>{{ course.stats.averageProgress }}%</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-star"></i>
              <div class="stat-info">
                <h3>Средняя оценка</h3>
                <p>{{ course.stats.averageRating }}/5</p>
              </div>
            </div>
          </div>

          <div class="students-progress">
            <h3>Прогресс студентов</h3>
            <div class="progress-list">
              <div v-for="student in course.students" :key="student.id" class="student-progress">
                <div class="student-info">
                  <img :src="student.avatar" :alt="student.name">
                  <span>{{ student.name }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: student.progress + '%' }"></div>
                  <span class="progress-text">{{ student.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно добавления контента -->
    <div v-if="showAddContentModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Добавить контент</h2>
          <button class="close-btn" @click="showAddContentModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="content-types">
            <button 
              v-for="type in contentTypes" 
              :key="type.id"
              class="content-type-btn"
              :class="{ active: selectedContentType === type.id }"
              @click="selectContentType(type)"
            >
              <i :class="type.icon"></i>
              <span>{{ type.label }}</span>
            </button>
          </div>

          <!-- Секция для видеоурока -->
          <div v-if="selectedContentType === 'video'" class="content-section">
            <div class="form-group">
              <label>Название видеоурока</label>
              <input 
                type="text" 
                v-model="newContent.title" 
                class="form-input"
                placeholder="Введите название видеоурока"
              >
            </div>
            <div class="form-group">
              <label>Ссылка на видео</label>
              <input 
                type="url" 
                v-model="newContent.videoUrl" 
                class="form-input"
                placeholder="Вставьте ссылку на видео"
              >
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea 
                v-model="newContent.description" 
                class="form-input"
                placeholder="Введите описание видеоурока"
              ></textarea>
            </div>
          </div>

          <!-- Секция для задания -->
          <div v-if="selectedContentType === 'task'" class="content-section">
            <div class="form-group">
              <label>Название задания</label>
              <input 
                type="text" 
                v-model="newContent.title" 
                class="form-input"
                placeholder="Введите название задания"
              >
            </div>
            <div class="form-group">
              <label>Описание задания</label>
              <textarea 
                v-model="newContent.description" 
                class="form-input"
                placeholder="Введите описание задания"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Критерии оценки</label>
              <textarea 
                v-model="newContent.criteria" 
                class="form-input"
                placeholder="Введите критерии оценки задания"
              ></textarea>
            </div>
          </div>

          <!-- Секция для теста -->
          <div v-if="selectedContentType === 'quiz'" class="content-section">
            <div class="form-group">
              <label>Название теста</label>
              <input 
                type="text" 
                v-model="newContent.title" 
                class="form-input"
                placeholder="Введите название теста"
              >
            </div>
            <div class="form-group">
              <label>Описание теста</label>
              <textarea 
                v-model="newContent.description" 
                class="form-input"
                placeholder="Введите описание теста"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Время на выполнение (в минутах)</label>
              <input 
                type="number" 
                v-model="newContent.timeLimit" 
                class="form-input"
                min="1"
                placeholder="Введите время в минутах"
              >
            </div>
          </div>

          <!-- Секция для файлов -->
          <div v-if="selectedContentType === 'file'" class="content-section">
            <div class="form-group">
              <label>Название раздела с файлами</label>
              <input 
                type="text" 
                v-model="newContent.title" 
                class="form-input"
                placeholder="Введите название раздела"
              >
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea 
                v-model="newContent.description" 
                class="form-input"
                placeholder="Введите описание файлов"
              ></textarea>
            </div>
            <div class="file-upload-section">
              <div class="file-upload-area">
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileUpload" 
                  class="file-input"
                  multiple
                >
                <div class="file-upload-placeholder">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Перетащите файлы сюда или кликните для выбора</p>
                  <span class="file-types">Поддерживаемые форматы: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</span>
                </div>
              </div>
              <div v-if="selectedFiles.length > 0" class="selected-files">
                <h3>Выбранные файлы:</h3>
                <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                  <i class="fas fa-file"></i>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  <button @click="removeFile(index)" class="remove-file-btn">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedContentType" class="modal-footer">
          <button class="cancel-btn" @click="showAddContentModal = false">Отмена</button>
          <button class="save-btn" @click="saveContent">
            <i class="fas fa-save"></i>
            Сохранить
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования урока -->
    <div v-if="showEditLessonModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Редактировать урок</h2>
          <button class="close-btn" @click="showEditLessonModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Название урока</label>
            <input 
              type="text" 
              v-model="editingLesson.title" 
              class="form-input"
              placeholder="Введите название урока"
            >
          </div>
          <div class="form-group">
            <label>Тип урока</label>
            <select v-model="editingLesson.type" class="form-input">
              <option value="video">Видеоурок</option>
              <option value="task">Задание</option>
              <option value="quiz">Тест</option>
              <option value="file">Файл</option>
            </select>
          </div>
          <div class="form-group">
            <label>Описание</label>
            <textarea 
              v-model="editingLesson.description" 
              class="form-input"
              placeholder="Введите описание урока"
            ></textarea>
          </div>
          <div class="form-actions">
            <button class="save-btn" @click="saveLesson">
              <i class="fas fa-save"></i>
              Сохранить
            </button>
            <button class="cancel-btn" @click="showEditLessonModal = false">
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import Sortable from 'sortablejs'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'EditCourse',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const courseId = route.params.id
    const modulesList = ref(null)
    const lessonsList = ref([])

    // Здесь можно добавить загрузку данных курса по ID
    const loadCourseData = async () => {
      try {
        // TODO: Заменить на реальный API-запрос
        console.log('Loading course data for ID:', courseId)
        // const response = await api.getCourse(courseId)
        // course.value = response.data
      } catch (error) {
        console.error('Error loading course:', error)
      }
    }

    onMounted(() => {
      loadCourseData()

      // Инициализация сортировки для модулей
      if (modulesList.value) {
        new Sortable(modulesList.value, {
          group: 'modules',
          animation: 150,
          handle: '.handle',
          onEnd: (evt) => {
            console.log('Module reordered:', evt)
          }
        })
      }

      // Инициализация сортировки для уроков в каждом модуле
      const lessonsContainers = document.querySelectorAll('.lessons-list')
      lessonsContainers.forEach(container => {
        new Sortable(container, {
          group: 'lessons',
          animation: 150,
          handle: '.handle',
          onEnd: (evt) => {
            console.log('Lesson reordered:', evt)
          }
        })
      })
    })

    return {
      modulesList,
      lessonsList,
      courseId,
      router
    }
  },
  data() {
    return {
      showAddContentModal: false,
      showEditLessonModal: false,
      editingLesson: null,
      currentModuleId: null,
      course: {
        id: 1,
        title: 'Веб-разработка',
        description: 'Курс по основам веб-разработки',
        modules: [
          {
            id: 1,
            title: 'Введение в HTML',
            lessons: [
              { 
                id: 1, 
                type: 'video', 
                title: 'Основы HTML',
                description: 'Введение в основы HTML разметки'
              },
              { 
                id: 2, 
                type: 'task', 
                title: 'Практическое задание: Создание первой страницы',
                description: 'Создание простой HTML страницы с основными элементами'
              }
            ]
          }
        ],
        stats: {
          activeStudents: 45,
          averageProgress: 68,
          averageRating: 4.7
        },
        students: [
          {
            id: 1,
            name: 'Иван Петров',
            avatar: '/images/student_icon.png',
            progress: 75
          },
          {
            id: 2,
            name: 'Мария Сидорова',
            avatar: '/images/student_icon.png',
            progress: 90
          }
        ]
      },
      contentTypes: [
        { id: 'video', label: 'Видеоурок', icon: 'fas fa-video' },
        { id: 'task', label: 'Задание', icon: 'fas fa-tasks' },
        { id: 'quiz', label: 'Тест', icon: 'fas fa-question-circle' },
        { id: 'file', label: 'Файл', icon: 'fas fa-file-alt' }
      ],
      selectedContentType: null,
      selectedFiles: [],
      newContent: {
        title: '',
        description: '',
        videoUrl: '',
        criteria: '',
        timeLimit: null,
      },
    }
  },
  methods: {
    async saveCourse() {
      try {
        // TODO: Здесь будет API-запрос для сохранения курса
        console.log('Сохранение курса:', this.course)
        
        // После успешного сохранения перенаправляем на панель преподавателя
        this.router.push('/teacher/dashboard')
      } catch (error) {
        console.error('Ошибка при сохранении курса:', error)
        // Здесь можно добавить обработку ошибок, например, показ уведомления
      }
    },
    goBack() {
      this.router.push('/teacher/dashboard')
    },
    previewCourse() {
      // Здесь будет логика предпросмотра курса
      this.$router.push(`/course/${this.course.id}/preview`)
    },
    deleteModule(moduleId) {
      this.course.modules = this.course.modules.filter(m => m.id !== moduleId)
    },
    editLesson(lesson, moduleId) {
      // Создаем копию урока с гарантированным наличием всех полей
      this.editingLesson = { 
        id: lesson.id,
        title: lesson.title || '',
        type: lesson.type || 'video',
        description: lesson.description || ''
      }
      this.currentModuleId = moduleId
      this.showEditLessonModal = true
    },
    deleteLesson(moduleId, lessonId) {
      const module = this.course.modules.find(m => m.id === moduleId)
      if (module) {
        module.lessons = module.lessons.filter(l => l.id !== lessonId)
      }
    },
    refreshStats() {
      // Здесь будет логика обновления статистики
      console.log('Обновление статистики')
    },
    getLessonIcon(type) {
      const icons = {
        video: 'fas fa-video',
        task: 'fas fa-tasks',
        quiz: 'fas fa-question-circle',
        file: 'fas fa-file-alt'
      }
      return icons[type] || 'fas fa-file'
    },
    selectContentType(type) {
      this.selectedContentType = type.id
      // Сброс формы при смене типа контента
      this.newContent = {
        title: '',
        description: '',
        videoUrl: '',
        criteria: '',
        timeLimit: null,
      }
      this.selectedFiles = []
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      this.selectedFiles.push(...files)
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    saveContent() {
      const content = {
        type: this.selectedContentType,
        ...this.newContent
      }
      
      if (this.selectedContentType === 'file') {
        content.files = this.selectedFiles
      }
      
      console.log('Сохранение контента:', content)
      
      // Сброс формы
      this.selectedContentType = null
      this.newContent = {
        title: '',
        description: '',
        videoUrl: '',
        criteria: '',
        timeLimit: null,
      }
      this.selectedFiles = []
      this.showAddContentModal = false
    },
    saveLesson() {
      if (!this.editingLesson || !this.currentModuleId) return

      const module = this.course.modules.find(m => m.id === this.currentModuleId)
      if (module) {
        const lessonIndex = module.lessons.findIndex(l => l.id === this.editingLesson.id)
        if (lessonIndex !== -1) {
          module.lessons[lessonIndex] = { ...this.editingLesson }
        }
      }

      this.showEditLessonModal = false
      this.editingLesson = null
      this.currentModuleId = null
    }
  }
})
</script>

<style scoped>
.edit-course {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.edit-course-container {
  max-width: 1400px;
  margin: 0 auto;
}

.course-header {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.course-info {
  flex: 1;
}

.course-title-input {
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: var(--transition);
}

.course-title-input:focus {
  outline: none;
  border-bottom-color: var(--primary-color);
}

.course-description-input {
  width: 100%;
  min-height: 100px;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  padding: 0.75rem;
  resize: vertical;
}

.course-actions {
  display: flex;
  gap: 1rem;
}

.save-btn,
.preview-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.save-btn {
  background: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.preview-btn {
  background: #f8f9fa;
  color: var(--text-color);
}

.preview-btn:hover {
  background: #e9ecef;
}

.course-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.content-panel,
.stats-panel {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.panel-header h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin: 0;
  padding-bottom: 0.75rem;
  position: relative;
  display: inline-block;
  text-align: center;
}

.panel-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
}

.stats-panel .panel-header h2::after {
  background-color: var(--primary-color);
}

.content-panel .panel-header h2::after {
  background-color: var(--primary-color);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.add-btn:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.module-item {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  padding: 1rem;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.module-title-input {
  flex: 1;
  border: none;
  background: transparent;
  font-weight: 600;
  padding: 0.25rem;
}

.module-title-input:focus {
  outline: none;
  background: white;
  border-radius: var(--border-radius);
}

.lesson-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
}

.lesson-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.handle {
  cursor: move;
  color: #adb5bd;
}

.lesson-actions {
  display: flex;
  gap: 0.5rem;
}

.lesson-actions button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  transition: var(--transition);
}

.lesson-actions button:hover {
  color: var(--primary-color);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-info h3 {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.stat-info p {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-color);
}

.students-progress {
  margin-top: 1.5rem;
}

.students-progress h3 {
  margin-bottom: 0.75rem;
  text-align: center;
  font-size: 1rem;
}

.student-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 150px;
}

.student-info img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  position: relative;
  margin-right: 35px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: -35px;
  top: -4px;
  font-size: 0.8rem;
  color: #6c757d;
}

.panel-actions {
  width: 100%;
  display: flex;
  justify-content: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

.modal-header h2 {
  margin: 0;
  padding-bottom: 1rem;
  position: relative;
  display: inline-block;
  text-align: center;
  font-size: 1.5rem;
  color: #2d3748;
}

.modal-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  border-radius: 3px;
}

.modal-header .close-btn {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-header .close-btn:hover {
  background: #f7fafc;
  color: #e53e3e;
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.content-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.content-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border: 2px solid #edf2f7;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content-type-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.content-type-btn.active {
  border-color: var(--primary-color);
  background: linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.05), rgba(var(--primary-color-rgb), 0.1));
}

.content-type-btn i {
  font-size: 2rem;
  color: var(--primary-color);
  transition: all 0.3s ease;
}

.content-type-btn span {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.95rem;
}

.content-type-btn:hover i {
  transform: scale(1.1);
}

.content-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-color-rgb), 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

textarea.form-input {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
}

.file-upload-section {
  margin-top: 1.5rem;
}

.file-upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.file-upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.02);
}

.file-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.file-upload-placeholder i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.file-upload-placeholder p {
  font-size: 1.1rem;
  color: #4a5568;
}

.file-types {
  font-size: 0.875rem;
  color: #718096;
}

.selected-files {
  margin-top: 1.5rem;
}

.selected-files h3 {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #2d3748;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border: 1px solid #edf2f7;
  transition: all 0.3s ease;
}

.file-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-name {
  flex: 1;
  font-size: 0.95rem;
  color: #2d3748;
}

.file-size {
  color: #718096;
  font-size: 0.875rem;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #fff5f5;
  color: #c53030;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8f9fa;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.save-btn {
  padding: 0.75rem 2rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-btn:hover {
  background: var(--accent-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.2);
}

.cancel-btn {
  padding: 0.75rem 2rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f8f9fa;
  color: var(--text-color);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-bottom: 1rem;
}

.back-btn:hover {
  background: #e9ecef;
  transform: translateX(-5px);
}

.back-btn i {
  font-size: 1rem;
}
</style> 