<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <div class="courses-header">
          <button class="back-button" @click="$router.push('/dashboard')">
            <span class="back-arrow">←</span>
            Назад
          </button>
          <h1>Все курсы</h1>
          <div class="search-filters">
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Поиск курсов..."
                @input="filterCourses"
              >
              <span class="search-icon">🔍</span>
            </div>
            <div class="filters">
              <select v-model="selectedCategory" @change="filterCourses">
                <option value="">Все категории</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <select v-model="selectedLevel" @change="filterCourses">
                <option value="">Все уровни</option>
                <option v-for="level in levels" :key="level" :value="level">
                  {{ level }}
                </option>
              </select>
              <select v-model="sortBy" @change="filterCourses">
                <option value="popular">По популярности</option>
                <option value="newest">По новизне</option>
                <option value="price-asc">По цене (возрастание)</option>
                <option value="price-desc">По цене (убывание)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="courses-grid">
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-image" :style="{ backgroundColor: course.color }">
              <div class="image-placeholder">{{ course.title[0] }}</div>
            </div>
            <div class="course-card__content">
              <div class="course-category">{{ course.category }}</div>
              <h3>{{ course.title }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <div class="course-level">{{ course.level }}</div>
                <div class="course-duration">{{ course.duration }}</div>
                <div class="course-price">{{ course.price }} ₽</div>
              </div>
              <div class="course-card__footer">
                <button class="btn btn-primary" @click="$router.push(`/course/${course.id}`)">
                  Подробнее
                </button>
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

export default {
  name: 'AllCourses',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedLevel: '',
      sortBy: 'popular',
      categories: ['Веб-разработка', 'Мобильная разработка', 'Дизайн', 'Аналитика данных', 'Искусственный интеллект'],
      levels: ['Начинающий', 'Средний', 'Продвинутый'],
      courses: [
        {
          id: 1,
          title: 'Веб-разработка с нуля',
          description: 'Полный курс по созданию современных веб-сайтов с использованием HTML, CSS и JavaScript',
          category: 'Веб-разработка',
          level: 'Начинающий',
          duration: '6 месяцев',
          price: 29999,
          color: '#4361ee',
          enrolled: 1200
        },
        {
          id: 2,
          title: 'React и Redux',
          description: 'Создание современных веб-приложений с использованием React и Redux',
          category: 'Веб-разработка',
          level: 'Средний',
          duration: '4 месяца',
          price: 39999,
          color: '#3f37c9',
          enrolled: 800
        },
        {
          id: 3,
          title: 'UI/UX Дизайн',
          description: 'Создание пользовательских интерфейсов и улучшение пользовательского опыта',
          category: 'Дизайн',
          level: 'Средний',
          duration: '3 месяца',
          price: 34999,
          color: '#f72585',
          enrolled: 600
        },
        {
          id: 4,
          title: 'Python для Data Science',
          description: 'Анализ данных и машинное обучение с использованием Python',
          category: 'Аналитика данных',
          level: 'Продвинутый',
          duration: '5 месяцев',
          price: 44999,
          color: '#4cc9f0',
          enrolled: 900
        },
        {
          id: 5,
          title: 'iOS Разработка',
          description: 'Создание приложений для iOS с использованием Swift',
          category: 'Мобильная разработка',
          level: 'Средний',
          duration: '4 месяца',
          price: 49999,
          color: '#3a0ca3',
          enrolled: 700
        },
        {
          id: 6,
          title: 'Машинное обучение',
          description: 'Основы машинного обучения и нейронных сетей',
          category: 'Искусственный интеллект',
          level: 'Продвинутый',
          duration: '6 месяцев',
          price: 59999,
          color: '#7209b7',
          enrolled: 500
        }
      ]
    }
  },
  computed: {
    filteredCourses() {
      let filtered = [...this.courses];

      // Поиск по названию
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        );
      }

      // Фильтр по категории
      if (this.selectedCategory) {
        filtered = filtered.filter(course => course.category === this.selectedCategory);
      }

      // Фильтр по уровню
      if (this.selectedLevel) {
        filtered = filtered.filter(course => course.level === this.selectedLevel);
      }

      // Сортировка
      switch (this.sortBy) {
        case 'popular':
          filtered.sort((a, b) => b.enrolled - a.enrolled);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id - a.id);
          break;
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }

      return filtered;
    }
  },
  methods: {
    filterCourses() {
      // Метод для дополнительной логики фильтрации, если потребуется
    }
  }
}
</script>

<style scoped>
.courses-header {
  margin-bottom: 2rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
}

.back-button:hover {
  color: var(--primary-color);
}

.back-arrow {
  font-size: 1.2rem;
  line-height: 1;
}

.courses-header h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--text-color);
}

.search-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.search-box input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filters select {
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  color: var(--text-color);
  background-color: white;
  cursor: pointer;
  transition: var(--transition);
}

.filters select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.course-image {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.course-card__content {
  padding: 1.5rem;
}

.course-category {
  font-size: 0.9rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.course-card__content h3 {
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.course-card__content p {
  color: #6c757d;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.course-level {
  background-color: #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.course-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-price {
  font-weight: 600;
  color: var(--primary-color);
}

.course-card__footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .back-button {
    position: static;
    margin-bottom: 1rem;
  }
  
  .courses-header h1 {
    margin-bottom: 1rem;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    width: 100%;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .dashboard-container {
    padding: 1rem;
  }

  .course-meta {
    flex-wrap: wrap;
  }
}
</style> 