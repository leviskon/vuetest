import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Создаем экземпляр axios с настройками по умолчанию
const axiosInstance = axios.create({
  withCredentials: true
});

export const courseService = {
  async getEnrolledCourses() {
    try {
      const userId = this.getCurrentUserId();
      console.log('Текущий userId:', userId);

      const response = await axiosInstance.get(`${API_URL}/enrollments/students/${userId}`);
      const enrollments = response.data;
      console.log('Ответ от /enrollments/students:', enrollments);

      // Получаем детали каждого курса
      const courses = await Promise.all(
        enrollments.map(async (enrollment) => {
          console.log('Делаем запрос на /courses/', enrollment.courseId);
          const courseResponse = await axiosInstance.get(`${API_URL}/courses/${enrollment.courseId}`);
          const courseData = courseResponse.data;
          console.log('Ответ от /courses/:', courseData);

          // Формируем полный URL изображения
          const imageUrl = courseData.imageUrl 
            ? courseData.imageUrl.startsWith('http') 
              ? courseData.imageUrl 
              : courseData.imageUrl.startsWith('/uploads')
                ? `http://localhost:8080${courseData.imageUrl}`
                : `http://localhost:8080/uploads/courses/images/${courseData.imageUrl.replace(/^\/+/, '')}`
            : null;
          console.log('Сформированный URL изображения:', imageUrl);
          
          return {
            ...courseData,
            imageUrl: imageUrl, // Обновляем поле imageUrl
            progress: enrollment.progress || 0
          };
        })
      );

      console.log('Итоговый массив курсов:', courses);
      return courses;
    } catch (error) {
      console.error('Ошибка при получении курсов:', error);
      return [];
    }
  },

  getCurrentUserId() {
    // Получаем ID пользователя из localStorage или другого хранилища
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
  },

  async getStudentCourses(studentId) {
    try {
      console.log('Получение курсов студента:', studentId);
      const response = await axiosInstance.get(`${API_URL}/enrollments/students/${studentId}`);
      console.log('Получены курсы студента:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении курсов студента:', error);
      throw error;
    }
  },

  async getCourseDetails(courseId) {
    try {
      const response = await axiosInstance.get(`${API_URL}/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении деталей курса:', error);
      throw error;
    }
  }
}; 