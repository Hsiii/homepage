import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';

import Mountains from 'components/Mountains';
const Links = React.lazy(() => import('components/Links'));

import 'components/Cover.css';

export default function Cover() {
    const input = useRef(null);

    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [toggle, setToggle] = useState(false);
    const [showLinks, setShowLinks] = useState(true);

    useEffect(() => {
        requestAnimationFrame(() => {
            const update = () => {
                const d = new Date();
                const hours = d.getHours().toString().padStart(2, '0');
                const minutes = d.getMinutes().toString().padStart(2, '0');
                setTime(`${hours}:${minutes}`);
                setDate(d.getMonth() + 1 + '/' + d.getDate());
            };
            update();
            const id = setInterval(update, 1000 * 60);
            return () => clearInterval(id);
        });
    }, []);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            setShowLinks(window.scrollY == 0);
        };
        handleScroll();

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        const handleKeyDown = (e) => {
            if (e.key == ' ' && document.activeElement !== input.current) {
                e.preventDefault();
                input.current.focus();
            }
            if (e.key === 'Escape' && document.activeElement === input.current) {
                e.preventDefault();
                input.current.blur();
            }
        };

        window.addEventListener('scroll', onScroll);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const toggleTime = useCallback(() => setToggle((t) => !t), []);

    return (
        <section className='cover'>
            <Mountains />
            <div className='title' onClick={toggleTime}>
                {toggle ? date : time}
            </div>

            <div className='search'>
                <form method='get' action='https://www.google.com/search'>
                    <input
                        className='search-input'
                        type='text'
                        name='q'
                        placeholder='Search...'
                        autoComplete='off'
                        ref={input}
                    />
                    <button>
                        <i className='fa fa-search' />
                    </button>
                </form>
            </div>
            <Suspense fallback={null}>{<Links disabled={!showLinks} />}</Suspense>
        </section>
    );
}
