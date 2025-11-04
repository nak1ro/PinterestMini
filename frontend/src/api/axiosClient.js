// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://pinterestmini-g0gzcsbdb7gvgbej.polandcentral-01.azurewebsites.net/api',
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
