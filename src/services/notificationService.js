import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

export const notificationService = {
  async createNotification(notification) {
    console.log('Отправка уведомления:', notification);
    try {
      const response = await axios.post(API_URL, notification, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getUserNotifications() {
    console.log('Начало запроса уведомлений');
    try {
    const response = await axios.get(API_URL, { withCredentials: true });
      console.log('Получены уведомления:', response.data);
    return response.data;
    } catch (error) {
      console.error('Ошибка при получении уведомлений:', error);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
    await axios.put(`${API_URL}/${id}/read`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
    await axios.put(`${API_URL}/read-all`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Ошибка при отметке всех уведомлений как прочитанных:', error);
      throw error;
    }
  },

  async deleteNotification(id) {
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
      throw error;
    }
  },

  // Вспомогательные методы для создания уведомлений разных типов
  async sendAccessRequest(courseId, fromUserId, toUserId, courseName) {
    return this.createNotification({
      fromUserId,
      toUserId,
      courseId,
      type: 'ACCESS_REQUEST',
      title: 'Запрос доступа к курсу',
      message: `Поступил запрос на доступ к курсу "${courseName}"`,
      isRead: false,
      createdAt: new Date()
    });
  },

  async sendAccessApproved(courseId, fromUserId, toUserId, courseName) {
    return this.createNotification({
      courseId,
      userId: fromUserId,
      toUserId: toUserId,
      type: 'ACCESS_APPROVED',
      title: 'Доступ к курсу одобрен',
      message: `Ваш запрос на доступ к курсу "${courseName}" был одобрен`,
      isRead: false,
      createdAt: new Date()
    });
  },

  async sendAccessRejected(courseId, fromUserId, toUserId, courseName) {
    return this.createNotification({
      fromUserId,
      toUserId,
      courseId,
      type: 'ACCESS_REJECTED',
      title: 'Доступ к курсу отклонен',
      message: `Ваш запрос на доступ к курсу "${courseName}" был отклонен`,
      isRead: false,
      createdAt: new Date()
    });
  }
}; 