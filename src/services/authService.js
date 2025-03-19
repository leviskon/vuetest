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
            
            console.log('Full server response:', response.data);
            console.log('User object from server:', response.data.user);
            
            if (response.data.user) {
                console.log('Login response:', response.data.user);
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
            
            console.log('Full server response:', response.data);
            console.log('User object from server:', response.data.user);
            
            if (response.data.user) {
                console.log('Register response:', response.data.user);
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
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('Raw user from localStorage:', user);
        console.log('User role type:', typeof user?.role);
        console.log('User role value:', user?.role);
        
        if (user && user.role) {
            if (typeof user.role === 'object' && user.role.name) {
                user.role = user.role.name;
            }
            user.role = String(user.role).toUpperCase();
        }
        return user;
    },

    getToken() {
        return localStorage.getItem('token');
    }
}; 