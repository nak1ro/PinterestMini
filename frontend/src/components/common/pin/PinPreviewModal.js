import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import useSavedPins from '../../../hooks/useSavedPins';
import usePinLike from '../../../hooks/usePinLike';
import useComments from '../../../hooks/useComments';

const ActionButton = ({icon, onClick, alt, animationKey}) => (
    <motion.button
        className="btn btn-sm d-flex align-items-center"
        onClick={onClick}
        whileHover={{scale: 1.05}}
        transition={{type: 'spring', stiffness: 300, damping: 20}}
        style={{
            outline: 'none',
            boxShadow: 'none',
            borderColor: 'transparent',
            background: 'transparent',
        }}
    >
            <motion.img
                key={animationKey}
                src={icon}
                alt={alt}
                style={{width: 26, height: 26}}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.2}}
            />

    </motion.button>
);

const CommentInput = ({newComment, setNewComment, onPost}) => (
    <div className="input-group mb-3">
        <input
            type="text"
            className="form-control"
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button" onClick={onPost}>
            Post
        </button>
    </div>
);

const CommentList = ({comments, loading}) => {
    if (loading) return <p>Loading comments...</p>;
    if (comments.length === 0) return <p>No comments yet</p>;

    return (
        <ul className="list-unstyled">
            {comments.map((c) => (
                <li key={c.id} className="d-flex mb-3 align-items-start">
                    <img
                        src={c.userAvatarUrl || '/assets/avatar-default.svg'}
                        alt={c.username}
                        className="rounded-circle me-2"
                        style={{width: 32, height: 32, objectFit: 'cover'}}
                        onError={(e) => {
                            e.target.src = '/assets/avatar-default.svg';
                        }}
                    />
                    <div>
                        <div className="fw-semibold">{c.username || 'User'}</div>
                        <div className="small text-muted">{new Date(c.createdAt).toLocaleDateString()}</div>
                        <div>{c.content}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const PinPreviewModal = ({pin, onClose}) => {
    const {savePin, unsavePin, isPinSaved} = useSavedPins();
    const {liked, likeCount, toggleLike} = usePinLike(pin.id);
    const {comments, loading: loadingComments, addComment} = useComments(pin.id);
    const saved = isPinSaved(pin.id);
    const [newComment, setNewComment] = useState('');
    const commentRef = useRef(null);
    const navigate = useNavigate();

    const avatarUrl = pin.owner?.profilePictureUrl || '/assets/avatar-default.svg';
    const username = pin.owner?.username || 'Unknown';

    const handleDownload = (e) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = pin.imageUrl;
        a.download = 'pin.jpg';
        a.click();
    };

    const scrollToComments = () => {
        commentRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    };

    const handlePostComment = async () => {
        if (newComment.trim()) {
            await addComment(newComment);
            setNewComment('');
        }
    };

    const goToAuthorProfile = (e) => {
        e.stopPropagation();
        if (pin.owner?.id) {
            navigate(`/profile/${pin.owner.id}`);
        }
    };

    if (!pin) return null;

    return (
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
            style={{zIndex: 1050}}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
        >
            <motion.div
                className="card shadow-lg overflow-hidden"
                style={{
                    maxWidth: '800px',
                    width: '100%',
                    height: 'calc(100vh - 30px)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
                initial={{scale: 0.9, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                transition={{duration: 0.3}}
            >
                <div className="overflow-auto" style={{flex: 1}}>
                    {/* HEADER */}
                    <div className="card-header d-flex justify-content-between align-items-center p-3">
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="d-flex align-items-center justify-content-start"
                                style={{width: 60}}
                            >
                                <ActionButton
                                    icon={liked ? "/assets/like_full.png" : "/assets/like.png"}
                                    onClick={toggleLike}
                                    alt={liked ? "Unlike" : "Like"}
                                    animationKey={liked ? "liked" : "unliked"}
                                />
                                <span className="fw-semibold ms-1">{likeCount}</span>
                            </div>

                            <ActionButton
                                icon="/assets/message.png"
                                onClick={scrollToComments}
                                alt="comment"
                                animationKey="message"
                            />
                            <ActionButton
                                icon="/assets/share.png"
                                onClick={handleDownload}
                                alt="share"
                                animationKey="share"
                            />
                        </div>


                        <button
                            className={`btn btn-sm px-3 rounded-3 ${saved ? 'btn-light border' : 'btn-danger'}`}
                            onClick={() => (saved ? unsavePin(pin.id) : savePin(pin.id))}
                        >
                            {saved ? 'Saved' : 'Save'}
                        </button>
                    </div>

                    {/* IMAGE */}
                    <div className="position-relative d-flex justify-content-center mb-3 mt-3 align-items-center px-3">
                        <img
                            src={pin.imageUrl}
                            alt={pin.title}
                            className="img-fluid rounded-3"
                            style={{maxWidth: '100%', height: '525px', objectFit: 'contain'}}
                            onError={(e) => {
                                e.target.src = '/assets/image-fallback.jpg';
                            }}
                        />
                    </div>

                    {/* TITLE + DESCRIPTION */}
                    <div className="card-body pt-0">
                        <h4 className="fw-bold mb-2" style={{fontSize: '1.6rem'}}>
                            {pin.title || 'Untitled Pin'}
                        </h4>
                        <p className="mb-2" style={{color: '#555', fontSize: '0.95rem'}}>
                            {pin.description || ''}
                        </p>
                        <div className="mb-2 d-flex flex-wrap gap-2">
                            {(pin.tag || []).map(tag => (
                                <span key={tag} className="badge bg-secondary">#{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* OWNER */}
                    <div className="card-footer bg-transparent border-top-0 mb-2 px-3 py-2">
                        <div className="d-flex align-items-center" onClick={goToAuthorProfile}>
                            <img
                                src={avatarUrl}
                                alt={username}
                                className="rounded-circle me-2"
                                style={{width: '40px', height: '40px', objectFit: 'cover', cursor: 'pointer'}}
                                onError={(e) => {
                                    e.target.src = '/assets/avatar-default.svg';
                                }}
                            />
                            <h6 className="mb-0">{username}</h6>
                        </div>
                    </div>

                    {/* COMMENTS */}
                    <div className="card-footer pb-3 mt-2" ref={commentRef} style={{backgroundColor: 'transparent'}}
                    >
                        <p className="mb-2 fw-bold">Comments</p>
                        <CommentInput newComment={newComment} setNewComment={setNewComment} onPost={handlePostComment}/>
                        <CommentList comments={comments} loading={loadingComments}/>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PinPreviewModal;
