import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PersonPlus, PersonCheck } from 'react-bootstrap-icons';

import { useAppContext } from '../../context/AppContext';
import useCreatedPins from '../../hooks/useCreatedPins';
import useSavedPins from '../../hooks/useSavedPins';
import useFollowCounts from '../../hooks/useFollowCounts';
import PinGrid from '../common/pin/PinGrid';

const OtherUserProfile = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState('created');
    const [isFollowing, setIsFollowing] = useState(false);

    const { user, userId } = useAppContext();

    const { createdPins, loading: loadingCreated } = useCreatedPins(username);
    const { savedPins, loading: loadingSaved } = useSavedPins();
    const { followersCount, followingCount } = useFollowCounts(userId);

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
        // Here you would typically make an API call to follow/unfollow the user
    };

    const pinsToShow = activeTab === 'created' ? createdPins : savedPins;
    const isLoading = activeTab === 'created' ? loadingCreated : loadingSaved;

    return (
        <motion.div
            className="container py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
                backgroundColor: 'var(--pinterest-bg)',
                color: 'var(--pinterest-text)',
                minHeight: '100vh'
            }}
        >
            {/* User Info */}
            <div className="d-flex flex-column align-items-center text-center mb-5">
                <img
                    src={`/avatars/${username}.jpg`}
                    alt={username}
                    className="rounded-circle mb-4 border border-3"
                    style={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        borderColor: 'var(--pinterest-border)'
                    }}
                />
                <h1 className="fw-bold fs-2 mb-2" style={{ color: 'var(--pinterest-text)' }}>
                    {username}
                </h1>
                <p className="text-center mx-auto mb-4" style={{
                    maxWidth: '500px',
                    color: 'var(--pinterest-text-muted)'
                }}>
                    Creative enthusiast sharing inspiring ideas and beautiful designs.
                </p>

                {/* Follow Button */}
                <Button
                    variant={isFollowing ? "outline-secondary" : "danger"}
                    className="rounded-pill px-4 py-2 fw-semibold mb-4"
                    onClick={handleFollowToggle}
                    style={{
                        background: isFollowing ? 'transparent' : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: isFollowing ? '2px solid var(--pinterest-border)' : 'none',
                        color: isFollowing ? 'var(--pinterest-text)' : 'white',
                        transition: 'all 0.2s ease',
                        minWidth: '120px'
                    }}
                    onMouseEnter={(e) => {
                        if (!isFollowing) {
                            e.target.style.transform = 'translateY(-2px) scale(1.02)';
                            e.target.style.boxShadow = '0 8px 25px rgba(230, 0, 35, 0.3)';
                        } else {
                            e.target.style.backgroundColor = 'var(--pinterest-hover)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isFollowing) {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = 'none';
                        } else {
                            e.target.style.backgroundColor = 'transparent';
                        }
                    }}
                >
                    {isFollowing ? (
                        <>
                            <PersonCheck size={18} className="me-2" />
                            Following
                        </>
                    ) : (
                        <>
                            <PersonPlus size={18} className="me-2" />
                            Follow
                        </>
                    )}
                </Button>

                {/* Stats */}
                <div className="d-flex gap-5">
                    <div className="text-center">
                        <div className="fw-bold fs-4" style={{ color: 'var(--pinterest-text)' }}>
                            {followersCount ?? '-'}
                        </div>
                        <div className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                            followers
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold fs-4" style={{ color: 'var(--pinterest-text)' }}>
                            {followingCount ?? '-'}
                        </div>
                        <div className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                            following
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold fs-4" style={{ color: 'var(--pinterest-text)' }}>
                            {createdPins?.length ?? '-'}
                        </div>
                        <div className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                            pins created
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="d-flex justify-content-center border-bottom mb-5" style={{ borderColor: 'var(--pinterest-border)' }}>
                <button
                    className={`btn fw-semibold px-4 py-3 border-0 ${
                        activeTab === 'created' ? 'border-bottom border-3' : ''
                    }`}
                    onClick={() => setActiveTab('created')}
                    style={{
                        borderBottomColor: activeTab === 'created' ? '#e60023' : 'transparent',
                        color: activeTab === 'created' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== 'created') {
                            e.target.style.color = 'var(--pinterest-text)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== 'created') {
                            e.target.style.color = 'var(--pinterest-text-muted)';
                        }
                    }}
                >
                    Created Pins
                </button>
                <button
                    className={`btn fw-semibold px-4 py-3 border-0 ${
                        activeTab === 'saved' ? 'border-bottom border-3' : ''
                    }`}
                    onClick={() => setActiveTab('saved')}
                    style={{
                        borderBottomColor: activeTab === 'saved' ? '#e60023' : 'transparent',
                        color: activeTab === 'saved' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== 'saved') {
                            e.target.style.color = 'var(--pinterest-text)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== 'saved') {
                            e.target.style.color = 'var(--pinterest-text-muted)';
                        }
                    }}
                >
                    Saved Pins
                </button>
            </div>

            {/* Tab Content */}
            <div className="px-3">
                {isLoading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3" style={{ color: 'var(--pinterest-text-muted)' }}>
                            Loading {activeTab} pins...
                        </p>
                    </div>
                ) : pinsToShow && pinsToShow.length > 0 ? (
                    <PinGrid pins={pinsToShow} />
                ) : (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <svg
                                width="80"
                                height="80"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: 'var(--pinterest-text-muted)' }}
                            >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21,15 16,10 5,21"></polyline>
                            </svg>
                        </div>
                        <h4 className="fw-normal mb-2" style={{ color: 'var(--pinterest-text-muted)' }}>
                            No {activeTab} pins yet
                        </h4>
                        <p className="small" style={{ color: 'var(--pinterest-text-muted)' }}>
                            {activeTab === 'created'
                                ? 'This user hasn\'t created any pins yet'
                                : 'This user hasn\'t saved any pins yet'
                            }
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OtherUserProfile;

