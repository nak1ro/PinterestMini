import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import users from '../../data/users';
import pins from '../../data/pins';
import PinGrid from '../common/pin/PinGrid';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('created');

  const user = users.find(u => u.username === username) || users[0];

  const userPins = pins.filter(pin => pin.user.id === user.id);
  const savedPins = pins.filter((pin, index) => index % 3 === 0);

  return (
      <motion.div
          className="container py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <div className="d-flex flex-column align-items-center text-center mb-4">
          <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle mb-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          <h1 className="fw-bold fs-2 mb-1">{user.name}</h1>
          <p className="text-muted mb-2">@{user.username}</p>
          <p className="text-center mx-auto" style={{ maxWidth: '500px' }}>{user.bio}</p>

          <div className="d-flex gap-4 mt-3">
            <div className="text-center">
              <div className="fw-bold fs-5">{user.followers}</div>
              <div className="text-muted small">followers</div>
            </div>
            <div className="text-center">
              <div className="fw-bold fs-5">{user.following}</div>
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

        <PinGrid pins={activeTab === 'created' ? userPins : savedPins} />
      </motion.div>
  );
};

export default Profile;
