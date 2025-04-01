<template>
  <div class="teacher-calendar">
    <div class="calendar-header">
      <h2>Календарь занятий</h2>
      <div class="calendar-controls">
        <button @click="previousMonth">&lt;</button>
        <span class="current-month">{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="nextMonth">&gt;</button>
      </div>
    </div>
    
    <div class="calendar-grid">
      <div class="weekdays">
        <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="days">
        <div v-for="day in calendarDays" 
             :key="day.date" 
             class="day"
             :class="{
               'other-month': !day.currentMonth,
               'has-events': day.events.length > 0,
               'today': isToday(day.date)
             }"
             @click="showDayEvents(day)">
          <span class="day-number">{{ day.dayNumber }}</span>
          <div v-if="day.events.length > 0" class="event-indicator"></div>
        </div>
      </div>
    </div>

    <!-- Модальное окно с событиями дня -->
    <div v-if="selectedDay" class="day-events-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>События на {{ formatDate(selectedDay.date) }}</h3>
          <button class="close-button" @click="selectedDay = null">&times;</button>
        </div>
        <div class="events-list">
          <div v-if="selectedDay.events.length === 0" class="no-events">
            Нет запланированных занятий
          </div>
          <div v-else v-for="event in selectedDay.events" 
               :key="event.id" 
               class="event-item">
            <div class="event-time">{{ event.time }}</div>
            <div class="event-info">
              <h4>{{ event.title }}</h4>
              <p>{{ event.group }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherCalendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDay: null,
      weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      calendarDays: [],
      events: [
        {
          id: 1,
          date: '2024-03-20',
          time: '10:00',
          title: 'Математика',
          group: 'Группа А-101'
        },
        // Добавьте больше событий по необходимости
      ]
    }
  },
  computed: {
    currentMonthName() {
      return this.currentDate.toLocaleString('ru-RU', { month: 'long' });
    },
    currentYear() {
      return this.currentDate.getFullYear();
    }
  },
  methods: {
    generateCalendar() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      this.calendarDays = [];
      
      // Добавляем дни предыдущего месяца
      const firstDayWeekday = firstDay.getDay() || 7;
      for (let i = firstDayWeekday - 1; i > 0; i--) {
        const date = new Date(year, month, -i);
        this.calendarDays.push({
          date: date,
          dayNumber: date.getDate(),
          currentMonth: false,
          events: this.getEventsForDate(date)
        });
      }
      
      // Добавляем дни текущего месяца
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        this.calendarDays.push({
          date: date,
          dayNumber: i,
          currentMonth: true,
          events: this.getEventsForDate(date)
        });
      }
      
      // Добавляем дни следующего месяца
      const remainingDays = 42 - this.calendarDays.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        this.calendarDays.push({
          date: date,
          dayNumber: date.getDate(),
          currentMonth: false,
          events: this.getEventsForDate(date)
        });
      }
    },
    getEventsForDate(date) {
      const dateString = this.formatDate(date);
      return this.events.filter(event => event.date === dateString);
    },
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
      this.generateCalendar();
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
      this.generateCalendar();
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    },
    formatDate(date) {
      return date.toISOString().split('T')[0];
    },
    showDayEvents(day) {
      this.selectedDay = day;
    }
  },
  mounted() {
    this.generateCalendar();
  }
}
</script>

<style scoped>
.teacher-calendar {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.calendar-controls button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px 10px;
}

.current-month {
  font-size: 1.2rem;
  font-weight: 600;
}

.calendar-grid {
  display: grid;
  gap: 10px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  aspect-ratio: 1;
  border: 1px solid #eee;
  padding: 5px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.day:hover {
  background-color: #f5f5f5;
}

.other-month {
  color: #ccc;
}

.has-events {
  background-color: #f0f7ff;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background-color: #4CAF50;
  border-radius: 50%;
  position: absolute;
  bottom: 5px;
}

.today {
  background-color: #e3f2fd;
}

.day-events-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.events-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.event-time {
  font-weight: 600;
  min-width: 80px;
}

.event-info h4 {
  margin: 0;
  font-size: 1rem;
}

.event-info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  color: #666;
}

.no-events {
  text-align: center;
  color: #666;
  padding: 20px;
}
</style> 