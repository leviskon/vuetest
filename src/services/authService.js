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
            if (error.response) {
                console.error('Ответ сервера с ошибкой:', error.response.data);
                throw new Error(typeof error.response.data === 'string' ? error.response.data : 'Ошибка при входе в систему');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
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
            if (error.response) {
                console.error('Ответ сервера с ошибкой:', error.response.data);
                throw new Error(typeof error.response.data === 'string' ? error.response.data : 'Ошибка при регистрации');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    async logout() {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            localStorage.removeItem('user');
        }
    },

    getCurrentUser() {
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
    },

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
};