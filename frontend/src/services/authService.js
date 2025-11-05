import axiosClient from '../api/axiosClient';
import { withErrorHandling } from '../utils/apiHelpers';

export const loginUser = async ({ login, password }) => {
    return withErrorHandling(() =>
        axiosClient.post('/account/login', { login, password })
    );
};

export const registerUser = async (formData) => {
    return withErrorHandling(() => axiosClient.post('/account/register', formData));
};

export const getUserInfoByUsername = async (username) => {
    return withErrorHandling(() =>
        axiosClient.get(`/account/user/${username}`)
    );
};

