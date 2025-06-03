import React from 'react';

const SignUpForm = () => {
    return (
        <form>
            <h2>Sign Up</h2>
            <input className={"authInput"} type="text" placeholder="Username" required />
            <input className={"authInput"} type="email" placeholder="Email" required />
            <input className={"authInput"} type="password" placeholder="Password" required />
            <button className={"authButton"} type="submit">Register</button>
        </form>
    );
};

export default SignUpForm;

