<template>
  <div class="assignments-container">
    <div v-if="assignments.length === 0" class="empty-state">
      <i class="fas fa-check-circle"></i>
      <p>Нет заданий, ожидающих проверки</p>
    </div>

    <div v-else class="assignments-list">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-item">
        <div class="assignment-info">
          <div class="assignment-header">
            <h3>{{ assignment.assignmentTitle }}</h3>
          </div>
          <div class="assignment-details">
            <div class="detail">
              <i class="fas fa-book"></i>
              <span>{{ assignment.courseTitle }}</span>
            </div>
            <div class="detail">
              <i class="fas fa-user"></i>
              <span>{{ assignment.studentName }}</span>
            </div>
          </div>
        </div>
        <div class="assignment-actions">
          <span class="submission-time">
            <i class="fas fa-clock"></i>
            {{ formatDate(assignment.submittedAt) }}
          </span>
          <div class="action-buttons">
            <button class="action-btn review" @click="reviewAssignment(assignment)">
              <i class="fas fa-eye"></i>
              Проверить
            </button>
            <button class="action-btn download" @click="downloadSubmission(assignment)">
              <i class="fas fa-download"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PendingAssignments',
  props: {
    assignments: {
      type: Array,
      required: true
    }
  },
  setup() {
    const router = useRouter()
    
    const reviewAssignment = (assignment) => {
      router.push(`/teacher/assignments/${assignment.id}/check`)
    }

    const downloadSubmission = (assignment) => {
      // TODO: Реализовать скачивание файлов
      console.log('Скачивание файлов для задания:', assignment.id)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      reviewAssignment,
      downloadSubmission,
      formatDate
    }
  }
}
</script>

<style scoped>
.assignments-container {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6c757d;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #4cc9f0;
}

.assignments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.assignment-item {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.assignment-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.assignment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.assignment-header {
  display: flex;
  align-items: center;
}

.assignment-header h3 {
  color: var(--text-color);
  margin: 0;
  font-size: 1.1rem;
}

.assignment-details {
  display: flex;
  gap: 1.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.assignment-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.submission-time {
  color: #6c757d;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.action-btn.review {
  background: var(--primary-color);
  color: white;
}

.action-btn.review:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.action-btn.download {
  background: #f8f9fa;
  color: var(--text-color);
}

.action-btn.download:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .assignment-item {
    flex-direction: column;
    gap: 1rem;
  }

  .assignment-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .submission-time {
    order: -1;
  }

  .assignment-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 