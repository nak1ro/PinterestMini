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
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={loading ? undefined : onClose}
        >
            <motion.div
                className="card shadow-lg"
                style={{ width: 'min(720px, 96vw)' }}
                onClick={(e) => e.stopPropagation()}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header */}
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Pin</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Close
                    </button>
                </div>

                {/* Body */}
                <div className="card-body">
                    {errorMsg && (
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Title</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Pin title"
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Description</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your pin"
                            disabled={loading}
                        />
                    </div>

                    {/* Allow comments */}
                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="allowCommentsSwitch"
                            checked={!!allowComments}
                            onChange={(e) => setAllowComments(e.target.checked)}
                            disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="allowCommentsSwitch">
                            Allow comments
                        </label>
                    </div>

                    {/* Tags */}
                    <PinTagsControl
                        value={tags}
                        onChange={setTags}
                        mode="object"
                        label="Tags"
                        placeholder="Type a tag and press Add or Enter"
                        maxTags={15}
                        allowDuplicates={false}
                        className="mb-0"
                    />
                </div>

                {/* Footer */}
                <div className="card-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving…' : 'Save changes'}
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        portalRoot
    );
};

export default PinEditModal;
