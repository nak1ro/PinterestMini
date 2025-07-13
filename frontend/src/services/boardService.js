import axiosClient from '../api/axiosClient';

export const createBoard = async (formData) => {
    return axiosClient.post('/board', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getMyBoards = async () => {
    return axiosClient.get('/board/me');
};
