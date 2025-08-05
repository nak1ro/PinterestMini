import axiosClient from '../api/axiosClient';

export const getSavedPins = async () => {
    const res = await axiosClient.get('/pin/saved');
    return res.data;
};

export const getCreatedPins = async () => {
    const res = await axiosClient.get('/pin/mine');
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

