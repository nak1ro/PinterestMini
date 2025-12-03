import { useState, useEffect, useRef, useCallback } from 'react';

const useGridColumnWidth = (minColumnWidth = 250, gap = 15) => {
    const containerRef = useRef(null);
    const [columnWidth, setColumnWidth] = useState(minColumnWidth);

    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const updateLayout = useCallback(() => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;

        // Calculate optimal column width based on container width
        let cols = Math.floor(containerWidth / minColumnWidth);
        if (cols < 2) cols = 2; // Minimum 2 columns

        // Calculate width accounting for gaps
        // totalWidth = (cols * colWidth) + ((cols - 1) * gap)
        // colWidth = (totalWidth - ((cols - 1) * gap)) / cols
        const availableWidth = containerWidth - ((cols - 1) * gap);
        const newColWidth = Math.floor(availableWidth / cols);

        setColumnWidth(newColWidth);
    }, [minColumnWidth, gap]);

    useEffect(() => {
        // Initial calculation
        updateLayout();

        const debouncedUpdate = debounce(updateLayout, 100);

        const resizeObserver = new ResizeObserver(() => {
            debouncedUpdate();
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [updateLayout]);

    return { containerRef, columnWidth };
};

export default useGridColumnWidth;
