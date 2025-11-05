import axiosClient from '../api/axiosClient';

export const getFollowersCount = async (userId) => {
    const res = await axiosClient.get(`/follow/${userId}/followers-count`);
    return res.data; // { count: number }
};

export const getFollowingCount = async (userId) => {
    const res = await axiosClient.get(`/follow/${userId}/following-count`);
    return res.data; // { count: number }
};

export const followUser = async (userId) => {
    const res = await axiosClient.post(`/follow/${userId}`);
    return res.data;
};

export const unfollowUser = async (userId) => {
    const res = await axiosClient.delete(`/follow/${userId}`);
    return res.data;
};

export const isFollowingUser = async (userId) => {
    const res = await axiosClient.get(`/follow/${userId}/check`);
    return res.data;
};

export const getFollowers = async (userId) => {
    const res = await axiosClient.get(`/follow/${userId}/followers`);
    return res.data;
};

export const getFollowing = async (userId) => {
    const res = await axiosClient.get(`/follow/${userId}/following`);
    return res.data;
};