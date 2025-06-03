import React from 'react';
import PinGrid from '../common/PinGrid';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const Home = () => {
  const { searchResults } = useAppContext();

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PinGrid pins={searchResults} />
    </motion.div>
  );
};

export default Home;
