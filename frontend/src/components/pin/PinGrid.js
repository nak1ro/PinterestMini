// components/pins/PinGrid.jsx
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { useEffect, useRef } from 'react';
import PinCard from './PinCard';
import useGridColumnWidth from '../../hooks/useGridColumnWidth';
import useSavedPins from '../../hooks/useSavedPins';

const PinGrid = ({ pins, boardId, onRemoveFromBoard, onDelete }) => {
    const { containerRef, columnWidth } = useGridColumnWidth();
    const gridRef = useRef();
    const masonryInstance = useRef(null);

    // ✅ Fetch saved pins ONCE here
    const savedPinsState = useSavedPins();

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const initMasonry = () => {
            if (masonryInstance.current) {
                masonryInstance.current.destroy();
            }

            masonryInstance.current = new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: false,
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

        // In case images are cached
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
                {(pins || []).map((pin) => (
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
                            // ✅ share hook result with every card
                            savedPinsState={savedPinsState}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinGrid;
