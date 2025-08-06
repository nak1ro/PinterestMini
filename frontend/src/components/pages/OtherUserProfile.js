import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PersonPlus, PersonCheck } from 'react-bootstrap-icons';

import { useAppContext } from '../../context/AppContext';
import useCreatedPins from '../../hooks/useCreatedPins';
import useSavedPins from '../../hooks/useSavedPins';
import useFollowCounts from '../../hooks/useFollowCounts';
import useUserProfile from '../../hooks/useUserProfile'; // Custom hook
import PinGrid from '../common/pin/PinGrid';

const OtherUserProfile = () => {
    const { username } = useParams(); // Get username from URL
    const [activeTab, setActiveTab] = useState('created');
    const [isFollowing, setIsFollowing] = useState(false);

    const { userId } = useAppContext();
    const { profile, loading: loadingProfile, error: profileError } = useUserProfile(username); // Using custom hook
    const { createdPins, loading: loadingCreated } = useCreatedPins(username);
    const { savedPins, loading: loadingSaved } = useSavedPins(username);
    const { followersCount, followingCount } = useFollowCounts(profile?.id);

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing);
        // TODO: Trigger API call to follow/unfollow here
    };

    const pinsToShow = activeTab === 'created' ? createdPins : savedPins;
    const isLoadingPins = activeTab === 'created' ? loadingCreated : loadingSaved;

    const avatarSrc = profile?.profilePictureUrl || '/assets/avatar-default.svg';
    const displayName = profile?.username || 'Unknown user';
    const bio = profile?.bio || 'No bio provided.';

    if (loadingProfile) {
        return <div>Loading...</div>;
    }

    if (profileError) {
        return <div>Error: {profileError}</div>;
    }

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
                    src={avatarSrc}
                    alt={displayName}
                    className="rounded-circle mb-4 border border-3"
                    style={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        borderColor: 'var(--pinterest-border)'
                    }}
                    onError={(e) => {
                        const fallback = '/assets/avatar-default.svg';
                        if (!e.target.src.endsWith(fallback)) {
                            e.target.src = fallback;
                        }
                    }}
                />
                <h1 className="fw-bold fs-2 mb-2" style={{ color: 'var(--pinterest-text)' }}>
                    {displayName}
                </h1>
                <p
                    className="text-center mx-auto mb-4"
                    style={{
                        maxWidth: '500px',
                        color: 'var(--pinterest-text-muted)'
                    }}
                >
                    {bio}
                </p>

                {/* Follow Button */}
                <Button
                    variant={isFollowing ? 'outline-secondary' : 'danger'}
                    className="rounded-pill px-4 py-2 fw-semibold mb-4"
                    onClick={handleFollowToggle}
                    style={{
                        background: isFollowing ? 'transparent' : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: isFollowing ? '2px solid var(--pinterest-border)' : 'none',
                        color: isFollowing ? 'var(--pinterest-text)' : 'white',
                        transition: 'all 0.2s ease',
                        minWidth: '120px'
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
                        <div className="fw-bold fs-4">{followersCount ?? '-'}</div>
                        <div className="small text-muted">followers</div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold fs-4">{followingCount ?? '-'}</div>
                        <div className="small text-muted">following</div>
                    </div>
                    <div className="text-center">
                        <div className="fw-bold fs-4">{createdPins?.length ?? '-'}</div>
                        <div className="small text-muted">pins created</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="d-flex justify-content-center border-bottom mb-5" style={{ borderColor: 'var(--pinterest-border)' }}>
                <button
                    className={`btn fw-semibold px-4 py-3 border-0 ${activeTab === 'created' ? 'border-bottom border-3' : ''}`}
                    onClick={() => setActiveTab('created')}
                    style={{
                        borderBottomColor: activeTab === 'created' ? '#e60023' : 'transparent',
                        color: activeTab === 'created' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Created Pins
                </button>
                <button
                    className={`btn fw-semibold px-4 py-3 border-0 ${activeTab === 'saved' ? 'border-bottom border-3' : ''}`}
                    onClick={() => setActiveTab('saved')}
                    style={{
                        borderBottomColor: activeTab === 'saved' ? '#e60023' : 'transparent',
                        color: activeTab === 'saved' ? 'var(--pinterest-text)' : 'var(--pinterest-text-muted)',
                        backgroundColor: 'transparent',
                        fontSize: '16px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    Saved Pins
                </button>
            </div>

            {/* Pins */}
            <div className="px-3">
                {isLoadingPins ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading {activeTab} pins...</p>
                    </div>
                ) : pinsToShow && pinsToShow.length > 0 ? (
                    <PinGrid pins={pinsToShow} />
                ) : (
                    <div className="text-center py-5">
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
                        <h4 className="fw-normal mt-3 text-muted">
                            No {activeTab} pins yet
                        </h4>
                        <p className="small text-muted">
                            {activeTab === 'created'
                                ? "This user hasn't created any pins yet"
                                : "This user hasn't saved any pins yet"}
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OtherUserProfile;
