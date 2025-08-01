import { useEffect, useState } from 'react';
import {getPopularTags} from '../services/tagService';
import {getPinsByTag} from "../services/pinService";

export const usePopularTags = (count = 5) => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            getPopularTags(count)
            .then(res => setTags(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [count]);

    return { tags, loading, error };
};

export const usePinsByTag = (tagName) => {
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
            getPinsByTag(tagName)
            .then(res => setPins(res.data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [tagName]);

    return { pins, loading, error };
};
