import React, { useEffect } from 'react';
import PinGrid from '../common/pin/PinGrid';
import { motion } from 'framer-motion';
import usePins from '../../hooks/usePins';
import useSearchPins from '../../hooks/useSearchPins';

const Home = () => {
    const { pins, loading } = usePins();
    const { searchResults, searchPins, resetSearch } = useSearchPins(pins);

    useEffect(() => {
        // Optionally reset search when pins change
        resetSearch();
    }, [pins]);

    if (loading) return <p className="text-center mt-5">Loading pins...</p>;

    return (
        <motion.div
            className="container py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <PinGrid pins={searchResults} />
        </motion.div>
    );
};

export default Home;
