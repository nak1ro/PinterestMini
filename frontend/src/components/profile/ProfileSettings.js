import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { updateProfile, deleteAccount } from '../../services/profileService';
import { Camera, X } from 'react-bootstrap-icons';

const ProfileSettings = () => {
    const { user, login, logout } = useAppContext();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        username: '',
        bio: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                bio: user.bio || '',
            });
            setPreviewUrl(user.profilePictureUrl || '/assets/avatar-default.svg');
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfilePicture(null);
        setPreviewUrl(user?.profilePictureUrl || '/assets/avatar-default.svg');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create FormData like pins and boards do
            const formData = new FormData();
            formData.append('name', form.username);
            if (form.bio) {
                formData.append('bio', form.bio);
            }
            // If a new profile picture was selected, append it to FormData
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            const result = await updateProfile(formData);

            if (!result.success) {
                setError(result.error);
                return;
            }

            // Update the user context with new data
            if (result.data) {
                const updatedUser = {
                    ...user,
                    ...result.data,
                    username: form.username,
                    name: form.username,
                    bio: form.bio,
                };
                login(updatedUser, user.email, localStorage.getItem('token'));
            }

            // Show success message or navigate
            navigate('/profile');
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            setShowDeleteConfirm(false);
            return;
        }

        setDeleteLoading(true);
        setError(null);

        try {
            const result = await deleteAccount();

            if (!result.success) {
                setError(result.error || 'Failed to delete account. Please try again.');
                return;
            }

            // Logout and redirect to home
            logout();
            navigate('/');
        } catch (err) {
            setError('Failed to delete account. Please try again.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <motion.div
            className="container-fluid py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ color: '#111', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' }}
        >
            <div className="mb-4">
                <h1 className="fw-bold mb-2" style={{ fontSize: '32px' }}>Profile Settings</h1>
                <p className="text-muted">Manage your profile information and account settings</p>
            </div>

            {error && (
                <div className="alert alert-danger mb-4 rounded-3" role="alert" style={{ fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Profile Picture Section */}
                <div className="mb-4">
                    <label className="form-label fw-semibold mb-3" style={{ fontSize: '16px' }}>
                        Profile Picture
                    </label>
                    <div className="d-flex align-items-center gap-4">
                        <div className="position-relative">
                            <img
                                src={previewUrl}
                                alt="Profile"
                                className="rounded-circle border border-2"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderColor: '#ddd',
                                }}
                                onError={(e) => {
                                    e.currentTarget.src = '/assets/avatar-default.svg';
                                }}
                            />
                            {profilePicture && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="position-absolute top-0 end-0 btn btn-sm btn-danger rounded-circle p-1"
                                    style={{ width: '28px', height: '28px' }}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="d-none"
                                id="profile-picture-upload"
                                disabled={loading}
                            />
                            <label
                                htmlFor="profile-picture-upload"
                                className="btn btn-sm fw-bold px-4 rounded-3"
                                style={{
                                    background: '#efefef',
                                    border: 'none',
                                    color: '#111',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <Camera className="me-2" size={16} />
                                {profilePicture ? 'Change Picture' : 'Upload Picture'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Username Input */}
                <div className="mb-4">
                    <label className="form-label fw-semibold mb-2" style={{ fontSize: '16px' }}>
                        Username
                    </label>
                    <input
                        name="username"
                        type="text"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: '#efefef',
                            fontSize: '16px',
                            height: '56px',
                            boxShadow: 'none',
                        }}
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                {/* Bio Input */}
                <div className="mb-4">
                    <label className="form-label fw-semibold mb-2" style={{ fontSize: '16px' }}>
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        className="form-control rounded-3 px-4 py-3 border-0"
                        style={{
                            backgroundColor: '#efefef',
                            fontSize: '16px',
                            minHeight: '120px',
                            boxShadow: 'none',
                            resize: 'vertical',
                        }}
                        placeholder="Tell us about yourself..."
                        value={form.bio}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>

                {/* Save Button */}
                <motion.button
                    className="btn btn-sm fw-bold px-4 rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                        background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                        border: 'none',
                        color: '#fff',
                        height: '56px',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(230, 0, 35, 0.3)',
                        minWidth: '150px',
                    }}
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? '0 4px 12px rgba(230, 0, 35, 0.3)' : '0 6px 20px rgba(230, 0, 35, 0.4)' }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </form>

            {/* Delete Account Section */}
            <div className="mt-5 pt-5 border-top">
                <h3 className="fw-bold mb-3" style={{ fontSize: '24px', color: '#dc3545' }}>
                    Danger Zone
                </h3>
                <p className="text-muted mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
                {!showDeleteConfirm ? (
                    <motion.button
                        className="btn btn-sm fw-bold px-4 rounded-3"
                        style={{
                            background: '#dc3545',
                            border: 'none',
                            color: '#fff',
                            height: '48px',
                            fontSize: '16px',
                        }}
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleteLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Delete Account
                    </motion.button>
                ) : (
                    <div className="d-flex gap-2 align-items-center">
                        <motion.button
                            className="btn btn-sm fw-bold px-4 rounded-3"
                            style={{
                                background: '#dc3545',
                                border: 'none',
                                color: '#fff',
                                height: '48px',
                                fontSize: '16px',
                            }}
                            onClick={handleDeleteAccount}
                            disabled={deleteLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                        </motion.button>
                        <motion.button
                            className="btn btn-sm fw-bold px-4 rounded-3"
                            style={{
                                background: '#efefef',
                                border: 'none',
                                color: '#111',
                                height: '48px',
                                fontSize: '16px',
                            }}
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={deleteLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfileSettings;

