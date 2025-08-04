import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';

import { useAppContext } from '../../context/AppContext';
import useSavedPins from '../../hooks/useSavedPins';
import useCreatedPins from '../../hooks/useCreatedPins';
import useFollowCounts from '../../hooks/useFollowCounts';

import BoardsTab from '../common/layout/profileTabs/BoardsTab';
import PinsTab from '../common/layout/profileTabs/PinsTab';

const Profile = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('pins');
    const [onlyMyPins, setOnlyMyPins] = useState(false);

    const { user, userId } = useAppContext();

    const { createdPins, loading: loadingCreated } = useCreatedPins(username);
    const { savedPins, loading: loadingSaved } = useSavedPins();
    const { followersCount, followingCount } = useFollowCounts(userId);

    const isLoadingPins =
        (onlyMyPins && loadingCreated) ||
        (!onlyMyPins && (loadingCreated || loadingSaved));

    const pinsToShow = onlyMyPins ? createdPins : [...createdPins, ...savedPins];

    return (
        <motion.div
            className="container py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* User Info */}
            <div className="d-flex flex-column align-items-center text-center mb-4">
                <img
                    src={`/avatars/${username}.jpg`}
                    alt={username}
                    className="rounded-circle mb-3"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h1 className="fw-bold fs-2 mb-1">{user?.username}</h1>
                <p className="text-center mx-auto" style={{ maxWidth: '500px' }}>
                    {user?.bio || ''}
                </p>

                <div className="d-flex gap-4 mt-3">
                    <div className="text-center">
                        <div className="fw-bold fs-5">{followersCount ?? '-'}</div>
                        <div className="text-muted small">followers</div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold fs-5">{followingCount ?? '-'}</div>
                        <div className="text-muted small">following</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="d-flex justify-content-center border-bottom mb-4">
                <button
                    className={`btn fw-semibold px-4 py-2 ${
                        activeTab === 'pins' ? 'border-bottom border-2 border-dark' : 'text-muted'
                    }`}
                    onClick={() => setActiveTab('pins')}
                >
                    Pins
                </button>
                <button
                    className={`btn fw-semibold px-4 py-2 ${
                        activeTab === 'boards' ? 'border-bottom border-2 border-dark' : 'text-muted'
                    }`}
                    onClick={() => setActiveTab('boards')}
                >
                    Boards
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'pins' && (
                <>
                    <PinsTab
                        pins={pinsToShow}
                        loading={isLoadingPins}
                    />
                </>
            )}

            {activeTab === 'boards' && <BoardsTab />}
        </motion.div>
    );
};

export default Profile;
