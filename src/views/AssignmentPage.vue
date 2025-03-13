<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <div class="back-button-container">
          <button class="back-button" @click="$router.push('/dashboard')">
            <span class="back-arrow">←</span>
            Вернуться в панель студента
          </button>
        </div>

        <div class="assignment-page">
          <div class="assignment-header">
            <h1>{{ assignment.title }}</h1>
            <div class="assignment-meta">
              <div class="meta-item">
                <span class="meta-label">Курс:</span>
                <span class="meta-value">{{ assignment.courseName }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Срок сдачи:</span>
                <span class="meta-value" :class="{ 'deadline-close': isDeadlineClose }">
                  {{ formatDate(assignment.deadline) }}
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Статус:</span>
                <span class="meta-value" :class="assignment.status">{{ getStatusText(assignment.status) }}</span>
              </div>
            </div>
          </div>

          <div class="assignment-content">
            <div class="task-description">
              <h2>Описание задания</h2>
              <div class="description-content" v-html="assignment.description"></div>
            </div>

            <div class="task-attachments">
              <h2>Прикрепленные материалы</h2>
              <div class="attachments-list">
                <div v-for="(file, index) in assignment.attachments" :key="index" class="attachment-item">
                  <span class="file-icon">📎</span>
                  <a :href="file.url" target="_blank" class="file-name">{{ file.name }}</a>
                </div>
              </div>
            </div>

            <div class="solution-section">
              <h2>Ваше решение</h2>
              <div class="solution-content">
                <div class="file-upload">
                  <div 
                    class="upload-area" 
                    @click="triggerFileInput"
                    @drop.prevent="handleFileDrop"
                    @dragover.prevent
                    @dragenter.prevent
                  >
                    <input 
                      type="file" 
                      ref="fileInput" 
                      @change="handleFileSelect" 
                      multiple 
                      class="file-input"
                    >
                    <div class="upload-content">
                      <span class="upload-icon">📁</span>
                      <p>Перетащите файлы сюда или нажмите для выбора</p>
                      <span class="upload-hint">Поддерживаемые форматы: PDF, DOC, DOCX, ZIP, RAR</span>
                    </div>
                  </div>

                  <div v-if="selectedFiles.length > 0" class="selected-files">
                    <div v-for="(file, index) in selectedFiles" :key="index" class="selected-file">
                      <span class="file-icon">📄</span>
                      <span class="file-name">{{ file.name }}</span>
                      <button class="remove-file" @click="removeFile(index)">×</button>
                    </div>
                  </div>
                </div>

                <div class="solution-notes">
                  <h3>Комментарии к решению</h3>
                  <textarea 
                    v-model="solutionNotes" 
                    placeholder="Добавьте комментарии к вашему решению (необязательно)"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="solution-actions">
              <button 
                class="btn btn-primary" 
                @click="submitSolution"
                :disabled="!canSubmit"
              >
                Отправить решение
              </button>
              <button 
                class="btn btn-secondary" 
                @click="saveDraft"
                :disabled="!hasChanges"
              >
                Сохранить черновик
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'AssignmentPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      assignment: {
        id: 1,
        title: 'Разработка веб-приложения',
        courseName: 'Веб-разработка',
        deadline: '2024-03-25',
        status: 'pending',
        description: `
          <p>В рамках данного задания вам необходимо разработать веб-приложение с использованием следующих технологий:</p>
          <ul>
            <li>HTML5 и CSS3</li>
            <li>JavaScript (ES6+)</li>
            <li>Vue.js</li>
            <li>Node.js и Express</li>
          </ul>
          <p>Требования к приложению:</p>
          <ol>
            <li>Реализовать аутентификацию пользователей</li>
            <li>Создать CRUD операции для основных сущностей</li>
            <li>Обеспечить адаптивный дизайн</li>
            <li>Реализовать валидацию форм</li>
            <li>Добавить обработку ошибок</li>
          </ol>
          <p>Дополнительные требования:</p>
          <ul>
            <li>Код должен быть хорошо структурирован</li>
            <li>Необходимо добавить комментарии к коду</li>
            <li>Реализовать обработку ошибок</li>
            <li>Добавить документацию по развертыванию</li>
          </ul>
        `,
        attachments: [
          { name: 'Требования к проекту.pdf', url: '#' },
          { name: 'Примеры кода.zip', url: '#' }
        ]
      },
      selectedFiles: [],
      solutionNotes: '',
      hasChanges: false
    }
  },
  computed: {
    isDeadlineClose() {
      const deadline = new Date(this.assignment.deadline)
      const now = new Date()
      const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))
      return daysLeft <= 3
    },
    canSubmit() {
      return this.selectedFiles.length > 0
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    getStatusText(status) {
      const statusMap = {
        pending: 'Ожидает выполнения',
        in_progress: 'В процессе',
        submitted: 'Отправлено',
        graded: 'Оценено'
      }
      return statusMap[status] || status
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.addFiles(files)
    },
    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files)
      this.addFiles(files)
    },
    addFiles(files) {
      this.selectedFiles.push(...files)
      this.hasChanges = true
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
      this.hasChanges = true
    },
    submitSolution() {
      // Здесь будет логика отправки решения
      console.log('Отправка решения:', {
        files: this.selectedFiles,
        notes: this.solutionNotes
      })
    },
    saveDraft() {
      // Здесь будет логика сохранения черновика
      console.log('Сохранение черновика:', {
        files: this.selectedFiles,
        notes: this.solutionNotes
      })
      this.hasChanges = false
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button-container {
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
}

.back-button:hover {
  background-color: #f8f9fa;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  font-size: 1.2rem;
  line-height: 1;
}

.assignment-page {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.assignment-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.assignment-header h1 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.assignment-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.meta-value {
  font-weight: 600;
}

.meta-value.deadline-close {
  color: #dc3545;
}

.meta-value.pending {
  color: #ffc107;
}

.meta-value.in_progress {
  color: #17a2b8;
}

.meta-value.submitted {
  color: #28a745;
}

.meta-value.graded {
  color: #6c757d;
}

.assignment-content {
  display: grid;
  gap: 2rem;
}

.task-description {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.task-description h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.description-content {
  line-height: 1.6;
}

.description-content ul,
.description-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.description-content li {
  margin-bottom: 0.5rem;
}

.task-attachments {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.task-attachments h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.attachment-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 1.2rem;
}

.file-name {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.solution-section {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.solution-section h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.file-upload {
  margin-bottom: 1.5rem;
}

.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(67, 97, 238, 0.05);
}

.file-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 2rem;
}

.upload-hint {
  font-size: 0.9rem;
  color: #6c757d;
}

.selected-files {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.remove-file {
  margin-left: auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: #f8f9fa;
  color: #dc3545;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.remove-file:hover {
  background: #dc3545;
  color: white;
}

.solution-notes {
  margin-top: 1.5rem;
}

.solution-notes h3 {
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.solution-notes textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: var(--transition);
}

.solution-notes textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.solution-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f1f1;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.btn-primary:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: var(--text-color);
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .assignment-page {
    padding: 1.5rem;
  }

  .assignment-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .solution-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 