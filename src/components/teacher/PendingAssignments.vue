<template>
  <div class="pending-assignments">
    <div v-if="isLoading" class="loading-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Загрузка ответов...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="submissions.length === 0" class="empty-state">
      <i class="fas fa-inbox"></i>
      <p>Нет новых ответов на проверку</p>
    </div>
    
    <div v-else class="submissions-list">
      <div v-for="submission in submissions" :key="submission.id" class="submission-card">
        <div class="submission-header">
          <div class="submission-header-main">
            <div class="student-info">
              <img 
                :src="getAvatarUrl(submission.student?.avatarUrl)" 
                :alt="submission.student?.name"
                class="student-avatar"
              >
              <div class="student-details">
                <span class="student-name">{{ submission.student?.name || 'Неизвестный студент' }}</span>
                <span class="assignment-title">Ответ на задание: {{ submission.assignment?.title || 'Без названия задания' }}</span>
                <span class="course-title">Курс: {{ getCourseTitle(submission) }}</span>
              </div>
            </div>
            <div class="submission-meta">
              <span class="submission-date">{{ formatDate(getSubmittedAt(submission)) }}</span>
              <div class="submission-status" :class="{ 'graded': submission.grade }">
                {{ submission.grade ? 'Оценено' : 'Не оценено' }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="submission-content">
          <div class="file-info">
            <i :class="['fas', getFileIcon(submission), 'file-icon']"></i>
            <span class="file-name">{{ getFileName(submission) }}</span>
            <button class="download-btn" @click="downloadSubmission(submission)">
              <i class="fas fa-download"></i>
              Скачать
            </button>
          </div>
          
          <div class="grading-section" v-if="!submission.grade">
            <div class="grade-input">
              <label>Оценка:</label>
              <input 
                type="number" 
                v-model="submission.tempGrade" 
                min="0" 
                max="100"
                placeholder="0-100"
              >
            </div>
            <div class="feedback-input">
              <label>Комментарий:</label>
              <textarea 
                v-model="submission.tempFeedback" 
                placeholder="Введите комментарий к работе..."
              ></textarea>
            </div>
            <button 
              class="grade-btn" 
              @click="submitGrade(submission)"
              :disabled="!isValidGrade(submission.tempGrade)"
            >
              Оценить работу
            </button>
          </div>
          
          <div class="grade-info" v-else>
            <div class="grade">
              <span class="grade-label">Оценка:</span>
              <span class="grade-value">{{ submission.grade }}/100</span>
              <div class="grade-actions">
                <button class="edit-grade-btn" @click="startEditGrade(submission)">
                  <i class="fas fa-edit"></i>
                  Изменить
                </button>
                <button class="delete-grade-btn" @click="deleteGrade(submission)">
                  <i class="fas fa-trash"></i>
                  Удалить
                </button>
              </div>
            </div>
            <div class="feedback" v-if="submission.feedback">
              <span class="feedback-label">Комментарий:</span>
              <p class="feedback-text">{{ submission.feedback }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingAssignments',
  props: {
    assignments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      submissions: [],
      isLoading: false,
      error: null,
      currentUser: null
    }
  },
  created() {
    // Получаем текущего пользователя при создании компонента
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
      this.currentUser = JSON.parse(currentUserStr);
    }
  },
  watch: {
    assignments: {
      immediate: true,
      handler: 'loadAllSubmissions'
    }
  },
  methods: {
    async loadAllSubmissions() {
      if (!this.assignments.length) {
        console.log('[PendingAssignments] Нет заданий для загрузки');
        return;
      }
      
      console.log('[PendingAssignments] Начало загрузки ответов для заданий:', this.assignments);
      this.isLoading = true;
      this.error = null;
      this.submissions = [];
      
      try {
        for (const assignment of this.assignments) {
          console.log(`[PendingAssignments] Загрузка ответов для задания ID=${assignment.id}`);
          const response = await fetch(`http://localhost:8080/api/submissions/assignment/${assignment.id}`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            console.error(`[PendingAssignments] Ошибка HTTP: ${response.status} ${response.statusText}`);
            throw new Error('Ошибка при загрузке ответов');
          }
          
          const submissions = await response.json();
          console.log(`[PendingAssignments] Получены ответы для задания ${assignment.id}:`, submissions);
          
          // Обрабатываем каждый ответ и загружаем его оценку
          const processedSubmissions = await Promise.all(submissions.map(async sub => {
            console.log('[PendingAssignments] Обработка ответа:', sub);
            const grade = await this.loadGrade(sub);
            
            return {
              ...sub,
              grade: grade ? grade.grade : null,
              feedback: grade ? grade.feedback : null,
              gradeId: grade ? grade.id : null,
              gradedById: grade ? grade.gradedById : null,
              tempGrade: '',
              tempFeedback: '',
              submissionDate: sub.submissionDate || sub.submittedAt // Поддержка обоих форматов даты
            };
          }));
          
          this.submissions.push(...processedSubmissions);
        }
        
        console.log('[PendingAssignments] Все ответы загружены:', this.submissions);
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при загрузке ответов:', error);
        this.error = 'Не удалось загрузить ответы студентов';
      } finally {
        this.isLoading = false;
      }
    },
    
    formatDate(dateString) {
      console.log('[PendingAssignments] Форматирование даты:', dateString);
      if (!dateString) {
        console.warn('[PendingAssignments] Пустая дата');
        return 'Дата не указана';
      }
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          console.warn('[PendingAssignments] Некорректная дата:', dateString);
          return 'Некорректная дата';
        }
        
        const formatted = date.toLocaleString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        console.log('[PendingAssignments] Отформатированная дата:', formatted);
        return formatted;
      } catch (error) {
        console.error('[PendingAssignments] Ошибка форматирования даты:', error);
        return 'Ошибка формата даты';
      }
    },
    
    isValidGrade(grade) {
      console.log('[PendingAssignments] Проверка оценки:', grade);
      const numGrade = Number(grade);
      const isValid = !isNaN(numGrade) && numGrade >= 0 && numGrade <= 100;
      console.log('[PendingAssignments] Оценка валидна:', isValid);
      return isValid;
    },
    
    async submitGrade(submission) {
      if (!this.currentUser?.id) {
        console.error('[PendingAssignments] Ошибка: нет id текущего пользователя');
        alert('Ошибка: не удалось определить преподавателя');
        return;
      }

      console.log('[PendingAssignments] Отправка оценки для ответа:', submission);
      try {
        // Получаем правильный submissionId
        const submissionId = submission.submission?.id || submission.id;
        if (!submissionId) {
          throw new Error('Не удалось определить ID ответа');
        }

        const gradeData = {
          submissionId: submissionId,
          grade: Number(submission.tempGrade),
          feedback: submission.tempFeedback,
          gradedById: this.currentUser.id
        };
        console.log('[PendingAssignments] Данные для отправки:', gradeData);
        
        const response = await fetch('http://localhost:8080/api/grades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(gradeData)
        });

        if (!response.ok) {
          console.error('[PendingAssignments] Ошибка HTTP при сохранении оценки:', response.status, response.statusText);
          throw new Error('Ошибка при сохранении оценки');
        }

        const grade = await response.json();
        console.log('[PendingAssignments] Получена оценка:', grade);
        
        // Обновляем информацию в списке
        const index = this.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
          this.submissions[index] = {
            ...submission,
            grade: grade.grade,
            feedback: grade.feedback,
            gradeId: grade.id,
            gradedById: grade.gradedById
          };
          console.log('[PendingAssignments] Ответ обновлен в списке');
        }
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при сохранении оценки:', error);
        alert('Не удалось сохранить оценку');
      }
    },

    async updateGrade(submission) {
      if (!submission.gradeId) {
        console.error('[PendingAssignments] Нет ID оценки для обновления');
        return;
      }

      try {
        // Получаем правильный submissionId
        const submissionId = submission.submission?.id || submission.id;
        if (!submissionId) {
          throw new Error('Не удалось определить ID ответа');
        }

        const gradeData = {
          submissionId: submissionId,
          grade: Number(submission.tempGrade),
          feedback: submission.tempFeedback,
          gradedById: this.currentUser.id
        };

        const response = await fetch(`http://localhost:8080/api/grades/${submission.gradeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(gradeData)
        });

        if (!response.ok) {
          throw new Error('Ошибка при обновлении оценки');
        }

        const updatedGrade = await response.json();
        
        const index = this.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
          this.submissions[index] = {
            ...submission,
            grade: updatedGrade.grade,
            feedback: updatedGrade.feedback
          };
        }

        alert('Оценка успешно обновлена');
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при обновлении оценки:', error);
        alert('Не удалось обновить оценку');
      }
    },

    async deleteGrade(submission) {
      if (!submission.gradeId) {
        console.error('[PendingAssignments] Нет ID оценки для удаления');
        return;
      }

      if (!confirm('Вы уверены, что хотите удалить оценку?')) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/grades/${submission.gradeId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Ошибка при удалении оценки');
        }

        const index = this.submissions.findIndex(s => s.id === submission.id);
        if (index !== -1) {
          this.submissions[index] = {
            ...submission,
            grade: null,
            feedback: null,
            gradeId: null,
            gradedById: null,
            tempGrade: '',
            tempFeedback: ''
          };
        }

        alert('Оценка успешно удалена');
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при удалении оценки:', error);
        alert('Не удалось удалить оценку');
      }
    },
    
    async downloadSubmission(submission) {
      console.log('[PendingAssignments] Скачивание файла для ответа:', submission);
      try {
        const response = await fetch(`http://localhost:8080/api/submissions/${submission.id}/file`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error('[PendingAssignments] Ошибка HTTP при скачивании:', response.status, response.statusText);
          throw new Error('Ошибка при скачивании файла');
        }
        
        const blob = await response.blob();
        console.log('[PendingAssignments] Файл получен, размер:', blob.size);
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = submission.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('[PendingAssignments] Файл скачан успешно');
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при скачивании файла:', error);
        alert('Не удалось скачать файл');
      }
    },
    
    getAvatarUrl(avatarUrl) {
      if (!avatarUrl) return '/default-avatar.png'; // Путь к дефолтной аватарке
      
      return avatarUrl.startsWith('http') 
        ? avatarUrl 
        : `http://localhost:8080${avatarUrl}`;
    },
    
    getFileName(submission) {
      // Если есть fileUrl, берем только имя файла, иначе пусто
      if (submission.fileUrl) return submission.fileUrl;
      if (submission.submission && submission.submission.fileUrl) return submission.submission.fileUrl;
      return 'Файл не прикреплен';
    },
    
    getSubmittedAt(submission) {
      // Возвращает дату отправки из разных возможных мест
      return submission.submittedAt || (submission.submission && submission.submission.submittedAt) || null;
    },
    
    getCourseTitle(submission) {
      // Пытаемся получить название курса из разных мест
      if (submission.assignment && submission.assignment.course && submission.assignment.course.name)
        return submission.assignment.course.name;
      if (submission.assignment && submission.assignment.courseTitle)
        return submission.assignment.courseTitle;
      if (submission.assignment && submission.assignment.course)
        return submission.assignment.course;
      return 'Без названия курса';
    },
    
    getFileIcon(submission) {
      // Получаем имя файла
      let fileName = '';
      if (submission.fileUrl) fileName = submission.fileUrl;
      else if (submission.submission && submission.submission.fileUrl) fileName = submission.submission.fileUrl;
      else return 'fa-file';
      const ext = fileName.split('.').pop().toLowerCase();
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
      return iconMap[ext] || iconMap['default'];
    },
    
    startEditGrade(submission) {
      // Заполняем временные поля текущими значениями
      submission.tempGrade = submission.grade.toString();
      submission.tempFeedback = submission.feedback || '';
      this.updateGrade(submission);
    },

    async loadGrade(submission) {
      try {
        const submissionId = submission.submission?.id || submission.id;
        if (!submissionId) {
          console.error('[PendingAssignments] Не удалось определить ID ответа');
          return null;
        }

        console.log(`[PendingAssignments] Загрузка оценки для ответа ID=${submissionId}`);
        const response = await fetch(`http://localhost:8080/api/grades/submission/${submissionId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('[PendingAssignments] Оценка не найдена');
            return null;
          }
          throw new Error('Ошибка при загрузке оценки');
        }

        const grade = await response.json();
        console.log('[PendingAssignments] Получена оценка:', grade);
        return grade;
      } catch (error) {
        console.error('[PendingAssignments] Ошибка при загрузке оценки:', error);
        return null;
      }
    },
  } // конец methods
}; // конец export default
</script>

<style scoped>
.pending-assignments {
  width: 100%;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submission-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.submission-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 1.2rem 1.5rem 1rem 1.5rem;
}

.submission-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.student-name {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.15rem;
}

.assignment-title {
  font-size: 1rem;
  color: #222;
  font-weight: 400;
  margin-top: 2px;
}

.course-title {
  font-size: 0.95rem;
  color: #888;
  font-weight: 500;
  margin-top: 2px;
}

.submission-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.submission-date {
  color: #666;
  font-size: 0.98rem;
  font-weight: 500;
}

.submission-status {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: #fff3cd;
  color: #856404;
  margin-top: 0.2rem;
}

.submission-status.graded {
  background: #d4edda;
  color: #155724;
}

.submission-content {
  padding: 1.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.file-icon {
  font-size: 1.5rem;
  /* По умолчанию серый */
  color: #95a5a6;
}
.fa-file-pdf.file-icon { color: #dc3545; }      /* PDF — красный */
.fa-file-word.file-icon { color: #2b579a; }     /* Word — синий */
.fa-file-excel.file-icon { color: #217346; }    /* Excel — зелёный */
.fa-file-powerpoint.file-icon { color: #d24726; } /* PowerPoint — оранжевый */
.fa-file-image.file-icon { color: #2ecc71; }    /* Картинки — зелёный */
.fa-file-archive.file-icon { color: #f39c12; }  /* Архивы — жёлтый */
.fa-file-code.file-icon { color: #3498db; }     /* Код — голубой */
.fa-file-alt.file-icon { color: #7f8c8d; }      /* Текст — серый */

.file-name {
  flex: 1;
  font-weight: 500;
  word-break: break-all;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: var(--secondary-color);
}

.grading-section {
  display: grid;
  gap: 1rem;
}

.grade-input, .feedback-input {
  display: grid;
  gap: 0.5rem;
}

.grade-input input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.feedback-input textarea {
  width: 100%;
  height: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.grade-btn {
  justify-self: end;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.grade-btn:hover {
  background: var(--secondary-color);
}

.grade-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.grade-info {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.grade {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.grade-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.edit-grade-btn,
.delete-grade-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-grade-btn {
  background: #f8f9fa;
  color: var(--primary-color);
}

.edit-grade-btn:hover {
  background: var(--primary-color);
  color: white;
}

.delete-grade-btn {
  background: #fff5f5;
  color: #dc3545;
}

.delete-grade-btn:hover {
  background: #dc3545;
  color: white;
}

.feedback-label {
  font-weight: 500;
  color: #666;
}

.feedback-text {
  margin: 0;
  color: #333;
  line-height: 1.5;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-state i,
.error-state i,
.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.loading-state i {
  color: var(--primary-color);
}

.error-state i {
  color: #dc3545;
}

.empty-state i {
  color: #6c757d;
}

@media (max-width: 768px) {
  .submission-header-main {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .student-info {
    flex-direction: row;
    width: 100%;
  }
  .student-avatar {
    width: 36px;
    height: 36px;
  }
  .student-name {
    font-size: 1.08rem;
  }
  .assignment-title {
    font-size: 0.98rem;
  }
  .course-title {
    font-size: 0.95rem;
  }
  .submission-meta {
    align-items: flex-start;
  }
}
</style>