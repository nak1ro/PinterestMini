import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import {useEffect, useRef} from 'react';
import PinCard from './PinCard';

const PinGrid = ({pins, boardId, onRemoveFromBoard, onDelete, onLoadMore, loadingMore}) => {
    const gridRef = useRef();
    const loadMoreRef = useRef();
    const masonryInstanceRef = useRef(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!onLoadMore || !loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !loadingMore) {
                    onLoadMore();
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        observer.observe(loadMoreRef.current);

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [onLoadMore, loadingMore]);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // Wait for all images to load inside the grid
        const imgLoad = imagesLoaded(grid);
        imgLoad.on('always', () => {
            // Destroy previous instance if it exists
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.destroy();
            }
            
            // Create new masonry instance
            masonryInstanceRef.current = new Masonry(grid, {
                itemSelector: '.masonry-item',
                gutter: 15,
                fitWidth: true,
            });
        });

        // Clean up on unmount
        return () => {
            imgLoad.off('always');
            if (masonryInstanceRef.current) {
                masonryInstanceRef.current.destroy();
            }
        };
    }, [pins]);

    return (
        <>
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
            {onLoadMore && (
                <div ref={loadMoreRef} style={{ minHeight: '20px', textAlign: 'center', padding: '20px' }}>
                    {loadingMore && <p>Loading more pins...</p>}
                </div>
            )}
        </>
    );
};

export default PinGrid;
