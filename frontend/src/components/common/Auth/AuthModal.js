import React from 'react';
import styles from './Auth.css';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const AuthModal = ({ type, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="auth-close-button" onClick={onClose}> × </button>
                {type === 'signin' ? <SignInForm /> : <SignUpForm />}
            </div>
        </div>
    );
};

export default AuthModal;
