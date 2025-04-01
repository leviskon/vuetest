<template>
  <div class="home">
    <header class="header">
      <div class="header__container">
        <div class="burger-menu" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav class="header__nav" :class="{ active: isMenuOpen }">
          <ul>
            <li><a href="#courses">Курсы</a></li>
            <li><a href="#features">Преимущества</a></li>
            <li><a href="#how-it-works">Как это работает</a></li>
            <li><a href="#contacts">Контакты</a></li>
          </ul>
        </nav>
        <div class="header__auth">
          <button class="btn btn-login" @click="$router.push('/auth')">Войти</button>
          <button class="btn btn-register" @click="$router.push('/auth?tab=register')">Регистрация</button>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__background">
          <div class="hero__overlay"></div>
          <div class="hero__content container">
            <h1 class="hero__title">Онлайн-обучение для вашего успеха</h1>
            <p class="hero__subtitle">Изучайте актуальные навыки с профессиональными преподавателями в удобное для вас время</p>
            <div class="hero__buttons">
              <button class="btn btn-primary" @click="$router.push('/auth?tab=register')">Начать обучение</button>
              <button class="btn btn-secondary" @click="scrollToFeatures">Узнать больше</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="container">
          <h2 class="section-title">Преимущества платформы</h2>
          <div class="features__grid">
            <div class="feature-card">
              <div class="feature-card__icon">
                <i class="fas fa-clock"></i>
              </div>
              <h3>Гибкое обучение</h3>
              <p>Учитесь в удобное для вас время, в своем темпе</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">
                <i class="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Опытные преподаватели</h3>
              <p>Занятия ведут профессионалы с многолетним опытом</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">
                <i class="fas fa-certificate"></i>
              </div>
              <h3>Сертификация</h3>
              <p>Получайте сертификаты по окончании курсов</p>
            </div>
            <div class="feature-card">
              <div class="feature-card__icon">
                <i class="fas fa-headset"></i>
              </div>
              <h3>Поддержка 24/7</h3>
              <p>Наша команда поддержки всегда готова помочь</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="how-it-works">
        <div class="container">
          <h2 class="section-title">Как это работает</h2>
          <div class="steps">
            <div class="step">
              <div class="step__number">1</div>
              <div class="step__icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <h3>Регистрация</h3>
              <p>Создайте аккаунт и выберите интересующие вас курсы</p>
            </div>
            <div class="step">
              <div class="step__number">2</div>
              <div class="step__icon">
                <i class="fas fa-book-reader"></i>
              </div>
              <h3>Обучение</h3>
              <p>Изучайте материалы и выполняйте практические задания</p>
            </div>
            <div class="step">
              <div class="step__number">3</div>
              <div class="step__icon">
                <i class="fas fa-tasks"></i>
              </div>
              <h3>Практика</h3>
              <p>Применяйте полученные знания на практике</p>
            </div>
            <div class="step">
              <div class="step__number">4</div>
              <div class="step__icon">
                <i class="fas fa-graduation-cap"></i>
              </div>
              <h3>Сертификация</h3>
              <p>Получите сертификат по окончании курса</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contacts" class="contact">
        <div class="container">
          <h2 class="section-title">Контакты и поддержка</h2>
          <div class="contact__grid">
            <div class="contact__info">
              <h3>Свяжитесь с нами</h3>
              <div class="contact__details">
                <div class="contact__item">
                  <i class="fas fa-envelope"></i>
                  <p>Email: info@example.com</p>
                </div>
                <div class="contact__item">
                  <i class="fas fa-phone"></i>
                  <p>Телефон: +7 (999) 123-45-67</p>
                </div>
                <div class="contact__item">
                  <i class="fas fa-clock"></i>
                  <p>Время работы: 24/7</p>
                </div>
              </div>
              <div class="social-links">
                <a href="#" class="social-link"><i class="fab fa-telegram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-vk"></i></a>
                <a href="#" class="social-link"><i class="fab fa-youtube"></i></a>
              </div>
            </div>
            <form class="contact__form" @submit.prevent="submitForm">
              <div class="form-group">
                <label for="name">Ваше имя</label>
                <input type="text" id="name" v-model="form.name" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="form.email" required>
              </div>
              <div class="form-group">
                <label for="message">Сообщение</label>
                <textarea id="message" v-model="form.message" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div>
            <h3>О нас</h3>
            <p>Мы предоставляем качественное онлайн-образование</p>
          </div>
          <div>
            <h3>Контакты</h3>
            <p>Email: info@example.com</p>
            <p>Телефон: +7 (999) 123-45-67</p>
          </div>
        </div>
        <div class="footer__bottom">
          <p>&copy; 2024 Образовательная платформа. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isMenuOpen: false,
      form: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    scrollToFeatures() {
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
    },
    submitForm() {
      // Здесь будет логика отправки формы
      console.log('Form submitted:', this.form)
      // Очистка формы после отправки
      this.form = {
        name: '',
        email: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.header__nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
}

.header__nav a:hover {
  color: var(--primary-color);
}

.header__auth {
  display: flex;
  gap: 1rem;
}

/* Hero Section */
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  margin-top: 60px;
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.hero__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 0 2rem;
}

.hero__title {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
  opacity: 1;
}

.hero__subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
}

.hero__buttons {
  display: flex;
  gap: 1rem;
  animation: fadeInUp 1s ease 0.4s;
  opacity: 0;
  animation-fill-mode: forwards;
}

/* Features Section */
.features {
  padding: 5rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--text-color);
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card__icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

/* How It Works Section */
.how-it-works {
  padding: 5rem 0;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
}

.step {
  text-align: center;
  position: relative;
}

.step__number {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
}

.step__icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

/* Contact Section */
.contact {
  padding: 5rem 0;
  background: #f8f9fa;
}

.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 0 2rem;
}

.contact__info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact__details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact__item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input,
.form-group textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  height: 150px;
  resize: vertical;
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer__bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Animations */
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .header__nav {
    display: none;
  }
  
  .header__nav.active {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .header__nav ul {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hero__title {
    font-size: 2.5rem;
  }
  
  .hero__subtitle {
    font-size: 1.2rem;
  }
  
  .hero__buttons {
    flex-direction: column;
  }
  
  .contact__grid {
    grid-template-columns: 1fr;
  }
  
  .features__grid,
  .steps {
    grid-template-columns: 1fr;
  }
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-primary:hover {
  background: var(--primary-color-dark);
}

.btn-secondary:hover {
  background: white;
  color: var(--primary-color);
}
</style>
