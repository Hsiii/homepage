import { useState, useEffect } from 'react';

import { linkTree, links } from 'constants';

export const useLinkNavigation = (keyboardNavidationEnabled) => {
    const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isMouseNavigating, setIsMouseNavigating] = useState(true);

    useEffect(() => {
        const onClick = () => {
            setIsKeyboardNavigating(false);
        };

        const onKeyDown = (e) => {
            // for chinese input method editor
            const key = e.code.slice(-1);

            // activate navigation
            if (!isKeyboardNavigating) {
                if (key === '1' && keyboardNavidationEnabled) {
                    setIsKeyboardNavigating(true);
                    setIsMouseNavigating(false);
                }
                return;
            }

            // disable when mouse navigation is active
            if (isMouseNavigating) return;

            // go to previous layer on escape
            if (e.key === 'Escape') {
                if (selectedIdx) {
                    setSelectedIdx(0);
                    return;
                }
                setIsKeyboardNavigating(false);
                return;
            }

            // keep valid navigation keys
            if (!/^[1-9]$/.test(key)) return;
            const idx = parseInt(key);
            if (idx > linkTree.length) return;

            // if nothing selected yet, select category
            if (!selectedIdx) {
                setSelectedIdx(idx);
                return;
            }

            // else go to link
            window.location.href =
                links[linkTree[selectedIdx - 1].links[idx - 1]];
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('click', onClick);
        };
    }, [
        isKeyboardNavigating,
        isMouseNavigating,
        selectedIdx,
        keyboardNavidationEnabled,
    ]);

    useEffect(() => {
        if (!isKeyboardNavigating) {
            setSelectedIdx(0);
            return;
        }
    }, [isKeyboardNavigating]);

    const startMouseNavigation = () => {
        setSelectedIdx(0);
        setIsMouseNavigating(true);
    };

    const endMouseNavigation = () => {
        setIsKeyboardNavigating(false);
        setIsMouseNavigating(false);
    };

    return {
        selectedIdx,
        isKeyboardNavigating,
        isMouseNavigating,
        startMouseNavigation,
        endMouseNavigation,
    };
};
