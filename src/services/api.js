import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true
});

// Добавляем перехватчик для логирования запросов
api.interceptors.request.use(
    (config) => {
        console.log('=== Информация о запросе ===');
        console.log('URL:', config.url);
        console.log('Метод:', config.method);
        console.log('Заголовки:', config.headers);
        console.log('withCredentials:', config.withCredentials);
        console.log('Куки:', document.cookie);
        console.log('Данные запроса:', config.data);
        return config;
    },
    (error) => {
        console.error('Ошибка в запросе:', error);
        return Promise.reject(error);
    }
);

// Добавляем перехватчик для логирования ответов
api.interceptors.response.use(
    (response) => {
        console.log('=== Информация об ответе ===');
        console.log('Статус:', response.status);
        console.log('Заголовки ответа:', response.headers);
        console.log('Куки после ответа:', document.cookie);
        console.log('Данные ответа:', response.data);
        return response;
    },
    (error) => {
        console.error('=== Ошибка в ответе ===');
        console.error('Статус:', error.response?.status);
        console.error('Заголовки ответа:', error.response?.headers);
        console.error('Данные ошибки:', error.response?.data);
        return Promise.reject(error);
    }
);

export const courseService = {
    async createCourse(courseData) {
        try {
            const formData = new FormData();
            formData.append('name', courseData.name);
            formData.append('description', courseData.description);
            formData.append('level', courseData.level);
            formData.append('category', courseData.category);
            
            if (courseData.imageFile) {
                formData.append('imageFile', courseData.imageFile);
            }
            
            console.log('=== Отправляемые данные курса ===');
            console.log('FormData:', Object.fromEntries(formData));
            
            const response = await api.post('/courses', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('=== Ответ сервера при создании курса ===');
            console.log('Данные:', response.data);
            return response.data;
        } catch (error) {
            console.error('=== Ошибка при создании курса ===');
            console.error('Ошибка:', error);
            if (error.response) {
                console.error('Ответ сервера с ошибкой:', error.response.data);
                throw new Error(error.response.data.message || 'Ошибка при создании курса');
            }
            throw error;
        }
    },

    async updateCourse(courseId, courseData) {
        try {
            const formData = new FormData();
            formData.append('name', courseData.title);
            formData.append('description', courseData.description);
            formData.append('level', courseData.level.toUpperCase());
            formData.append('category', courseData.category || 'Programming');
            
            if (courseData.image) {
                formData.append('imageFile', courseData.image);
            }
            
            const response = await api.put(`/courses/${courseId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при обновлении курса');
            } else if (error.request) {
                throw new Error('Сервер недоступен');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    async deleteCourse(courseId) {
        try {
            await api.delete(`/courses/${courseId}`);
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при удалении курса');
            } else if (error.request) {
                throw new Error('Сервер недоступен');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    async getCourses() {
        try {
            const response = await api.get('/courses');
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при получении списка курсов');
            } else if (error.request) {
                throw new Error('Сервер недоступен');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
        }
    },

    async getCourseById(courseId) {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при получении курса');
            } else if (error.request) {
                throw new Error('Сервер недоступен');
            } else {
                throw new Error('Ошибка при отправке запроса');
            }
        }
    }
};

export const materialService = {
    async createMaterial(materialData) {
        try {
            const formData = new FormData();
            formData.append('courseId', materialData.courseId);
            formData.append('typeId', materialData.typeId);
            formData.append('title', materialData.title);
            formData.append('description', materialData.description);
            formData.append('orderIndex', materialData.orderIndex);
            formData.append('duration', materialData.duration);
            
            if (materialData.file) {
                formData.append('file', materialData.file);
            }
            
            const response = await api.post('/materials', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при создании материала');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw error;
            }
        }
    },

    async updateMaterial(materialId, materialData) {
        try {
            const formData = new FormData();
            formData.append('courseId', materialData.courseId);
            formData.append('typeId', materialData.typeId);
            formData.append('title', materialData.title);
            formData.append('description', materialData.description);
            formData.append('orderIndex', materialData.orderIndex);
            formData.append('duration', materialData.duration);
            
            if (materialData.file) {
                formData.append('file', materialData.file);
            }
            
            const response = await api.put(`/materials/${materialId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при обновлении материала');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw error;
            }
        }
    },

    async deleteMaterial(materialId) {
        try {
            await api.delete(`/materials/${materialId}`);
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при удалении материала');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw error;
            }
        }
    },

    async getMaterial(materialId) {
        try {
            const response = await api.get(`/materials/${materialId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при получении материала');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw error;
            }
        }
    },

    async getCourseMaterials(courseId) {
        try {
            const response = await api.get(`/courses/${courseId}/materials`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при получении материалов курса');
            } else if (error.request) {
                throw new Error('Сервер недоступен. Проверьте подключение к интернету');
            } else {
                throw error;
            }
        }
    }
};