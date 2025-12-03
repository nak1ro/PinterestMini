import React from 'react';

const ProfileSkeleton = () => {
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

                .skeleton-circle {
                    border-radius: 50%;
                }

                .skeleton-rounded {
                    border-radius: 8px;
                }
            `}</style>

            <div className="container-fluid container-lg py-5 pt-5 px-3 px-lg-0">
                {/* Avatar Skeleton */}
                <div className="d-flex flex-column align-items-center text-center mb-5">
                    <div
                        className="skeleton skeleton-circle mb-4"
                        style={{ width: '140px', height: '140px' }}
                    />

                    {/* Username Skeleton */}
                    <div
                        className="skeleton skeleton-rounded mb-2"
                        style={{ width: '200px', height: '32px' }}
                    />

                    {/* Bio Skeleton */}
                    <div
                        className="skeleton skeleton-rounded mb-4"
                        style={{ width: '300px', height: '20px', maxWidth: '80%' }}
                    />

                    {/* Stats Skeleton */}
                    <div className="d-flex gap-3 gap-md-5 flex-wrap justify-content-center">
                        <div className="text-center">
                            <div
                                className="skeleton skeleton-rounded mb-2"
                                style={{ width: '60px', height: '28px' }}
                            />
                            <div
                                className="skeleton skeleton-rounded"
                                style={{ width: '70px', height: '16px' }}
                            />
                        </div>
                        <div className="text-center">
                            <div
                                className="skeleton skeleton-rounded mb-2"
                                style={{ width: '60px', height: '28px' }}
                            />
                            <div
                                className="skeleton skeleton-rounded"
                                style={{ width: '80px', height: '16px' }}
                            />
                        </div>
                        <div className="text-center">
                            <div
                                className="skeleton skeleton-rounded mb-2"
                                style={{ width: '60px', height: '28px' }}
                            />
                            <div
                                className="skeleton skeleton-rounded"
                                style={{ width: '90px', height: '16px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="d-flex justify-content-center border-bottom mb-4 mb-md-5 flex-wrap">
                    <div
                        className="skeleton skeleton-rounded me-3"
                        style={{ width: '120px', height: '40px' }}
                    />
                    <div
                        className="skeleton skeleton-rounded"
                        style={{ width: '120px', height: '40px' }}
                    />
                </div>

                {/* Loading Message */}
                <div className="text-center py-3">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading profile...</p>
                </div>
            </div>
        </>
    );
};

export default ProfileSkeleton;
