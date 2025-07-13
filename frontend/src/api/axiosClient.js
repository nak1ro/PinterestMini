// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://77.110.116.229:5005/api', // ← вот тут настрой IP-адрес бэка
    headers: {
        'Content-Type': 'application/json',
        // добавь заголовки если есть токен
    },
    withCredentials: true,
});



// ⛨ Перехватчик для установки Authorization
axiosClient.interceptors.request.use(
    (config) => {
        if (config.skipAuth) return config;
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;
