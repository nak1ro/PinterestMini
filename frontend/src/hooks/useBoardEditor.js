// src/hooks/useBoardEditor.js
import { useCallback, useMemo, useState } from 'react';
import { changeBoardInfo, deleteBoard as deleteBoardApi } from '../services/boardService';

export default function useBoardEditor(board, { onUpdated, onDeleted } = {}) {
    const initial = useMemo(() => ({
        name: board?.name ?? '',
        description: board?.description ?? '',
        isPrivate: Boolean(board?.isPrivate),
        coverImageUrl: board?.coverImageUrl ?? null,
    }), [board]);

    const [name, setName] = useState(initial.name);
    const [description, setDescription] = useState(initial.description);
    const [isPrivate, setIsPrivate] = useState(initial.isPrivate);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(initial.coverImageUrl);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const onPickCover = useCallback((file) => {
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    }, []);

    const buildFormData = useCallback(() => {
        const fd = new FormData();
        if (name !== initial.name) fd.append('Name', name);
        if (description !== initial.description) fd.append('Description', description);
        if (isPrivate !== initial.isPrivate) fd.append('IsPrivate', String(isPrivate));
        if (coverFile) fd.append('CoverImage', coverFile);
        return fd;
    }, [name, description, isPrivate, coverFile, initial.name, initial.description, initial.isPrivate]);

    const updateBoard = useCallback(async () => {
        if (!board?.id) return;
        setSaving(true);
        setError(null);
        try {
            const fd = buildFormData();
            if ([...fd.keys()].length === 0) {
                onUpdated && onUpdated({ ...board });
                return;
            }
            const res = await changeBoardInfo(board.id, fd);
            const serverData = res?.data ?? {};

            // Prepare updated payload
            const updated = {
                ...board,
                ...serverData, // trust backend if it returns new values
                name,
                description,
                isPrivate,
            };

            // Cache-bust cover if a new file was uploaded but backend URL may be cached
            if (coverFile) {
                const base = serverData.coverImageUrl || board.coverImageUrl;
                if (base) {
                    const sep = base.includes('?') ? '&' : '?';
                    updated.coverImageUrl = `${base}${sep}v=${Date.now()}`;
                }
            }

            onUpdated && onUpdated(updated);
            return updated;
        } catch (err) {
            console.error('Failed to update board:', err);
            setError(err);
            throw err;
        } finally {
            setSaving(false);
        }
    }, [board, name, description, isPrivate, coverFile, buildFormData, onUpdated]);

    const removeBoard = useCallback(async () => {
        if (!board?.id) return;
        setDeleting(true);
        setError(null);
        try {
            await deleteBoardApi(board.id);
            onDeleted && onDeleted(board.id);
        } catch (err) {
            console.error('Failed to delete board:', err);
            setError(err);
            throw err;
        } finally {
            setDeleting(false);
        }
    }, [board, onDeleted]);

    const resetLocal = useCallback(() => {
        setName(initial.name);
        setDescription(initial.description);
        setIsPrivate(initial.isPrivate);
        setCoverFile(null);
        setCoverPreview(initial.coverImageUrl);
        setError(null);
    }, [initial]);

    return {
        name, setName,
        description, setDescription,
        isPrivate, setIsPrivate,
        coverPreview,
        onPickCover,
        updateBoard,
        removeBoard,
        resetLocal,
        saving,
        deleting,
        error,
    };
}
