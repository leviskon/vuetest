<template>
  <section class="calendar-section" id="calendar">
    <h2>Календарь</h2>
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="btn-icon" @click="prevMonth">
          <span>←</span>
        </button>
        <h3>{{ currentMonthName }} {{ currentYear }}</h3>
        <button class="btn-icon" @click="nextMonth">
          <span>→</span>
        </button>
      </div>
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="calendar-days">
        <div 
          v-for="day in calendarDays" 
          :key="day.date" 
          class="calendar-day"
          :class="{ 
            'other-month': !day.currentMonth, 
            'has-events': day.events.length > 0,
            'today': isToday(day.date)
          }"
          @click="selectDay(day)"
        >
          <span class="day-number">{{ day.dayNumber }}</span>
          <div v-if="day.events.length > 0" class="event-dot"></div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="selectedDay && selectedDayEvents.length > 0" class="day-events" :class="{ 'fade-out': isClosing }">
    <h4>События на {{ formatDate(selectedDay) }}</h4>
    <div v-for="event in selectedDayEvents" :key="event.id" class="event-item">
      <div class="event-time">{{ formatTime(event.time) }}</div>
      <div class="event-info">
        <div class="event-title">{{ event.title }}</div>
        <div class="event-description">{{ event.description }}</div>
      </div>
    </div>
    <div class="timer-bar"></div>
  </div>
</template>

<script>
export default {
  name: 'CalendarSection',
  data() {
    return {
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDay: null,
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      isClosing: false,
      closeTimer: null
    }
  },
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  computed: {
    currentMonthName() {
      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
      ];
      return months[this.currentMonth];
    },
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      let firstDayOfWeek = firstDay.getDay();
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
      
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
        days.push({
          date: date,
          dayNumber: date.getDate(),
          currentMonth: false,
          events: this.getEventsForDay(date)
        });
      }
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          date: date,
          dayNumber: i,
          currentMonth: true,
          events: this.getEventsForDay(date)
        });
      }
      
      const daysNeeded = 42 - days.length;
      for (let i = 1; i <= daysNeeded; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({
          date: date,
          dayNumber: i,
          currentMonth: false,
          events: this.getEventsForDay(date)
        });
      }
      
      return days;
    },
    selectedDayEvents() {
      if (!this.selectedDay) return [];
      return this.getEventsForDay(this.selectedDay);
    }
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.selectedDay = null;
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.selectedDay = null;
    },
    selectDay(day) {
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
      }
      
      this.selectedDay = day.date;
      this.isClosing = false;
      
      this.closeTimer = setTimeout(() => {
        this.isClosing = true;
        setTimeout(() => {
          this.selectedDay = null;
        }, 300);
      }, 5000);
    },
    getEventsForDay(date) {
      if (!date) return [];
      return this.events.filter(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
    formatTime(time) {
      return time;
    }
  }
}
</script>

<style scoped>
.calendar-section {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
  height: 600px;
  display: flex;
  flex-direction: column;
}

.calendar-section h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.calendar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  background: white;
  padding: 0.5rem;
  z-index: 2;
}

.calendar-header h3 {
  font-size: 1.2rem;
  margin: 0;
}

.btn-icon {
  width: 32px;
  height: 32px;
  font-size: 1rem;
  border: none;
  background: var(--light-color);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: var(--primary-color);
  color: white;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  position: sticky;
  top: 60px;
  background: white;
  padding: 0.5rem;
  z-index: 2;
}

.weekday {
  padding: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-color);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  padding: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1/1;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  position: relative;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  background: var(--light-color);
}

.calendar-day:hover {
  background: rgba(67, 97, 238, 0.1);
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.today {
  background: rgba(67, 97, 238, 0.15);
  font-weight: 600;
}

.day-number {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary-color);
  margin-top: 2px;
}

.day-events {
  position: fixed;
  top: 80px;
  right: 20px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;
  animation: slideInRight 0.3s ease;
}

.day-events.fade-out {
  animation: fadeOutRight 0.3s ease forwards;
}

.timer-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  animation: timer 5s linear forwards;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.event-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: var(--border-radius);
  background: var(--light-color);
  animation: fadeInUp 0.3s ease;
  transition: var(--transition);
}

.event-item:hover {
  transform: translateY(-2px);
  background: rgba(67, 97, 238, 0.1);
}

.event-time {
  font-weight: 600;
  color: var(--primary-color);
  min-width: 60px;
}

.event-info {
  flex: 1;
}

.event-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.event-description {
  font-size: 0.9rem;
  color: #6c757d;
}

@media (max-width: 1024px) {
  .calendar-section {
    height: 500px;
  }
}

@media (max-width: 576px) {
  .calendar-weekdays, .calendar-days {
    font-size: 0.8rem;
  }
  
  .event-item {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 