import { useEffect, useState } from 'react';
import {
    getSavedPins,
    savePin as savePinApi,
    unsavePin as unsavePinApi
} from '../services/pinService';

const useSavedPins = () => {
    const [savedPins, setSavedPins] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSavedPins = async () => {
        setLoading(true);
        try {
            const data = await getSavedPins();
            setSavedPins(data);
        } catch (error) {
            console.error('Error fetching saved pins:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePin = async (pinId) => {
        await savePinApi(pinId);
        await fetchSavedPins();
    };

    const unsavePin = async (pinId) => {
        await unsavePinApi(pinId);
        await fetchSavedPins();
    };

    const isPinSaved = (pinId) => savedPins.some(pin => pin.id === pinId);

    useEffect(() => {
        fetchSavedPins();
    }, []);

    return {
        savedPins,
        loading,
        savePin,
        unsavePin,
        isPinSaved,
        refetch: fetchSavedPins
    };
};

export default useSavedPins;
