import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router-dom';
import useSavedPins from '../../../hooks/useSavedPins'; // ✅ NEW: our hook
import PinPreviewModal from './PinPreviewModal';
import {Download} from 'react-bootstrap-icons';

const PinCard = ({pin}) => {
    const {savePin, unsavePin, isPinSaved} = useSavedPins(); // ✅ use the hook
    const saved = isPinSaved(pin.id);
    const [isHovered, setIsHovered] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        saved ? unsavePin(pin.id) : savePin(pin.id);
    };

    const handlePinClick = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    return (
        <>
            <motion.div
                className="card mb-3 shadow-sm border-0 overflow-hidden position-relative"
                whileHover={{y: -5}}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.3}}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handlePinClick}
                style={{cursor: 'pointer'}}
            >
                <div className="position-relative w-100">
                    <img
                        src={pin.image}
                        alt={pin.title}
                        className="img-fluid w-100"
                        style={{display: 'block'}}
                    />

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between"
                                style={{backgroundColor: 'rgba(0,0,0,0.5)', color: 'white'}}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.2}}
                            >
                                <div className="d-flex justify-content-between p-3">
                                    <motion.a
                                        href={pin.image}
                                        download
                                        className="d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            padding: 0,
                                            backgroundColor: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.6)',
                                            borderRadius: '6px',
                                            color: 'white'
                                        }}
                                        whileHover={{scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)'}}
                                        whileTap={{scale: 0.95}}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download size={18}/>
                                    </motion.a>

                                    <motion.button
                                        className={`btn btn-sm ${saved ? 'btn-light' : 'btn-danger'}`}
                                        onClick={handleSaveClick}
                                        whileHover={{scale: 1.05}}
                                        whileTap={{scale: 0.95}}
                                    >
                                        {saved ? 'Saved' : 'Save'}
                                    </motion.button>
                                </div>

                                <motion.div
                                    className="d-flex align-items-center px-3 pb-3"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.3, ease: 'easeInOut'}}
                                >
                                    <Link
                                        to={`/profile/${pin.user.username}`}
                                        className="d-flex align-items-center text-white text-decoration-none"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <img
                                            src={pin.user.avatar}
                                            alt={pin.user.username}
                                            className="rounded-circle me-2"
                                            style={{width: '24px', height: '24px', objectFit: 'cover'}}
                                        />
                                        <span className="small">{pin.user.username}</span>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPreview && (
                    <PinPreviewModal pin={pin} onClose={() => setShowPreview(false)}/>
                )}
            </AnimatePresence>
        </>
    );
};

export default PinCard;
