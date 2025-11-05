import React from 'react';
import { motion } from 'framer-motion';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const AuthModal = ({ type, onClose, onSwitchType }) => {
    return (
        <div>
            <motion.div
                className="modal-backdrop fade show"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            />
            <div 
                className="modal fade show d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100"
                onClick={onClose}
                style={{ zIndex: 1050 }}
            >
                <motion.div
                    className="modal-content bg-white rounded-4 shadow-lg"
                    style={{
                        width: 'min(420px, 90vw)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    }}
                    onClick={e => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    key={type}
                >
                    <motion.button
                        className="btn-close position-absolute top-0 end-0 m-3"
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            zIndex: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                    {type === 'signin' ? (
                        <SignInForm onSwitchToSignUp={() => onSwitchType('signup')} />
                    ) : (
                        <SignUpForm />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthModal;
