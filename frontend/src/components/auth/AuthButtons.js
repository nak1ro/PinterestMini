import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';


const AuthButtons = () => {
    const [authModalType, setAuthModalType] = useState(null); // 'signin' или 'signup'

    const openModal = (type) => setAuthModalType(type);
    const switchType = (type) => setAuthModalType(type);

    return (
        <>
            <style>{`
                .auth-button {
                    height: 38px;
                    min-width: 90px;
                    padding: 0 1rem;
                    font-size: 0.9rem;
                }

                .auth-buttons-container {
                    gap: 0.5rem;
                }

                @media (max-width: 768px) {
                    .auth-button {
                        height: 36px;
                        min-width: 75px;
                        padding: 0 0.875rem;
                        font-size: 0.875rem;
                    }

                    .auth-buttons-container {
                        gap: 0.5rem;
                    }
                }

                @media (max-width: 480px) {
                    .auth-button {
                        height: 36px;
                        min-width: 65px;
                        padding: 0 0.625rem;
                        font-size: 0.8rem;
                    }

                    .auth-buttons-container {
                        gap: 0.375rem;
                    }
                }

                @media (max-width: 320px) {
                    .auth-button {
                        height: 34px;
                        min-width: 58px;
                        padding: 0 0.5rem;
                        font-size: 0.75rem;
                    }

                    .auth-buttons-container {
                        gap: 0.25rem;
                    }
                }
            `}</style>

            <div>
                <div className="auth-buttons-container d-flex align-items-center">
                    <motion.button
                        onClick={() => openModal('signin')}
                        className="auth-button btn btn-sm fw-bold rounded-3"
                        style={{
                            background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                            border: 'none',
                            color: '#fff',
                            whiteSpace: 'nowrap'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Log In
                    </motion.button>
                    <motion.button
                        onClick={() => openModal('signup')}
                        className="auth-button btn btn-sm fw-bold rounded-3"
                        style={{
                            background: '#efefef',
                            border: 'none',
                            color: '#111',
                            whiteSpace: 'nowrap'
                        }}
                        whileHover={{ scale: 1.05, background: '#e2e2e2' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Sign Up
                    </motion.button>
                </div>
                {authModalType && (
                    <AuthModal
                        type={authModalType}
                        onClose={() => setAuthModalType(null)}
                        onSwitchType={switchType}
                    />
                )}
            </div>
        </>
    );
};

export default AuthButtons;