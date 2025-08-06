import axiosClient from '../api/axiosClient';
import { parseApiError } from '../utils/parseApiError';

export const loginUser = async ({ login, password }) => {
    try {
        const res = await axiosClient.post('/account/login', { login, password });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

export const registerUser = async (formData) => {
    try {
        const res = await axiosClient.post('/account/register', formData);
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

export const getUserInfoByUsername = async (username) => {
    try {
        const res = await axiosClient.get(`/account/user/${username}`);
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

