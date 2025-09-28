import { useCallback, useState } from 'react';
import { updatePin as updatePinApi } from '../services/pinService';

export default function useUpdatePin(pinId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = useCallback(
        async (dto) => {
            const startedAt = new Date();
            const groupTitle = `[useUpdatePin] PUT /pin/${pinId} @ ${startedAt.toISOString()}`;

            // Helpful, structured log with the exact payload you send
            console.groupCollapsed(groupTitle);
            console.log('PinId:', pinId);
            console.log('Payload (UpdatePinDto):', {
                Title: dto?.Title ?? null,
                Description: dto?.Description ?? null,
                AllowComments: typeof dto?.AllowComments === 'boolean' ? dto.AllowComments : null,
                TagNames: Array.isArray(dto?.TagNames) ? dto.TagNames : [],
                BoardIds: Array.isArray(dto?.BoardIds) ? dto.BoardIds : undefined,
            });

            setLoading(true);
            setError(null);

            try {
                const data = await updatePinApi(pinId, dto);

                // Log the server’s response (you can trim or map if it’s huge)
                console.log('Response (updated pin):', data);
                const finishedAt = new Date();
                console.log('Duration (ms):', finishedAt.getTime() - startedAt.getTime());
                console.groupEnd();

                return data;
            } catch (e) {
                // Surface a concise error in console and state
                const status = e?.response?.status;
                const serverMsg = e?.response?.data ?? e?.message ?? e;
                console.error('Update failed:', { status, serverMsg });
                const finishedAt = new Date();
                console.log('Duration (ms):', finishedAt.getTime() - startedAt.getTime());
                console.groupEnd();

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
