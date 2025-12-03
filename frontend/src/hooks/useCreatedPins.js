import useAsync from './common/useAsync';
import { getCreatedPins, getCreatedPinsByUser } from '../services/pinService';

export default function useCreatedPins(username = null) {
    const { data, loading, error, execute } = useAsync(
        async () => {
            const res = username
                ? await getCreatedPinsByUser(username)
                : await getCreatedPins();

            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [username],
        { immediate: true, initialData: [] }
    );

    return {
        createdPins: data,
        loading,
        error,
        refetch: execute,
    };
}