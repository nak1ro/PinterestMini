import { useState, useEffect } from 'react';
import { getUserInfoByUsername } from '../services/authService'; // Assuming you have an API function to get user data

const useUserProfile = (username) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await getUserInfoByUsername(username);  // Replace with your actual API call
                if (response.success) {
                    setProfile(response.data);
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]); // Refetch profile when username changes

    return { profile, loading, error };
};

export default useUserProfile;
