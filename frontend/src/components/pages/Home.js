// pages/Home.jsx
import React from 'react';
import PinGrid from '../pin/PinGrid';
import { motion } from 'framer-motion';
import { useSearchContext } from '../../context/SearchContext';
import useInfinitePins from '../../hooks/useInfinitePins';

const Home = () => {
    const { searchResults, isSearching, hasSearched } = useSearchContext();
    const { pins: basePins, loading: baseLoading, loadingMore, hasMore, loadMore } = useInfinitePins();

    if (baseLoading) return <p className="text-center mt-5">Loading pins...</p>;

    const pinsToShow = hasSearched ? searchResults : basePins;
    const showInfiniteScroll = !hasSearched && hasMore;

    return (
        <motion.div
            className="px-0 py-4 container-fluid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {pinsToShow.length === 0 ? (
                <p className="text-center mt-5">No pins found.</p>
            ) : (
                <PinGrid 
                    pins={pinsToShow} 
                    onLoadMore={showInfiniteScroll ? loadMore : undefined}
                    loadingMore={loadingMore}
                />
            )}
        </motion.div>
    );
};

export default Home;
