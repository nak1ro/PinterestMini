import axiosClient from '../api/axiosClient';
import { getMultipartHeaders } from '../utils/apiHelpers';
import { validateQuery } from '../utils/apiHelpers';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../utils/apiConstants';
import { parseApiError } from '../utils/parseApiError';

export const getSavedPins = async () => {
    const res = await axiosClient.get('/pin/saved');
    return res.data;
};

export const getCreatedPins = async () => {
    const res = await axiosClient.get('/pin/mine');
    return res.data;
};

export const updatePin = async (pinId) => {
    const res = await axiosClient.put(`/pin/${pinId}`);
    return res.data;
};

export const savePin = async (pinId) => {
    await axiosClient.post(`/pin/${pinId}/save`);
};

export const unsavePin = async (pinId) => {
    await axiosClient.delete(`/pin/${pinId}/save`);
};

export const createPin = async (formData, onUploadProgress) => {
    return axiosClient.post('/pin', formData, {
        headers: getMultipartHeaders(),
        onUploadProgress: onUploadProgress || undefined,
    });
};

export const deletePin = async (pinId) => {
    return axiosClient.delete(`/pin/${pinId}`);
};

export const getPinBoards = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/boards`);
    return res.data;
};

export const setPinBoards = async (pinId, boardIds) => {
    const res = await axiosClient.put(`/pin/${pinId}/boards`, { boardIds });
    return res.data;
};

export const getPublicPins = (page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    return axiosClient.get('/pin/feed', {
        skipAuth: true,
        params: {
            page,
            pageSize,
        },
    });
};

export const getPinsByTag = (tagName) => {
    return axiosClient.get(`/tag/${tagName}/pins`, { skipAuth: true });
};

export const fetchPinsByQuery = async (query, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    validateQuery(query);

    try {
        return axiosClient.get('/pin/search', {
            skipAuth: true,
            params: {
                query,
                page,
                pageSize,
            },
        });
    } catch (error) {
        throw new Error(parseApiError(error) || 'Failed to load pins');
    }
};

export const fetchSavedPinsByQuery = async (query, page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) => {
    validateQuery(query);

    try {
        return axiosClient.get('/pin/saved/search', {
            skipAuth: true,
            params: {
                query,
                page,
                pageSize,
            },
        });
    } catch (error) {
        throw new Error(parseApiError(error) || 'Failed to load pins');
    }
};

export const likePin = async (pinId) => {
    await axiosClient.post(`/pin/${pinId}/likes`);
};

export const unlikePin = async (pinId) => {
    await axiosClient.delete(`/pin/${pinId}/likes`);
};

export const isPinLiked = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/likes/is-liked`);
    return res.data;
};

export const getLikeStatus = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/likes/count`);
    return res.data;
};

export const getIsPinSaved = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/saved/is-saved`);
    return res.data;
};