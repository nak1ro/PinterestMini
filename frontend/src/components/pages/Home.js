// pages/Home.jsx
import React from 'react';
import PinGrid from '../common/pin/PinGrid';
import { motion } from 'framer-motion';
import { useSearchContext } from '../../context/SearchContext';
import usePins from '../../hooks/usePins';

const Home = () => {
    const { searchResults, isSearching } = useSearchContext();
    const { pins: basePins, loading: baseLoading } = usePins();

    if (baseLoading) return <p className="text-center mt-5">Loading pins...</p>;

    const pinsToShow = isSearching || searchResults.length > 0 ? searchResults : basePins;

    return (
        <motion.div className="container py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {pinsToShow.length === 0 ? (
                <p className="text-center mt-5">No pins found.</p>
            ) : (
                <PinGrid pins={pinsToShow} />
            )}
        </motion.div>
    );
};

export default Home;
