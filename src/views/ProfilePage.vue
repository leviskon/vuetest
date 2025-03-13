<template>
  <div class="dashboard">
    <Header />
    
    <main class="main">
      <div class="dashboard-container">
        <div class="back-button-container">
          <button class="back-button" @click="$router.push('/dashboard')">
            <span class="back-arrow">←</span>
            Вернуться в панель студента
          </button>
        </div>

        <div class="profile-page">
          <div class="profile-header">
            <h1>Мой профиль</h1>
            <button 
              class="btn btn-primary" 
              @click="toggleEditMode"
              v-if="!isEditMode"
            >
              Редактировать профиль
            </button>
          </div>

          <div class="profile-content">
            <div class="profile-avatar">
              <div class="avatar-container">
                <img :src="user.avatar" :alt="user.name" class="avatar-image">
                <div v-if="isEditMode" class="avatar-upload">
                  <input 
                    type="file" 
                    ref="avatarInput" 
                    @change="handleAvatarChange" 
                    accept="image/*"
                    class="avatar-input"
                  >
                  <button class="btn btn-secondary" @click="triggerAvatarInput">
                    Изменить фото
                  </button>
                </div>
              </div>
            </div>

            <div class="profile-info">
              <div class="info-section">
                <h2>Основная информация</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Имя</label>
                    <input 
                      v-if="isEditMode" 
                      v-model="editedUser.name" 
                      type="text"
                      class="form-input"
                    >
                    <span v-else>{{ user.name }}</span>
                  </div>
                  <div class="info-item">
                    <label>Email</label>
                    <input 
                      v-if="isEditMode" 
                      v-model="editedUser.email" 
                      type="email"
                      class="form-input"
                    >
                    <span v-else>{{ user.email }}</span>
                  </div>
                  <div class="info-item">
                    <label>Телефон</label>
                    <input 
                      v-if="isEditMode" 
                      v-model="editedUser.phone" 
                      type="tel"
                      class="form-input"
                    >
                    <span v-else>{{ user.phone || 'Не указан' }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h2>Дополнительная информация</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Дата рождения</label>
                    <input 
                      v-if="isEditMode" 
                      v-model="editedUser.birthDate" 
                      type="date"
                      class="form-input"
                    >
                    <span v-else>{{ formatDate(user.birthDate) || 'Не указана' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Город</label>
                    <input 
                      v-if="isEditMode" 
                      v-model="editedUser.city" 
                      type="text"
                      class="form-input"
                    >
                    <span v-else>{{ user.city || 'Не указан' }}</span>
                  </div>
                  <div class="info-item">
                    <label>О себе</label>
                    <textarea 
                      v-if="isEditMode" 
                      v-model="editedUser.bio" 
                      class="form-textarea"
                      rows="4"
                    ></textarea>
                    <span v-else>{{ user.bio || 'Не указано' }}</span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h2>Статистика обучения</h2>
                <div class="stats-grid">
                  <div class="stat-item">
                    <span class="stat-value">{{ user.stats.coursesCompleted }}</span>
                    <span class="stat-label">Завершено курсов</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ user.stats.assignmentsCompleted }}</span>
                    <span class="stat-label">Выполнено заданий</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ user.stats.averageGrade }}%</span>
                    <span class="stat-label">Средняя оценка</span>
                  </div>
                </div>
              </div>

              <div v-if="isEditMode" class="profile-actions">
                <button class="btn btn-primary" @click="saveProfile">
                  Сохранить изменения
                </button>
                <button class="btn btn-secondary" @click="cancelEdit">
                  Отмена
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
  name: 'ProfilePage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      isEditMode: false,
      user: {
        id: 1,
        name: 'Иван Петров',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        avatar: '/images/student_icon.png',
        birthDate: '2000-01-01',
        city: 'Москва',
        bio: 'Студент 3 курса, увлекаюсь веб-разработкой',
        stats: {
          coursesCompleted: 5,
          assignmentsCompleted: 12,
          averageGrade: 92
        }
      },
      editedUser: {}
    }
  },
  methods: {
    toggleEditMode() {
      this.isEditMode = !this.isEditMode
      if (this.isEditMode) {
        this.editedUser = { ...this.user }
      }
    },
    triggerAvatarInput() {
      this.$refs.avatarInput.click()
    },
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        // Здесь будет логика загрузки аватара
        console.log('Загрузка аватара:', file)
      }
    },
    formatDate(date) {
      if (!date) return null
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    saveProfile() {
      // Здесь будет логика сохранения профиля
      this.user = { ...this.editedUser }
      this.isEditMode = false
    },
    cancelEdit() {
      this.isEditMode = false
      this.editedUser = {}
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button-container {
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
}

.back-button:hover {
  background-color: #f8f9fa;
  transform: translateX(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-arrow {
  font-size: 1.2rem;
  line-height: 1;
}

.profile-page {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.profile-header h1 {
  margin: 0;
  color: var(--text-color);
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.profile-avatar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.avatar-container {
  text-align: center;
}

.avatar-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avatar-input {
  display: none;
}

.profile-info {
  display: grid;
  gap: 2rem;
}

.info-section {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.info-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.info-grid {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: grid;
  gap: 0.5rem;
}

.info-item label {
  color: #6c757d;
  font-size: 0.9rem;
}

.info-item span {
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: var(--transition);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f1f1;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
}

.btn-secondary {
  background: white;
  color: var(--text-color);
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .profile-page {
    padding: 1.5rem;
  }

  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-avatar {
    position: static;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .profile-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 