import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import pins from '../../data/pins';
import PinGrid from './PinGrid';

const PinDetail = () => {
  const { id } = useParams();
  const pin = pins.find(p => p.id === parseInt(id));

  const relatedPins = pins
      .filter(p => p.id !== parseInt(id) && p.tags.some(tag => pin.tags.includes(tag)))
      .slice(0, 6);

  if (!pin) {
    return <div className="container py-5">Pin not found</div>;
  }

  return (
      <motion.div
          className="container py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-4 overflow-hidden shadow-lg d-flex flex-column flex-md-row mb-5">
          <div className="w-100 w-md-50">
            <img
                src={pin.image}
                alt={pin.title}
                className="w-100 h-100 object-fit-cover"
                style={{ maxHeight: '600px' }}
            />
          </div>
          <div className="p-4 d-flex flex-column justify-content-between w-100">
            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-danger rounded-pill fw-semibold px-4">Save</button>
            </div>

            <h1 className="h3 fw-bold mb-3">{pin.title}</h1>
            <p className="text-muted mb-4">{pin.description}</p>

            <div className="d-flex align-items-center mb-4">
              <img
                  src={pin.user.avatar}
                  alt={pin.user.username}
                  className="rounded-circle me-3"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
              <div>
                <div className="fw-semibold">{pin.user.username}</div>
                <small className="text-muted">1.2k followers</small>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {pin.tags.map(tag => (
                  <span key={tag} className="badge bg-secondary">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="fw-bold fs-5 mb-3">More like this</h2>
          <PinGrid pins={relatedPins} />
        </div>
      </motion.div>
  );
};

export default PinDetail;
