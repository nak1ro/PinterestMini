import useAsync from './common/useAsync';
import {getUserInfoByUsername} from '../services/authService';

export default function useUserProfile(username) {
    const {data, loading, error} = useAsync(
        async () => {
            if (!username) return null;
            const response = await getUserInfoByUsername(username);
            if (response && response.success) return response.data;
            if (response && response.data && response.data.success) return response.data.data;
            throw (response && (response.error || (response.data && response.data.error))) || new Error('Failed to load profile');
        },
        [username],
        {immediate: Boolean(username), initialData: null}
    );

    return {profile: data, loading, error};
}