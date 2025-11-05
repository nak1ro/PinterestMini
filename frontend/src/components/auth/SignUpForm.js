// src/components/auth/SignUpForm.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import {registerUser} from '../../services/authService';

const SignUpForm = () => {
    const { login } = useAppContext();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    const requirements = [
        {
            label: 'Minimum of 6 characters',
            isValid: form.password.length >= 6
        },
        {
            label: 'Includes at least one number',
            isValid: /\d/.test(form.password)
        },
        {
            label: 'Includes at least one uppercase letter',
            isValid: /[A-Z]/.test(form.password)
        },
        {
            label: 'Includes at least one special character',
            isValid: /[^A-Za-z0-9]/.test(form.password)
        }
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultReg = await registerUser(form);

        if (!resultReg.success) {
            setError(resultReg.error);
            return;
        }
        login(resultReg.data, resultReg.data.email, resultReg.data.token);
    };

    const allRequirementsMet = requirements.every(req => req.isValid);

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
                    Create your account to get started
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
                        name="username"
                        type="text"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: focusedField === 'username' ? '#fff' : '#efefef',
                            fontSize: '16px',
                            height: '56px',
                            boxShadow: focusedField === 'username' 
                                ? '0 0 0 3px rgba(230, 0, 35, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)' 
                                : 'none',
                            border: focusedField === 'username' ? '2px solid #e60023' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && allRequirementsMet && form.username && form.email && form.password) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        required
                    />
                </motion.div>

                {/* Email Input */}
                <motion.div
                    className="mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <input
                        name="email"
                        type="email"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: focusedField === 'email' ? '#fff' : '#efefef',
                            fontSize: '16px',
                            height: '56px',
                            boxShadow: focusedField === 'email' 
                                ? '0 0 0 3px rgba(230, 0, 35, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)' 
                                : 'none',
                            border: focusedField === 'email' ? '2px solid #e60023' : '2px solid transparent',
                            transition: 'all 0.2s ease'
                        }}
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && allRequirementsMet && form.username && form.email && form.password) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        required
                    />
                </motion.div>

                {/* Password Input */}
                <motion.div
                    className="mb-3"
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && allRequirementsMet && form.username && form.email && form.password) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        required
                    />
                </motion.div>

                {/* Password Requirements */}
                <AnimatePresence>
                    {form.password && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 rounded-3"
                            style={{
                                backgroundColor: '#f8f9fa',
                                fontSize: '13px',
                                border: '1px solid #e9ecef'
                            }}
                        >
                            <div className="small text-muted mb-2 fw-semibold">Password requirements:</div>
                            {requirements.map((req, index) => (
                                <motion.div
                                    key={index}
                                    className="d-flex align-items-center mb-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                        color: req.isValid ? '#28a745' : '#767676',
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    <motion.span
                                        className="me-2 d-inline-flex align-items-center justify-content-center"
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            backgroundColor: req.isValid ? '#28a745' : 'transparent',
                                            border: req.isValid ? 'none' : '2px solid #767676',
                                            fontSize: '12px',
                                            color: req.isValid ? '#fff' : '#767676',
                                            fontWeight: 'bold'
                                        }}
                                        animate={{
                                            scale: req.isValid ? [1, 1.2, 1] : 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {req.isValid ? '✓' : ''}
                                    </motion.span>
                                    <span style={{ fontSize: '13px' }}>{req.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.button
                        className="btn btn-sm fw-bold px-4 rounded-3 w-100 d-flex align-items-center justify-content-center"
                        style={{
                            background: allRequirementsMet && form.password
                                ? 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)'
                                : 'linear-gradient(135deg, #ccc 0%, #bbb 100%)',
                            border: 'none',
                            color: '#fff',
                            height: '56px',
                            fontSize: '16px',
                            boxShadow: allRequirementsMet && form.password
                                ? '0 4px 12px rgba(230, 0, 35, 0.3)'
                                : 'none',
                            cursor: allRequirementsMet && form.password ? 'pointer' : 'not-allowed'
                        }}
                        type="submit"
                        disabled={!allRequirementsMet || !form.password}
                        whileHover={allRequirementsMet && form.password ? {
                            scale: 1.02,
                            boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)'
                        } : {}}
                        whileTap={allRequirementsMet && form.password ? { scale: 0.98 } : {}}
                    >
                        Sign Up
                    </motion.button>
                </motion.div>
            </form>
        </div>
    );
};

export default SignUpForm;
