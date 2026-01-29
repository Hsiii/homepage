import React, { useEffect, useRef, useState } from 'react';
import {
    Bookmark,
    HelpCircle,
    Keyboard,
    MousePointerClick,
    Search,
} from 'lucide-react';

import 'components/Help.css';

export const Help: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMouseMode, setIsMouseMode] = useState(true);
    const helpRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (
                isOpen &&
                !(e.target as HTMLElement).contains(helpRef.current)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', onClickOutside);
        return () => {
            document.removeEventListener('click', onClickOutside);
        };
    }, [isOpen, helpRef]);

    return (
        <div className='help' ref={helpRef}>
            <button
                className='help-icon-btn'
                aria-label='Help'
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                <HelpCircle className='icon' size={24} />
            </button>

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
