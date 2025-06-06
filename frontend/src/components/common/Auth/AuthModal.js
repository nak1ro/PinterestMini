import React from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

const AuthModal = ({ type, onClose }) => {
    return (
        <div>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show d-flex align-items-center justify-content-center" onClick={onClose}>
                <div className="modal-content bg-white rounded-4 shadow p-4" style={{
                    minWidth: '320px',
                    maxWidth: '90%',
                    position: 'relative',
                    animation: 'popIn 0.25s ease-out',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', // тень можно чуть кастомизировать
                }} onClick={e => e.stopPropagation()}>
                <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onClose}> </button>
                {type === 'signin' ? <SignInForm /> : <SignUpForm />}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
