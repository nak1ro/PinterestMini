import useAsync from './common/useAsync';
import { getSavedPins, savePin as savePinApi, unsavePin as unsavePinApi } from '../services/pinService';

export default function useSavedPins() {
    const { data, loading, error, execute, setData } = useAsync(
        async () => {
            const res = await getSavedPins();
            if (Array.isArray(res && res.data)) return res.data;
            if (Array.isArray(res)) return res;
            return [];
        },
        [],
        { immediate: true, initialData: [] }
    );

    const savePin = async (pinId) => {
        await savePinApi(pinId);
        await execute();
    };

    const unsavePin = async (pinId) => {
        await unsavePinApi(pinId);
        await execute();
    };

    const isPinSaved = (pinId) => data.some((p) => p.id === pinId);

    return {
        savedPins: data,
        loading,
        error,
        savePin,
        unsavePin,
        isPinSaved,
        refetch: execute,
        setSavedPins: setData,
    };
}