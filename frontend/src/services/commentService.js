import axiosClient from '../api/axiosClient';

export const getComments = async (pinId) => {
    const res = await axiosClient.get(`/pin/${pinId}/comments`);
    return res.data; // [{ id, content, createdAt, user: { username, profilePictureUrl, id } }]
};

export const postComment = async (pinId, content) => {
    const res = await axiosClient.post(`/pin/${pinId}/comments`, { content });
    return res.data; // returns created comment object
};

export const deleteComment = async (pinId, commentId) => {
    const res = await axiosClient.delete(`/pin/${pinId}/comments/${commentId}`);
    return res.data;
};
