import React, {useState} from 'react';
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
                    height: 36px;
                    min-width: 90px;
                    padding: 0 1rem;
                }

                @media (max-width: 768px) {
                    .auth-button {
                        height: 32px;
                        min-width: 70px;
                        padding: 0 0.75rem;
                        font-size: 0.875rem;
                    }
                }

                @media (max-width: 480px) {
                    .auth-button {
                        height: 32px;
                        min-width: 60px;
                        padding: 0 0.5rem;
                        font-size: 0.8rem;
                    }
                }
            `}</style>

            <div>
                <div className="d-flex gap-2 align-items-center">
                <motion.button 
                    onClick={() => openModal('signin')} 
                    className="auth-button btn btn-sm fw-bold rounded-3"
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        color: '#fff',
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