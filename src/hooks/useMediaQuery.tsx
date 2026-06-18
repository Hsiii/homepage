import { useEffect, useState } from 'react';

const getMediaQueryMatch = (query: string): boolean =>
    globalThis.matchMedia(query).matches;

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => getMediaQueryMatch(query));

    useEffect(() => {
        const mediaQueryList = globalThis.matchMedia(query);

        const updateMatches = () => {
            setMatches(mediaQueryList.matches);
        };

        updateMatches();
        mediaQueryList.addEventListener('change', updateMatches);
        return () => {
            mediaQueryList.removeEventListener('change', updateMatches);
        };
    }, [query]);

    return matches;
};
