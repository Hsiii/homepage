import { useState, useEffect, useCallback } from 'react';

export const useHideLinks = () => {
    let ticking = false;
    const [hideLinks, setHideLinks] = useState(false);

    const handleScroll = useCallback(() => {
        setHideLinks(window.scrollY !== 0);
    }, []);

    const onScroll = useCallback(() => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, []);

    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return { hideLinks };
};
