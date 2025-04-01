<template>
  <div class="edit-course">
    <div v-if="showNotification" class="notification">
      {{ notificationMessage }}
    </div>
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
        </div>
      </div>

      <div class="course-content">
        <!-- Левая панель с содержимым курса -->
        <div class="content-panel">
          <div class="panel-header">
            <h2>Содержание курса</h2>
            <div class="panel-actions">
              <button class="add-btn" @click="showMaterialModal = true">
                <i class="fas fa-plus"></i>
                Добавить материал
              </button>
            </div>
          </div>

          <div class="content-list">
            <div ref="materialsList" class="materials-list">
              <div v-for="material in course.materials" :key="material.id" class="material-item">
                <div class="material-header">
                  <i class="fas fa-grip-vertical handle"></i>
                  <input 
                    v-model="material.title" 
                    class="material-title-input"
                    placeholder="Название материала"
                  >
                  <div class="material-actions">
                    <button @click="deleteMaterial(material.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="material-description">
                  <textarea 
                    v-model="material.description" 
                    class="material-description-input"
                    placeholder="Описание материала"
                  ></textarea>
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

    <!-- Модальное окно добавления материала -->
    <div v-if="showMaterialModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Добавить материал</h2>
          <button class="close-btn" @click="showMaterialModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
            <label>Название материала</label>
              <input 
                type="text" 
              v-model="newMaterial.title" 
                class="form-input"
              placeholder="Введите название материала"
              >
            </div>
            <div class="form-group">
            <label>Описание материала</label>
              <textarea 
              v-model="newMaterial.description" 
                class="form-input"
              placeholder="Введите описание материала"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Файл материала</label>
              <div class="file-upload-area" @click="$refs.fileInput.click()" @drop.prevent="handleFileDrop" @dragover.prevent>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleFileUpload" 
                  class="file-input"
                  style="display: none"
                >
                <div class="file-upload-content">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Перетащите файл сюда или нажмите для выбора</p>
                  <span class="file-types">Поддерживаемые форматы: PDF, DOC, DOCX, PPT, PPTX, MP4</span>
                </div>
              </div>
              <div v-if="newMaterial.file" class="selected-file">
                <div class="file-info">
                  <i class="fas fa-file"></i>
                  <span>{{ newMaterial.file.name }}</span>
                </div>
                <button class="remove-file" @click="removeFile">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
        </div>
        <div v-if="newMaterial.file" class="modal-footer">
          <button class="cancel-btn" @click="showMaterialModal = false">Отмена</button>
          <button class="save-btn" @click="addMaterial">
            <i class="fas fa-save"></i>
            Сохранить
          </button>
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
    const materialsList = ref(null)

    onMounted(() => {
      // Инициализация сортировки для материалов
      if (materialsList.value) {
        new Sortable(materialsList.value, {
          group: 'materials',
          animation: 150,
          handle: '.handle',
          onEnd: (evt) => {
            console.log('Material reordered:', evt)
          }
        })
      }
    })

    return {
      materialsList,
      courseId,
      router
    }
  },
  data() {
    return {
      course: {
        id: null,
        title: '',
        description: '',
        imageUrl: '',
        level: '',
        category: '',
        materials: [],
        stats: {
          activeStudents: 0,
          averageProgress: 0,
          averageRating: 0
        },
        students: []
      },
      newMaterial: {
        title: '',
        description: '',
        file: null
      },
      showMaterialModal: false,
      loading: false,
      showNotification: false,
      notificationMessage: ''
    }
  },
  async created() {
    const route = useRoute()
    const courseId = route.params.id
    
    try {
      console.log('Загрузка данных курса с ID:', courseId)
      const response = await fetch(`http://localhost:8080/api/courses/${courseId}`, {
        credentials: 'include'
      })

      if (response.status === 403) {
        console.error('Ошибка доступа: нет прав для доступа к курсу')
        alert('У вас нет прав для доступа к этому курсу')
        this.$router.push('/teacher/dashboard')
        return
      }

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      const data = await response.json()
      console.log('Получены данные курса:', data)

      this.course = {
        id: data.id,
        title: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        level: data.level,
        category: data.category,
        materials: [],
        stats: {
          activeStudents: data.totalStudents || 0,
          averageProgress: 0,
          averageRating: 0
        },
        students: []
      }
    } catch (error) {
      console.error('Ошибка при загрузке курса:', error)
      console.error('Детали ошибки:', {
        message: error.message,
        stack: error.stack
      })
      alert('Не удалось загрузить данные курса')
      this.$router.push('/teacher/dashboard')
    }
  },
  methods: {
    goBack() {
      this.$router.push('/teacher/dashboard')
    },
    async saveCourse() {
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('name', this.course.title)
        formData.append('description', this.course.description)
        formData.append('level', this.course.level)
        formData.append('category', this.course.category)

        const response = await fetch(`http://localhost:8080/api/courses/${this.course.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Ошибка при сохранении курса')
        }

        this.notificationMessage = 'Курс успешно сохранен'
        this.showNotification = true
        
        setTimeout(() => {
          this.$router.push('/teacher/dashboard')
        }, 1000)
      } catch (error) {
        console.error('Ошибка при сохранении курса:', error)
        this.notificationMessage = 'Не удалось сохранить курс'
        this.showNotification = true
      } finally {
        this.loading = false
      }
    },
    async addMaterial() {
      if (!this.newMaterial.title || !this.newMaterial.file) {
        alert('Пожалуйста, заполните все поля')
        return
      }

      const formData = new FormData()
      formData.append('title', this.newMaterial.title)
      formData.append('description', this.newMaterial.description)
      formData.append('file', this.newMaterial.file)

      try {
        const response = await fetch(`http://localhost:8080/api/courses/${this.course.id}/materials`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Ошибка при добавлении материала')
        }

        const material = await response.json()
        this.course.materials.push(material)
        this.showMaterialModal = false
        this.newMaterial = { title: '', description: '', file: null }
      } catch (error) {
        console.error('Ошибка при добавлении материала:', error)
        alert('Не удалось добавить материал')
      }
    },
    async deleteMaterial(materialId) {
      if (!confirm('Вы уверены, что хотите удалить этот материал?')) {
        return
      }

      try {
        const response = await fetch(`http://localhost:8080/api/courses/${this.course.id}/materials/${materialId}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Ошибка при удалении материала')
        }

        this.course.materials = this.course.materials.filter(m => m.id !== materialId)
      } catch (error) {
        console.error('Ошибка при удалении материала:', error)
        alert('Не удалось удалить материал')
      }
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      this.newMaterial.file = files[0]
    },
    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      this.newMaterial.file = files[0]
    },
    removeFile() {
      this.newMaterial.file = null
    },
    refreshStats() {
      // Реализация обновления статистики
      console.log('Обновление статистики курса')
    },
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

.save-btn {
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
  padding-right: 4rem;
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

.material-item {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  padding: 1rem;
}

.material-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.material-title-input {
  flex: 1;
  border: none;
  background: transparent;
  font-weight: 600;
  padding: 0.25rem;
}

.material-title-input:focus {
  outline: none;
  background: white;
  border-radius: var(--border-radius);
}

.material-description-input {
  width: 100%;
  min-height: 100px;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  padding: 0.75rem;
  resize: vertical;
}

.material-actions {
  display: flex;
  gap: 0.5rem;
}

.material-actions button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  transition: var(--transition);
}

.material-actions button:hover {
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  padding-bottom: 1rem;
  position: relative;
  display: inline-block;
  text-align: center;
  font-size: 1.75rem;
  color: #1a202c;
  font-weight: 700;
}

.modal-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 2px;
}

.modal-body {
  padding: 2rem;
  background: #ffffff;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
}

.form-input::placeholder {
  color: #a0aec0;
}

textarea.form-input {
  min-height: 150px;
  resize: vertical;
  line-height: 1.6;
}

.file-upload-area {
  width: 100%;
  padding: 2.5rem;
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
}

.file-upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.02);
  transform: translateY(-2px);
}

.file-upload-content {
  text-align: center;
  color: #4a5568;
}

.file-upload-content i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.file-upload-content p {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.file-types {
  font-size: 0.875rem;
  color: #718096;
}

.selected-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.selected-file:hover {
  border-color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.02);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-info i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.file-info span {
  font-size: 0.95rem;
  color: #2d3748;
}

.remove-file {
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file:hover {
  background: #edf2f7;
  color: #e53e3e;
  transform: rotate(90deg);
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
  border-radius: 0 0 20px 20px;
}

.save-btn {
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--primary-color-rgb), 0.3);
}

.cancel-btn {
  padding: 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.cancel-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
}

.close-btn {
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  background: #f7fafc;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: #edf2f7;
  color: #e53e3e;
  transform: rotate(90deg) scale(1.1);
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

.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #48bb78;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease forwards;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.refresh-btn {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.refresh-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.refresh-btn:hover {
  background: #edf2f7;
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.1);
}

.refresh-btn:hover i {
  transform: rotate(180deg);
}

.refresh-btn:active {
  transform: translateY(-50%) scale(0.95);
}
</style> 