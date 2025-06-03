import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import pins from '../../data/pins';
import PinGrid from '../common/PinGrid';

const PinDetail = () => {
  const { id } = useParams();
  const pin = pins.find(p => p.id === parseInt(id));
  
  // Get related pins based on tags
  const relatedPins = pins
    .filter(p => p.id !== parseInt(id) && p.tags.some(tag => pin.tags.includes(tag)))
    .slice(0, 6);

  if (!pin) {
    return <div className="container">Pin not found</div>;
  }

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pin-detail">
        <div className="pin-detail-image">
          <img src={pin.image} alt={pin.title} />
        </div>
        <div className="pin-detail-content">
          <div className="pin-detail-header">
            <button className="save-button">Save</button>
          </div>
          <h1 className="pin-detail-title">{pin.title}</h1>
          <p className="pin-detail-description">{pin.description}</p>
          
          <div className="pin-detail-user">
            <img src={pin.user.avatar} alt={pin.user.username} />
            <div className="pin-detail-user-info">
              <span className="pin-detail-user-name">{pin.user.username}</span>
              <span className="pin-detail-user-followers">1.2k followers</span>
            </div>
          </div>
          
          <div className="pin-tags">
            {pin.tags.map(tag => (
              <span key={tag} className="pin-tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="related-pins">
        <h2 className="related-pins-title">More like this</h2>
        <PinGrid pins={relatedPins} />
      </div>
    </motion.div>
  );
};

export default PinDetail;
