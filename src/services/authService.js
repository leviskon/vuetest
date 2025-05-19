import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const AVATAR_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Сервер ответил с ошибкой
            console.error('Ошибка ответа сервера:', error.response.data);
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // Запрос был отправлен, но ответ не получен
            console.error('Ошибка запроса:', error.request);
            return Promise.reject(new Error('Сервер недоступен'));
        } else {
            // Ошибка при настройке запроса
            console.error('Ошибка:', error.message);
            return Promise.reject(error);
        }
    }
);

const processUserData = (userData) => {
    if (userData.avatarUrl) {
        // Проверяем, начинается ли URL с http:// или https://
        if (!userData.avatarUrl.startsWith('http://') && !userData.avatarUrl.startsWith('https://')) {
            // Убираем начальный слеш, если он есть
            const cleanPath = userData.avatarUrl.startsWith('/') ? userData.avatarUrl.slice(1) : userData.avatarUrl
            userData.avatarUrl = `${AVATAR_BASE_URL}/${cleanPath}`
        }
    }
    return userData;
};

export const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            console.log('=== Информация о входе ===');
            console.log('Ответ сервера:', response.data);
            console.log('Заголовки ответа:', response.headers);
            console.log('Куки после входа:', document.cookie);
            
            if (response.data.user) {
                const processedUser = processUserData(response.data.user);
                localStorage.setItem('user', JSON.stringify(processedUser));
                return response.data;
            } else {
                throw new Error('Пользователь не найден в ответе сервера');
            }
        } catch (error) {
            console.error('=== Ошибка при входе ===');
            console.error('Ошибка:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role.toUpperCase()
            });
            
            console.log('=== Информация о регистрации ===');
            console.log('Ответ сервера:', response.data);
            console.log('Заголовки ответа:', response.headers);
            console.log('Куки после регистрации:', document.cookie);
            
            if (response.data.user) {
                const processedUser = processUserData(response.data.user);
                localStorage.setItem('user', JSON.stringify(processedUser));
                return response.data;
            } else {
                throw new Error('Пользователь не найден в ответе сервера');
            }
        } catch (error) {
            console.error('=== Ошибка при регистрации ===');
            console.error('Ошибка:', error);
            throw error;
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            localStorage.removeItem('user');
            throw error;
        }
    },

    getCurrentUser() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                return null;
            }
            
            if (user.role) {
                if (typeof user.role === 'object' && user.role.name) {
                    user.role = user.role.name;
                }
                user.role = String(user.role).toUpperCase();
            }
            
            return user;
        } catch (error) {
            console.error('Ошибка при получении текущего пользователя:', error);
            return null;
        }
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};