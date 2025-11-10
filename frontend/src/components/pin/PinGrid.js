import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import {useEffect, useRef, useState} from 'react';
import PinCard from './PinCard';

const PinGrid = ({pins, boardId, onRemoveFromBoard, onDelete}) => {
    const gridRef = useRef();
    const [columnWidth, setColumnWidth] = useState(305);

    useEffect(() => {
        const updateColumnWidth = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 480) {
                const availableWidth = screenWidth - 24 - 30;
                setColumnWidth(Math.floor(availableWidth / 2));
            } else if (screenWidth < 768) {
                const availableWidth = screenWidth - 24 - 30;
                setColumnWidth(Math.floor(availableWidth / 2));
            } else if (screenWidth < 1024) {
                setColumnWidth((screenWidth - 80 - 60) / 2);
            } else if (screenWidth < 1440) {
                setColumnWidth(305);
            } else {
                setColumnWidth(305);
            }
        };

        updateColumnWidth();
        window.addEventListener('resize', updateColumnWidth);

        return () => {
            window.removeEventListener('resize', updateColumnWidth);
        };
    }, []);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const imgLoad = imagesLoaded(grid);
        imgLoad.on('always', () => {
            const isMobile = window.innerWidth < 768;
            new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: !isMobile,
            });
        });

        return () => {
            imgLoad.off('always');
        };
    }, [pins, columnWidth]);

    return (
        <>
            <style>{`
                .masonry-grid {
                    margin: 0 auto;
                    width: 100%;
                }

                .masonry-item {
                    box-sizing: border-box;
                }

                .masonry-item > * {
                    max-width: 100%;
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .masonry-grid {
                        padding: 0;
                        width: 100% !important;
                    }
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
                        style={{width: `${columnWidth}px`, maxWidth: '100%'}}
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
        </>
    );
};

export default PinGrid;
