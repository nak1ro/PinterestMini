// src/components/Auth/SignUpForm.js
import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { registerUser } from '../../../services/authService';

const SignUpForm = () => {
    const { login } = useAppContext();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { username, email, token } = await registerUser(form);
            login({ username, email }, token);
        } catch (err) {
            console.error(err);
            setError('Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <input
                name="username"
                type="text"
                className="authInput"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                className="authInput"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                className="authInput"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button className="authButton" type="submit">Register</button>
        </form>
    );
};

export default SignUpForm;
