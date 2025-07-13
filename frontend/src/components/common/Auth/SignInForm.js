// src/components/Auth/SignInForm.js
import React, { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import {loginUser, registerUser} from '../../../services/authService';

const SignInForm = () => {
    const {login} = useAppContext();
    const [form, setForm] = useState({login: '', password: ''});
    const [error, setError] = useState(null);


        const handleChange = (e) => {
            setForm({...form, [e.target.name]: e.target.value});
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            const resultLog = await loginUser(form);

            if (!resultLog.success) {
                setError(`${resultLog.error}`);
                return;
            }
            console.log(resultLog.data.token);
            login(resultLog.data.username, resultLog.data.email, resultLog.data.token);

        };

        return (
            <form onSubmit={handleSubmit}>
                <h2>Log In</h2>
                {error && <p className="error">{error}</p>}
                <input
                    name="login"
                    type="text"
                    className="form-control rounded-3 px-4 py-3 border border-light m-1 form-control shadow-none"
                    placeholder="Username"
                    value={form.username}
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
                <button className="btn btn-danger btn-lg fw-semibold rounded-5 m-1" type="submit">Log In</button>
            </form>
        );
    };

export default SignInForm;
