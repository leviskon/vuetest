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
                  {{ formatCategory(category) }}
                </option>
              </select>
              <select v-model="selectedLevel" @change="filterCourses">
                <option value="">Все уровни</option>
                <option v-for="level in levels" :key="level" :value="level">
                  {{ formatLevel(level) }}
                </option>
              </select>
              <select v-model="sortBy" @change="filterCourses">
                <option value="popular">По популярности</option>
                <option value="newest">По новизне</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Загрузка курсов...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <div v-else class="courses-grid">
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-image" :style="{ backgroundColor: '#4361ee' }">
              <img 
                v-if="course.imageUrl" 
                :src="getImageUrl(course.imageUrl)" 
                :alt="course.name"
                @error="handleImageError"
                class="course-img"
              >
              <div v-else class="image-placeholder">{{ course.name[0] }}</div>
            </div>
            <div class="course-card__content">
              <h3>{{ course.name }}</h3>
              <p>{{ course.description }}</p>
              <div class="course-meta">
                <span class="course-category">{{ formatCategory(course.category) }}</span>
                <span class="course-level">{{ formatLevel(course.level) }}</span>
                <span class="course-duration">{{ course.totalStudents }} студентов</span>
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
      categories: ['PROGRAMMING', 'DESIGN', 'MARKETING', 'BUSINESS', 'LANGUAGE', 'OTHER'],
      levels: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      courses: [],
      isLoading: false,
      error: null
    }
  },
  computed: {
    filteredCourses() {
      let filtered = [...this.courses];

      // Поиск по названию
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(course => 
          course.name.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        );
      }

      // Фильтр по категории
      if (this.selectedCategory) {
        console.log('Фильтрация по категории:', this.selectedCategory);
        console.log('До фильтрации:', filtered.length);
        filtered = filtered.filter(course => {
          // Приводим обе строки к верхнему регистру для сравнения
          const courseCategory = (course.category || '').toUpperCase();
          const selectedCategory = this.selectedCategory.toUpperCase();
          console.log('Категория курса:', courseCategory, 'Выбранная категория:', selectedCategory);
          return courseCategory === selectedCategory;
        });
        console.log('После фильтрации:', filtered.length);
      }

      // Фильтр по уровню
      if (this.selectedLevel) {
        filtered = filtered.filter(course => course.level === this.selectedLevel);
      }

      // Сортировка
      switch (this.sortBy) {
        case 'popular':
          filtered.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      return filtered;
    }
  },
  methods: {
    async loadCourses() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:8080/api/courses', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при загрузке курсов');
        }

        const data = await response.json();
        console.log('Полученные данные курсов:', data);
        
        // Логируем категории курсов
        const courseCategories = data.map(course => course.category);
        console.log('Категории курсов:', courseCategories);
        console.log('Уникальные категории курсов:', [...new Set(courseCategories)]);
        
        this.courses = data;
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
        this.error = 'Не удалось загрузить курсы. Пожалуйста, попробуйте позже.';
      } finally {
        this.isLoading = false;
      }
    },
    handleImageError(event) {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
      const placeholder = event.target.parentElement.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    },
    formatCategory(category) {
      if (!category) return '';
      
      // Приводим категорию к верхнему регистру для сравнения
      const upperCategory = category.toUpperCase();
      
      const categoryMap = {
        'PROGRAMMING': 'Программирование',
        'DESIGN': 'Дизайн',
        'MARKETING': 'Маркетинг',
        'BUSINESS': 'Бизнес',
        'LANGUAGE': 'Языки',
        'OTHER': 'Другое'
      };
      return categoryMap[upperCategory] || category;
    },
    formatLevel(level) {
      const levelMap = {
        'BEGINNER': 'Начинающий',
        'INTERMEDIATE': 'Средний',
        'ADVANCED': 'Продвинутый'
      };
      return levelMap[level] || level;
    },
    getImageUrl(imageUrl) {
      if (!imageUrl) {
        console.log('imageUrl отсутствует');
        return null;
      }
      
      console.log('Исходный imageUrl:', imageUrl);
      
      // Если URL уже полный, возвращаем его
      if (imageUrl.startsWith('http')) {
        console.log('Полный URL:', imageUrl);
        return imageUrl;
      }
      
      // Если URL начинается с /uploads, добавляем только домен
      if (imageUrl.startsWith('/uploads')) {
        const fullUrl = `http://localhost:8080${imageUrl}`;
        console.log('URL с /uploads:', fullUrl);
        return fullUrl;
      }
      
      // В остальных случаях добавляем путь к директории с изображениями
      const fullUrl = `http://localhost:8080/uploads/courses/images/${imageUrl}`;
      console.log('Сформированный URL:', fullUrl);
      return fullUrl;
    },
    filterCourses() {
      // Метод для дополнительной логики фильтрации, если потребуется
    }
  },
  mounted() {
    this.loadCourses();
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
  overflow: hidden;
  position: relative;
}

.course-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.course-card__content {
  padding: 1.5rem;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0 1rem;
  font-size: 0.9rem;
  color: #6c757d;
  flex-wrap: wrap;
}

.course-category,
.course-level,
.course-duration {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  display: inline-block;
}

.course-category {
  color: var(--primary-color);
  background: rgba(76, 201, 240, 0.1);
}

.course-level {
  color: var(--accent-color);
  background: rgba(255, 107, 107, 0.1);
}

.course-duration {
  color: #6c757d;
  background: #f8f9fa;
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