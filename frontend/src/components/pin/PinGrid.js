import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import {useEffect, useRef} from 'react';
import PinCard from './PinCard';

const PinGrid = ({pins, boardId, onRemoveFromBoard, onDelete}) => {
    const gridRef = useRef();

    useEffect(() => {
        const grid = gridRef.current;

        // Wait for all images to load inside the grid
        const imgLoad = imagesLoaded(grid);
        imgLoad.on('always', () => {
            new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: true,
            });
        });

        // Optional: Clean up on unmount
        return () => {
            imgLoad.off('always');
        };
    }, [pins]);

    return (
        <div
            ref={gridRef}
            className="masonry-grid m-auto"
            style={{margin: '0 auto'}}
        >
            {(pins || []).map(pin => (
                <div key={pin.id} className="masonry-item" style={{width: '305px'}}>
                    <PinCard 
                        pin={pin} 
                        boardId={boardId}
                        onRemoveFromBoard={onRemoveFromBoard}
                        onDelete={onDelete}
                    />
                </div>
            ))}
        </div>
    );
};

export default PinGrid;
