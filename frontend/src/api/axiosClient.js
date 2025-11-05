import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConstants';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to add Authorization header
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
