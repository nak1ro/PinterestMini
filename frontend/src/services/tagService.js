import axiosClient from '../api/axiosClient';

export const createTag = async (tagName) => {
    return axiosClient.post('/tag', { name: tagName });
};

export const getAllTags = async () => {
    return axiosClient.get('/tag/');
};
