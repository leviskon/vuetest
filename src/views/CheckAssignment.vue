<template>
  <div class="check-assignment">
    <div class="check-assignment-container">
      <!-- Кнопка "Назад" -->
      <button class="back-btn" @click="goBack">
        <i class="fas fa-arrow-left"></i>
        Назад
      </button>

      <!-- Основная информация о задании -->
      <div class="assignment-header">
        <div class="assignment-info">
          <h1>{{ assignment.title }}</h1>
          <div class="student-info">
            <img :src="assignment.student.avatar" :alt="assignment.student.name">
            <div class="student-details">
              <h3>{{ assignment.student.name }}</h3>
              <p>Группа: {{ assignment.student.group }}</p>
            </div>
          </div>
          <div class="assignment-meta">
            <span><i class="fas fa-calendar"></i> Сдано: {{ formatDate(assignment.submittedAt) }}</span>
            <span><i class="fas fa-clock"></i> Время выполнения: {{ assignment.timeSpent }}</span>
          </div>
        </div>
      </div>

      <!-- Содержимое задания -->
      <div class="assignment-content">
        <div class="content-section">
          <h2>Решение студента</h2>
          <div class="solution-content">
            <div class="code-block">
              <pre><code>{{ assignment.solution }}</code></pre>
            </div>
            <div class="attachments" v-if="assignment.attachments.length">
              <h3>Прикрепленные файлы:</h3>
              <div class="attachments-list">
                <div v-for="file in assignment.attachments" :key="file.id" class="attachment-item">
                  <i class="fas fa-file"></i>
                  <span>{{ file.name }}</span>
                  <a :href="file.url" target="_blank" class="download-btn">
                    <i class="fas fa-download"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Критерии оценки -->
        <div class="grading-section">
          <h2>Критерии оценки</h2>
          <div class="criteria-list">
            <div v-for="criterion in assignment.criteria" :key="criterion.id" class="criterion-item">
              <div class="criterion-header">
                <h3>{{ criterion.title }}</h3>
                <div class="points-input">
                  <input 
                    type="number" 
                    v-model="criterion.points" 
                    :max="criterion.maxPoints"
                    min="0"
                    class="form-input"
                  >
                  <span>/ {{ criterion.maxPoints }}</span>
                </div>
              </div>
              <p class="criterion-description">{{ criterion.description }}</p>
            </div>
          </div>

          <!-- Комментарии -->
          <div class="comments-section">
            <h3>Комментарии к работе</h3>
            <textarea 
              v-model="assignment.comments" 
              class="form-input"
              placeholder="Добавьте комментарии к работе студента..."
            ></textarea>
          </div>

          <!-- Итоговая оценка -->
          <div class="final-grade">
            <div class="grade-info">
              <h3>Итоговая оценка</h3>
              <div class="grade-display">
                <span class="grade-number">{{ calculateTotalGrade }}</span>
                <span class="grade-max">/ {{ maxPossibleGrade }}</span>
              </div>
            </div>
            <div class="grade-actions">
              <button class="save-btn" @click="saveGrade">
                <i class="fas fa-save"></i>
                Сохранить оценку
              </button>
              <button class="reject-btn" @click="rejectAssignment">
                <i class="fas fa-times"></i>
                Отправить на доработку
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CheckAssignment',
  setup() {
    const router = useRouter()
    
    // Тестовые данные
    const assignment = ref({
      id: 1,
      title: 'Практическое задание: Создание первой страницы',
      student: {
        name: 'Иван Петров',
        avatar: '/images/student_icon.png',
        group: 'Веб-разработка 2024'
      },
      submittedAt: '2024-03-15T14:30:00',
      timeSpent: '2 часа 15 минут',
      solution: `<!DOCTYPE html>
<html>
<head>
    <title>Моя первая страница</title>
</head>
<body>
    <h1>Привет, мир!</h1>
    <p>Это моя первая HTML страница.</p>
</body>
</html>`,
      attachments: [
        { id: 1, name: 'index.html', url: '#' },
        { id: 2, name: 'styles.css', url: '#' }
      ],
      criteria: [
        {
          id: 1,
          title: 'Структура HTML',
          description: 'Правильное использование HTML тегов и структуры документа',
          maxPoints: 10,
          points: 0
        },
        {
          id: 2,
          title: 'Стилизация',
          description: 'Применение CSS стилей и оформление страницы',
          maxPoints: 15,
          points: 0
        },
        {
          id: 3,
          title: 'Интерактивность',
          description: 'Добавление интерактивных элементов',
          maxPoints: 10,
          points: 0
        }
      ],
      comments: ''
    })

    const calculateTotalGrade = computed(() => {
      return assignment.value.criteria.reduce((total, criterion) => total + criterion.points, 0)
    })

    const maxPossibleGrade = computed(() => {
      return assignment.value.criteria.reduce((total, criterion) => total + criterion.maxPoints, 0)
    })

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const saveGrade = async () => {
      try {
        // TODO: API запрос для сохранения оценки
        console.log('Сохранение оценки:', {
          assignmentId: assignment.value.id,
          criteria: assignment.value.criteria,
          comments: assignment.value.comments,
          totalGrade: calculateTotalGrade.value
        })
        router.push('/teacher/dashboard')
      } catch (error) {
        console.error('Ошибка при сохранении оценки:', error)
      }
    }

    const rejectAssignment = () => {
      // TODO: Логика отправки на доработку
      console.log('Отправка на доработку:', assignment.value.id)
    }

    const goBack = () => {
      router.push('/teacher/dashboard')
    }

    return {
      assignment,
      calculateTotalGrade,
      maxPossibleGrade,
      formatDate,
      saveGrade,
      rejectAssignment,
      goBack
    }
  }
})
</script>

<style scoped>
.check-assignment {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.check-assignment-container {
  max-width: 1200px;
  margin: 0 auto;
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

.assignment-header {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--box-shadow);
}

.assignment-info h1 {
  font-size: 1.75rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.student-info img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.student-details h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.student-details p {
  color: #6c757d;
  font-size: 0.9rem;
}

.assignment-meta {
  display: flex;
  gap: 2rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.assignment-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignment-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.content-section,
.grading-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.content-section h2,
.grading-section h2 {
  font-size: 1.25rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #edf2f7;
}

.solution-content {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.code-block {
  background: #1e1e1e;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  color: #d4d4d4;
  font-family: 'Consolas', monospace;
}

.attachments h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid #edf2f7;
}

.attachment-item i {
  color: var(--primary-color);
}

.download-btn {
  margin-left: auto;
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: var(--transition);
}

.download-btn:hover {
  background: rgba(var(--primary-color-rgb), 0.1);
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.criterion-item {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.criterion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.criterion-header h3 {
  font-size: 1rem;
  margin: 0;
}

.points-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.points-input input {
  width: 60px;
  padding: 0.5rem;
  border: 2px solid #edf2f7;
  border-radius: var(--border-radius);
  text-align: center;
}

.criterion-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.comments-section {
  margin-bottom: 2rem;
}

.comments-section h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.comments-section textarea {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 2px solid #edf2f7;
  border-radius: var(--border-radius);
  resize: vertical;
}

.final-grade {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 2px solid #edf2f7;
}

.grade-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.grade-display {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.grade-max {
  font-size: 1.5rem;
  color: #6c757d;
}

.grade-actions {
  display: flex;
  gap: 1rem;
}

.save-btn,
.reject-btn {
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

.reject-btn {
  background: #fff5f5;
  color: #e53e3e;
}

.reject-btn:hover {
  background: #fed7d7;
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .assignment-content {
    grid-template-columns: 1fr;
  }
}
</style> 