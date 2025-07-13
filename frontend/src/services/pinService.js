import axiosClient from '../api/axiosClient';

export const getSavedPins = async () => {
    const res = await axiosClient.get('/pin/saved');
    return res.data;
};

export const savePin = async (pinId) => {
    await axiosClient.post(`/pin/${pinId}/save`);
};

export const unsavePin = async (pinId) => {
    await axiosClient.delete(`/pin/${pinId}/save`);
};