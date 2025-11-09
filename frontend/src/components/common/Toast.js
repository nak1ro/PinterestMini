import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Non-blocking toast/snackbar component for mobile-friendly feedback
 */
const Toast = ({ message, show, onClose, duration = 2000, type = 'success' }) => {
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const bgColors = {
        success: '#2e7d32',
        error: '#d32f2f',
        info: '#0288d1',
        warning: '#f57c00',
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="position-fixed start-50 translate-middle-x d-flex align-items-center justify-content-center px-4 py-3 rounded-3"
                    style={{
                        bottom: '24px',
                        zIndex: 9999,
                        backgroundColor: bgColors[type] || bgColors.success,
                        color: '#fff',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        maxWidth: '90vw',
                        minWidth: '200px',
                        pointerEvents: 'auto',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;

