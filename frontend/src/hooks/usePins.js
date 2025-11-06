import useAsync from './common/useAsync';
import { getPublicPins } from '../services/pinService';

export default function usePins() {
    const { data, loading, error } = useAsync(
        async () => {
            const response = await getPublicPins(1, 55);
            if (Array.isArray(response && response.data && response.data.items)) return response.data.items;
            if (Array.isArray(response && response.data)) return response.data;
            if (Array.isArray(response)) return response;
            return [];
        },
        [],
        { immediate: true, initialData: [] }
    );

    return { pins: data, loading, error };
}