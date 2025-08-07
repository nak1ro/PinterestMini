import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {useParams} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {ArrowLeft, Eye} from 'react-bootstrap-icons';

import {useAppContext} from '../../context/AppContext';
import useSavedPins from '../../hooks/useSavedPins';
import useCreatedPins from '../../hooks/useCreatedPins';
import useFollowCounts from '../../hooks/useFollowCounts';
import useUserFollowers from '../../hooks/useUserFollowers';
import useUserFollowing from '../../hooks/useUserFollowing';

import BoardsTab from '../common/layout/profileTabs/BoardsTab';
import PinsTab from '../common/layout/profileTabs/PinsTab';
import OtherUserProfile from './OtherUserProfile';
import UserListModal from '../common/layout/UserListModal';

const Profile = () => {
    const {username} = useParams();
    const [activeTab, setActiveTab] = useState('pins');
    const [onlyMyPins, setOnlyMyPins] = useState(false);
    const [viewAsOther, setViewAsOther] = useState(false);

    const {user, userId} = useAppContext();
    const {createdPins, loading: loadingCreated} = useCreatedPins(username);
    const {savedPins, loading: loadingSaved} = useSavedPins();
    const {followersCount} = useFollowCounts(userId);
    const {followingCount} = useFollowCounts(userId);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('followers'); // 'followers' | 'following'

    const {
        followers,
        loading: loadingFollowers,
    } = useUserFollowers(userId, showModal && modalType === 'followers');

    const {
        following,
        loading: loadingFollowing,
    } = useUserFollowing(userId, showModal && modalType === 'following');

    const isLoadingPins =
        (onlyMyPins && loadingCreated) ||
        (!onlyMyPins && (loadingCreated || loadingSaved));

    const pinsToShow = onlyMyPins
        ? createdPins
        : [...(createdPins || []), ...(savedPins || [])];

    if (viewAsOther) return renderOtherUserView();

    return (
        <motion.div
            className="container-fluid py-4"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.3}}
            style={{color: '#111', minHeight: '100vh'}}
        >
            <div className="row">
                <div className="col-lg-9">
                    {renderHeader()}
                    {renderTabButtons()}
                    {activeTab === 'pins' ? renderPinsTab() : <BoardsTab/>}
                </div>
                <div className="col-lg-3">{renderSidebar()}</div>
            </div>

            {/* === FOLLOWERS/FOLLOWING MODAL === */}
            <UserListModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={modalTitle}
                users={modalType === 'followers' ? followers : following}
                loading={modalType === 'followers' ? loadingFollowers : loadingFollowing}
            />
        </motion.div>
    );

    // === Header
    function renderHeader() {
        return (
            <div className="d-flex justify-content-between align-items-center mb-4 px-3">
                <h1 className="fw-bold fs-2 mb-0" style={{color: '#111'}}>
                    Your saved ideas
                </h1>
            </div>
        );
    }

    // === Tabs
    function renderTabButtons() {
        return (
            <div className="d-flex justify-content-start px-3 border-bottom border-bottom"
                 style={{borderColor: '#ddd'}}>
                {renderTabButton('pins', 'Pins')}
                {renderTabButton('boards', 'Boards')}
            </div>
        );
    }

    function renderTabButton(tabKey, label) {
        const isActive = activeTab === tabKey;
        return (
            <button
                className={`btn fw-semibold px-4 py-3 border-0 ${
                    isActive ? 'border-bottom border-3' : ''
                }`}
                onClick={() => setActiveTab(tabKey)}
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

    // === Pins Tab
    function renderPinsTab() {
        return (
            <PinsTab
                pins={pinsToShow}
                loading={isLoadingPins}
                onlyMyPins={onlyMyPins}
                setOnlyMyPins={setOnlyMyPins}
            />
        );
    }

    // === Sidebar
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
                        src={user?.profilePictureUrl || '/assets/avatar-default.svg'}
                        alt={user?.username || 'User Avatar'}
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
                    <h5 className="fw-bold mb-1" style={{color: '#111'}}>
                        {user?.username || 'Unknown'}
                    </h5>

                    {/* Followers + Following Row */}
                    <div className="d-flex justify-content-center gap-5 mt-3 mb-4">
                        {/* Followers */}
                        <div
                            className="text-center border rounded-3 py-2 px-3"
                            style={{
                                cursor: 'pointer', minWidth: '100px',
                            }}
                            onClick={() => {
                                setModalType('followers');
                                setModalTitle('Followers');
                                setShowModal(true);
                            }}
                        >
                            <div className="fw-bold" style={{color: '#111'}}>
                                {followersCount ?? 0}
                            </div>
                            <div className="small" style={{color: '#777'}}>Followers</div>
                        </div>

                        {/* Following */}
                        <div
                            className="text-center border rounded-3 py-2 px-3"
                            style={{
                                cursor: 'pointer', minWidth: '100px',
                            }}
                            onClick={() => {
                                setModalType('following');
                                setModalTitle('Following');
                                setShowModal(true);
                            }}
                        >
                            <div className="fw-bold" style={{color: '#111'}}>
                                {followingCount ?? 0}
                            </div>
                            <div className="small" style={{color: '#777'}}>Following</div>
                        </div>
                    </div>

                    {/* View As Other Button */}
                    <Button
                        variant="outline-secondary"
                        className="rounded-3 px-3 py-2 w-100 fw-medium"
                        onClick={() => setViewAsOther(true)}
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
                        <Eye size={16} className="me-2"/>
                        View profile
                    </Button>
                </div>

                {/* Stats */}
                <div className="border-top pt-3" style={{borderColor: '#ddd'}}>
                    <div className="row text-center">
                        <div className="col-6">
                            <div className="fw-bold" style={{color: '#111'}}>
                                {createdPins?.length ?? 0}
                            </div>
                            <div className="small" style={{color: '#777'}}>Created</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold" style={{color: '#111'}}>
                                {savedPins?.length ?? 0}
                            </div>
                            <div className="small" style={{color: '#777'}}>Saved</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // === Other User View
    function renderOtherUserView() {
        return (
            <div>
                <div className="position-fixed top-0 start-0 p-3" style={{zIndex: 1050}}>
                    <Button
                        variant="light"
                        className="rounded-pill px-3 py-2 shadow-sm"
                        onClick={() => setViewAsOther(false)}
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
                        <ArrowLeft size={16} className="me-2"/>
                        Back to My Profile
                    </Button>
                </div>

                <OtherUserProfile/>
            </div>
        );
    }
};

export default Profile;