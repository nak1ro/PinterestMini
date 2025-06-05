// src/components/Auth/SignInForm.js
import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { loginUser } from '../../../services/authService';

const SignInForm = () => {
    const { login } = useAppContext();
    const [form, setForm] = useState({ login: '', password: '' });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { username, email, token } = await loginUser(form);
            login({ username, email }, token);
        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Log In</h2>
            {error && <p className="error">{error}</p>}
            <input
                name="login"
                type="text"
                className="authInput"
                placeholder="Username"
                value={form.username}
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
            <button className="authButton" type="submit">Log In</button>
        </form>
    );
};

export default SignInForm;
