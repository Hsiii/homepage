import React, {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { HelpCircle, Moon, Sun } from 'lucide-react';

import './Help.css';

const loadHelpDialog = async () => await import('./HelpDialog');

const HelpDialog = lazy(
    async () =>
        await loadHelpDialog().then((module) => ({
            default: module.HelpDialog,
        }))
);

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

export const Help: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMouseMode, setIsMouseMode] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(
        () => globalThis.document.documentElement.dataset.theme === 'dark'
    );
    const helpRef = useRef<HTMLDivElement>(null);
    const themeTransitionLoaderRef = useRef<
        Promise<ThemeTransitionModule> | undefined
    >(undefined);

    const preloadHelpDialog = useCallback(() => {
        loadHelpDialog().catch(() => undefined);
        return undefined;
    }, []);

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

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                helpRef.current?.contains(e.target as Node) === false
            ) {
                setIsOpen(false);
            }
        };
        globalThis.document.addEventListener('click', onClickOutside);
        return () => {
            globalThis.document.removeEventListener('click', onClickOutside);
        };
    }, [isOpen]);

    return (
        <div className='help' ref={helpRef}>
            <div className='help-actions'>
                <button
                    className='theme-icon-btn'
                    aria-label={
                        isDarkMode
                            ? 'Switch to light mode'
                            : 'Switch to dark mode'
                    }
                    onClick={(event) => {
                        handleThemeToggle(event).catch(() => undefined);
                    }}
                    onFocus={preloadThemeTransition}
                    onMouseEnter={preloadThemeTransition}
                >
                    {isDarkMode ? (
                        <Moon className='icon' />
                    ) : (
                        <Sun className='icon' />
                    )}
                </button>
                <button
                    className='help-icon-btn'
                    aria-label='Help'
                    onFocus={preloadHelpDialog}
                    onMouseEnter={preloadHelpDialog}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isOpen) {
                            preloadHelpDialog();
                        }
                        setIsOpen(!isOpen);
                    }}
                >
                    <HelpCircle className='icon' />
                </button>
            </div>

            <div className={`help-dialog ${isOpen ? 'open' : ''}`}>
                {isOpen ? (
                    <Suspense fallback={undefined}>
                        <HelpDialog
                            isMouseMode={isMouseMode}
                            onSelectKeyboardMode={() => {
                                setIsMouseMode(false);
                            }}
                            onSelectMouseMode={() => {
                                setIsMouseMode(true);
                            }}
                        />
                    </Suspense>
                ) : undefined}
            </div>
        </div>
    );
};
