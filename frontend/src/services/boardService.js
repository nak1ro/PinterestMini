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

export const getPinsCountForBoard = async (boardId) => {
    return axiosClient.get(`/board/${boardId}/pins-count`);
};

export const changeBoardInfo = async (boardId, formData) => {
    return axiosClient.put(`/board/${boardId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deleteBoard = async (boardId) => {
    return axiosClient.delete(`/board/${boardId}`);
};

export const getPinsOfBoard = async (boardId) => {
    return axiosClient.get(`/board/${boardId}/pins`);
};

export const savePinToBoard = async (boardId, pinId) => {
    return axiosClient.post(`/board/${boardId}/pins/${pinId}`);
};

