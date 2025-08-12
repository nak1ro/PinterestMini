import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ArrowLeft, Eye } from 'react-bootstrap-icons';

import { useAppContext } from '../../context/AppContext';
import useProfileController from '../../hooks/useProfileController';

import BoardsTab from './profileTabs/BoardsTab';
import PinsTab from './profileTabs/PinsTab';
import OtherUserProfile from './OtherUserProfile';
import UserListModal from '../common/UserListModal';

const Profile = () => {
    const { username } = useParams();
    const { user, userId } = useAppContext();

    // All logic/state lives in the controller hook
    const ctrl = useProfileController({ username, user, userId });

    if (ctrl.viewAsOther) return renderOtherUserView();

    return (
        <motion.div
            className="container-fluid py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#111', minHeight: '100vh' }}
        >
            <div className="row">
                <div className="col-lg-9">
                    {renderHeader()}
                    {renderTabButtons()}
                    {ctrl.activeTab === 'pins'
                        ? renderPinsTab()
                        : <BoardsTab />}
                </div>
                <div className="col-lg-3">{renderSidebar()}</div>
            </div>

            <UserListModal
                show={ctrl.showModal}
                onClose={ctrl.closeModal}
                title={ctrl.modalTitle}
                users={ctrl.modalType === 'followers' ? ctrl.followers : ctrl.following}
                loading={ctrl.modalType === 'followers' ? ctrl.loadingFollowers : ctrl.loadingFollowing}
            />
        </motion.div>
    );

    // ======= subviews (presentational only) =======

    function renderHeader() {
        return (
            <div className="d-flex justify-content-between align-items-center mb-4 px-3">
                <h1 className="fw-bold fs-2 mb-0" style={{ color: '#111' }}>
                    Your saved ideas
                </h1>
            </div>
        );
    }

    function renderTabButtons() {
        return (
            <div
                className="d-flex justify-content-start px-3 border-bottom border-bottom"
                style={{ borderColor: '#ddd' }}
            >
                {renderTabButton('pins', 'Pins')}
                {renderTabButton('boards', 'Boards')}
            </div>
        );
    }

    function renderTabButton(tabKey, label) {
        const isActive = ctrl.activeTab === tabKey;
        return (
            <button
                className={`btn fw-semibold px-4 py-3 border-0 ${isActive ? 'border-bottom border-3' : ''}`}
                onClick={() => ctrl.setActiveTab(tabKey)}
                style={{
                    borderBottomColor: isActive ? '#e60023' : 'transparent',
                    color: isActive ? '#111' : '#777',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    minWidth: '120px',
                }}
            >
                {label}
            </button>
        );
    }

    function renderPinsTab() {
        return (
            <PinsTab
                pins={ctrl.pinsToShow}
                loading={ctrl.isLoadingPins}
                onlyMyPins={ctrl.onlyMyPins}
                setOnlyMyPins={ctrl.setOnlyMyPins}
            />
        );
    }

    function renderSidebar() {
        return (
            <div
                className="position-sticky p-4 rounded-3 shadow-sm "
                style={{
                    top: '100px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                }}
            >
                {/* Avatar + Name */}
                <div className="text-center mb-4">
                    <img
                        src={ctrl.user?.profilePictureUrl || '/assets/avatar-default.svg'}
                        alt={ctrl.user?.username || 'User Avatar'}
                        className="rounded-circle mb-3 border border-2"
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderColor: '#ccc',
                        }}
                        onError={(e) => {
                            const fallback = '/assets/avatar-default.svg';
                            if (!e.target.src.endsWith(fallback)) e.target.src = fallback;
                        }}
                    />
                    <h5 className="fw-bold mb-1" style={{ color: '#111' }}>
                        {ctrl.user?.username || 'Unknown'}
                    </h5>

                    {/* Followers + Following */}
                    <div className="d-flex justify-content-center gap-5 mt-3 mb-4">
                        <div
                            className="text-center border rounded-3 py-2 px-3"
                            style={{ cursor: 'pointer', minWidth: '100px' }}
                            onClick={ctrl.openFollowers}
                        >
                            <div className="fw-bold" style={{ color: '#111' }}>
                                {ctrl.followersCount ?? 0}
                            </div>
                            <div className="small" style={{ color: '#777' }}>Followers</div>
                        </div>

                        <div
                            className="text-center border rounded-3 py-2 px-3"
                            style={{ cursor: 'pointer', minWidth: '100px' }}
                            onClick={ctrl.openFollowing}
                        >
                            <div className="fw-bold" style={{ color: '#111' }}>
                                {ctrl.followingCount ?? 0}
                            </div>
                            <div className="small" style={{ color: '#777' }}>Following</div>
                        </div>
                    </div>

                    {/* View As Other */}
                    <Button
                        variant="outline-secondary"
                        className="rounded-3 px-3 py-2 w-100 fw-medium"
                        onClick={() => ctrl.setViewAsOther(true)}
                        style={{
                            border: '2px solid #ddd',
                            color: '#111',
                            backgroundColor: 'transparent',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f5f5f5';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.borderColor = '#ddd';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        <Eye size={16} className="me-2" />
                        View profile
                    </Button>
                </div>

                {/* Stats */}
                <div className="border-top pt-3" style={{ borderColor: '#ddd' }}>
                    <div className="row text-center">
                        <div className="col-6">
                            <div className="fw-bold" style={{ color: '#111' }}>
                                {ctrl.createdPins?.length ?? 0}
                            </div>
                            <div className="small" style={{ color: '#777' }}>Created</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold" style={{ color: '#111' }}>
                                {ctrl.savedPins?.length ?? 0}
                            </div>
                            <div className="small" style={{ color: '#777' }}>Saved</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function renderOtherUserView() {
        return (
            <div>
                <div className="position-fixed top-0 start-0 p-3" style={{ zIndex: 1050 }}>
                    <Button
                        variant="light"
                        className="rounded-pill px-3 py-2 shadow-sm"
                        onClick={() => ctrl.setViewAsOther(false)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #ccc',
                            transition: 'all 0.2s ease',
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

                {/* You said to keep the "view as other" design inside this component.
            If you decide to inline that UI fully, replace <OtherUserProfile /> here. */}
                <OtherUserProfile />
            </div>
        );
    }
};

export default Profile;
