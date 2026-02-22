import React, { useEffect, useRef, useState } from 'react';
import {
    Bookmark,
    HelpCircle,
    Keyboard,
    Moon,
    MousePointerClick,
    Search,
    Sun,
} from 'lucide-react';

import 'components/Help.css';

const midpoint = (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
) => ({
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
});

const createBlobPath = (
    centerX: number,
    centerY: number,
    radius: number,
    phase: number,
    wobbleStrength = 1
) => {
    const pointCount = 10;
    const points = Array.from({ length: pointCount }, (_, index) => {
        const angle = (index / pointCount) * Math.PI * 2;
        const wobble =
            1 +
            wobbleStrength *
                (0.16 * Math.sin(angle * 3 + phase) +
                    0.1 * Math.sin(angle * 5 - phase * 0.7));
        return {
            x: centerX + Math.cos(angle) * radius * wobble,
            y: centerY + Math.sin(angle) * radius * wobble,
        };
    });

    const start = midpoint(points[pointCount - 1], points[0]);
    let path = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`;

    for (let i = 0; i < pointCount; i++) {
        const current = points[i];
        const next = points[(i + 1) % pointCount];
        const nextMidpoint = midpoint(current, next);
        path += ` Q ${current.x.toFixed(2)} ${current.y.toFixed(2)} ${nextMidpoint.x.toFixed(2)} ${nextMidpoint.y.toFixed(2)}`;
    }

    return `${path} Z`;
};

export const Help: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMouseMode, setIsMouseMode] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(
        () => globalThis.document.documentElement.dataset.theme === 'dark'
    );
    const helpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = globalThis.document.documentElement;
        const isDark = root.dataset.theme === 'dark';
        root.style.colorScheme = isDark ? 'dark' : 'light';
        setIsDarkMode(isDark);
    }, []);

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

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const root = globalThis.document.documentElement;
        const nextDarkMode = !isDarkMode;

        const searchElement = globalThis.document.querySelector('.search');
        const searchRect = searchElement?.getBoundingClientRect();
        let wonkyCenterX = globalThis.innerWidth / 2;
        let wonkyCenterY = globalThis.innerHeight / 2;

        if (searchRect) {
            wonkyCenterX = searchRect.left + searchRect.width / 2;
            wonkyCenterY = searchRect.top + searchRect.height / 2;
        }
        const wonkyMaxRadius = Math.hypot(
            Math.max(wonkyCenterX, globalThis.innerWidth - wonkyCenterX),
            Math.max(wonkyCenterY, globalThis.innerHeight - wonkyCenterY)
        );

        const buttonRect = e.currentTarget.getBoundingClientRect();
        const buttonCenterX = buttonRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top + buttonRect.height / 2;

        root.style.setProperty('--theme-transition-x', `${wonkyCenterX}px`);
        root.style.setProperty('--theme-transition-y', `${wonkyCenterY}px`);
        root.style.setProperty('--theme-transition-end', `${wonkyMaxRadius}px`);

        const pathFrames = [
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, 14, 0.2, 1)}')`,
                offset: 0,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 0.2, 1.35, 1)}')`,
                offset: 0.08,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 0.35, 2.4, 1)}')`,
                offset: 0.18,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 0.56, 1.1, 1)}')`,
                offset: 0.34,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 0.84, 2.9, 1)}')`,
                offset: 0.52,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 1.22, 1.7, 1)}')`,
                offset: 0.72,
            },
            {
                clipPath: `path('${createBlobPath(wonkyCenterX, wonkyCenterY, wonkyMaxRadius * 1.95, 0, 0)}')`,
                offset: 1,
            },
        ];

        const applyTheme = () => {
            root.dataset.theme = nextDarkMode ? 'dark' : 'light';
            root.style.colorScheme = nextDarkMode ? 'dark' : 'light';
            globalThis.localStorage.setItem(
                'theme',
                nextDarkMode ? 'dark' : 'light'
            );
            setIsDarkMode(nextDarkMode);
        };

        if ('startViewTransition' in globalThis.document) {
            const transition = (
                globalThis.document as Document & {
                    startViewTransition: (
                        callback: () => void
                    ) => ViewTransition;
                }
            ).startViewTransition(applyTheme);

            transition.ready
                .then(() => {
                    const searchIcon =
                        globalThis.document.querySelector('.search-icon .icon');
                    const searchIconRect = searchIcon?.getBoundingClientRect();
                    const searchIconCenterX = searchIconRect
                        ? searchIconRect.left + searchIconRect.width / 2
                        : buttonCenterX;
                    const searchIconCenterY = searchIconRect
                        ? searchIconRect.top + searchIconRect.height / 2
                        : buttonCenterY;
                    const circularMaxRadius = Math.hypot(
                        Math.max(
                            searchIconCenterX,
                            globalThis.innerWidth - searchIconCenterX
                        ),
                        Math.max(
                            searchIconCenterY,
                            globalThis.innerHeight - searchIconCenterY
                        )
                    );
                    const circleFrames = [
                        {
                            clipPath: `circle(0px at ${searchIconCenterX}px ${searchIconCenterY}px)`,
                            offset: 0,
                        },
                        {
                            clipPath: `circle(${(circularMaxRadius * 1.16).toFixed(2)}px at ${searchIconCenterX}px ${searchIconCenterY}px)`,
                            offset: 0.78,
                        },
                        {
                            clipPath: `circle(${(circularMaxRadius * 1.05).toFixed(2)}px at ${searchIconCenterX}px ${searchIconCenterY}px)`,
                            offset: 1,
                        },
                    ];

                    root.animate(nextDarkMode ? pathFrames : circleFrames, {
                        duration: nextDarkMode ? 2400 : 1200,
                        easing: nextDarkMode
                            ? 'linear'
                            : 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                        fill: 'both',
                        pseudoElement: '::view-transition-new(root)',
                    });
                })
                .catch(() => undefined);
            return;
        }

        applyTheme();
    };

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
                    onClick={toggleTheme}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                >
                    <HelpCircle className='icon' />
                </button>
            </div>

            <div className={`help-dialog ${isOpen ? 'open' : ''}`}>
                <div className='help-content'>
                    <div className='help-switch'>
                        <button
                            className={`help-switch-btn ${isMouseMode ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMouseMode(true);
                            }}
                        >
                            <MousePointerClick className='icon' size={24} />
                        </button>
                        <button
                            className={`help-switch-btn ${isMouseMode ? '' : 'active'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMouseMode(false);
                            }}
                        >
                            <Keyboard className='icon' size={24} />
                        </button>
                    </div>
                    <div className='help-desc-list'>
                        <div className='help-desc-item bookmark-desc'>
                            <div className='icon-container'>
                                <Bookmark className='icon' size={20} />
                            </div>
                            <div className='help-desc-text'>
                                {isMouseMode ? (
                                    <p className='key-info'>
                                        Access bookmark panel on the left.
                                    </p>
                                ) : (
                                    <>
                                        <div className='key-info'>
                                            expand panel
                                            <span className='key'>1</span>
                                        </div>
                                        <div className='key-info'>
                                            select / jump to
                                            <span className='key'>1 - 9</span>
                                        </div>
                                        <div className='key-info'>
                                            unselect / close
                                            <span className='key'>ESC</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='help-desc-item searchbar-desc'>
                            <div className='icon-container'>
                                <Search className='icon' size={20} />
                            </div>
                            <div className='help-desc-text'>
                                {isMouseMode ? (
                                    <p className='key-info'>
                                        Search bookmarks directly.
                                    </p>
                                ) : (
                                    <>
                                        <div className='key-info'>
                                            start searching
                                            <span className='key'>SPACE</span>
                                        </div>
                                        <div className='key-info'>
                                            cancel search
                                            <span className='key'>ESC</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
