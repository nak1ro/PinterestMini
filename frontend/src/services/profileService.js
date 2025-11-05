import axiosClient from '../api/axiosClient';
import { parseApiError } from '../utils/parseApiError';

export const updateProfile = async (formData) => {
    try {
        const res = await axiosClient.put('/account/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

export const deleteAccount = async () => {
    try {
        const res = await axiosClient.delete('/account/delete');
        return { success: true, data: res.data };
    } catch (err) {
        return { success: false, error: parseApiError(err) };
    }
};

