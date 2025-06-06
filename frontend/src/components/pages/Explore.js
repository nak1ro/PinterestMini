import React from 'react';
import { motion } from 'framer-motion';
import pins from '../../data/pins';
import PinGrid from '../common/pin/PinGrid';

const Explore = () => {
  const categories = {};
  pins.forEach(pin => {
    pin.tags.forEach(tag => {
      if (!categories[tag]) categories[tag] = [];
      if (!categories[tag].find(p => p.id === pin.id)) {
        categories[tag].push(pin);
      }
    });
  });

  return (
      <motion.div
          className="container py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <h1 className="text-center fw-bold mb-5" style={{ fontSize: '2rem' }}>Explore</h1>

        <div className="mt-4">
          {Object.keys(categories).slice(0, 5).map(category => (
              <div key={category} className="mb-5">
                <h2 className="fw-semibold mb-4 ps-3" style={{ fontSize: '1.5rem' }}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h2>
                <PinGrid pins={categories[category].slice(0, 4)} />
              </div>
          ))}
        </div>
      </motion.div>
  );
};

export default Explore;
