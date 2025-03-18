<template>
    <div class="auth-page">
      <div class="auth-container">
        <button class="close-btn" @click="handleClose">
          <span>×</span>
        </button>
        
        <div class="auth-tabs">
          <button 
            class="auth-tab" 
            :class="{ 'active': activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Вход
          </button>
          <button 
            class="auth-tab" 
            :class="{ 'active': activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            Регистрация
          </button>
        </div>
        
        <!-- Добавляем отображение ошибок -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <!-- Добавляем индикатор загрузки -->
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
        </div>
        
        <!-- Форма входа -->
        <form v-if="activeTab === 'login'" class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group" :class="{ 'error': formErrors.login.email }">
            <label for="login-email">Email</label>
            <input 
              id="login-email" 
              type="email" 
              v-model="loginForm.email" 
              placeholder="Введите email" 
              required
            >
            <div v-if="formErrors.login.email" class="field-error">{{ formErrors.login.email }}</div>
          </div>
          
          <div class="form-group">
            <label for="login-password">Пароль</label>
            <div class="password-input-container">
              <input 
                id="login-password" 
                :type="showPassword ? 'text' : 'password'" 
                v-model="loginForm.password" 
                placeholder="Введите пароль" 
                required
              >
              <button 
                type="button" 
                class="password-toggle" 
                @click="showPassword = !showPassword"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>
          
          <div class="form-checkbox">
            <input type="checkbox" id="remember" v-model="loginForm.remember">
            <label for="remember">Запомнить меня</label>
          </div>
          
          <button type="submit" class="btn btn-register auth-submit">Войти</button>
          
          <div class="auth-links">
            <a href="#" @click.prevent="forgotPassword">Забыли пароль?</a>
          </div>
        </form>
        
        <!-- Форма регистрации -->
        <form v-else class="auth-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="register-name">Имя</label>
            <input 
              id="register-name" 
              type="text" 
              v-model="registerForm.name" 
              placeholder="Введите имя" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-email">Email</label>
            <input 
              id="register-email" 
              type="email" 
              v-model="registerForm.email" 
              placeholder="Введите email" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-password">Пароль</label>
            <input 
              id="register-password" 
              type="password" 
              v-model="registerForm.password" 
              placeholder="Введите пароль" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="register-role">Роль</label>
            <select 
              id="register-role" 
              v-model="registerForm.role" 
              required
            >
              <option value="">Выберите роль</option>
              <option value="student">Студент</option>
              <option value="teacher">Преподаватель</option>
            </select>
          </div>
          
          <div class="form-checkbox">
            <input type="checkbox" id="terms" v-model="registerForm.terms" required>
            <label for="terms">Я согласен с <a href="#" @click.prevent="showTerms">условиями использования</a></label>
          </div>
          
          <button type="submit" class="btn btn-register auth-submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { authService } from '@/services/authService';

  export default {
    name: 'Auth',
    data() {
      return {
        activeTab: 'login',
        showPassword: false,
        loginForm: {
          email: '',
          password: '',
          remember: false
        },
        registerForm: {
          name: '',
          email: '',
          password: '',
          role: '',
          terms: false
        },
        error: null,
        loading: false,
        formErrors: {
          login: {},
          register: {}
        }
      }
    },
    methods: {
      async handleLogin() {
        if (!this.loginForm.email || !this.loginForm.password) {
          this.error = 'Пожалуйста, заполните все поля';
          return;
        }

        try {
          this.loading = true;
          this.error = null;
          await authService.login(this.loginForm.email, this.loginForm.password);
          
          // Перенаправляем на dashboard в зависимости от роли
          const user = authService.getCurrentUser();
          if (user.role === 'TEACHER') {
            this.$router.push('/teacher/dashboard');
          } else {
            this.$router.push('/dashboard');
          }
        } catch (error) {
          this.error = error.message || 'Ошибка при входе в систему';
        } finally {
          this.loading = false;
        }
      },

      async handleRegister() {
        if (!this.registerForm.name || !this.registerForm.email || !this.registerForm.password || !this.registerForm.role || !this.registerForm.terms) {
          this.error = 'Пожалуйста, заполните все поля и примите условия использования';
          return;
        }

        try {
          this.loading = true;
          this.error = null;
          await authService.register(this.registerForm);
          
          // Перенаправляем на dashboard в зависимости от роли
          const user = authService.getCurrentUser();
          if (user.role === 'TEACHER') {
            this.$router.push('/teacher/dashboard');
          } else {
            this.$router.push('/dashboard');
          }
        } catch (error) {
          this.error = error.message || 'Ошибка при регистрации';
        } finally {
          this.loading = false;
        }
      },
      forgotPassword() {
        // Логика для восстановления пароля
        alert('Функция восстановления пароля будет доступна позже');
      },
      showTerms() {
        // Логика для показа условий использования
        alert('Условия использования будут доступны позже');
      },
      handleClose() {
        // Если компонент используется как модальное окно
        this.$emit('close');
        
        // Возвращаемся на предыдущую страницу
        this.$router.go(-1);
      },
      clearErrors() {
        this.error = null;
        this.formErrors = {
          login: {},
          register: {}
        };
      },

      validateLoginForm() {
        this.formErrors.login = {};
        let isValid = true;

        if (!this.loginForm.email) {
          this.formErrors.login.email = 'Email обязателен';
          isValid = false;
        } else if (!this.isValidEmail(this.loginForm.email)) {
          this.formErrors.login.email = 'Введите корректный email';
          isValid = false;
        }

        if (!this.loginForm.password) {
          this.formErrors.login.password = 'Пароль обязателен';
          isValid = false;
        }

        return isValid;
      },

      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
    },
    mounted() {
      // Проверяем наличие параметра tab в URL
      const tab = this.$route.query.tab;
      if (tab === 'register') {
        this.activeTab = 'register';
      }
    }
  }
  </script>
  
  <style scoped>
  .auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: linear-gradient(rgba(43, 45, 66, 0.7), rgba(58, 12, 163, 0.7)), url('/images/auth-bg.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .auth-container {
    position: relative;
    max-width: 450px;
    width: 100%;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    animation: fadeInUp 0.6s;
  }
  
  .close-btn {
    position: absolute;
    right: 15px;
    top: 15px;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    font-size: 24px;
    line-height: 1;
    color: var(--text-color);
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s ease;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: rotate(90deg);
    color: var(--primary-color);
  }
  
  .close-btn span {
    display: block;
    transform: translateY(-1px);
  }
  
  .auth-tabs {
    display: flex;
    border-bottom: 1px solid #f1f1f1;
  }
  
  .auth-tab {
    flex: 1;
    padding: 1.25rem;
    font-weight: 600;
    background: none;
    border: none;
    cursor: pointer;
    transition: var(--transition);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    color: var(--text-color);
  }
  
  .auth-tab.active {
    color: var(--primary-color);
    position: relative;
  }
  
  .auth-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    animation: slideIn 0.3s ease;
  }
  
  @keyframes slideIn {
    from {
      width: 0;
      left: 50%;
    }
    to {
      width: 100%;
      left: 0;
    }
  }
  
  .auth-form {
    padding: 2rem;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
  }
  
  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: var(--border-radius);
    transition: var(--transition);
    font-size: 1rem;
  }
  
  .form-group input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    outline: none;
  }
  
  .form-checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .form-checkbox input {
    margin-right: 10px;
  }
  
  .form-checkbox label {
    font-size: 0.9rem;
  }
  
  .auth-submit {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
  }
  
  .auth-submit:hover {
    transform: translateY(-2px);
  }
  
  .auth-links {
    text-align: center;
    font-size: 0.9rem;
  }
  
  .auth-links a {
    color: var(--primary-color);
    transition: var(--transition);
  }
  
  .auth-links a:hover {
    text-decoration: underline;
    color: var(--secondary-color);
  }
  
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: var(--border-radius);
    transition: var(--transition);
    font-size: 1rem;
    background-color: white;
  }
  
  .form-group select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    outline: none;
  }
  
  @media (max-width: 480px) {
    .auth-container {
      max-width: 100%;
    }
    
    .auth-form {
      padding: 1.5rem;
    }
  }
  
  .form-group.error input,
  .form-group.error select {
    border-color: #dc3545;
  }
  
  .form-group.error .field-error {
    color: #dc3545;
    font-size: 0.8rem;
    margin-top: 4px;
  }
  
  .error-message {
    color: #dc3545;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 12px;
    margin: 10px 20px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    animation: slideDown 0.3s ease-out;
  }
  
  .error-message i {
    font-size: 1.1rem;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .password-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .password-input-container input {
    width: 100%;
    padding-right: 40px;
  }
  
  .password-toggle {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    padding: 5px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
  }
  
  .password-toggle:hover {
    color: #333;
  }
  
  .password-toggle i {
    font-size: 16px;
  }
  </style>