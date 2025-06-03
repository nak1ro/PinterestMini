import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import users from '../../data/users';
import pins from '../../data/pins';
import PinGrid from '../common/PinGrid';

const Profile = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('created');
  
  // Find user by username or use the first user as default
  const user = users.find(u => u.username === username) || users[0];
  
  // Get pins created by this user
  const userPins = pins.filter(pin => pin.user.id === user.id);
  
  // For demo purposes, we'll use a subset of all pins as "saved" pins
  const savedPins = pins.filter((pin, index) => index % 3 === 0);

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-header">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="profile-avatar" 
        />
        <h1 className="profile-name">{user.name}</h1>
        <p className="profile-username">@{user.username}</p>
        <p className="profile-bio">{user.bio}</p>
        
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{user.followers}</span>
            <span className="stat-label">followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.following}</span>
            <span className="stat-label">following</span>
          </div>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'created' ? 'active' : ''}`}
          onClick={() => setActiveTab('created')}
        >
          Created
        </button>
        <button 
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
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
