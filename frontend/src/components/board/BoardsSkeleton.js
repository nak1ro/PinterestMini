import React from 'react';

const BoardsSkeleton = () => {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .skeleton {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 0px,
                        #f8f8f8 40px,
                        #f0f0f0 80px
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite linear;
                }

                .skeleton-rounded {
                    border-radius: 12px;
                }
            `}</style>

            <div className="row g-4">
                {/* Generate 8 skeleton board cards */}
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div
                            className="skeleton skeleton-rounded"
                            style={{
                                width: '100%',
                                height: '220px',
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default BoardsSkeleton;
