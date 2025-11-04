import axiosClient from '../api/axiosClient';

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

export const createPin = async (formData) => {
    return axiosClient.post('/pin', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deletePin = async (pinId) => {
    return axiosClient.delete(`/pin/${pinId}`);
};

// Get boards that contain this pin
export const getPinBoards = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/boards`);
    return res.data;
};

// Set boards for a pin (replace all board memberships)
export const setPinBoards = async (pinId, boardIds) => {
    const res = await axiosClient.put(`/pin/${pinId}/boards`, { boardIds });
    return res.data;
};

export const getPublicPins = (page = 1, pageSize = 20) => {
    return axiosClient.get('/pin/feed', {
        skipAuth: true,
        params: {
            page,
            pageSize
        }
    });
};

export const getPinsByTag = (tagName)=> {
    return axiosClient.get(`/tag/${tagName}/pins`,
        {skipAuth: true});
}


export const fetchPinsByQuery = async (query, page = 1, pageSize = 20) => {
    if (!query || typeof query !== 'string') throw new Error('Invalid query');

    try {
        return axiosClient.get('/pin/search', {
            skipAuth: true,
            params: {
                query,
                page,
                pageSize
            }
        });
    } catch (error) {
        console.error('API error:', error);
        throw new Error(error.response?.data?.error || 'Ошибка при загрузке пинов');
    }
};

export const fetchSavedPinsByQuery = async (query, page = 1, pageSize = 20) => {
    if (!query || typeof query !== 'string') throw new Error('Invalid query');

    try {
        return axiosClient.get('/pin/saved/search', {
            skipAuth: true,
            params: {
                query,
                page,
                pageSize
            }
        });
    } catch (error) {
        console.error('API error:', error);
        throw new Error(error.response?.data?.error || 'Ошибка при загрузке пинов');
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
    return res.data; // { isLiked: boolean, likeCount: number }
};

export const getLikeStatus = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/likes/count`);
    return res.data; // { likeCount: number }
};

export const getIsPinSaved = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/saved/is-saved`);
    return res.data; // { isSaved: boolean }
};