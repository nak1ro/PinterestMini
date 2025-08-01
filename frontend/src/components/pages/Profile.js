import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import PinGrid from '../common/pin/PinGrid';
import { useAppContext } from '../../context/AppContext';
import useSavedPins from '../../hooks/useSavedPins';
import useCreatedPins from '../../hooks/useCreatedPins';
import { Spinner } from 'react-bootstrap';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('created');
  const { user: currentUser } = useAppContext();

  const {
    createdPins,
    loading: loadingCreated
  } = useCreatedPins(username);

  const {
    savedPins,
    loading: loadingSaved
  } = useSavedPins();

  const isLoading = (activeTab === 'created' && loadingCreated) || (activeTab === 'saved' && loadingSaved);
  const pinsToShow = activeTab === 'created' ? createdPins : savedPins;

  return (
      <motion.div
          className="container py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <div className="d-flex flex-column align-items-center text-center mb-4">
          <img
              // src={user.avatar}
              // alt={user.name}
              className="rounded-circle mb-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          <h1 className="fw-bold fs-2 mb-1">{currentUser}</h1>
          <p className="text-center mx-auto" style={{ maxWidth: '500px' }}>{currentUser}</p>

          <div className="d-flex gap-4 mt-3">
            <div className="text-center">
              <div className="fw-bold fs-5">{4}</div>
              <div className="text-muted small">followers</div>
            </div>
            <div className="text-center">
              <div className="fw-bold fs-5">{5}</div>
              <div className="text-muted small">following</div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center border-bottom mb-4">
          <button
              className={`btn fw-semibold px-4 py-2 ${activeTab === 'created' ? 'border-bottom border-2 border-dark' : 'text-muted'}`}
              onClick={() => setActiveTab('created')}
          >
            Created
          </button>
          <button
              className={`btn fw-semibold px-4 py-2 ${activeTab === 'saved' ? 'border-bottom border-2 border-dark' : 'text-muted'}`}
              onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        </div>

        {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
        ) : (
            <PinGrid pins={pinsToShow} />
        )}
      </motion.div>
  );
};

export default Profile;
