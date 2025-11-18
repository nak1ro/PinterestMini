import React from 'react';
import {motion} from 'framer-motion';
import {useParams} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {ArrowLeft, Eye} from 'react-bootstrap-icons';

import { useAppSelector } from '../../hooks/redux';
import { selectUser, selectUserId } from '../../store/slices/authSlice';
import useProfileController from '../../hooks/useProfileController';

import BoardsTab from './profileTabs/BoardsTab';
import PinsTab from './profileTabs/PinsTab';
import OtherUserProfile from './OtherUserProfile';
import UserListModal from '../common/UserListModal';

const Profile = () => {
    const {username} = useParams();
    const user = useAppSelector(selectUser);
    const userId = useAppSelector(selectUserId);

    // All logic/state lives in the controller hook
    const ctrl = useProfileController({username, user, userId});

    if (ctrl.viewAsOther) return renderOtherUserView();

    return (
        <motion.div
            className="container-fluid py-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            style={{color: '#111', minHeight: '100vh', backgroundColor: '#fafafa'}}
        >
            <div className="row">
                <div className="col-lg-9">
                    {renderHeader()}
                    {renderTabButtons()}
                    {ctrl.activeTab === 'pins'
                        ? renderPinsTab()
                        : <BoardsTab/>}
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
            <motion.div 
                className="d-flex justify-content-between align-items-center mb-5 px-3"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div>
                    <h1 className="fw-bold mb-2" style={{color: '#111', fontSize: '2rem'}}>
                        Your saved ideas
                    </h1>
                    <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                        Organize and manage your pins and boards
                    </p>
                </div>
            </motion.div>
        );
    }

    function renderTabButtons() {
        return (
            <motion.div
                className="d-flex justify-content-start px-3 border-bottom mb-4"
                style={{borderColor: '#e0e0e0'}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                {renderTabButton('pins', 'Pins')}
                {renderTabButton('boards', 'Boards')}
            </motion.div>
        );
    }

    function renderTabButton(tabKey, label) {
        const isActive = ctrl.activeTab === tabKey;
        return (
            <motion.button
                className="btn fw-semibold px-4 py-3 border-0 position-relative"
                onClick={() => ctrl.setActiveTab(tabKey)}
                style={{
                    color: isActive ? '#111' : '#777',
                    backgroundColor: 'transparent',
                    fontSize: '16px',
                    minWidth: '120px',
                    transition: 'color 0.2s ease',
                }}
                whileHover={{ color: '#111' }}
                whileTap={{ scale: 0.98 }}
            >
                {label}
                {isActive && (
                    <motion.div
                        className="position-absolute bottom-0 start-0 w-100"
                        style={{ height: '3px', backgroundColor: '#e60023' }}
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </motion.button>
        );
    }

    function renderPinsTab() {
        const handlePinDelete = async (pinId) => {
            // Refetch both lists to update the UI after deletion
            await Promise.all([ctrl.refetchCreated(), ctrl.refetchSaved()]);
        };

        return (
            <PinsTab
                pins={ctrl.pinsToShow}
                loading={ctrl.isLoadingPins}
                onlyMyPins={ctrl.onlyMyPins}
                setOnlyMyPins={ctrl.setOnlyMyPins}
                onDelete={handlePinDelete}
            />
        );
    }

    function renderSidebar() {
        return (
            <motion.div
                className="position-sticky"
                style={{
                    top: '100px',
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <div
                    className="p-4 rounded-3"
                    style={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    {/* Avatar + Name */}
                    <div className="text-center mb-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                        >
                            <img
                                src={ctrl.user?.profilePictureUrl || `${process.env.PUBLIC_URL || ''}/assets/avatar-default.svg`}
                                alt={ctrl.user?.username || 'User Avatar'}
                                className="rounded-circle mb-3"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    border: '3px solid #fff',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                                onError={(e) => {
                                    const fallback = `${process.env.PUBLIC_URL || ''}/assets/avatar-default.svg`;
                                    if (!e.target.src.endsWith(fallback)) e.target.src = fallback;
                                }}
                            />
                        </motion.div>
                        <h4 className="fw-bold mb-2" style={{color: '#111', fontSize: '1.25rem'}}>
                            {ctrl.user?.username || 'Unknown'}
                        </h4>
                        {ctrl.user?.email && (
                            <p className="text-muted small mb-3" style={{ fontSize: '0.875rem' }}>
                                {ctrl.user.email}
                            </p>
                        )}

                        {/* Followers + Following */}
                        <div className="d-flex justify-content-center gap-3 mt-4 mb-4">
                            <motion.div
                                className="text-center rounded-3 py-3 px-4 flex-grow-1"
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: '#f8f8f8',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.2s ease',
                                }}
                                onClick={ctrl.openFollowers}
                                whileHover={{ 
                                    backgroundColor: '#efefef',
                                    scale: 1.02,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="fw-bold fs-5 mb-1" style={{color: '#111'}}>
                                    {ctrl.followersCount ?? 0}
                                </div>
                                <div className="small text-muted" style={{ fontSize: '0.875rem' }}>Followers</div>
                            </motion.div>

                            <motion.div
                                className="text-center rounded-3 py-3 px-4 flex-grow-1"
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: '#f8f8f8',
                                    border: '1px solid #e0e0e0',
                                    transition: 'all 0.2s ease',
                                }}
                                onClick={ctrl.openFollowing}
                                whileHover={{ 
                                    backgroundColor: '#efefef',
                                    scale: 1.02,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="fw-bold fs-5 mb-1" style={{color: '#111'}}>
                                    {ctrl.followingCount ?? 0}
                                </div>
                                <div className="small text-muted" style={{ fontSize: '0.875rem' }}>Following</div>
                            </motion.div>
                        </div>

                        {/* View As Other */}
                        <motion.button
                            className="btn rounded-3 px-3 py-2 w-100 fw-medium d-flex align-items-center justify-content-center"
                            onClick={() => ctrl.setViewAsOther(true)}
                            style={{
                                border: '1px solid #ddd',
                                color: '#111',
                                backgroundColor: '#fff',
                                transition: 'all 0.2s ease',
                            }}
                            whileHover={{ 
                                backgroundColor: '#f8f8f8',
                                borderColor: '#ccc',
                                scale: 1.02
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Eye size={18} className="me-2"/>
                            View profile
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="border-top pt-4" style={{borderColor: '#e0e0e0'}}>
                        <div className="row g-3">
                            <motion.div 
                                className="col-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#fafafa' }}>
                                    <div className="fw-bold fs-4 mb-1" style={{color: '#111'}}>
                                        {ctrl.createdPins?.length ?? 0}
                                    </div>
                                    <div className="small text-muted" style={{ fontSize: '0.875rem' }}>Created</div>
                                </div>
                            </motion.div>
                            <motion.div 
                                className="col-6"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                            >
                                <div className="text-center p-3 rounded-3" style={{ backgroundColor: '#fafafa' }}>
                                    <div className="fw-bold fs-4 mb-1" style={{color: '#111'}}>
                                        {ctrl.savedPins?.length ?? 0}
                                    </div>
                                    <div className="small text-muted" style={{ fontSize: '0.875rem' }}>Saved</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    function renderOtherUserView() {
        return (
            <div>
                <motion.div 
                    className="position-fixed top-0 start-0 p-3" 
                    style={{zIndex: 1050}}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.button
                        className="btn rounded-3 px-4 py-2 d-flex align-items-center fw-medium shadow-sm"
                        onClick={() => ctrl.setViewAsOther(false)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid #e0e0e0',
                            color: '#111',
                        }}
                        whileHover={{ 
                            backgroundColor: '#fff',
                            scale: 1.02,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ArrowLeft size={18} className="me-2"/>
                        Back to My Profile
                    </motion.button>
                </motion.div>
                <OtherUserProfile username={ctrl.username || ctrl.user?.username} />
            </div>
        );
    }
};

export default Profile;
