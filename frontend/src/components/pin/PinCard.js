import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from 'react-router-dom';
import useSavedPins from '../../hooks/useSavedPins';
import PinPreviewModal from './PinPreviewModal';

const PinCard = ({pin}) => {
    const {savePin, unsavePin, isPinSaved} = useSavedPins();
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

    return (<>
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
                    src={pin.imageUrl}
                    alt={pin.title}
                    className="img-fluid w-100"
                    style={{display: 'block'}}
                />

                <AnimatePresence>
                    {isHovered && (<motion.div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between"
                        style={{backgroundColor: 'rgba(0,0,0,0.5)', color: 'white'}}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                    >

                        {/* Top Row */}
                        <div className="d-flex fw-bold justify-content-between align-items-center p-3 gap-2">
                            {/* Save button (left) */}
                            <motion.button
                                className={`btn btn-sm px-3 fw-bold rounded-3 d-flex align-items-center justify-content-center`}
                                onClick={handleSaveClick}
                                style={{
                                    fontSize: '0.9rem',
                                    border: 'none',
                                    height: '36px',
                                    minWidth: '70px',
                                    background: saved ? '#dddddd' : 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                    color: saved ? '#333' : '#fff',
                                }}
                                whileHover={{scale: 1.04}}
                                whileTap={{scale: 0.97}}
                            >
                                {saved ? 'Saved' : 'Save'}
                            </motion.button>

                            {/* Owner link (right) */}
                            <motion.div
                                className="d-flex align-items-center rounded-3 px-2 py-1"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.3)', height: '36px', minWidth: '80px',
                                }}
                                whileHover={{scale: 1.04}}
                                whileTap={{scale: 0.97}}
                            >
                                <Link
                                    to={`/profile/${pin.owner?.username || pin.owner?.id}`}
                                    className="d-flex align-items-center text-white text-decoration-none w-100 h-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={pin.owner?.profilePictureUrl || '/assets/avatar-default.svg'}
                                        alt={pin.owner?.username || 'User'}
                                        className="rounded-circle me-2"
                                        style={{width: '26px', height: '26px', objectFit: 'cover'}}
                                        onError={(e) => {
                                            e.target.src = '/assets/avatar-default.svg';
                                        }}
                                    />
                                    <span className="small">
                                              {pin.owner?.username?.length > 8
                                                  ? `${pin.owner.username.slice(0, 8)}...`
                                                  : pin.owner?.username || 'Unknown'}
                                    </span>
                                </Link>
                            </motion.div>

                        </div>
                    </motion.div>)}
                </AnimatePresence>

            </div>
        </motion.div>

        <AnimatePresence>
            {showPreview && (<PinPreviewModal pin={pin} onClose={() => setShowPreview(false)}/>)}
        </AnimatePresence>
    </>);
};

export default PinCard;
