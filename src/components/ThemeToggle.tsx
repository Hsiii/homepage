import React, { useCallback, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeTransitionModule {
    runThemeTransition: (options: {
        button: HTMLButtonElement;
        isDarkMode: boolean;
    }) => boolean;
}

const applyThemeImmediately = (isDarkMode: boolean): boolean => {
    const nextDarkMode = !isDarkMode;
    const nextTheme = nextDarkMode ? 'dark' : 'light';
    const root = globalThis.document.documentElement;

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    globalThis.localStorage.setItem('theme', nextTheme);

    return nextDarkMode;
};

export const ThemeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        () => globalThis.document.documentElement.dataset.theme === 'dark'
    );
    const themeTransitionLoaderRef = useRef<
        Promise<ThemeTransitionModule> | undefined
    >(undefined);

    const loadThemeTransition =
        useCallback(async (): Promise<ThemeTransitionModule> => {
            themeTransitionLoaderRef.current ??=
                import('@/utils/themeTransition');

            return await themeTransitionLoaderRef.current;
        }, []);

    const preloadThemeTransition = useCallback(() => {
        loadThemeTransition().catch(() => undefined);
        return undefined;
    }, [loadThemeTransition]);

    const handleThemeToggle = useCallback(
        async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            const button = event.currentTarget;

            try {
                const { runThemeTransition } = await loadThemeTransition();
                const nextDarkMode = runThemeTransition({
                    button,
                    isDarkMode,
                });

                setIsDarkMode(nextDarkMode);
            } catch {
                setIsDarkMode(applyThemeImmediately(isDarkMode));
            }
        },
        [isDarkMode, loadThemeTransition]
    );

    return (
        <button
            className='theme-icon-btn'
            aria-label={
                isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
            }
            onClick={(event) => {
                handleThemeToggle(event).catch(() => undefined);
            }}
            onFocus={preloadThemeTransition}
            onMouseEnter={preloadThemeTransition}
        >
            {isDarkMode ? <Moon className='icon' /> : <Sun className='icon' />}
        </button>
    );
};
