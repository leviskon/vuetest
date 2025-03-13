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
        
        <!-- Форма входа -->
        <form v-if="activeTab === 'login'" class="auth-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input 
              id="login-email" 
              type="email" 
              v-model="loginForm.email" 
              placeholder="Введите email" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="login-password">Пароль</label>
            <input 
              id="login-password" 
              type="password" 
              v-model="loginForm.password" 
              placeholder="Введите пароль" 
              required
            >
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
  export default {
    name: 'Auth',
    data() {
      return {
        activeTab: 'login',
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
        }
      }
    },
    methods: {
      handleLogin() {
        // Простая проверка данных
        if (!this.loginForm.email || !this.loginForm.password) {
          alert('Пожалуйста, заполните все поля');
          return;
        }

        // В реальном приложении здесь будет запрос к API
        // Имитация успешной авторизации
        const userData = {
          email: this.loginForm.email,
          name: 'Пользователь', // В реальном приложении это придет с сервера
          id: Date.now() // В реальном приложении это придет с сервера
        };

        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify(userData));

        // Перенаправляем на dashboard
        this.$router.push('/dashboard');
      },
      handleRegister() {
        if (!this.registerForm.name || !this.registerForm.email || !this.registerForm.password || !this.registerForm.role || !this.registerForm.terms) {
          alert('Пожалуйста, заполните все поля и примите условия использования');
          return;
        }

        // В реальном приложении здесь будет запрос к API
        // Имитация успешной регистрации
        const userData = {
          email: this.registerForm.email,
          name: this.registerForm.name,
          role: this.registerForm.role,
          id: Date.now() // В реальном приложении это придет с сервера
        };

        // Сохраняем данные пользователя
        localStorage.setItem('user', JSON.stringify(userData));

        // Перенаправляем на dashboard
        this.$router.push('/dashboard');
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
  </style>