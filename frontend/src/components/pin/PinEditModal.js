import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import PinTagsControl from '../common/PinTagsControl';
import useUpdatePin from '../../hooks/useUpdatePin';

const ensureRoot = () => {
    let node = document.getElementById('pin-edit-modal-root');
    if (!node) {
        node = document.createElement('div');
        node.id = 'pin-edit-modal-root';
        document.body.appendChild(node);
    }
    return node;
};

const PinEditModal = ({ show, onClose, pin, onApply }) => {
    const portalRoot = useMemo(ensureRoot, []);

    const [title, setTitle] = useState(pin?.title || '');
    const [description, setDescription] = useState(pin?.description || '');
    const [allowComments, setAllowComments] = useState(
        typeof pin?.allowComments === 'boolean' ? pin.allowComments : true
    );
    const [tags, setTags] = useState(Array.isArray(pin?.tags) ? pin.tags : []);
    const [errorMsg, setErrorMsg] = useState('');

    // hook that talks to backend
    const { update, loading, error } = useUpdatePin(pin?.id);

    useEffect(() => {
        setTitle(pin?.title || '');
        setDescription(pin?.description || '');
        setAllowComments(typeof pin?.allowComments === 'boolean' ? pin.allowComments : true);
        setTags(Array.isArray(pin?.tags) ? pin.tags : []);
        setErrorMsg('');
    }, [pin]);

    // lock body scroll while open
    useEffect(() => {
        if (!show) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [show]);

    if (!show) return null;

    const buildDto = () => {
        // Map to UpdatePinDto shape (PascalCase as in your C# DTO)
        // Tag objects -> TagNames (string[])
        const tagNames = Array.isArray(tags)
            ? tags
                .map(t => (typeof t?.name === 'string' ? t.name.trim() : ''))
                .filter(Boolean)
            : [];

        return {
            Title: title ?? null,
            Description: description ?? null,
            AllowComments: typeof allowComments === 'boolean' ? allowComments : null,
            TagNames: tagNames.length > 0 ? tagNames : [],
            // Include BoardIds only if you actually edit them in this modal. Otherwise omit:
            // BoardIds: [...]
        };
    };

    const handleSave = async () => {
        try {
            setErrorMsg('');
            const dto = buildDto();
            const serverPin = await update(dto);

            // Keep your existing contract with parent: pass the "updates" object
            // so PinPreviewModal can optimistically merge its local state.
            onApply({
                title,
                description,
                allowComments,
                tags
            });

            // If you want to prefer serverPin (normalized tags etc.), you can ALSO pass it:
            // onApply(serverPin);

            onClose();
        } catch (e) {
            const message =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                e?.message ||
                'Failed to update pin.';
            setErrorMsg(String(message));
            // keep modal open so user can retry
        }
    };

    return createPortal(
        <motion.div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 2000, backgroundColor: 'rgba(0, 0, 0, 0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={loading ? undefined : onClose}
        >
            <div
                className="w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ pointerEvents: 'none' }}
            >
                <motion.div
                    className="bg-white"
                    style={{
                        width: 'min(720px, 92vw)',
                        maxHeight: '90vh',
                        borderRadius: '24px',
                        boxShadow: '0 24px 64px rgba(17, 17, 17, 0.28)',
                        pointerEvents: 'auto',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Header */}
                    <div
                        className="d-flex align-items-start justify-content-between px-4 pt-4 pb-3 border-bottom"
                        style={{ background: '#fafafa' }}
                    >
                        <div>
                            <h3 className="mb-1 fw-bold" style={{ color: '#111', fontSize: '1.65rem' }}>
                                Edit pin
                            </h3>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.95rem' }}>
                                Fine-tune the details so your pin stands out.
                            </p>
                        </div>
                        <motion.button
                            type="button"
                            className="btn p-0 border-0"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem'
                            }}
                            onClick={onClose}
                            disabled={loading}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ✕
                        </motion.button>
                    </div>

                    {/* Body */}
                    <div className="px-4 py-4 flex-grow-1 overflow-auto">
                        {errorMsg && (
                            <div
                                className="alert rounded-3 d-flex align-items-center gap-2 mb-4"
                                role="alert"
                                style={{
                                    backgroundColor: '#fee',
                                    border: 'none',
                                    color: '#bd081c',
                                    fontWeight: 500,
                                }}
                            >
                                <span aria-hidden="true">⚠️</span>
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Title */}
                        <div className="mb-4">
                            <label className="fw-semibold text-uppercase mb-2" style={{ fontSize: '0.85rem', color: '#767676' }}>
                                Title
                            </label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                style={{
                                    border: '1px solid #d0d0d0',
                                    padding: '12px 16px',
                                    backgroundColor: '#fafafa',
                                    fontSize: '1rem'
                                }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Add a title that captures attention"
                                disabled={loading}
                            />
                            <small className="text-muted d-block mt-2" style={{ fontSize: '0.85rem' }}>
                                Great titles are specific and inspire curiosity.
                            </small>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="fw-semibold text-uppercase mb-2" style={{ fontSize: '0.85rem', color: '#767676' }}>
                                Description
                            </label>
                            <textarea
                                className="form-control rounded-3"
                                rows={4}
                                style={{
                                    border: '1px solid #d0d0d0',
                                    padding: '12px 16px',
                                    backgroundColor: '#fafafa',
                                    fontSize: '1rem'
                                }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell people what they’ll find when they click your pin"
                                disabled={loading}
                            />
                            <small className="text-muted d-block mt-2" style={{ fontSize: '0.85rem' }}>
                                Share helpful details, keywords, or a short story.
                            </small>
                        </div>

                        {/* Allow comments */}
                        <div
                            className="d-flex align-items-center justify-content-between rounded-4 px-4 py-3 mb-4"
                            style={{
                                border: '1px solid #e6e6e6',
                                background: '#fdfdfd'
                            }}
                        >
                            <div className="me-3">
                                <div className="fw-semibold" style={{ color: '#111' }}>
                                    Allow comments
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                    Let people share feedback and start conversations.
                                </div>
                            </div>
                            <div className="form-check form-switch m-0">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="allowCommentsSwitch"
                                    checked={!!allowComments}
                                    onChange={(e) => setAllowComments(e.target.checked)}
                                    disabled={loading}
                                    style={{ width: '3rem', height: '1.5rem' }}
                                />
                                <label className="visually-hidden" htmlFor="allowCommentsSwitch">
                                    Allow comments
                                </label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-2">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <label className="fw-semibold text-uppercase mb-0" style={{ fontSize: '0.85rem', color: '#767676' }}>
                                    Tags
                                </label>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    Up to 15 tags
                                </span>
                            </div>
                            <PinTagsControl
                                value={tags}
                                onChange={setTags}
                                mode="object"
                                label=""
                                placeholder="Type a tag and press Add or Enter"
                                maxTags={15}
                                allowDuplicates={false}
                                className="mb-0"
                            />
                            <small className="text-muted d-block mt-2" style={{ fontSize: '0.85rem' }}>
                                Tags help people discover your pin in searches.
                            </small>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="px-4 py-4 border-top d-flex justify-content-end gap-3"
                        style={{ backgroundColor: '#fff' }}
                    >
                        <motion.button
                            type="button"
                            className="btn fw-semibold px-4 rounded-3"
                            style={{
                                backgroundColor: '#efefef',
                                border: 'none',
                                color: '#111',
                                height: '48px',
                                minWidth: '110px'
                            }}
                            onClick={onClose}
                            disabled={loading}
                            whileHover={{ scale: 1.02, backgroundColor: '#e2e2e2' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="button"
                            className="btn fw-semibold px-4 rounded-3 text-white"
                            style={{
                                background: 'linear-gradient(135deg, #e60023 0%, #bd081c 100%)',
                                border: 'none',
                                height: '48px',
                                minWidth: '150px',
                                boxShadow: '0 10px 24px rgba(230, 0, 35, 0.35)'
                            }}
                            onClick={handleSave}
                            disabled={loading}
                            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(230, 0, 35, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {loading ? 'Saving…' : 'Save changes'}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </motion.div>,
        portalRoot
    );
};

export default PinEditModal;
