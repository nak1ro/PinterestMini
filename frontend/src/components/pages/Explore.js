import React from 'react';
import { motion } from 'framer-motion';
import pins from '../../data/pins';
import PinGrid from '../common/PinGrid';

const Explore = () => {
  // Group pins by categories (using tags)
  const categories = {};
  pins.forEach(pin => {
    pin.tags.forEach(tag => {
      if (!categories[tag]) {
        categories[tag] = [];
      }
      if (!categories[tag].find(p => p.id === pin.id)) {
        categories[tag].push(pin);
      }
    });
  });

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="page-title">Explore</h1>
      
      <div className="categories-section">
        {Object.keys(categories).slice(0, 5).map(category => (
          <div key={category} className="category-section">
            <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <PinGrid pins={categories[category].slice(0, 4)} />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Explore;
