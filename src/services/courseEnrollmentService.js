import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enrollments';

export const courseEnrollmentService = {
  async enrollStudent(courseId, studentId) {
    try {
      console.log('Зачисление студента на курс:', { courseId, studentId });
      const response = await axios.post(
        `${API_URL}/courses/${courseId}/enroll?studentId=${studentId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при зачислении студента:', error);
      throw error;
    }
  },

  async unenrollStudent(courseId, studentId) {
    try {
      await axios.delete(
        `${API_URL}/courses/${courseId}/unenroll?studentId=${studentId}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Ошибка при отчислении студента:', error);
      throw error;
    }
  },

  async getStudentEnrollments(studentId) {
    try {
      const response = await axios.get(
        `${API_URL}/students/${studentId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении курсов студента:', error);
      throw error;
    }
  },

  async getCourseEnrollments(courseId) {
    try {
      const response = await axios.get(
        `${API_URL}/courses/${courseId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении студентов курса:', error);
      throw error;
    }
  }
}; 