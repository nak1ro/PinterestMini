// hooks/useUserProfile.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const useUserProfile = (username) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;

        setLoading(true);
        axios.get(`/api/users/${username}`)
            .then((res) => setProfile(res.data))
            .catch((err) => {
                console.error('Failed to load user profile:', err);
                setProfile(null);
            })
            .finally(() => setLoading(false));
    }, [username]);

    return { profile, loading };
};

export default useUserProfile;
