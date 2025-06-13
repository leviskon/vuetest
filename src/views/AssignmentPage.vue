<template>
  <div class="dashboard">
    <Header />
    
    <!-- Notification Modal (inline) -->
    <div v-if="modal.visible" class="modal-overlay">
      <div class="modal-window" :class="modal.type">
        <div class="modal-icon">
          <i v-if="modal.type==='success'" class="fas fa-check-circle"></i>
          <i v-else class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="modal-message">{{ modal.message }}</div>
        <button class="modal-close" @click="closeModal">Закрыть</button>
      </div>
    </div>
    
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
                <span class="meta-value" :class="{ done: submissions.length > 0, pending: submissions.length === 0 }">{{ assignmentStatusText }}</span>
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
                  <i :class="['fas', getFileIcon(file.name), 'file-icon']"></i>
                  <span class="file-name">{{ file.name }}</span>
                  <button @click="downloadFile(file.downloadUrl, file.name)" class="download-button">
                    <i class="fas fa-download"></i>
                    Скачать
                  </button>
                </div>
              </div>
            </div>

            <div class="solution-section">
              <h2>Ваше решение</h2>
              <div class="solution-content">
                <div v-if="submissions.length > 0" class="submissions-list">
                  <h3>Отправленные решения</h3>
                  <div v-for="submission in submissions" :key="submission.submission.id" class="submission-item">
                    <div class="submission-date-block">
                      <span class="submission-date">Отправлено: {{ formatSubmissionDate(getSubmittedAt(submission)) }}</span>
                      <div v-if="grades[submission.submission.id]" class="grade-info">
                        <span :class="['grade-badge', getGradeColor(grades[submission.submission.id].grade)]">
                          Оценка: {{ grades[submission.submission.id].grade }}
                        </span>
                        <div class="feedback-tooltip">
                          <i class="fas fa-comment-alt"></i>
                          <div class="feedback-content">
                            <div class="feedback-header">
                              <span class="feedback-label">Комментарий преподавателя:</span>
                              <span class="feedback-date">{{ formatDate(grades[submission.submission.id].createdAt) }}</span>
                            </div>
                            <p class="feedback-text">{{ grades[submission.submission.id].feedback }}</p>
                            <div class="feedback-footer">
                              <span class="graded-by">Оценено: {{ grades[submission.submission.id].gradedBy.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="submission-main-row">
                      <template v-if="editingSubmissionId !== submission.submission.id">
                        <span class="file-info">
                          <i :class="['fas', getFileIcon(getFileName(submission)), 'file-icon']"></i>
                          <span class="file-name">{{ getFileName(submission) }}</span>
                        </span>
                        <div class="submission-actions-row">
                          <button class="btn btn-info btn-sm" @click="downloadSubmission(submission.submission.id)">
                            <i class="fas fa-download"></i> Скачать
                          </button>
                          <button 
                            v-if="canEditSubmission(submission.submission.id)"
                            class="btn btn-warning btn-sm" 
                            @click="startEditSubmission(submission)"
                          >
                            <i class="fas fa-edit"></i> Изменить
                          </button>
                          <button 
                            v-if="canEditSubmission(submission.submission.id)"
                            class="btn btn-danger btn-sm" 
                            @click="deleteSubmission(submission.submission.id)"
                          >
                            <i class="fas fa-trash"></i> Удалить
                          </button>
                        </div>
                      </template>
                      <template v-else>
                        <div class="file-edit-row">
                          <label class="edit-file-label-styled">
                            <i class="fas fa-file file-icon"></i>
                            <input type="file" @change="onEditFileChange($event)" class="edit-file-input-styled" />
                            <span class="edit-file-placeholder">
                              {{ editingFile ? editingFile.name : 'Выберите новый файл' }}
                            </span>
                          </label>
                          <button class="btn btn-success btn-sm" @click="saveEditSubmission(submission)">Сохранить</button>
                          <button class="btn btn-secondary btn-sm" @click="cancelEditSubmission">Отмена</button>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>

                <div v-if="!hasGrade" class="file-upload">
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

                <div v-if="!hasGrade" class="solution-actions">
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
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { authService } from '@/services/authService'

export default {
  name: 'AssignmentPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      assignment: {
        id: null,
        title: '',
        courseName: '',
        deadline: '',
        status: '',
        description: '',
        attachments: []
      },
      selectedFiles: [],
      solutionNotes: '',
      hasChanges: false,
      loading: true,
      error: null,
      submissions: [],
      editingSubmissionId: null,
      editingFile: null,
      grades: {},
      modal: {
        visible: false,
        type: 'success', // или 'error'
        message: ''
      }
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
      // Проверяем, есть ли оценка у любого из решений
      const hasGrade = this.submissions.some(submission => 
        this.grades[submission.submission.id]
      );
      return this.selectedFiles.length > 0 && !hasGrade;
    },
    hasGrade() {
      return this.submissions.some(submission => 
        this.grades[submission.submission.id]
      );
    },
    assignmentStatusText() {
      if (this.hasGrade) {
        return 'Оценено';
      }
      return this.submissions && this.submissions.length > 0 ? 'Выполнено' : 'Ожидает выполнения';
    },
    canEditSubmission() {
      return (submissionId) => !this.grades[submissionId];
    }
  },
  async created() {
    // Если есть данные в query, используем их сразу
    const q = this.$route.query;
    if (q && q.title && q.courseId) {
      console.log('[AssignmentPage] Используем данные из query:', q);
      this.assignment.title = q.title;
      this.assignment.description = q.description;
      this.assignment.deadline = q.deadline;
      this.assignment.courseName = q.courseName;
      this.assignment.status = q.status;
      this.assignment.id = this.$route.params.id;
      this.assignment.attachments = [];
      this.loading = false;
      await this.fetchAssignmentFilesByCourse();
      await this.loadSubmissions();
    } else {
      await this.fetchAssignmentByCourse();
      await this.loadSubmissions();
    }
  },
  methods: {
    async getCourseId() {
      try {
        const courseId = this.$route.query.courseId;
        console.log('[AssignmentPage] Получен courseId из query:', courseId);
        if (!courseId) {
          throw new Error('courseId не найден в параметрах запроса');
        }
        return courseId;
      } catch (error) {
        console.error('[AssignmentPage] Ошибка при получении courseId:', error);
        throw error;
      }
    },
    async fetchAssignmentByCourse() {
      this.loading = true;
      this.error = null;
      try {
        const assignmentId = this.$route.params.id;
        const courseId = await this.getCourseId();
        
        console.log(`[AssignmentPage] Запрос заданий курса ${courseId}: /api/assignments/course/${courseId}/with-files`);
        const resp = await fetch(`http://localhost:8080/api/assignments/course/${courseId}/with-files`, { 
          credentials: 'include' 
        });
        console.log('[AssignmentPage] Ответ сервера:', resp);
        if (!resp.ok) throw new Error('Ошибка загрузки заданий курса');
        const data = await resp.json();
        console.log('[AssignmentPage] Полученные задания курса:', data);
        const found = data.find(a => String(a.id) === String(assignmentId));
        console.log('[AssignmentPage] Найденное задание:', found);
        if (!found) throw new Error('Задание не найдено');
        let attachments = [];
        if (found.url) {
          let filesArr = [];
          try {
            filesArr = JSON.parse(found.url);
          } catch (e) {
            filesArr = [];
          }
          attachments = filesArr.map((name, idx) => ({
            name,
            url: `http://localhost:8080/api/assignments/${found.id}/file/${idx}`
          }));
        }
        this.assignment = {
          id: found.id,
          title: found.title,
          courseName: found.courseName || '',
          deadline: found.dueDate,
          status: found.status || '',
          description: found.description,
          attachments
        };
        console.log('[AssignmentPage] Итоговое задание для отображения:', this.assignment);
      } catch (e) {
        this.error = e.message || 'Ошибка загрузки задания';
        console.error('[AssignmentPage] Ошибка:', e);
      } finally {
        this.loading = false;
      }
    },
    async fetchAssignmentFilesByCourse() {
      try {
        const assignmentId = this.$route.params.id;
        const courseId = this.$route.query.courseId;
        if (!courseId) return;
        
        console.log(`[AssignmentPage] (files) Запрос заданий курса: /api/assignments/course/${courseId}/with-files`);
        const resp = await fetch(`http://localhost:8080/api/assignments/course/${courseId}/with-files`, { 
          credentials: 'include' 
        });
        
        if (!resp.ok) return;
        
        const data = await resp.json();
        console.log('[AssignmentPage] (files) Полученные задания курса:', data);
        
        const found = data.find(a => String(a.id) === String(assignmentId));
        console.log('[AssignmentPage] (files) Найденное задание:', found);
        
        if (!found) return;
        
        let attachments = [];
        if (found.url) {
          let filesArr = [];
          try {
            filesArr = JSON.parse(found.url);
          } catch (e) {
            filesArr = [];
          }
          
          attachments = filesArr.map((name, idx) => ({
            name,
            url: `http://localhost:8080/api/assignments/${found.id}/file/${idx}`,
            downloadUrl: `http://localhost:8080/api/assignments/${found.id}/file/${idx}`
          }));
        }
        
        this.assignment.attachments = attachments;
        console.log('[AssignmentPage] (files) Итоговые attachments:', this.assignment.attachments);
      } catch (e) {
        console.error('[AssignmentPage] (files) Ошибка:', e);
      }
    },
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
    showModal(type, message) {
      this.modal.type = type;
      this.modal.message = message;
      this.modal.visible = true;
      setTimeout(() => {
        this.modal.visible = false;
      }, 2500);
    },
    closeModal() {
      this.modal.visible = false;
    },
    async submitSolution() {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.error('Пользователь не авторизован');
        this.showModal('error', 'Ошибка: Пользователь не авторизован');
        return;
      }

      if (!this.selectedFiles.length) {
        this.showModal('error', 'Пожалуйста, выберите файл для отправки');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', this.selectedFiles[0]);
        formData.append('assignmentId', this.assignment.id);
        formData.append('studentId', currentUser.id);

        const response = await fetch('http://localhost:8080/api/submissions', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке решения');
        }

        const submission = await response.json();
        console.log('Решение успешно отправлено:', submission);
        
        this.selectedFiles = [];
        this.hasChanges = false;
        this.assignment.status = 'submitted';
        
        this.showModal('success', 'Решение успешно отправлено!');
      } catch (error) {
        console.error('Ошибка при отправке решения:', error);
        this.showModal('error', 'Ошибка при отправке решения');
      }
    },
    saveDraft() {
      // Здесь будет логика сохранения черновика
      console.log('Сохранение черновика:', {
        files: this.selectedFiles,
        notes: this.solutionNotes
      })
      this.hasChanges = false
    },
    getFileName(submission) {
      // Универсально достаём имя файла из submission
      if (!submission) return '';
      if (submission.fileUrl) return submission.fileUrl;
      if (submission.submission && submission.submission.fileUrl) return submission.submission.fileUrl;
      return '';
    },
    getFileIcon(fileName) {
      if (!fileName || typeof fileName !== 'string') return 'fa-file';
      const extension = fileName.split('.').pop().toLowerCase();
      const iconMap = {
        'pdf': 'fa-file-pdf',
        'doc': 'fa-file-word',
        'docx': 'fa-file-word',
        'txt': 'fa-file-alt',
        'rtf': 'fa-file-alt',
        'jpg': 'fa-file-image',
        'jpeg': 'fa-file-image',
        'png': 'fa-file-image',
        'gif': 'fa-file-image',
        'svg': 'fa-file-image',
        'zip': 'fa-file-archive',
        'rar': 'fa-file-archive',
        '7z': 'fa-file-archive',
        'js': 'fa-file-code',
        'html': 'fa-file-code',
        'css': 'fa-file-code',
        'py': 'fa-file-code',
        'java': 'fa-file-code',
        'cpp': 'fa-file-code',
        'c': 'fa-file-code',
        'xls': 'fa-file-excel',
        'xlsx': 'fa-file-excel',
        'csv': 'fa-file-excel',
        'ppt': 'fa-file-powerpoint',
        'pptx': 'fa-file-powerpoint',
        'default': 'fa-file'
      };
      return iconMap[extension] || iconMap['default'];
    },
    async downloadFile(url, fileName) {
      try {
        const response = await fetch(url, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при скачивании файла');
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
      }
    },
    async loadSubmissions() {
      try {
        console.log('[loadSubmissions] Начало загрузки отправленных решений');
        const response = await fetch(`http://localhost:8080/api/submissions/assignment/${this.assignment.id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при загрузке отправленных решений');
        }
        
        const data = await response.json();
        console.log('[loadSubmissions] Ответ сервера:', data);
        this.submissions = data;

        // Загружаем оценки для каждого решения
        for (const submission of this.submissions) {
          if (submission.submission && submission.submission.id) {
            console.log(`[loadSubmissions] Загрузка оценки для решения с ID: ${submission.submission.id}`);
            await this.loadGrade(submission.submission.id);
          } else {
            console.warn('[loadSubmissions] Не удалось найти ID решения в объекте:', submission);
          }
        }
      } catch (error) {
        console.error('[loadSubmissions] Ошибка при загрузке отправленных решений:', error);
      }
    },
    async loadGrade(submissionId) {
      try {
        console.log(`[loadGrade] Загрузка оценки для решения ${submissionId}`);
        const response = await fetch(`http://localhost:8080/api/grades/submission/${submissionId}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.log(`[loadGrade] Оценка не найдена для решения ${submissionId}`);
          return;
        }
        
        const grade = await response.json();
        console.log(`[loadGrade] Получена оценка для решения ${submissionId}:`, grade);
        this.grades = {
          ...this.grades,
          [submissionId]: grade
        };
      } catch (error) {
        console.error(`[loadGrade] Ошибка при загрузке оценки для решения ${submissionId}:`, error);
      }
    },
    async downloadSubmission(submissionId) {
      try {
        const response = await fetch(`http://localhost:8080/api/submissions/${submissionId}/file`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при скачивании файла');
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'submission';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        alert('Ошибка при скачивании файла');
      }
    },
    startEditSubmission(submission) {
      this.editingSubmissionId = submission.submission.id;
      this.editingFile = null;
    },
    cancelEditSubmission() {
      this.editingSubmissionId = null;
      this.editingFile = null;
    },
    onEditFileChange(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.editingFile = files[0];
      } else {
        this.editingFile = null;
      }
    },
    async saveEditSubmission(submission) {
      if (!this.editingFile) {
        this.showModal('error', 'Пожалуйста, выберите новый файл для обновления');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', this.editingFile);
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.id) {
          formData.append('studentId', currentUser.id);
        }
        const response = await fetch(`http://localhost:8080/api/submissions/${submission.submission.id}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Ошибка при обновлении решения');
        }
        const updatedSubmission = await response.json();
        const index = this.submissions.findIndex(s => s.submission.id === submission.submission.id);
        if (index !== -1) {
          this.submissions[index] = updatedSubmission;
        }
        this.editingSubmissionId = null;
        this.editingFile = null;
        this.showModal('success', 'Решение успешно обновлено');
      } catch (error) {
        console.error('Ошибка при обновлении решения:', error);
        this.showModal('error', 'Ошибка при обновлении решения');
      }
    },
    async deleteSubmission(submissionId) {
      if (!confirm('Вы уверены, что хотите удалить это решение?')) return;
      
      try {
        const currentUser = authService.getCurrentUser();
        const formData = new FormData();
        if (currentUser && currentUser.id) {
          formData.append('studentId', currentUser.id);
        }
        const response = await fetch(`http://localhost:8080/api/submissions/${submissionId}`, {
          method: 'DELETE',
          credentials: 'include',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при удалении решения');
        }
        
        this.submissions = this.submissions.filter(s => s.submission.id !== submissionId);
        this.showModal('success', 'Решение успешно удалено');
      } catch (error) {
        console.error('Ошибка при удалении решения:', error);
        this.showModal('error', 'Ошибка при удалении решения');
      }
    },
    formatSubmissionDate(dateStr) {
      // Ожидается формат: '2025-05-28 19:56:28.088943'
      if (!dateStr) return '';
      // Преобразуем в ISO-формат
      const iso = dateStr.replace(' ', 'T').split('.')[0];
      const date = new Date(iso);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getSubmittedAt(submission) {
      if (!submission) return '';
      if (submission.submittedAt) return submission.submittedAt;
      if (submission.submission && submission.submission.submittedAt) return submission.submission.submittedAt;
      return '';
    },
    getGradeColor(grade) {
      if (grade >= 0 && grade < 55) return 'grade-badge-red';
      if (grade >= 55 && grade < 70) return 'grade-badge-orange';
      if (grade >= 70 && grade < 85) return 'grade-badge-yellow';
      if (grade >= 85 && grade <= 100) return 'grade-badge-green';
      return 'grade-badge-default';
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

.meta-value.done {
  color: #28a745;
  font-weight: 600;
}

.meta-value.pending {
  color: #ffc107;
  font-weight: 600;
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
  font-size: 1.5rem;
  color: var(--primary-color);
  width: 24px;
  text-align: center;
}

.fa-file-word { color: #2b579a; }
.fa-file-pdf { color: #ff0000; }
.fa-file-excel { color: #217346; }
.fa-file-powerpoint { color: #d24726; }
.fa-file-image { color: #2ecc71; }
.fa-file-archive { color: #f39c12; }
.fa-file-code { color: #3498db; }
.fa-file-alt { color: #7f8c8d; }
.fa-file { color: #95a5a6; }

.file-name {
  flex: 1;
  color: var(--text-color);
  font-weight: 500;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.download-button:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
}

.download-button i {
  font-size: 1rem;
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

.submissions-list {
  margin-bottom: 2rem;
}

.submission-item {
  background: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.submission-date-block {
  margin-bottom: 0.7rem;
  background: #f8f9fa;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.grade-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.grade-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  transition: all 0.3s ease;
}

.grade-badge-red {
  background: #dc3545;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.grade-badge-orange {
  background: #fd7e14;
  box-shadow: 0 2px 8px rgba(253, 126, 20, 0.2);
}

.grade-badge-yellow {
  background: #ffc107;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.2);
}

.grade-badge-green {
  background: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.grade-badge-default {
  background: #6c757d;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);
}

.grade-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feedback-tooltip {
  position: relative;
  cursor: pointer;
}

.feedback-tooltip i {
  color: #6c757d;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.feedback-tooltip:hover i {
  color: var(--primary-color);
}

.feedback-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 300px;
  max-width: 400px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.feedback-tooltip:hover .feedback-content {
  display: block;
}

.feedback-content::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.feedback-label {
  font-weight: 600;
  color: var(--text-color);
}

.feedback-date {
  font-size: 0.85rem;
  color: #6c757d;
}

.feedback-text {
  margin: 0.5rem 0;
  line-height: 1.5;
  color: var(--text-color);
}

.feedback-footer {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #6c757d;
}

.graded-by {
  font-style: italic;
}

.submission-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  width: 100%;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #eef3fb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 500;
  min-width: 250px;
  min-height: 40px;
  height: 40px;
  box-sizing: border-box;
}

.file-edit-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.edit-file-label-styled {
  display: flex;
  align-items: center;
  background: #eef3fb;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1.08rem;
  font-weight: 500;
  min-width: 250px;
  min-height: 40px;
  height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  gap: 0.5rem;
  position: relative;
  margin-right: 1rem;
}

.edit-file-input-styled {
  display: none;
}

.edit-file-placeholder {
  color: #6c757d;
  font-size: 1.08rem;
  font-weight: 500;
  background: transparent;
  width: 100%;
  text-align: left;
  padding-left: 0.2rem;
}

.file-info input[type="file"]:focus + .edit-file-placeholder {
  outline: 2px solid var(--primary-color);
}

.submission-actions-row {
  display: flex;
  gap: 1rem;
}

.edit-file-input {
  margin-left: 1rem;
  margin-right: 0.5rem;
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

  .submission-main-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
  }

  .submission-actions-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .submission-main-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .submission-actions-row {
    width: 100%;
    justify-content: space-between;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-window {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-window.success {
  border-left: 6px solid #28a745;
}

.modal-window.error {
  border-left: 6px solid #dc3545;
}

.modal-icon {
  font-size: 2.5rem;
  color: #28a745;
}

.modal-window.error .modal-icon {
  color: #dc3545;
}

.modal-message {
  font-size: 1.15rem;
  color: #222;
  text-align: center;
}

.modal-close {
  margin-top: 0.5rem;
  background: #f8f9fa;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
}

.modal-close:hover {
  background: #e2e6ea;
}
</style> 