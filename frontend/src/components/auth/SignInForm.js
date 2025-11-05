// src/components/auth/SignInForm.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import {loginUser} from '../../services/authService';

const SignInForm = ({ onSwitchToSignUp }) => {
    const {login} = useAppContext();
    const [form, setForm] = useState({login: '', password: ''});
    const [error, setError] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultLog = await loginUser(form);

        if (!resultLog.success) {
            setError(resultLog.error);
            return;
        }
        login(resultLog.data, resultLog.data.email, resultLog.data.token);
    };

    return (
        <div className="p-5" style={{ backgroundColor: '#fff' }}>
            {/* Logo/Header Section */}
            <div className="text-center mb-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <span className="text-danger fw-bold" style={{ fontSize: '32px', letterSpacing: '-1px' }}>
                        PinterestMini
                    </span>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted mt-2 mb-0"
                    style={{ fontSize: '15px' }}
                >
                    Welcome back! Log in to your account
                </motion.p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="alert alert-danger mb-4 rounded-3 d-flex align-items-center"
                        role="alert"
                        style={{
                            fontSize: '14px',
                            padding: '12px 16px',
                            border: 'none',
                            backgroundColor: '#fee',
                            color: '#c33'
                        }}
                    >
                        <span className="me-2">⚠️</span>
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
                {/* Username Input */}
                <motion.div
                    className="mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <input
                        name="login"
                        type="text"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: focusedField === 'login' ? '#fff' : '#efefef',
                            fontSize: '16px',
                            height: '56px',
                            boxShadow: focusedField === 'login' 
                                ? '0 0 0 3px rgba(230, 0, 35, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)' 
                                : 'none',
                            border: focusedField === 'login' ? '2px solid #e60023' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                        placeholder="Username"
                        value={form.login}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('login')}
                        onBlur={() => setFocusedField(null)}
                        required
                    />
                </motion.div>

                {/* Password Input */}
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <input
                        name="password"
                        type="password"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: focusedField === 'password' ? '#fff' : '#efefef',
                            fontSize: '16px',
                            height: '56px',
                            boxShadow: focusedField === 'password' 
                                ? '0 0 0 3px rgba(230, 0, 35, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)' 
                                : 'none',
                            border: focusedField === 'password' ? '2px solid #e60023' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                    />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.button
                        className="btn btn-sm fw-bold px-4 rounded-3 w-100 d-flex align-items-center justify-content-center"
                        style={{
                            background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                            border: 'none',
                            color: '#fff',
                            height: '56px',
                            fontSize: '16px',
                            boxShadow: '0 4px 12px rgba(230, 0, 35, 0.3)'
                        }}
                        type="submit"
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Log In
                    </motion.button>
                </motion.div>
            </form>

            {/* Sign Up Link */}
            <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <span className="text-muted" style={{ fontSize: '14px' }}>
                    Don't have an account?{' '}
                </span>
                <motion.button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="btn btn-link p-0 border-0 text-decoration-none fw-semibold"
                    style={{
                        color: '#e60023',
                        fontSize: '14px',
                        textDecoration: 'none'
                    }}
                    whileHover={{ textDecoration: 'underline' }}
                >
                    Sign up
                </motion.button>
            </motion.div>
        </div>
    );
};

export default SignInForm;
