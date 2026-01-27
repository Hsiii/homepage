import { useEffect, useState } from 'react';
import { links, linkTree } from '@constants';

export const useLinkNavigation = (
    isSearchNav: boolean,
    onClearSearch: () => void,
    highlightedCategory?: number
) => {
    // 1-based indexing
    const [selectedCategory, setSelectedCategory] = useState(0);

    const [prevHighlightedCategory, setPrevHighlightedCategory] =
        useState(highlightedCategory);

    if (highlightedCategory !== prevHighlightedCategory) {
        setPrevHighlightedCategory(highlightedCategory);
        setSelectedCategory(highlightedCategory || 0);
    }

    // Shows hotkey hint, expands the base panel, cancels mouse navigation
    const [isKeyboardNav, setIsKeyboardNav] = useState(false);

    // Hide the hotkey hint, cancels keyboard navigation
    const [isMouseNav, setIsMouseNav] = useState(false);

    const [prevIsSearchNav, setPrevIsSearchNav] = useState(isSearchNav);

    // Clear nav states
    if (isSearchNav !== prevIsSearchNav) {
        setPrevIsSearchNav(isSearchNav);
        if (isSearchNav) {
            setIsKeyboardNav(false);
            setIsMouseNav(false);
            setSelectedCategory(0);
        }
    }

    useEffect(() => {
        const onClick = () => {
            setIsKeyboardNav(false);
            setSelectedCategory(0);
        };

        const onKeyDown = (e: KeyboardEvent) => {
            // for chinese input method editor
            const key = e.code.slice(-1);

            // activate navigation
            if (!isKeyboardNav) {
                if (key === '1' && !isSearchNav) {
                    setIsKeyboardNav(true);
                    setIsMouseNav(false);
                }
                return;
            }

            // go to previous layer on escape
            if (e.key === 'Escape') {
                if (selectedCategory) {
                    setSelectedCategory(0);
                    return;
                }
                setIsKeyboardNav(false);
                return;
            }

            // keep valid navigation keys
            if (!/^[1-9]$/.test(key)) return;
            const idx = parseInt(key);
            if (idx > linkTree.length) return;

            // if nothing selected yet, select category
            if (!selectedCategory) {
                setSelectedCategory(idx);
                return;
            }

            // else navigate to the selected link
            window.location.href =
                links[linkTree[selectedCategory - 1].links[idx - 1]];
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('click', onClick);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('click', onClick);
        };
    }, [isKeyboardNav, isMouseNav, selectedCategory, isSearchNav]);

    const startMouseNav = () => {
        setIsMouseNav(true);
        setIsKeyboardNav(false);
        setSelectedCategory(0);
        onClearSearch();
    };

    const endMouseNav = () => {
        setIsMouseNav(false);
    };

    return {
        selectedCategory,
        setSelectedCategory,
        isKeyboardNav,
        isMouseNav,
        startMouseNav,
        endMouseNav,
    };
};
