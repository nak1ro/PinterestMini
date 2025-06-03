import React from 'react';

const SignInForm = () => {
    return (
        <form>
            <h2>Log In</h2>
            <input className={"authInput"} type="email" placeholder="Email or Username" required />
            <input className={"authInput"} type="password" placeholder="Password" required />
            <button className={"authButton"} type="submit">Log In</button>
        </form>
    );
};

export default SignInForm;
