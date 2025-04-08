import axios from 'axios'
import { authService } from './authService'

const API_URL = 'http://localhost:8080/api'
const AVATAR_BASE_URL = 'http://localhost:8080'

export const profileService = {
  async getProfile() {
    try {
      console.log('=== Начало загрузки профиля ===')
      const currentUser = authService.getCurrentUser()
      console.log('Текущий пользователь:', currentUser)
      
      const response = await axios.get(`${API_URL}/profile`, {
        withCredentials: true
      })
      
      console.log('Сырой ответ сервера:', response)
      console.log('Данные ответа:', response.data)
      
      // Добавляем базовый URL к пути аватара
      const userData = response.data
      if (userData.avatarUrl) {
        console.log('URL аватара до обработки:', userData.avatarUrl)
        // Проверяем, начинается ли URL с http:// или https://
        if (!userData.avatarUrl.startsWith('http://') && !userData.avatarUrl.startsWith('https://')) {
          // Убираем начальный слеш, если он есть
          const cleanPath = userData.avatarUrl.startsWith('/') ? userData.avatarUrl.slice(1) : userData.avatarUrl
          userData.avatarUrl = `${AVATAR_BASE_URL}/${cleanPath}`
        }
        console.log('URL аватара после обработки:', userData.avatarUrl)
      }
      
      // Обновляем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('Обновленные данные пользователя в localStorage:', userData)
      
      return userData
    } catch (error) {
      console.error('=== Ошибка получения профиля ===')
      console.error('Полная ошибка:', error)
      console.error('Ответ сервера с ошибкой:', error.response?.data)
      console.error('Статус ошибки:', error.response?.status)
      console.error('Заголовки ответа:', error.response?.headers)
      throw error
    }
  },

  async updateProfile(profileData) {
    try {
      console.log('=== Начало обновления профиля ===')
      console.log('Данные для обновления:', profileData)
      
      const formData = new FormData()
      
      if (profileData.name) {
        formData.append('name', profileData.name)
      }
      
      if (profileData.email) {
        formData.append('email', profileData.email)
      }
      
      if (profileData.avatarFile) {
        formData.append('avatarFile', profileData.avatarFile)
      }

      const response = await axios.put(`${API_URL}/profile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('Сырой ответ сервера:', response)
      console.log('Данные ответа:', response.data)
      
      // Добавляем базовый URL к пути аватара в ответе
      const userData = response.data
      if (userData.avatarUrl) {
        console.log('URL аватара до обработки:', userData.avatarUrl)
        // Проверяем, начинается ли URL с http:// или https://
        if (!userData.avatarUrl.startsWith('http://') && !userData.avatarUrl.startsWith('https://')) {
          // Убираем начальный слеш, если он есть
          const cleanPath = userData.avatarUrl.startsWith('/') ? userData.avatarUrl.slice(1) : userData.avatarUrl
          userData.avatarUrl = `${AVATAR_BASE_URL}/${cleanPath}`
        }
        console.log('URL аватара после обработки:', userData.avatarUrl)
      }
      
      // Обновляем данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      console.log('Обновленные данные пользователя в localStorage:', userData)
      
      return userData
    } catch (error) {
      console.error('=== Ошибка обновления профиля ===')
      console.error('Полная ошибка:', error)
      console.error('Ответ сервера с ошибкой:', error.response?.data)
      console.error('Статус ошибки:', error.response?.status)
      console.error('Заголовки ответа:', error.response?.headers)
      throw error
    }
  }
} 