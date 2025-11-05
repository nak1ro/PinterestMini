import React, {useState} from 'react';
import { motion } from 'framer-motion';
import AuthModal from './AuthModal';


const AuthButtons = () => {
    const [authModalType, setAuthModalType] = useState(null); // 'signin' или 'signup'

    const openModal = (type) => setAuthModalType(type);
    const closeModal = () => setAuthModalType(null);
    const switchType = (type) => setAuthModalType(type);

    return (
        <div>
            <div className="d-flex gap-2 align-items-center">
                <motion.button 
                    onClick={() => openModal('signin')} 
                    className="btn btn-sm fw-bold px-4 rounded-3"
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        color: '#fff',
                        height: '36px',
                        minWidth: '90px',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Log In
                </motion.button>
                <motion.button 
                    onClick={() => openModal('signup')} 
                    className="btn btn-sm fw-bold px-4 rounded-3"
                    style={{
                        background: '#efefef',
                        border: 'none',
                        color: '#111',
                        height: '36px',
                        minWidth: '90px',
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
    );
};

export default AuthButtons;