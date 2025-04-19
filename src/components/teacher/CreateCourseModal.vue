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
            <div class="image-preview" :class="{ 'has-image': imagePreview }">
              <template v-if="!imagePreview">
                <div class="image-upload-content">
                  <i class="fas fa-cloud-upload-alt image-upload-icon"></i>
                  <span class="image-upload-text">Перетащите изображение или кликните для выбора</span>
                  <span class="image-upload-subtext">PNG, JPG или GIF до 5 МБ</span>
                </div>
              </template>
              <img v-else :src="imagePreview" alt="Preview">
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
            <option value="" disabled selected>Выберите категорию</option>
            <option value="PROGRAMMING">Программирование</option>
            <option value="DESIGN">Дизайн</option>
            <option value="MARKETING">Маркетинг</option>
            <option value="BUSINESS">Бизнес</option>
            <option value="LANGUAGE">Языки</option>
            <option value="OTHER">Другое</option>
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
        category: ''
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
        const formData = new FormData()
        formData.append('name', this.form.title)
        formData.append('description', this.form.description)
        formData.append('level', this.form.level)
        formData.append('category', this.form.category)
        
        if (this.form.image) {
          formData.append('imageFile', this.form.image)
        }

        const response = await fetch('http://localhost:8080/api/courses', {
          method: 'POST',
          credentials: 'include',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Ошибка при создании курса')
        }

        const data = await response.json()
        this.$emit('create', data)
        this.closeModal()
      } catch (error) {
        console.error('Ошибка при создании курса:', error)
        alert('Не удалось создать курс. Пожалуйста, попробуйте позже.')
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
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.modal-content {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-radius: 24px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center center;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 20px 20px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: white;
  font-weight: 700;
  text-align: center;
  border: none;
}

.modal-header h2::after {
  display: none;
}

.section-header h2::after,
.panel-header h2::after {
  display: none;
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
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  opacity: 0;
  animation: formGroupFadeIn 0.4s ease forwards;
}

@keyframes formGroupFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }
.form-group:nth-child(5) { animation-delay: 0.5s; }

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  color: #1e293b;
}

.form-group input:hover,
.form-group textarea:hover,
.form-group select:hover {
  border-color: var(--primary-color);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.1);
  transform: translateY(-1px);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #94a3b8;
  transition: color 0.3s ease;
}

.form-group input:focus::placeholder,
.form-group textarea:focus::placeholder {
  color: #cbd5e1;
}

.image-upload {
  position: relative;
  width: 100%;
  min-height: 200px;
  margin-top: 0.5rem;
}

.image-upload input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.image-preview {
  width: 100%;
  min-height: 200px;
  border-radius: 16px;
  background: linear-gradient(45deg, #f8fafc 25%, #f1f5f9 25%, #f1f5f9 50%, #f8fafc 50%, #f8fafc 75%, #f1f5f9 75%);
  background-size: 20px 20px;
  border: 2px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.image-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.05) 0%, rgba(var(--accent-color-rgb), 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview:hover::before {
  opacity: 1;
}

.image-preview:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--primary-color-rgb), 0.1);
}

.image-preview.has-image {
  border-style: solid;
  background: none;
  padding: 0;
}

.image-preview.has-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.image-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  text-align: center;
  z-index: 1;
}

.image-upload-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  opacity: 0.5;
  transition: all 0.3s ease;
}

.image-preview:hover .image-upload-icon {
  opacity: 0.8;
  transform: scale(1.1);
}

.image-upload-text {
  font-size: 1rem;
  font-weight: 500;
}

.image-upload-subtext {
  font-size: 0.875rem;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  opacity: 0;
  animation: formGroupFadeIn 0.4s ease forwards 0.6s;
}

.cancel-btn,
.submit-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cancel-btn {
  background: #f1f5f9;
  color: #475569;
}

.cancel-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

.submit-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  box-shadow: 0 4px 15px rgba(var(--primary-color-rgb), 0.2);
  position: relative;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(var(--primary-color-rgb), 0.3);
}

.submit-btn:hover::before {
  opacity: 1;
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
    max-height: 95vh;
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
    flex-direction: column-reverse;
    gap: 0.75rem;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    padding: 0.875rem;
  }
}
</style>