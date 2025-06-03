import React, { useState } from 'react';
import AuthModal from './AuthModal';


const AuthButtons = () => {
    // Временный стейт для проверки залогинен ли пользователь
    const [authModalType, setAuthModalType] = useState(null); // 'signin' или 'signup'

    const openModal = (type) => setAuthModalType(type);
    const closeModal = () => setAuthModalType(null);

    return (
        <div className="auth-buttons">
                <div className="auth-buttons-container">
                    <button onClick={() => openModal('signin')} className="login-btn">
                        Log In
                    </button>
                    <button onClick={() => openModal('signup')} className="signup-btn">
                        Sign Up
                    </button>
                </div>
            {authModalType && (
                <AuthModal type={authModalType} onClose={() => setAuthModalType(null)} />
            )}
        </div>
    );
};

export default AuthButtons;