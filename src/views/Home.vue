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
            <li><a href="#about">О нас</a></li>
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
      <section class="hero">
        <div class="container">
          <h1>Онлайн-обучение для вашего успеха</h1>
          <p>Изучайте актуальные навыки с профессиональными преподавателями</p>
        </div>
      </section>

      <section class="courses">
        <div class="container">
          <h2>Наши курсы</h2>
          <div class="courses__grid">
            <div v-for="course in courses" :key="course.id" class="course-card">
              <img :src="course.image" :alt="course.title">
              <div class="course-card__content">
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
                <div class="course-card__footer">
                  <button class="btn btn-register">Записаться</button>
                </div>
              </div>
            </div>
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
      courses: [
        {
          id: 1,
          title: 'Веб-разработка',
          description: 'Изучите HTML, CSS и JavaScript с нуля',
          image: '/images/web-dev.jpg',
        },
        {
          id: 2,
          title: 'Python для начинающих',
          description: 'Основы программирования на Python',
          image: '/images/python.jpg',
        },
        {
          id: 3,
          title: 'UX/UI Дизайн',
          description: 'Создавайте современные интерфейсы',
          image: '/images/uxui.png',
        }
      ]
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>
