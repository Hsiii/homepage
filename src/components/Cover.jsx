import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

import { Mountains } from 'components';
const Links = lazy(() => import('components/Links'));
import { useTime, useHideLinks } from 'hooks';
import { Search } from 'lucide-react';
import 'components/Cover.css';

export default function Cover() {
    const inputRef = useRef(null);
    const { time } = useTime();
    const { hideLinks } = useHideLinks();
    const [inputFocused, setInputFocused] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key == ' ' && !inputFocused) {
                e.preventDefault();
                inputRef.current.focus();
            }
            if (e.key === 'Escape' && inputFocused) {
                e.preventDefault();
                inputRef.current.value = '';
                inputRef.current.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const preventEmptySubmit = (e) => {
        if (inputRef.current.value.trim() === '') {
            e.preventDefault();
        }
    };

    return (
        <section className='cover'>
            <Mountains />
            <span className='title'>{time}</span>

            <div className='search'>
                <form
                    className='search-form'
                    method='get'
                    action='https://www.google.com/search'
                    onSubmit={preventEmptySubmit}
                >
                    <div className='search-icon'>
                        <Search className='icon' size={24} />
                    </div>
                    <input
                        className='search-input'
                        type='text'
                        name='q'
                        placeholder='Search'
                        autoComplete='off'
                        ref={inputRef}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                    />
                </form>
            </div>
            <p className='hint'>[SPACE]</p>

            <Suspense fallback={null}>
                {
                    <Links
                        hidden={hideLinks}
                        keyboardNavidationEnabled={!inputFocused}
                    />
                }
            </Suspense>
        </section>
    );
}
