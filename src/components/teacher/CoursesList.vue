<template>
  <div class="courses-container" :class="viewMode">
    <div v-if="viewMode === 'grid'" class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="course-image">
          <img 
            v-if="course.image" 
            :src="getImageUrl(course.image)" 
            :alt="course.title"
            crossorigin="use-credentials"
            @error="handleImageError"
          >
          <div v-else class="image-placeholder">{{ course.title[0] }}</div>
          <div class="course-overlay">
            <button class="edit-btn" @click="editCourse(course)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" @click="deleteCourse(course)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="course-info">
          <h3>{{ course.title }}</h3>
          <p class="course-description">{{ course.description }}</p>
          <div class="course-meta">
            <span class="course-category">{{ formatCategory(course.category) }}</span>
            <span class="course-level">{{ formatLevel(course.level) }}</span>
          </div>
          <div class="course-stats">
            <div class="stat">
              <i class="fas fa-users"></i>
              <span>{{ course.students }} студентов</span>
            </div>
            <div class="stat">
              <i class="fas fa-chart-line"></i>
              <span>{{ course.progress }}% завершено</span>
            </div>
            <div class="stat">
              <i class="fas fa-star"></i>
              <span>{{ course.rating }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="courses-list">
      <div v-for="course in courses" :key="course.id" class="course-item">
        <div class="course-item-main">
          <div class="course-item-info">
            <h3>{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
          </div>
          <div class="course-item-stats">
            <div class="stat">
              <i class="fas fa-users"></i>
              <span>{{ course.students }} студентов</span>
            </div>
            <div class="stat">
              <i class="fas fa-chart-line"></i>
              <span>{{ course.progress }}% завершено</span>
            </div>
            <div class="stat">
              <i class="fas fa-star"></i>
              <span>{{ course.rating }}</span>
            </div>
          </div>
        </div>
        <div class="course-item-actions">
          <button class="action-btn" @click="editCourse(course)">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn" @click="deleteCourse(course)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'CoursesList',
  props: {
    courses: {
      type: Array,
      required: true
    },
    viewMode: {
      type: String,
      default: 'grid'
    }
  },
  setup(props, { emit }) {
    const router = useRouter()

    const formatCategory = (category) => {
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
    }

    const formatLevel = (level) => {
      const levelMap = {
        'BEGINNER': 'Начинающий',
        'INTERMEDIATE': 'Средний',
        'ADVANCED': 'Продвинутый'
      };
      return levelMap[level] || level;
    }

    const handleImageError = (event) => {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
      const placeholder = event.target.parentElement.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.style.display = 'flex';
      }
    }

    const getImageUrl = (imageUrl) => {
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
    }

    const editCourse = (course) => {
      router.push({
        name: 'EditCourse',
        params: { id: course.id }
      })
    }

    const deleteCourse = async (course) => {
      if (!confirm('Вы уверены, что хотите удалить этот курс?')) {
        return
      }

      try {
        const response = await fetch(`http://localhost:8080/api/courses/${course.id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Ошибка при удалении курса')
        }

        emit('course-deleted', course.id)
      } catch (error) {
        console.error('Ошибка при удалении курса:', error)
        alert('Не удалось удалить курс. Пожалуйста, попробуйте позже.')
      }
    }

    return {
      editCourse,
      deleteCourse,
      handleImageError,
      getImageUrl,
      formatCategory,
      formatLevel
    }
  }
})
</script>

<style scoped>
.courses-container {
  width: 100%;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.course-image {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.course-card:hover .course-overlay {
  opacity: 1;
}

.edit-btn, .delete-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: white;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: white;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.course-info {
  padding: 1.5rem;
}

.course-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.course-description {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.course-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.course-category,
.course-level {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  background: #f8f9fa;
  font-size: 0.85rem;
}

.course-category {
  color: var(--primary-color);
  background: rgba(76, 201, 240, 0.1);
}

.course-level {
  color: var(--accent-color);
  background: rgba(255, 107, 107, 0.1);
}

.course-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.courses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-item {
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--box-shadow);
  transition: var(--transition);
}

.course-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-item-main {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.course-item-info {
  flex: 1;
}

.course-item-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.course-item-stats {
  display: flex;
  gap: 1.5rem;
}

.course-item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f8f9fa;
  color: var(--text-color);
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background: var(--primary-color);
  color: white;
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .course-item-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .course-item-stats {
    flex-wrap: wrap;
  }
}
</style> 