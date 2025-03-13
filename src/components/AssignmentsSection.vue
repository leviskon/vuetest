<template>
  <section class="assignments-section" id="assignments">
    <h2>Текущие задания</h2>
    <div class="assignments-container">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-status" :class="getStatusClass(assignment)">
          <span v-if="assignment.status === 'pending'" class="status-dot pending"></span>
          <span v-else-if="assignment.status === 'completed'" class="status-dot completed"></span>
          <span v-else class="status-dot overdue"></span>
        </div>
        <div class="assignment-info">
          <h3>{{ assignment.title }}</h3>
          <p>{{ assignment.description }}</p>
        </div>
        <div class="assignment-meta">
          <div class="assignment-course">{{ assignment.courseName }}</div>
          <div class="assignment-deadline" :class="{ 'deadline-close': isDeadlineClose(assignment) }">
            Срок: {{ formatDate(assignment.deadline) }}
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn btn-primary" @click="$router.push(`/assignment/${assignment.id}`)">
            Перейти к заданию
          </button>
        </div>
      </div>
      <div v-if="assignments.length === 0" class="no-assignments">
        <p>У вас нет активных заданий</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AssignmentsSection',
  props: {
    assignments: {
      type: Array,
      required: true
    }
  },
  methods: {
    getStatusClass(assignment) {
      if (assignment.status === 'completed') return 'status-completed';
      if (new Date() > assignment.deadline) return 'status-overdue';
      return 'status-pending';
    },
    isDeadlineClose(assignment) {
      const today = new Date();
      const diffTime = assignment.deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }
}
</script>

<style scoped>
.assignments-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  height: 600px;
  display: flex;
  flex-direction: column;
}

.assignments-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.assignments-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.assignments-container::-webkit-scrollbar {
  width: 8px;
}

.assignments-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.assignments-container::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

.assignments-container::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}

.assignment-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #f1f1f1;
  position: relative;
  transition: var(--transition);
}

.assignment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.assignment-card.status-completed {
  border-left-color: #4cc9f0;
}

.assignment-card.status-pending {
  border-left-color: #f77f00;
}

.assignment-card.status-overdue {
  border-left-color: #e63946;
}

.assignment-status {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-dot.pending {
  background-color: #f77f00;
}

.status-dot.completed {
  background-color: #4cc9f0;
}

.status-dot.overdue {
  background-color: #e63946;
}

.assignment-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.assignment-info p {
  color: #6c757d;
  font-size: 0.95rem;
}

.assignment-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.assignment-course {
  font-size: 0.9rem;
  background-color: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  color: var(--secondary-color);
  font-weight: 600;
}

.assignment-deadline {
  font-size: 0.9rem;
  color: #6c757d;
}

.deadline-close {
  color: #e63946;
  font-weight: 600;
}

.assignment-actions {
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
}

.no-assignments {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

@media (max-width: 1024px) {
  .assignments-section {
    height: 500px;
  }
}

@media (max-width: 576px) {
  .assignment-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 