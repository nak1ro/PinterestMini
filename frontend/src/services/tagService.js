import axiosClient from '../api/axiosClient';

export const createTag = async (tagName) => {
    return axiosClient.post('/tag', { name: tagName });
};

export const getAllTags = async () => {
    return axiosClient.get('/tag/');
};

export const getPopularTags = async (count) => {
    return axiosClient.get(`/tag/popular?count=${count}`, {
        skipAuth: true});
}