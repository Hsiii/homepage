import { useCallback, useEffect, useRef, useState } from 'react';

export const useHideLinks = () => {
    const ticking = useRef(false);
    const [hideLinks, setHideLinks] = useState(
        () => typeof window !== 'undefined' && window.scrollY !== 0
    );

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
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [onScroll]);

    return { hideLinks };
};
