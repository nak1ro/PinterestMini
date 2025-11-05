import axiosClient from '../api/axiosClient';
import { getMultipartHeaders } from '../utils/apiHelpers';

export const createBoard = async (formData) => {
    return axiosClient.post('/board', formData, {
        headers: getMultipartHeaders(),
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
        headers: getMultipartHeaders(),
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

export const removePinFromBoard = async (boardId, pinId) => {
    return axiosClient.delete(`/board/${boardId}/pins/${pinId}`);
};

