// src/components/Auth/SignUpForm.js
import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import {loginUser, registerUser} from '../../../services/authService';

const SignUpForm = () => {
    const { login } = useAppContext();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState(null);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultReg = await registerUser(form);

        if (!resultReg.success) {
            setError(`${resultReg.error}`);
            return;
        }
        console.log(resultReg.data.token);
        login(resultReg.data.username, resultReg.data.email, resultReg.data.token);

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
            <ul className="space-y-1 text-sm">
                {requirements.map((req, index) => (
                    <li
                        key={index}
                        className={`flex items-center gap-2 ${
                            req.isValid ? 'text-green-600' : 'text-gray-500'
                        }`}
                    >
                        <span>{req.isValid ? '😃' : '🔞'}</span>
                        <span>{req.label}</span>
                    </li>
                ))}
            </ul>
        </form>
    );
};

export default SignUpForm;
