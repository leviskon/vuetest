<template>
  <div class="home">
    <header class="header">
      <div class="header__container">
        <div class="header__logo">
          <h1>SkillUp</h1>
        </div>
        <div class="burger-menu" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav class="header__nav" :class="{ active: isMenuOpen }">
          <ul>
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
            <div class="contact__item">
              <div class="contact__item-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <p>Email: info@example.com</p>
            </div>
            <div class="contact__item">
              <div class="contact__item-icon">
                <i class="fas fa-phone"></i>
              </div>
              <p>Телефон: +7 (999) 123-45-67</p>
            </div>
            <div class="contact__item">
              <div class="contact__item-icon">
                <i class="fas fa-clock"></i>
              </div>
              <p>Время работы: 24/7</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div>
            <h3>SkillUp</h3>
            <p>Универсальная система обучения для современных образовательных учреждений</p>
          </div>
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
          <p>&copy; 2024 SkillUp. Все права защищены.</p>
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
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 90%;
  max-width: 1000px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.5rem 0;
}

.header__container {
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo {
  display: flex;
  align-items: center;
}

.header__logo h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.header__nav ul {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.header__nav a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  padding: 0.5rem 0;
}

.header__nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.header__nav a:hover::after {
  width: 100%;
}

.header__auth {
  display: flex;
  gap: 1.5rem;
}

.btn-login {
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.8rem 1.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.btn-login:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.btn-register {
  background: var(--primary-color);
  color: white;
  padding: 0.8rem 1.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border-radius: 10px;
}

.btn-register:hover {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.burger-menu {
  display: none;
  cursor: pointer;
  padding: 0.5rem;
}

.burger-menu span {
  display: block;
  width: 25px;
  height: 2px;
  background: var(--text-color);
  margin: 5px 0;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  margin-top: 0;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 95%);
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
  background: transparent;
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
  position: relative;
  overflow: hidden;
  background: transparent;
}

.how-it-works::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
  clip-path: polygon(0 15%, 100% 0, 100% 85%, 0 100%);
  opacity: 1;
}

.how-it-works::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
  clip-path: polygon(0 15%, 100% 0, 100% 85%, 0 100%);
}

.how-it-works .container {
  position: relative;
  z-index: 1;
  color: white;
}

.how-it-works .section-title,
.how-it-works .step h3,
.how-it-works .step p {
  color: white;
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
  background: rgba(255, 255, 255, 0.2);
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
  color: white;
  margin-bottom: 1rem;
}

/* Contact Section */
.contact {
  padding: 5rem 0;
  position: relative;
  background: transparent;
}

.contact .container {
  position: relative;
  z-index: 1;
}

.contact .section-title {
  color: var(--text-color);
  text-align: center;
  margin-bottom: 3rem;
}

.contact__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact__item {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.contact__item:hover {
  transform: translateY(-5px);
}

.contact__item-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.contact__item p {
  color: var(--text-color);
  margin-top: 1rem;
}

.social-links {
  display: none;
}

/* Footer */
.footer {
  position: relative;
  background: transparent;
  color: white;
  padding: 4rem 0 2rem;
  overflow: hidden;
  border-radius: 0;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
  border-radius: 0;
}

.footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
  border-radius: 0;
}

.footer__content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer__content h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.footer__content p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.footer__bottom {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__bottom p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
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
  .header {
    top: 1rem;
    width: 95%;
    padding: 0.3rem 0;
  }

  .header__container {
    padding: 0.3rem 1rem;
    justify-content: space-between;
  }

  .burger-menu {
    display: block;
  }

  .header__nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-top: none;
  }
  
  .header__nav.active {
    display: block;
  }
  
  .header__nav ul {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .header__auth {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }

  .btn-login,
  .btn-register {
    width: 100%;
    text-align: center;
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
    gap: 1.5rem;
  }
  
  .features__grid,
  .steps {
    grid-template-columns: 1fr;
  }

  .footer {
    padding: 3rem 0 2rem;
  }

  .footer__content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .header__logo h1 {
    font-size: 1.5rem;
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

.main {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}
</style>
