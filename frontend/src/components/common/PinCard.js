import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router-dom';
import {useAppContext} from '../../context/AppContext';
import PinPreviewModal from './PinPreviewModal';

const PinCard = ({pin}) => {
    const {savePin, unsavePin, isPinSaved} = useAppContext();
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
                <img
                    src={pin.image}
                    alt={pin.title}
                    className="card-img-top img-fluid"
                    style={{objectFit: 'cover'}}
                />

                {/* Hover overlay */}
                <AnimatePresence>
                    TODO: Remove elevating animation when in overlay mode;
                    Author name should appear only on hover;
                    When appearing, author name doesn't need elevation animation;
                    When disappearing, author name needs elevation animation;

                    {isHovered && (
                        <motion.div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3"
                            style={{backgroundColor: 'rgba(0,0,0,0.5)', color: 'white'}}
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.2}}
                        >
                            <div className="d-flex justify-content-end">
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
                                className="d-flex align-items-center justify-content-between mt-auto"
                                initial={{y: 20, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{delay: 0.1}}
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
                                    <span>{pin.user.username}</span>
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="card-body">
                    <h5 className="card-title mb-2">{pin.title}</h5>
                    <Link
                        to={`/profile/${pin.user.username}`}
                        className="d-flex align-items-center text-decoration-none text-dark"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={pin.user.avatar}
                            alt={pin.user.username}
                            className="rounded-circle me-2"
                            style={{width: '24px', height: '24px', objectFit: 'cover'}}
                        />
                        <span>{pin.user.username}</span>
                    </Link>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPreview && (
                    <PinPreviewModal
                        pin={pin}
                        onClose={() => setShowPreview(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default PinCard;
