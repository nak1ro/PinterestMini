import { useMemo, useState } from 'react';
import useSavedPins from './useSavedPins';
import useCreatedPins from './useCreatedPins';
import useFollowCounts from './useFollowCounts';
import useUserFollowers from './useUserFollowers';
import useUserFollowing from './useUserFollowing';

const useProfileController = ({ username, user, userId }) => {
    const [activeTab, setActiveTab] = useState('pins'); // 'pins' | 'boards'
    const [onlyMyPins, setOnlyMyPins] = useState(false);
    const [viewAsOther, setViewAsOther] = useState(false);

    // Data
    const { createdPins, loading: loadingCreated, refetch: refetchCreated } = useCreatedPins(username);
    const { savedPins, loading: loadingSaved, refetch: refetchSaved } = useSavedPins();
    const { followersCount } = useFollowCounts(userId);
    const { followingCount } = useFollowCounts(userId);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('followers'); // 'followers' | 'following'

    // Lazy-load modal lists only when opened
    const { followers, loading: loadingFollowers } = useUserFollowers(
        userId,
        showModal && modalType === 'followers'
    );
    const { following, loading: loadingFollowing } = useUserFollowing(
        userId,
        showModal && modalType === 'following'
    );

    // Helpers
    const mergeUniquePins = (a = [], b = []) => {
        const seen = new Set();
        const out = [];
        for (const p of [...a, ...b]) {
            if (!p) continue;
            const key = String(p.id);
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(p);
        }
        return out;
    };

    const isLoadingPins = useMemo(() => {
        return onlyMyPins ? loadingCreated : (loadingCreated || loadingSaved);
    }, [onlyMyPins, loadingCreated, loadingSaved]);

    const pinsToShow = useMemo(() => {
        if (onlyMyPins) return createdPins || [];
        return mergeUniquePins(createdPins || [], savedPins || []);
    }, [onlyMyPins, createdPins, savedPins]);

    // Modal API
    const openFollowers = () => {
        setModalType('followers');
        setModalTitle('Followers');
        setShowModal(true);
    };

    const openFollowing = () => {
        setModalType('following');
        setModalTitle('Following');
        setShowModal(true);
    };

    const closeModal = () => setShowModal(false);

    return {
        // state
        activeTab,
        onlyMyPins,
        viewAsOther,
        user,
        userId,
        username,

        // data
        createdPins,
        savedPins,
        followersCount,
        followingCount,

        // derived
        isLoadingPins,
        pinsToShow,

        // modal
        showModal,
        modalTitle,
        modalType,
        followers,
        following,
        loadingFollowers,
        loadingFollowing,
        openFollowers,
        openFollowing,
        closeModal,

        // setters
        setActiveTab,
        setOnlyMyPins,
        setViewAsOther,

        // refetch functions for data updates
        refetchCreated,
        refetchSaved,
    };
};

export default useProfileController;
