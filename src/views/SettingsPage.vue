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

        <div class="settings-page">
          <div class="settings-header">
            <h1>Настройки</h1>
          </div>

          <div class="settings-content">
            <div class="settings-section">
              <h2>Безопасность</h2>
              <div class="settings-form">
                <div class="form-group">
                  <label>Текущий пароль</label>
                  <input 
                    type="password" 
                    v-model="passwordForm.currentPassword"
                    class="form-input"
                  >
                </div>
                <div class="form-group">
                  <label>Новый пароль</label>
                  <input 
                    type="password" 
                    v-model="passwordForm.newPassword"
                    class="form-input"
                  >
                </div>
                <div class="form-group">
                  <label>Подтвердите новый пароль</label>
                  <input 
                    type="password" 
                    v-model="passwordForm.confirmPassword"
                    class="form-input"
                  >
                </div>
                <div class="form-actions">
                  <button 
                    class="btn btn-primary" 
                    @click="changePassword"
                    :disabled="!canChangePassword"
                  >
                    Изменить пароль
                  </button>
                </div>
              </div>
            </div>

            <div class="settings-section">
              <h2>Уведомления</h2>
              <div class="settings-form">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="notifications.email"
                      class="checkbox-input"
                    >
                    <span>Email уведомления</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="notifications.push"
                      class="checkbox-input"
                    >
                    <span>Push-уведомления</span>
                  </label>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="notifications.news"
                      class="checkbox-input"
                    >
                    <span>Новости и обновления</span>
                  </label>
                </div>
                <div class="form-actions">
                  <button 
                    class="btn btn-primary" 
                    @click="saveNotificationSettings"
                    :disabled="!hasNotificationChanges"
                  >
                    Сохранить настройки
                  </button>
                </div>
              </div>
            </div>

            <div class="settings-section">
              <h2>Язык и регион</h2>
              <div class="settings-form">
                <div class="form-group">
                  <label>Язык интерфейса</label>
                  <select v-model="language" class="form-input">
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Часовой пояс</label>
                  <select v-model="timezone" class="form-input">
                    <option value="UTC+3">Москва (UTC+3)</option>
                    <option value="UTC+2">Калининград (UTC+2)</option>
                    <option value="UTC+4">Самара (UTC+4)</option>
                    <option value="UTC+5">Екатеринбург (UTC+5)</option>
                    <option value="UTC+6">Омск (UTC+6)</option>
                    <option value="UTC+7">Новосибирск (UTC+7)</option>
                  </select>
                </div>
                <div class="form-actions">
                  <button 
                    class="btn btn-primary" 
                    @click="saveLanguageSettings"
                    :disabled="!hasLanguageChanges"
                  >
                    Сохранить настройки
                  </button>
                </div>
              </div>
            </div>

            <div class="settings-section danger-zone">
              <h2>Опасная зона</h2>
              <div class="settings-form">
                <div class="form-group">
                  <p class="danger-text">
                    Удаление аккаунта приведет к безвозвратной потере всех данных.
                    Это действие нельзя отменить.
                  </p>
                </div>
                <div class="form-actions">
                  <button 
                    class="btn btn-danger" 
                    @click="confirmDeleteAccount"
                  >
                    Удалить аккаунт
                  </button>
                </div>
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
  name: 'SettingsPage',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notifications: {
        email: true,
        push: true,
        news: false
      },
      language: 'ru',
      timezone: 'UTC+3',
      initialSettings: {
        notifications: {},
        language: '',
        timezone: ''
      }
    }
  },
  computed: {
    canChangePassword() {
      return (
        this.passwordForm.currentPassword &&
        this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        this.passwordForm.newPassword === this.passwordForm.confirmPassword
      )
    },
    hasNotificationChanges() {
      return JSON.stringify(this.notifications) !== JSON.stringify(this.initialSettings.notifications)
    },
    hasLanguageChanges() {
      return (
        this.language !== this.initialSettings.language ||
        this.timezone !== this.initialSettings.timezone
      )
    }
  },
  methods: {
    changePassword() {
      // Здесь будет логика изменения пароля
      console.log('Изменение пароля:', this.passwordForm)
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    saveNotificationSettings() {
      // Здесь будет логика сохранения настроек уведомлений
      console.log('Сохранение настроек уведомлений:', this.notifications)
      this.initialSettings.notifications = { ...this.notifications }
    },
    saveLanguageSettings() {
      // Здесь будет логика сохранения языковых настроек
      console.log('Сохранение языковых настроек:', {
        language: this.language,
        timezone: this.timezone
      })
      this.initialSettings.language = this.language
      this.initialSettings.timezone = this.timezone
    },
    confirmDeleteAccount() {
      if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.')) {
        // Здесь будет логика удаления аккаунта
        console.log('Удаление аккаунта')
      }
    }
  },
  created() {
    // Инициализация начальных настроек
    this.initialSettings = {
      notifications: { ...this.notifications },
      language: this.language,
      timezone: this.timezone
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

.settings-page {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f1f1;
}

.settings-header h1 {
  margin: 0;
  color: var(--text-color);
}

.settings-content {
  display: grid;
  gap: 2rem;
}

.settings-section {
  background: #f8f9fa;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.settings-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.settings-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  color: #6c757d;
  font-size: 0.9rem;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
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

.btn-primary:disabled {
  background: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.danger-zone {
  border: 1px solid #dc3545;
  background: #fff5f5;
}

.danger-text {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .settings-page {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style> 