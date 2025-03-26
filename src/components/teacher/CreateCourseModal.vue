<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Создание нового курса</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="title">Название курса</label>
          <input 
            type="text" 
            id="title" 
            v-model="form.title" 
            required
            placeholder="Введите название курса"
          >
        </div>

        <div class="form-group">
          <label for="description">Описание курса</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            required
            rows="4"
            placeholder="Опишите содержание курса"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="image">Изображение курса</label>
          <div class="image-upload">
            <input 
              type="file" 
              id="image" 
              accept="image/*"
              @change="handleImageUpload"
            >
            <div class="image-preview" v-if="imagePreview">
              <img :src="imagePreview" alt="Preview">
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="level">Уровень сложности</label>
          <select id="level" v-model="form.level" required>
            <option value="BEGINNER">Начинающий</option>
            <option value="INTERMEDIATE">Средний</option>
            <option value="ADVANCED">Продвинутый</option>
          </select>
        </div>

        <div class="form-group">
          <label for="category">Категория</label>
          <select id="category" v-model="form.category" required>
            <option value="Programming">Программирование</option>
            <option value="Design">Дизайн</option>
            <option value="Marketing">Маркетинг</option>
            <option value="Business">Бизнес</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeModal">
            Отмена
          </button>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Создание...' : 'Создать курс' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { courseService } from '@/services/api'

export default {
  name: 'CreateCourseModal',
  data() {
    return {
      form: {
        title: '',
        description: '',
        image: null,
        level: 'BEGINNER',
        category: 'Programming'
      },
      imagePreview: null,
      isLoading: false
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.form.image = file
        const reader = new FileReader()
        reader.onload = e => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    async handleSubmit() {
      try {
        this.isLoading = true
        
        // Подготавливаем данные для отправки
        const courseData = {
          name: this.form.title,
          description: this.form.description,
          level: this.form.level,
          category: this.form.category,
          imageFile: this.form.image
        }

        // Отправляем запрос на создание курса
        const createdCourse = await courseService.createCourse(courseData)
        
        // Закрываем модальное окно и уведомляем родительский компонент
        this.$emit('course-created', createdCourse)
        this.closeModal()
      } catch (error) {
        console.error('Ошибка при создании курса:', error)
        alert(error.message || 'Произошла ошибка при создании курса')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: var(--primary-color);
  padding: 2rem;
  border-radius: 24px 24px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
}

.modal-header h2 {
  color: white;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.75rem;
  text-align: center;
  width: fit-content;
}

.modal-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 2px;
}

.close-btn {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  font-size: 1.1rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) rotate(90deg);
}

.modal-form {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.modal-form::-webkit-scrollbar {
  width: 8px;
}

.modal-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 1rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #edf2f7;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.image-preview {
  width: 100%;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px dashed #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: var(--primary-color);
  background: #f0f7ff;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f1f1;
}

.cancel-btn,
.submit-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  color: var(--text-color);
}

.cancel-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.2);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 201, 240, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
    border-radius: 20px;
  }

  .modal-header {
    padding: 1.5rem;
    border-radius: 20px 20px 0 0;
  }

  .modal-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style> 