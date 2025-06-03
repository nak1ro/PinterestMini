import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const PinPreviewModal = ({ pin, onClose }) => {
  if (!pin) return null;

  return (
    <motion.div 
      className="pin-preview-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="pin-preview-content zoom-in"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="pin-preview-close" onClick={onClose}>×</div>
        
        <div className="pin-preview-image">
          <img src={pin.image} alt={pin.title} />
        </div>
        
        <div className="pin-preview-details">
          <h2 className="pin-preview-title">{pin.title}</h2>
          <p className="pin-preview-description">{pin.description}</p>
          
          <div className="pin-preview-user">
            <img src={pin.user.avatar} alt={pin.user.username} />
            <div className="pin-preview-user-info">
              <span className="pin-preview-user-name">{pin.user.username}</span>
              <span className="pin-preview-user-followers">1.2k followers</span>
            </div>
          </div>
          
          <div className="pin-tags">
            {pin.tags.map(tag => (
              <span key={tag} className="pin-tag">#{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PinPreviewModal;
