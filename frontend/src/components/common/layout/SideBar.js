import React, {useState} from 'react';

const Sidebar = () => {
    return (
        <div
            className="d-flex flex-column align-items-center p-2 position-fixed top-0 left-0 w-60 h-100"
            style={{
                zIndex: 1000
            }}
        >
            <a href="/" className="mb-4 text-white fs-3 text-decoration-none">
                <img
                    src="/assets/pinterestLogo.png"
                />
            </a>
            <a href="/" className="nav-link text-white mb-4">
                <img
                    src="/assets/homeIcon.png"
                    alt="no image("// connect to back
                    width="35"
                    height="35"
                    className="rounded-20"
                />
            </a>
            <a href="/explore" className="nav-link text-white mb-4 my">
                <img
                src="/assets/exploreIcon.png"
                alt="no image("// connect to back
                width="35"
                height="35"
                className="rounded-20"
                />
            </a>
            <a href="/create-pin" className="nav-link text-white mb-4">
                <img
                src="/assets/createIcon.png"
                alt="no image("// connect to back
                width="35"
                height="35"
                className="rounded-20"
                />
            </a>
        </div>
    );
};
export default Sidebar;
