import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Добавляем импорты Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

// Глобальная обработка ошибок
app.config.errorHandler = (err, vm, info) => {
  console.error('Глобальная ошибка:', err)
  console.error('Информация об ошибке:', info)
}

// Обработка необработанных Promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Необработанная ошибка Promise:', event.reason)
  event.preventDefault()
})

app.use(router)
app.use(vuetify) // Используем Vuetify

// Обработка ошибок маршрутизации
router.onError((error) => {
  console.error('Ошибка маршрутизации:', error)
})

app.mount('#app')
