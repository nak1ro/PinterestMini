import { useCallback, useState } from 'react';
import { updatePin as updatePinApi } from '../services/pinService';

export default function useUpdatePin(pinId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = useCallback(
        async (dto) => {
            setLoading(true);
            setError(null);

            try {
                const data = await updatePinApi(pinId, dto);
                return data;
            } catch (e) {
                setError(e?.response?.data || e);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [pinId]
    );

    return { update, loading, error };
}
