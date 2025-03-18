import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            }, {
                withCredentials: true
            });
            
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                // Сервер ответил с ошибкой
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при входе в систему');
            } else if (error.request) {
                // Запрос был сделан, но ответ не получен
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                // Ошибка при настройке запроса
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/register`, {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role.toUpperCase()
            }, {
                withCredentials: true
            });
            
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                // Сервер ответил с ошибкой
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при регистрации');
            } else if (error.request) {
                // Запрос был сделан, но ответ не получен
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                // Ошибка при настройке запроса
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken() {
        return localStorage.getItem('token');
    }
}; 