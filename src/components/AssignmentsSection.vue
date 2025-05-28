<template>
  <section class="assignments-section" id="assignments">
    <h2>Текущие задания</h2>
    <div class="assignments-container">
      <div v-for="assignment in assignments" :key="assignment.id" class="assignment-card">
        <div class="assignment-course-title">
          <span class="assignment-course-icon">📚</span>
          Задание к курсу <span class="assignment-course-name-highlight">{{ assignment.courseName }}</span>
        </div>
        <div class="assignment-info">
          <h3 class="assignment-title">{{ assignment.title }}</h3>
          <p class="assignment-description">{{ assignment.description }}</p>
        </div>
        <div class="assignment-meta">
          <div :class="['assignment-deadline', getDeadlineColorClass(assignment)]">
            Срок: {{ formatDate(assignment.dueDate) }}
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn btn-primary" @click="goToAssignment(assignment)">
            Перейти к заданию
          </button>
        </div>
        <div class="assignment-status" :class="getStatusClass(assignment)">
          <span :class="['status-dot', getCourseDotColor(assignment.courseName)]"></span>
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
  data() {
    return {
      courseDotColors: {},
      dotPalette: [
        'dot-bright-red',    // #ff1744
        'dot-bright-orange', // #ff9100
        'dot-bright-yellow', // #ffd600
        'dot-bright-green',  // #00e676
        'dot-bright-blue',   // #2979ff
        'dot-bright-purple', // #d500f9
        'dot-bright-pink',   // #ff4081
        'dot-bright-cyan',   // #00e5ff
        'dot-bright-lime',   // #c6ff00
        'dot-bright-teal',   // #1de9b6
      ]
    }
  },
  created() {
    // При загрузке компонента читаем цвета из localStorage
    const saved = localStorage.getItem('courseDotColors');
    if (saved) {
      try {
        this.courseDotColors = JSON.parse(saved);
      } catch (e) {
        this.courseDotColors = {};
      }
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
    getDeadlineColorClass(assignment) {
      const today = new Date();
      const dueDate = new Date(assignment.dueDate);
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 3 && diffDays >= 1) return 'deadline-red';
      if (diffDays <= 5 && diffDays > 3) return 'deadline-orange';
      if (diffDays > 5) return 'deadline-green';
      if (diffDays < 1) return 'deadline-red'; // просрочено
      return '';
    },
    getCourseDotColor(courseName) {
      if (!this.courseDotColors[courseName]) {
        // Выбираем случайный цвет из палитры, не повторяя уже занятые
        const usedColors = Object.values(this.courseDotColors);
        const availableColors = this.dotPalette.filter(c => !usedColors.includes(c));
        let color;
        if (availableColors.length > 0) {
          color = availableColors[Math.floor(Math.random() * availableColors.length)];
        } else {
          color = this.dotPalette[Math.floor(Math.random() * this.dotPalette.length)];
        }
        this.courseDotColors[courseName] = color;
        // Сохраняем в localStorage
        localStorage.setItem('courseDotColors', JSON.stringify(this.courseDotColors));
      }
      return this.courseDotColors[courseName];
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    goToAssignment(assignment) {
      console.log('[AssignmentsSection] Переход к заданию:', assignment);
      this.$router.push({
        path: `/assignment/${assignment.id}`,
        query: {
          title: assignment.title,
          description: assignment.description,
          deadline: assignment.dueDate || assignment.deadline,
          courseName: assignment.course?.name || '',
          status: assignment.status || '',
          courseId: assignment.course?.id
        }
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
  border: 3px solid #b3c6e6;
  position: relative;
  transition: var(--transition);
  margin-bottom: 2rem;
}

.assignment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.assignment-course-title {
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  font-weight: 700;
  color: #2a4d9b;
  border-radius: 10px 10px 0 0;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  margin-bottom: 0.7rem;
  letter-spacing: 0.01em;
}

.assignment-course-icon {
  margin-right: 0.5em;
  font-size: 1.2em;
}

.assignment-course-name-highlight {
  font-weight: 800;
  color: #1a237e;
  margin-left: 0.3em;
  background: linear-gradient(90deg, #e0e7ff 0%, #f0f4ff 100%);
  border-radius: 8px;
  padding: 2px 12px;
  display: inline-block;
}

.assignment-info {
  margin-bottom: 0.5rem;
}

.assignment-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #222;
}
.assignment-description {
  font-size: 1rem;
  color: #5a5a5a;
  margin-bottom: 0.2rem;
}

.assignment-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.assignment-deadline {
  font-size: 0.98rem;
  color: #6c757d;
}

.deadline-red {
  color: #e63946;
  font-weight: 700;
}

.deadline-orange {
  color: #f77f00;
  font-weight: 700;
}

.deadline-green {
  color: #43a047;
  font-weight: 700;
}

.assignment-actions {
  margin-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
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

/* Цвета для разных курсов */
.dot-bright-red { background-color: #ff1744; }
.dot-bright-orange { background-color: #ff9100; }
.dot-bright-yellow { background-color: #ffd600; }
.dot-bright-green { background-color: #00e676; }
.dot-bright-blue { background-color: #2979ff; }
.dot-bright-purple { background-color: #d500f9; }
.dot-bright-pink { background-color: #ff4081; }
.dot-bright-cyan { background-color: #00e5ff; }
.dot-bright-lime { background-color: #c6ff00; }
.dot-bright-teal { background-color: #1de9b6; }

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