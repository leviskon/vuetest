<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div>
          <h3>Поддержка</h3>
          <p>Email: support@example.com</p>
          <p>Телефон: +7 (999) 123-45-67</p>
        </div>
        <div>
          <h3>Полезные ссылки</h3>
          <p><a href="#">Справочный центр</a></p>
          <p><a href="#">Часто задаваемые вопросы</a></p>
        </div>
      </div>
      <div class="footer__bottom">
        <p>&copy; 2024 Образовательная платформа. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #2d3748;
  color: white;
  padding: 3rem 0 1.5rem;
}

.footer__content {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer h3 {
  color: white;
  margin-bottom: 1rem;
}

.footer p {
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.footer a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: var(--transition);
}

.footer a:hover {
  color: white;
}

.footer__bottom {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    gap: 2rem;
  }
}
</style> 