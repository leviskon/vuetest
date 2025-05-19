const requestAccess = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestBody = {
      courseId: courseId,
      message: 'Запрос на доступ к курсу'
    };

    console.log('Отправляемый запрос:', {
      url: 'http://localhost:8080/api/notifications/request',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: requestBody
    });

    const response = await fetch('http://localhost:8080/api/notifications/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке запроса');
    }

    const data = await response.json();
    alert('Запрос на доступ отправлен');
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке запроса');
  }
}; 