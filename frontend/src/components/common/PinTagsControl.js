import React, {useEffect, useMemo, useState} from 'react';

const PinTagsControl = ({
                            value,
                            onChange,
                            mode = 'string',
                            label = 'Tags',
                            placeholder = 'Type and press Enter',
                            maxTags = 15,
                            allowDuplicates = false,
                            className = '',
                            style,
                        }) => {
    const [input, setInput] = useState('');

    const viewItems = useMemo(() => {
        if (!Array.isArray(value)) return [];
        if (mode === 'object') {
            return value
                .map((t) => {
                    const name = String(t?.name ?? '').trim();
                    if (!name) return null;
                    const id = String(t?.id ?? name.toLowerCase().replace(/\s+/g, '-'));
                    return {id, name};
                })
                .filter(Boolean);
        }
        return value
            .map((n) => {
                const name = String(n ?? '').trim();
                if (!name) return null;
                const id = name.toLowerCase().replace(/\s+/g, '-');
                return {id, name};
            })
            .filter(Boolean);
    }, [value, mode]);

    const lowerSet = useMemo(
        () => new Set(viewItems.map((t) => t.name.toLowerCase())),
        [viewItems]
    );

    const toOutput = (items) => {
        if (mode === 'object') {
            return items.map(({id, name}) => ({id, name}));
        }
        return items.map(({name}) => name);
    };

    const addName = (raw) => {
        const name = String(raw ?? '').trim();
        if (!name) return;
        if (!allowDuplicates && lowerSet.has(name.toLowerCase())) return;
        if (viewItems.length >= maxTags) return;
        const id = name.toLowerCase().replace(/\s+/g, '-'); // stable id for strings / fallback
        const next = [...viewItems, {id, name}];
        onChange(toOutput(next));
        setInput('');
    };

    const removeById = (id) => {
        const next = viewItems.filter((t) => t.id !== id);
        onChange(toOutput(next));
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addName(input);
        }
        if (e.key === ',' && !e.shiftKey) {
            e.preventDefault();
            addName(input);
        }
    };

    useEffect(() => {
        if (viewItems.length >= maxTags && input) setInput('');
    }, [viewItems.length, maxTags, input]);
    Math.max(0, maxTags - viewItems.length);

    return (
        <div className={className} style={style}>
            <label className="form-label fw-semibold">{label}</label>

            <div className="d-flex flex-wrap gap-2 mb-2">
                {viewItems.map((t) => (
                    <span
                        key={t.id}
                        className="badge bg-secondary d-flex align-items-center justify-content-center"
                        style={{padding: '0.5em 0.75em'}}
                    >
            {t.name}
                        <button
                            type="button"
                            className="btn btn-sm btn-light py-0 ms-2"
                            onClick={() => removeById(t.id)}
                            aria-label={`Remove ${t.name}`}
                            style={{lineHeight: 1}}
                        >
              ×
            </button>
          </span>
                ))}
            </div>

            <div className="input-group mb-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    aria-label="Tag input"
                />
            </div>
        </div>
    );
};

export default PinTagsControl;
