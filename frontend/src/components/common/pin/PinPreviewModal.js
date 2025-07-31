import React from 'react';
import { motion } from 'framer-motion';

const PinPreviewModal = ({ pin, onClose }) => {
  if (!pin) return null;

  const avatarUrl = `/avatars/${pin.ownerId}.jpg`; // либо генерируем по ownerId
  const username = pin.ownerId?.slice(0, 8); // псевдо-никнейм на основе GUID

  return (
      <motion.div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
          style={{ zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
      >
        <motion.div
            className="bg-white rounded shadow-lg p-4 position-relative"
            style={{ maxWidth: '700px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
          <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={onClose}
              aria-label="Close"
          ></button>

          <div className="mb-4">
            <img
                src={pin.imageUrl}
                alt={pin.title}
                className="img-fluid rounded w-100"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h2 className="h4 fw-semibold mb-3">{pin.title}</h2>
            <p className="text-muted mb-4">{pin.description}</p>

            <div className="d-flex align-items-center mb-4">
              <img
                  src={avatarUrl}
                  alt={username}
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <div className="fw-bold">{username}</div>
                <div className="text-muted small">1.2k followers</div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {(pin.tags || []).map(tag => (
                  <span key={tag} className="badge bg-secondary">#{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default PinPreviewModal;
