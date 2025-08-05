import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ArrowLeft, Eye } from 'react-bootstrap-icons';

import { useAppContext } from '../../context/AppContext';
import useSavedPins from '../../hooks/useSavedPins';
import useCreatedPins from '../../hooks/useCreatedPins';
import useFollowCounts from '../../hooks/useFollowCounts';

import BoardsTab from '../common/layout/profileTabs/BoardsTab';
import PinsTab from '../common/layout/profileTabs/PinsTab';
import OtherUserProfile from './OtherUserProfile';

const Profile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pins');
    const [onlyMyPins, setOnlyMyPins] = useState(false);
    const [viewAsOther, setViewAsOther] = useState(false);

    const { user, userId } = useAppContext();

    const { createdPins, loading: loadingCreated } = useCreatedPins(username);
    const { savedPins, loading: loadingSaved } = useSavedPins();
    const { followersCount, followingCount } = useFollowCounts(userId);

    const isLoadingPins =
        (onlyMyPins && loadingCreated) ||
        (!onlyMyPins && (loadingCreated || loadingSaved));

    const pinsToShow = onlyMyPins ? createdPins : [...(createdPins || []), ...(savedPins || [])];

    if (viewAsOther) {
        return (
            <div>
                <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
                    <Button
                        variant="light"
                        className="rounded-pill px-3 py-2 shadow-sm"
                        onClick={() => setViewAsOther(false)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--pinterest-border)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(255,255,255,0.9)';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Back to My Profile
                    </Button>
                </div>
                <OtherUserProfile />
            </div>
        );
    }

    return (
        <motion.div
            className="container-fluid py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
                backgroundColor: 'var(--pinterest-bg)',
                color: 'var(--pinterest-text)',
                minHeight: '100vh'
            }}
        >
            <div className="row">
                <div className="col-lg-9">
                    <div className="d-flex justify-content-between align-items-center mb-4 px-3">
                        <h1 className="fw-bold fs-2 mb-0" style={{ color: 'var(--pinterest-text)' }}>
                            Your saved ideas
                        </h1>
                    </div>

                    <div className="d-flex justify-content-start px-3" style={{ borderColor: 'var(--pinterest-border)' }}>
                        <button
                            className={`btn fw-semibold px-4 py-3 p-50 border-0 ${activeTab === 'pins' ? 'border-bottom border-3' : ''}`}
                            onClick={() => setActiveTab('pins')}
                            style={{
                                borderBottomColor: activeTab === 'pins' ? '#e60023' : 'transparent',
                                color: activeTab === 'pins' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                                backgroundColor: 'transparent',
                                fontSize: '16px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Pins
                        </button>
                        <button
                            className={`btn fw-semibold px-4 py-3 border-0 ${activeTab === 'boards' ? 'border-bottom border-3' : ''}`}
                            onClick={() => setActiveTab('boards')}
                            style={{
                                borderBottomColor: activeTab === 'boards' ? '#e60023' : 'transparent',
                                color: activeTab === 'boards' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                                backgroundColor: 'transparent',
                                fontSize: '16px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Boards
                        </button>
                    </div>

                    {activeTab === 'pins' && (
                        <PinsTab
                            pins={pinsToShow}
                            loading={isLoadingPins}
                            onlyMyPins={onlyMyPins}
                            setOnlyMyPins={setOnlyMyPins}
                        />
                    )}

                    {activeTab === 'boards' && <BoardsTab />}
                </div>

                <div className="col-lg-3">
                    <div
                        className="position-sticky p-4 rounded-4 shadow-sm"
                        style={{
                            top: '100px',
                            backgroundColor: 'var(--pinterest-card-bg)',
                            border: '1px solid var(--pinterest-border)'
                        }}
                    >
                        <div className="text-center mb-4">
                            <img
                                src={user?.profilePictureUrl || '/assets/avatar-default.svg'}
                                alt={user?.username || 'User Avatar'}
                                className="rounded-circle mb-3 border border-2"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'cover',
                                    borderColor: 'var(--pinterest-border)'
                                }}
                                onError={(e) => {
                                    const fallback = '/assets/avatar-default.svg';
                                    if (!e.target.src.endsWith(fallback)) e.target.src = fallback;
                                }}
                            />
                            <h5 className="fw-bold mb-1" style={{ color: 'var(--pinterest-text)' }}>
                                {user?.username || 'Unknown'}
                            </h5>
                            <p className="small mb-3" style={{ color: 'var(--pinterest-text-muted)' }}>
                                {followersCount ?? 0} followers
                            </p>

                            <Button
                                variant="outline-secondary"
                                className="rounded-pill px-3 py-2 w-100 fw-medium"
                                onClick={() => setViewAsOther(true)}
                                style={{
                                    border: '2px solid var(--pinterest-border)',
                                    color: 'var(--pinterest-text)',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'var(--pinterest-hover)';
                                    e.target.style.borderColor = '#e60023';
                                    e.target.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.borderColor = 'var(--pinterest-border)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                <Eye size={16} className="me-2" />
                                View profile
                            </Button>
                        </div>

                        <div className="border-top pt-3" style={{ borderColor: 'var(--pinterest-border)' }}>
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="fw-bold" style={{ color: 'var(--pinterest-text)' }}>
                                        {createdPins?.length ?? 0}
                                    </div>
                                    <div className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                                        Created
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold" style={{ color: 'var(--pinterest-text)' }}>
                                        {savedPins?.length ?? 0}
                                    </div>
                                    <div className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                                        Saved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
