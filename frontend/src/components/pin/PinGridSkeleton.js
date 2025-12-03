import React, { useMemo } from 'react';
import Masonry from 'masonry-layout';
import { useEffect, useRef } from 'react';
import PinSkeleton from './PinSkeleton';
import useGridColumnWidth from '../../hooks/useGridColumnWidth';

const PinGridSkeleton = () => {
    const { containerRef, columnWidth } = useGridColumnWidth();
    const gridRef = useRef();
    const masonryInstance = useRef(null);

    // Generate a fixed number of skeletons
    const skeletons = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // Initialize Masonry
        // We need a slight delay to ensure the DOM elements are rendered with correct widths
        const timeoutId = setTimeout(() => {
            if (masonryInstance.current) {
                masonryInstance.current.destroy();
            }

            masonryInstance.current = new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: false,
                transitionDuration: 0, // No transition for skeletons
            });
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            if (masonryInstance.current) {
                masonryInstance.current.destroy();
            }
        };
    }, [columnWidth]); // Re-run when column width changes

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
                {skeletons.map(id => (
                    <div
                        key={id}
                        className="masonry-item"
                        style={{ width: `${columnWidth}px` }}
                    >
                        <PinSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinGridSkeleton;
