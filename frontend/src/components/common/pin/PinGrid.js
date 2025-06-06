import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import {useEffect, useRef} from 'react';
import PinCard from './PinCard';

const PinGrid = ({pins}) => {
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
        <div className="container py-4">
            <div
                ref={gridRef}
                className="masonry-grid m-auto"
                style={{ margin: '0 auto', maxWidth: '1300px' }}
            >
                {pins.map(pin => (
                    <div key={pin.id} className="masonry-item" style={{width: '250px'}}>
                        <PinCard pin={pin}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PinGrid;
