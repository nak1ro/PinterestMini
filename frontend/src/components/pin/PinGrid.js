import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { useEffect, useRef, useState, useCallback } from 'react';
import PinCard from './PinCard';

const PinGrid = ({ pins, boardId, onRemoveFromBoard, onDelete }) => {
    const gridRef = useRef();
    const containerRef = useRef();
    const [columnWidth, setColumnWidth] = useState(305);
    const masonryInstance = useRef(null);

    // Debounce function to limit how often a function can fire
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
        // We want columns to be around 250-300px
        let cols = Math.floor(containerWidth / 250);
        if (cols < 2) cols = 2; // Minimum 2 columns

        // Calculate width accounting for gaps (15px gap)
        // totalWidth = (cols * colWidth) + ((cols - 1) * gap)
        // colWidth = (totalWidth - ((cols - 1) * gap)) / cols
        const gap = 15;
        const availableWidth = containerWidth - ((cols - 1) * gap);
        const newColWidth = Math.floor(availableWidth / cols);

        setColumnWidth(newColWidth);
    }, []);

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

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // Initialize or update Masonry
        const initMasonry = () => {
            if (masonryInstance.current) {
                masonryInstance.current.destroy();
            }

            masonryInstance.current = new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: false, // We're handling width via container
                transitionDuration: '0.2s',
            });
        };

        const imgLoad = imagesLoaded(grid);
        imgLoad.on('progress', () => {
            if (masonryInstance.current) {
                masonryInstance.current.layout();
            }
        });

        imgLoad.on('always', () => {
            initMasonry();
        });

        // Also run immediately in case images are cached
        initMasonry();

        return () => {
            imgLoad.off('progress');
            imgLoad.off('always');
            if (masonryInstance.current) {
                masonryInstance.current.destroy();
            }
        };
    }, [pins, columnWidth]);

    return (
        <div ref={containerRef} style={{ width: '100%' }}>
            <style>{`
                .masonry-grid {
                    margin: 0 auto;
                    width: 100%;
                }

                .masonry-item {
                    box-sizing: border-box;
                    margin-bottom: 15px;
                }
            `}</style>

            <div
                ref={gridRef}
                className="masonry-grid"
            >
                {(pins || []).map(pin => (
                    <div
                        key={pin.id}
                        className="masonry-item"
                        style={{ width: `${columnWidth}px` }}
                    >
                        <PinCard
                            pin={pin}
                            boardId={boardId}
                            onRemoveFromBoard={onRemoveFromBoard}
                            onDelete={onDelete}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinGrid;
