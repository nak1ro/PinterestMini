import React from 'react';
import PinCard from './PinCard';

const PinGrid = ({ pins }) => {
  return (
    <div className="pin-grid">
      {pins.map(pin => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </div>
  );
};

export default PinGrid;
