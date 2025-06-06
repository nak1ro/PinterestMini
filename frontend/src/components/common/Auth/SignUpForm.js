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
                className="form-control rounded-3 px-4 py-3 border border-light m-1 form-control shadow-none"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                name="email"
                type="email"
                className="form-control rounded-3 px-4 py-3 border border-light m-1 form-control shadow-none"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                className="form-control rounded-3 px-4 py-3 border border-light m-1 form-control shadow-none"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button className="btn btn-danger btn-lg fw-semibold rounded-5" type="submit">Register</button>
        </form>
    );
};

export default SignUpForm;
