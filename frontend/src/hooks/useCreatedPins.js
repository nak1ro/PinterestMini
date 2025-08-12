import useAsync from './common/useAsync';
import { getCreatedPins } from '../services/pinService';

export default function useCreatedPins() {
    const { data, loading, error, execute } = useAsync(
        async () => {
            const res = await getCreatedPins();
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [],
        { immediate: true, initialData: [] }
    );

    return {
        createdPins: data,
        loading,
        error,
        refetch: execute,
    };
}