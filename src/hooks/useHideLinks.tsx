import { useState, useEffect, useCallback, useRef } from 'react';

export const useHideLinks = () => {
    const ticking = useRef(false);
    const [hideLinks, setHideLinks] = useState(false);

    const handleScroll = useCallback(() => {
        setHideLinks(window.scrollY !== 0);
    }, []);

    const onScroll = useCallback(() => {
        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking.current = false;
            });
            ticking.current = true;
        }
    }, [handleScroll]);

    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [handleScroll, onScroll]);

    return { hideLinks };
};
