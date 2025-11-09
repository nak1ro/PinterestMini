import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeDots } from 'react-bootstrap-icons';

/**
 * Mobile-friendly overflow menu with bottom sheet style
 */
const OverflowMenu = ({ show, onClose, items, isMobile }) => {
    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    
                    {/* Menu */}
                    <motion.div
                        className="position-fixed start-50 translate-middle-x bg-white rounded-3 overflow-hidden"
                        style={{
                            zIndex: 2001,
                            bottom: isMobile ? '16px' : 'auto',
                            top: isMobile ? 'auto' : '50%',
                            transform: isMobile ? 'translateX(-50%)' : 'translate(-50%, -50%)',
                            width: isMobile ? 'calc(100% - 32px)' : '280px',
                            maxWidth: '400px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        }}
                        initial={{ opacity: 0, y: isMobile ? 40 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: isMobile ? 40 : 10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {items.map((item, index) => (
                            <motion.button
                                key={index}
                                className="w-100 d-flex align-items-center gap-3 px-4 py-3 border-0 bg-white"
                                onClick={() => {
                                    item.onClick();
                                    onClose();
                                }}
                                style={{
                                    borderBottom: index < items.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    color: item.danger ? '#dc3545' : '#111',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    minHeight: '56px', // Touch-friendly height
                                }}
                                whileHover={{ backgroundColor: '#f8f8f8' }}
                                whileTap={{ backgroundColor: '#efefef', scale: 0.98 }}
                                disabled={item.disabled}
                            >
                                {item.icon && (
                                    <span style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>
                                        {item.icon}
                                    </span>
                                )}
                                <span>{item.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

/**
 * Button to trigger the overflow menu
 */
export const OverflowMenuButton = ({ onClick, isMobile }) => (
    <motion.button
        className="btn d-flex align-items-center justify-content-center rounded-3"
        onClick={onClick}
        style={{
            background: 'transparent',
            border: 'none',
            color: '#111',
            height: isMobile ? '44px' : '48px',
            width: isMobile ? '44px' : '48px',
            minWidth: isMobile ? '44px' : '48px',
        }}
        whileHover={{ scale: 1.05, background: 'rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.95 }}
        title="More options"
    >
        <ThreeDots size={24} />
    </motion.button>
);

export default OverflowMenu;

