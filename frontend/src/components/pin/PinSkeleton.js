import React from 'react';

const PinSkeleton = () => {
    // Random height between 200px and 400px to simulate different pin sizes
    const height = Math.floor(Math.random() * (400 - 200 + 1)) + 200;

    return (
        <div
            className="rounded-4 mb-3"
            style={{
                height: `${height}px`,
                backgroundColor: '#e0e0e0',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <style>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .skeleton-shimmer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.4) 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
            <div className="skeleton-shimmer" />
        </div>
    );
};

export default PinSkeleton;
