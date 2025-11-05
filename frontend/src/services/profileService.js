import axiosClient from '../api/axiosClient';
import { withErrorHandling } from '../utils/apiHelpers';
import { getMultipartHeaders } from '../utils/apiHelpers';

export const updateProfile = async (formData) => {
    return withErrorHandling(() =>
        axiosClient.put('/account/profile', formData, {
            headers: getMultipartHeaders(),
        })
    );
};

export const deleteAccount = async () => {
    return withErrorHandling(() => axiosClient.delete('/account/delete'));
};

