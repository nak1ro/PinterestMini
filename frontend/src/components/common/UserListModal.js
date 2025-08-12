import React from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UserListModal = ({ show, onClose, title, users = [], loading = false }) => {
    return (
        <Modal show={show} onHide={onClose} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-3">
                        <Spinner animation="border" variant="danger" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center text-muted py-3">No users to display.</div>
                ) : (
                    <ul className="list-unstyled mb-0">
                        {users.map((user, idx) => {
                            const isLast = idx === users.length - 1;
                            return (
                                <li
                                    key={user.id}
                                    className={`mb-0 ${!isLast ? 'border-bottom' : ''}`}
                                    style={{ borderColor: '#e6e6e6' }}
                                >
                                    <Link
                                        to={`/profile/${user.username}`}
                                        className="d-flex align-items-center text-decoration-none py-3"
                                        style={{
                                            gap: '12px',
                                            color: '#111',
                                        }}
                                    >
                                        <img
                                            src={user.profilePictureUrl || '/assets/avatar-default.svg'}
                                            alt={user.username}
                                            className="rounded-circle flex-shrink-0"
                                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                                            onError={(e) => {
                                                const fallback = '/assets/avatar-default.svg';
                                                if (!e.target.src.endsWith(fallback)) e.target.src = fallback;
                                            }}
                                        />
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold">{user.username}</span>
                                            {user.displayName ? (
                                                <span className="text-muted small">{user.displayName}</span>
                                            ) : null}
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UserListModal;
