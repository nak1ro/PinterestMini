import axiosClient from '../api/axiosClient';

export const loginUser = async (credentials) => {
    const response = await axiosClient.post('/account/login', credentials);
    return response.data; // { username, email, token }
};

export const registerUser = async (formData) => {
    const response = await axiosClient.post('/account/register', formData);
    return response.data; // { username, email, token }
};
