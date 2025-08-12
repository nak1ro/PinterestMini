import useAsync from './common/useAsync';
import { getPopularTags } from '../services/tagService';
import { getPinsByTag } from '../services/pinService';

export const usePopularTags = (count = 5) => {
    const { data, loading, error } = useAsync(
        async () => {
            const res = await getPopularTags(count);
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [count],
        { immediate: true, initialData: [] }
    );

    return { tags: data, loading, error };
};

export const usePinsByTag = (tagName) => {
    const { data, loading, error } = useAsync(
        async () => {
            const res = await getPinsByTag(tagName);
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [tagName],
        { immediate: Boolean(tagName), initialData: [] }
    );

    return { pins: data, loading, error };
};