import axiosClient from '../api/axiosClient';

export const getFollowersCount = async (userId) => {
    const res = await axiosClient.get(`/user/${userId}/followers-count`);
    return res.data; // { count: number }
};

export const getFollowingCount = async (userId) => {
    const res = await axiosClient.get(`/user/${userId}/following-count`);
    return res.data; // { count: number }
};
