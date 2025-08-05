import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FujiSanCard = () => {
    return (
        <div className="d-flex justify-content-center my-4">
            <div className="card" style={{ display: 'inline-block', maxWidth: '400px' }}>
                {/* Header with action buttons */}
                <div className="card-header d-flex justify-content-between align-items-center p-3">
                    <div className="d-flex align-items-center gap-3">
                        {/* Like button with count */}
                        <button className="btn btn-link p-0 text-dark" onClick={() => console.log('Like clicked')}>
                            <i className="bi bi-heart"></i> 15
                        </button>

                        {/* Comment button */}
                        <button className="btn btn-link p-0 text-dark" onClick={() => console.log('Comment clicked')}>
                            <i className="bi bi-chat"></i>
                        </button>

                        {/* Share button */}
                        <button className="btn btn-link p-0 text-dark" onClick={() => console.log('Share clicked')}>
                            <i className="bi bi-share"></i>
                        </button>
                    </div>

                    {/* Save button */}
                    <button className="btn btn-danger px-3" onClick={() => console.log('Save clicked')}>
                        Save
                    </button>
                </div>

                {/* Main image content */}
                <div className="position-relative">
                    <img
                        src="/assets/avatar-default.svg"
                        className="card-img-top"
                        alt="Mount Fuji with cherry blossoms"
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                    />

                    {/* Action buttons on image */}
                    <div className="position-absolute top-0 end-0 p-2">
                        <button
                            className="btn btn-light btn-sm me-2"
                            onClick={() => console.log('Expand image clicked')}
                            title="Expand image"
                        >
                            <i className="bi bi-arrows-fullscreen"></i>
                        </button>

                        <button
                            className="btn btn-light btn-sm"
                            onClick={() => console.log('Rotate/refresh clicked')}
                            title="Rotate or refresh view"
                        >
                            <i className="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>

                    {/* Title overlay */}
                    <div className="position-absolute bottom-0 start-0 end-0 p-3"
                         style={{
                             background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                         }}
                    >
                        <p className="text-white mb-0 small">
                            <strong>ICONIC SNOW-CAPPED PEAK & VOLCANO</strong>
                        </p>
                    </div>
                </div>

                {/* Card body with description text */}
                <div className="card-body">
                    <p className="card-text small mb-2">
                        Japan is to the Mt. Fuji, what each is a broad and solid
                        foundation for the other. This mountain has been revered
                        for centuries and is still one of the greatest expressions of reverence
                        and awe throughout Japan and the world.
                    </p>
                </div>

                {/* User info section */}
                <div className="card-footer bg-transparent border-top-0 px-3 py-2">
                    <div className="d-flex align-items-center">
                        <div
                            className="rounded-circle bg-secondary me-2"
                            style={{ width: '24px', height: '24px' }}
                        ></div>
                        <h6 className="mb-0">Fuji San</h6>
                    </div>
                </div>

                {/* Comments section */}
                <div className="card-footer bg-light">
                    <p className="mb-2 fw-bold">No comments yet</p>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Add a comment to start the conversation"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    console.log('Comment submitted:', e.target.value);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => console.log('Comment submit button clicked')}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FujiSanCard;
