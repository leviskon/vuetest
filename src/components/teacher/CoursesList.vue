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

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteModal" class="delete-modal-overlay" @click="closeDeleteModal">
      <div class="delete-modal" @click.stop>
        <div class="delete-modal-header">
          <h3>Подтверждение удаления</h3>
          <button class="close-btn" @click="closeDeleteModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="delete-modal-body">
          <i class="fas fa-exclamation-triangle warning-icon"></i>
          <p>Вы действительно хотите удалить курс "{{ selectedCourse?.title }}"?</p>
          <p class="warning-text">Это действие невозможно отменить.</p>
        </div>
        <div class="delete-modal-footer">
          <button class="cancel-btn" @click="closeDeleteModal">Отмена</button>
          <button class="confirm-delete-btn" @click="confirmDelete">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно успешного удаления -->
    <div v-if="showSuccessModal" class="success-modal-overlay">
      <div class="success-modal">
        <div class="success-modal-body">
          <i class="fas fa-check-circle success-icon"></i>
          <p>Курс успешно удален</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
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
    const showDeleteModal = ref(false)
    const showSuccessModal = ref(false)
    const selectedCourse = ref(null)

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

    const deleteCourse = (course) => {
      selectedCourse.value = course
      showDeleteModal.value = true
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      selectedCourse.value = null
    }

    const showSuccessMessage = () => {
      showSuccessModal.value = true
      setTimeout(() => {
        showSuccessModal.value = false
      }, 2000) // Окно исчезнет через 2 секунды
    }

    const confirmDelete = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/courses/${selectedCourse.value.id}`, {
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

        emit('course-deleted', selectedCourse.value.id)
        closeDeleteModal()
        showSuccessMessage()
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
      formatLevel,
      showDeleteModal,
      showSuccessModal,
      closeDeleteModal,
      confirmDelete,
      selectedCourse
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

/* Стили для модального окна */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: modal-appear 0.3s ease;
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.delete-modal-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-color);
}

.delete-modal-body {
  text-align: center;
  margin-bottom: 24px;
}

.warning-icon {
  font-size: 3rem;
  color: #ffc107;
  margin-bottom: 16px;
}

.warning-text {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 8px;
}

.delete-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn, .confirm-delete-btn {
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f8f9fa;
  color: var(--text-color);
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-delete-btn {
  background: #dc3545;
  color: white;
}

.confirm-delete-btn:hover {
  background: #c82333;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стили для модального окна успешного удаления */
.success-modal-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: slide-in 0.3s ease, slide-out 0.3s ease 1.7s;
}

.success-modal {
  background: #4BB543;
  color: white;
  border-radius: 8px;
  padding: 16px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  min-width: 300px;
}

.success-modal-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.success-icon {
  font-size: 1.5rem;
}

.success-modal p {
  margin: 0;
  font-weight: 500;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>