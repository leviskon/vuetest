<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
:root {
  --primary-color: #4361ee;
  --secondary-color: #3a0ca3;
  --accent-color: #f72585;
  --text-color: #2b2d42;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  --success-color: #4cc9f0;
  --border-radius: 8px;
  --box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  --transition: all 0.3s ease;
}

body {
  font-family: 'Montserrat', 'Roboto', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #f8f9fa;
}

a {
  text-decoration: none;
  color: var(--primary-color);
  transition: var(--transition);
}

a:hover {
  color: var(--secondary-color);
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 2.5rem;
  position: relative;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h2:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  border-radius: 4px;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  transition: var(--transition);
}

.header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.header__nav a {
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0;
}

.header__nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.header__nav a:hover::after {
  width: 100%;
}

.header__auth {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
}

.btn-login {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-login:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-3px);
  box-shadow: var(--box-shadow);
}

.btn-register {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.4);
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(67, 97, 238, 0.6);
}
.course-card__footer .btn-register {
  display: block;
  width: 100%;
  padding: 1rem 0;
  font-size: 1rem;
}
.main {
  margin-top: 80px;
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  background: linear-gradient(rgba(43, 45, 66, 0.8), rgba(58, 12, 163, 0.8)), url('/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  text-align: center;
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  border-radius: 0 0 30px 30px;
  box-shadow: var(--box-shadow);
}

.hero::before {
  content: '';
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  height: 100px;
  background: white;
  clip-path: polygon(0 0, 100% 100%, 100% 100%, 0% 100%);
}

.hero h1 {
  font-size: 3.5rem;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
  margin-bottom: 1.5rem;
  animation: fadeInDown 1s;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s;
}

.courses {
  padding: 4rem 0;
  text-align: center;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 3rem;
}

.courses__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;
}

.course-card {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.3s, box-shadow 0.3s;
  background: white;
  position: relative;
}

.course-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
}

.course-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.5s;
}

.course-card:hover img {
  transform: scale(1.05);
}

.course-card__content {
  padding: 1.5rem;
}

.course-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
}

.course-card p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.course-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f1f1;
}

.price {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.footer {
  background: linear-gradient(45deg, var(--dark-color), var(--secondary-color));
  color: white;
  padding: 4rem 0 2rem;
  border-radius: 30px 30px 0 0;
  margin-top: 3rem;
}

.footer h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.75rem;
}

.footer h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: var(--accent-color);
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer__bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.9rem;
}

.burger-menu {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.burger-menu span {
  width: 25px;
  height: 3px;
  background: var(--primary-color);
  transition: var(--transition);
  border-radius: 3px;
}

.burger-menu:hover span {
  background: var(--accent-color);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .header__nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1.5rem;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }

  .header__nav.active {
    display: block;
    animation: fadeIn 0.3s;
  }

  .header__nav ul {
    flex-direction: column;
    gap: 1.5rem;
  }

  .header__auth {
    display: none;
  }

  .burger-menu {
    display: flex;
  }
  
  .hero {
    padding: 5rem 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style> 
