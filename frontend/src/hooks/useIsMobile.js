import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device is mobile based on screen width
 * @param {number} breakpoint - The width breakpoint in pixels (default: 640px)
 * @returns {boolean} - True if screen width is below breakpoint
 */
export const useIsMobile = (breakpoint = 640) => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < breakpoint
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

/**
 * Hook to detect if user prefers reduced motion
 * @returns {boolean} - True if user prefers reduced motion
 */
export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handleChange = (e) => setPrefersReducedMotion(e.matches);
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return prefersReducedMotion;
};

export default useIsMobile;

