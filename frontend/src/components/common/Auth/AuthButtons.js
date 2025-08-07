import React, {useState} from 'react';
import AuthModal from './AuthModal';


const AuthButtons = () => {
    const [authModalType, setAuthModalType] = useState(null); // 'signin' или 'signup'

    const openModal = (type) => setAuthModalType(type);
    const closeModal = () => setAuthModalType(null);

    return (
        <div>
            <div>
                <button onClick={() => openModal('signin')} className="btn btn-danger btn-sm fw-semibold">
                    Log In
                </button>
                <button onClick={() => openModal('signup')} className="btn btn-sm btn-light fw-semibold ms-3">
                    Sign Up
                </button>
            </div>
            {authModalType && (
                <AuthModal type={authModalType} onClose={() => setAuthModalType(null)}/>
            )}
        </div>
    );
};

export default AuthButtons;