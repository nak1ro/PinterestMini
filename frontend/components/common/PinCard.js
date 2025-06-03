import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import PinPreviewModal from './PinPreviewModal';

const PinCard = ({ pin }) => {
  const { savePin, unsavePin, isPinSaved } = useAppContext();
  const saved = isPinSaved(pin.id);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (saved) {
      unsavePin(pin.id);
    } else {
      savePin(pin.id);
    }
  };

  const handlePinClick = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <>
      <motion.div 
        className="pin-card"
        whileHover={{ y: -5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handlePinClick}
      >
        <img 
          src={pin.image} 
          alt={pin.title} 
          className="pin-image" 
        />
        
        {/* Hover overlay with animation */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="pin-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overlay-top">
                <motion.button 
                  className={`save-button ${saved ? 'saved' : ''}`}
                  onClick={handleSaveClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {saved ? 'Saved' : 'Save'}
                </motion.button>
              </div>
              <motion.div 
                className="overlay-bottom"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  to={`/profile/${pin.user.username}`} 
                  className="pin-user"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={pin.user.avatar} 
                    alt={pin.user.username} 
                    className="user-avatar" 
                  />
                  <span className="user-name">{pin.user.username}</span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="pin-content">
          <h3 className="pin-title">{pin.title}</h3>
          <Link 
            to={`/profile/${pin.user.username}`} 
            className="pin-user"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={pin.user.avatar} 
              alt={pin.user.username} 
              className="user-avatar" 
            />
            <span className="user-name">{pin.user.username}</span>
          </Link>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPreview && (
          <PinPreviewModal 
            pin={pin} 
            onClose={() => setShowPreview(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PinCard;
