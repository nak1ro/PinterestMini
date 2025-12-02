import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'react-bootstrap-icons';


const EnhancedImageViewer = ({ show, imageUrl, imageAlt, onClose, isMobile }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [swipeStartY, setSwipeStartY] = useState(0);
    const [swipeDistance, setSwipeDistance] = useState(0);
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const lastTouchDistance = useRef(null);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (show) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setSwipeDistance(0);
        }
    }, [show]);

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            lastTouchDistance.current = distance;
        } else if (e.touches.length === 1 && scale === 1) {
            setSwipeStartY(e.touches[0].clientY);
            setIsDragging(true);
        } else if (e.touches.length === 1 && scale > 1) {
            dragStart.current = {
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            };
            setIsDragging(true);
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && lastTouchDistance.current) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            
            const delta = distance / lastTouchDistance.current;
            const newScale = Math.max(1, Math.min(4, scale * delta));
            setScale(newScale);
            lastTouchDistance.current = distance;
        } else if (e.touches.length === 1 && isDragging) {
            if (scale === 1) {
                const currentY = e.touches[0].clientY;
                const distance = currentY - swipeStartY;
                if (distance > 0) { 
                    setSwipeDistance(distance);
                }
            } else {
                e.preventDefault();
                const newX = e.touches[0].clientX - dragStart.current.x;
                const newY = e.touches[0].clientY - dragStart.current.y;
                setPosition({ x: newX, y: newY });
            }
        }
    };

    const handleTouchEnd = (e) => {
        lastTouchDistance.current = null;
        setIsDragging(false);

        if (scale === 1 && swipeDistance > 100) {
            onClose();
        } else {
            setSwipeDistance(0);
        }
    };

    const handleDoubleTap = (e) => {
        if (scale > 1) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        } else {
            setScale(2);
            const rect = imageRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                setPosition({ x: -x, y: -y });
            }
        }
    };

    const handleWheel = (e) => {
        if (!isMobile) {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = Math.max(1, Math.min(4, scale * delta));
            setScale(newScale);
            if (newScale === 1) {
                setPosition({ x: 0, y: 0 });
            }
        }
    };

    const opacity = 1 - Math.min(swipeDistance / 300, 0.7);

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ 
                            zIndex: 3000, 
                            backgroundColor: `rgba(0, 0, 0, ${0.95 * opacity})`,
                            // Add safe area padding
                            paddingTop: 'env(safe-area-inset-top)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: opacity }}
                        exit={{ opacity: 0 }}
                        onClick={() => scale === 1 && onClose()}
                    />
                    
                    {/* Image container */}
                    <div 
                        ref={containerRef}
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ 
                            zIndex: 3001,
                            paddingTop: 'env(safe-area-inset-top)',
                            paddingBottom: 'env(safe-area-inset-bottom)',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onWheel={handleWheel}
                    >
                        <motion.div
                            className="position-relative"
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            initial={{ opacity: 0, scale: 0.9, y: 0 }}
                            animate={{ 
                                opacity: opacity, 
                                scale: 1,
                                y: swipeDistance
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <motion.img
                                ref={imageRef}
                                src={imageUrl}
                                alt={imageAlt}
                                onDoubleClick={!isMobile ? handleDoubleTap : undefined}
                                onTouchEnd={(e) => {
                                    // Double-tap detection for mobile
                                    if (e.timeStamp - (imageRef.current?.lastTap || 0) < 300) {
                                        handleDoubleTap(e);
                                    }
                                    imageRef.current.lastTap = e.timeStamp;
                                }}
                                style={{
                                    maxWidth: scale === 1 ? '98vw' : 'none',
                                    maxHeight: scale === 1 ? '98vh' : 'none',
                                    width: scale > 1 ? `${100 * scale}%` : 'auto',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: isMobile ? '0' : '16px',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                                    transform: `translate(${position.x}px, ${position.y}px)`,
                                    cursor: scale > 1 ? 'move' : 'zoom-in',
                                    userSelect: 'none',
                                    touchAction: 'none',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isMobile && scale === 1) {
                                        handleDoubleTap(e);
                                    }
                                }}
                                draggable={false}
                                onError={(e) => {
                                    e.currentTarget.src = '/assets/image-fallback.jpg';
                                }}
                            />
                        </motion.div>
                        
                        {/* Close button */}
                        <motion.button
                            className="position-absolute btn btn-sm p-0 border-0 bg-white rounded-circle d-flex align-items-center justify-content-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            style={{
                                top: isMobile ? 'calc(env(safe-area-inset-top) + 16px)' : '24px',
                                right: '24px',
                                width: isMobile ? '44px' : '40px',
                                height: isMobile ? '44px' : '40px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                zIndex: 3002,
                            }}
                            whileHover={{ scale: 1.1, backgroundColor: '#f8f8f8' }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <X size={20} style={{ color: '#111' }} />
                        </motion.button>
                        
                        {/* Zoom indicator */}
                        {scale > 1 && (
                            <motion.div
                                className="position-absolute bg-dark text-white px-3 py-2 rounded-pill"
                                style={{
                                    bottom: isMobile ? 'calc(env(safe-area-inset-bottom) + 24px)' : '24px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    opacity: 0.8,
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.8, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                {Math.round(scale * 100)}%
                            </motion.div>
                        )}
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EnhancedImageViewer;

