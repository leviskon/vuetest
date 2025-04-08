<template>
  <div class="profile-page">
    <Header />
    <main class="main-content">
      <div class="container">
        <div class="back-button">
          <button @click="$router.back()" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Назад
          </button>
        </div>

        <div class="profile-card">
          <div class="profile-header">
            <h1>{{ isEditing ? 'Редактировать профиль' : 'Мой профиль' }}</h1>
            <p class="text-muted">Управление личными данными</p>
          </div>

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <div class="profile-body">
            <div class="avatar-section">
              <img 
                :src="user.avatar || '/images/student_icon.png'" 
                alt="Аватар" 
                class="avatar" 
                @error="handleImageError"
              />
              <div class="avatar-actions">
                <label class="btn btn-primary" :class="{ 'is-uploading': isLoading }">
                  <i class="fas fa-camera"></i> Изменить фото
                  <input type="file" @change="handleAvatarUpload" accept="image/*" style="display: none" />
                </label>
              </div>
            </div>

            <div class="info-section">
              <form @submit.prevent="handleSubmit">
                <div class="info-group">
                  <div class="field-label">Имя пользователя</div>
                  <div class="field-value">
                    <template v-if="isEditing">
                      <input 
                        type="text" 
                        v-model="user.name" 
                        class="form-input"
                        placeholder="Введите ваше имя"
                        :disabled="isLoading"
                      />
                    </template>
                    <template v-else>
                      <p>{{ user.name }}</p>
                    </template>
                  </div>
                </div>

                <div class="info-group">
                  <div class="field-label">Электронная почта</div>
                  <div class="field-value">
                    <template v-if="isEditing">
                      <input 
                        type="email" 
                        v-model="user.email" 
                        class="form-input"
                        placeholder="Введите ваш email"
                        :disabled="isLoading"
                      />
                    </template>
                    <template v-else>
                      <p>{{ user.email }}</p>
                    </template>
                  </div>
                </div>

                <div class="form-actions">
                  <button 
                    type="button" 
                    @click="toggleEdit" 
                    class="btn btn-secondary"
                    :disabled="isLoading"
                  >
                    {{ isEditing ? 'Отмена' : 'Редактировать' }}
                  </button>
                  <button 
                    v-if="isEditing" 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                  </button>
                </div>
              </form>
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
import { profileService } from '@/services/profileService'
import { authService } from '@/services/authService'

export default {
  name: 'ProfilePage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        avatar: '',
        role: null,
        createdAt: null,
        updatedAt: null
      },
      isEditing: false,
      avatarFile: null,
      isLoading: false,
      error: null
    }
  },
  methods: {
    async loadUserData() {
      try {
        this.isLoading = true
        console.log('=== Начало загрузки данных пользователя в ProfilePage ===')
        console.log('Текущее состояние пользователя:', this.user)
        
        const userData = await profileService.getProfile()
        console.log('Ответ от сервера:', userData)
        console.log('URL аватара:', userData.avatarUrl)
        
        // Проверяем наличие всех необходимых данных
        if (!userData) {
          throw new Error('Данные пользователя не получены')
        }
        
        // Обновляем данные пользователя
        this.user = {
          name: userData.name || '',
          email: userData.email || '',
          avatar: userData.avatarUrl || '/images/student_icon.png',
          role: userData.role || null,
          createdAt: userData.createdAt || null,
          updatedAt: userData.updatedAt || null
        }
        
        console.log('Обновленные данные пользователя:', this.user)
      } catch (error) {
        this.error = 'Ошибка загрузки данных пользователя'
        console.error('Ошибка загрузки данных пользователя:', error)
        console.error('Детали ошибки:', error.response?.data)
        console.error('Статус ошибки:', error.response?.status)
        
        // Пробуем получить данные из localStorage как запасной вариант
        const localUser = authService.getCurrentUser()
        if (localUser) {
          console.log('Попытка использовать данные из localStorage:', localUser)
          this.user = {
            name: localUser.name || '',
            email: localUser.email || '',
            avatar: localUser.avatarUrl || '/images/student_icon.png',
            role: localUser.role || null,
            createdAt: localUser.createdAt || null,
            updatedAt: localUser.updatedAt || null
          }
        }
      } finally {
        this.isLoading = false
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (!this.isEditing) {
        this.error = null
      }
    },
    async handleSubmit() {
      try {
        this.isLoading = true
        this.error = null
        
        const profileData = {}
        
        if (this.user.name) {
          profileData.name = this.user.name
        }
        
        if (this.user.email) {
          profileData.email = this.user.email
        }
        
        if (this.avatarFile) {
          profileData.avatarFile = this.avatarFile
        }

        const updatedUser = await profileService.updateProfile(profileData)
        this.user = {
          ...this.user,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatarUrl
        }
        
        this.isEditing = false
      } catch (error) {
        this.error = 'Ошибка обновления профиля'
        console.error('Ошибка обновления профиля:', error)
      } finally {
        this.isLoading = false
      }
    },
    async handleAvatarUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      try {
        this.avatarFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.user.avatar = e.target.result
        }
        reader.readAsDataURL(file)
      } catch (error) {
        this.error = 'Ошибка загрузки аватара'
        console.error('Ошибка загрузки аватара:', error)
      }
    },
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    handleImageError(e) {
      console.error('Ошибка загрузки аватара:', e.target.src)
      e.target.src = '/images/student_icon.png'
    }
  },
  mounted() {
    this.loadUserData()
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  margin-top: 80px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-button {
  margin-bottom: 1rem;
}

.back-button .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--text-color);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--box-shadow);
}

.back-button .btn:hover {
  background: #f8f9fa;
  transform: translateX(-5px);
}

.profile-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--box-shadow);
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
}

.profile-header h1 {
  font-size: 1.75rem;
  color: var(--text-color);
  margin: 0;
  white-space: nowrap;
}

.profile-header p {
  margin: 0.5rem 0 0;
  color: #6c757d;
  white-space: nowrap;
}

.profile-body {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-top: -1rem;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  margin-top: -2rem;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary-color);
  box-shadow: var(--box-shadow);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-actions {
  margin-top: -1rem;
}

.avatar-actions .btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.avatar-actions .btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
}

.avatar-actions .btn i {
  font-size: 1.1rem;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  margin-bottom: 0.75rem;
}

.field-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-value {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
}

.field-value p {
  margin: 0;
  padding: 0.25rem 0;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 2px solid #edf2f7;
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  transition: var(--transition);
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--accent-color);
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f8f9fa;
  color: var(--text-color);
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-body {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .avatar-section {
    margin-bottom: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

.avatar-section {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 3px solid var(--primary-color);
  box-shadow: var(--box-shadow);
}

.avatar-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.avatar-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.avatar-actions .btn i {
  margin-right: 0.5rem;
}

.is-uploading {
  opacity: 0.7;
  pointer-events: none;
}

.alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.alert-danger {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style> 