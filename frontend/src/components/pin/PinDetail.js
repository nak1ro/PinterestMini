import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import { getPinById, getPinsByTag } from '../../services/pinService';
import PinGrid from './PinGrid';
import PinEditModal from './PinEditModal';
import { useAppContext } from '../../context/AppContext';
import useSavedPins from '../../hooks/useSavedPins';
import usePinLike from '../../hooks/usePinLike';
import useFollowCounts from '../../hooks/useFollowCounts';
import { copyTextToClipboard } from '../../utils/clipboard';

const PinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPins, setRelatedPins] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const { savePin, unsavePin, isPinSaved } = useSavedPins();
  const { liked, likeCount, toggleLike } = usePinLike(pin?.id);
  const { followersCount } = useFollowCounts(pin?.owner?.id);

  const [saved, setSaved] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchPin = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const pinData = await getPinById(id);
        setPin(pinData);
        
        if (user && pinData.id) {
          setCheckingSaved(true);
          try {
            const isSavedStatus = await isPinSaved(pinData.id);
            setSaved(isSavedStatus);
          } catch (err) {
            console.error('Failed to check saved status:', err);
          } finally {
            setCheckingSaved(false);
          }
        }
      } catch (err) {
        console.error('Failed to load pin:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load pin');
      } finally {
        setLoading(false);
      }
    };

    fetchPin();
  }, [id, user]);

  useEffect(() => {
    const fetchRelatedPins = async () => {
      if (!pin || !pin.tags || pin.tags.length === 0) return;

      setLoadingRelated(true);
      try {
        const firstTag = Array.isArray(pin.tags)
          ? (pin.tags[0]?.name || pin.tags[0])
          : null;
        
        if (firstTag) {
          const response = await getPinsByTag(firstTag);
          const pinsData = response?.data || response || [];
          // Filter out current pin and limit to 6
          const filtered = pinsData
            .filter(p => p.id !== parseInt(id))
            .slice(0, 6);
          setRelatedPins(filtered);
        }
      } catch (err) {
        console.error('Failed to load related pins:', err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedPins();
  }, [pin, id]);

  const handleSaveClick = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      if (saved) {
        await unsavePin(pin.id);
        setSaved(false);
      } else {
        await savePin(pin.id);
        setSaved(true);
      }
    } catch (err) {
      console.error('Failed to save/unsave pin:', err);
      alert('Failed to save pin. Please try again.');
    }
  };

  const handleAuthorClick = () => {
    if (pin?.owner?.username) {
      navigate(`/profile/${pin.owner.username}`);
    }
  };

  const handleShare = async () => {
    const pinUrl = `${window.location.origin}/pin/${pin.id}`;
    try {
      const copied = await copyTextToClipboard(pinUrl);
      if (!copied) {
        throw new Error('Clipboard copy rejected');
      }
      // Show temporary message
      const tempAlert = document.createElement('div');
      tempAlert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 text-center';
      tempAlert.style.zIndex = '9999';
      tempAlert.textContent = `Link copied: ${pinUrl}`;
      document.body.appendChild(tempAlert);
      setTimeout(() => {
        tempAlert.remove();
      }, 2000);
    } catch (err) {
      console.error('Link copied to the clipboard!', err);
      alert('Link copied to the clipboard!');
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditApply = (updates) => {
    // Update local pin state with edits
    setPin((prev) => ({
      ...prev,
      ...updates
    }));
    setShowEditModal(false);
  };

  // Check if current user is the owner
  const isOwner = user && pin && (
    (pin.ownerId && pin.ownerId === user.id) ||
    (pin.owner && pin.owner.id === user.id)
  );

  const getTagName = (tag) => {
    if (typeof tag === 'string') return tag;
    if (tag?.name) return tag.name;
    return '';
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3 text-muted">Loading pin...</p>
      </div>
    );
  }

  if (error || !pin) {
    return (
      <div className="container py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error || 'Pin not found'}</p>
        </Alert>
      </div>
    );
  }

  const imageUrl = pin.imageUrl || pin.image || '';
  const avatarUrl = pin.owner?.profilePictureUrl || '/assets/avatar-default.svg';
  const username = pin.owner?.username || 'Unknown';
  const tags = Array.isArray(pin.tags) ? pin.tags : [];

  return (
    <motion.div
      className="container py-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-4 overflow-hidden shadow-lg d-flex flex-column flex-md-row mb-5">
        <div className="w-100 w-md-50">
          <img
            src={imageUrl}
            alt={pin.title || 'Pin image'}
            className="w-100 h-100 object-fit-cover"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = '/assets/avatar-default.svg';
            }}
          />
        </div>
        <div className="p-4 d-flex flex-column justify-content-between w-100">
          <div className="d-flex justify-content-end mb-3">
            {user && (
              <button
                className={`btn rounded-pill fw-semibold px-4 ${saved ? 'btn-secondary' : 'btn-danger'}`}
                onClick={handleSaveClick}
                disabled={checkingSaved}
              >
                {checkingSaved ? 'Loading...' : saved ? 'Saved' : 'Save'}
              </button>
            )}
          </div>

          <div>
            <h1 className="h3 fw-bold mb-3">{pin.title || 'Untitled Pin'}</h1>
            {pin.description && (
              <p className="text-muted mb-4">{pin.description}</p>
            )}

            <div className="d-flex align-items-center mb-4" style={{ cursor: 'pointer' }} onClick={handleAuthorClick}>
              <img
                src={avatarUrl}
                alt={username}
                className="rounded-circle me-3"
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/avatar-default.svg';
                }}
              />
              <div>
                <div className="fw-semibold">{username}</div>
                {followersCount !== null && (
                  <small className="text-muted">
                    {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                  </small>
                )}
              </div>
            </div>

            {tags.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => {
                  const tagName = getTagName(tag);
                  if (!tagName) return null;
                  return (
                    <Link
                      key={index}
                      to={`/tag/${encodeURIComponent(tagName)}`}
                      className="badge bg-secondary text-decoration-none"
                    >
                      #{tagName}
                    </Link>
                  );
                })}
              </div>
            )}

            {user && (
              <div className="d-flex align-items-center gap-3">
                <button
                  className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={toggleLike}
                >
                  {liked ? '❤️ Liked' : '🤍 Like'} {likeCount > 0 && `(${likeCount})`}
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleShare}
                  title="Copy link"
                >
                  📤 Share
                </button>
                {isOwner && (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleEditClick}
                    title="Edit pin"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedPins.length > 0 && (
        <div className="mb-4">
          <h2 className="fw-bold fs-5 mb-3">More like this</h2>
          {loadingRelated ? (
            <div className="text-center py-3">
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            <PinGrid pins={relatedPins} />
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && pin && (
        <PinEditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          pin={pin}
          onApply={handleEditApply}
        />
      )}
    </motion.div>
  );
};

export default PinDetail;
