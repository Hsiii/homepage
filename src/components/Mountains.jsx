import React, { useEffect, useRef } from 'react';

import 'components/Mountains.css';

export default function Mountains() {
    const mtMid = useRef(null);
    const mtBack = useRef(null);

    useEffect(() => {
        let ticking = false;

        const setTransform = (el, tr) => {
            el.current.style.transform = `translateY(${tr * window.scrollY}px)`;
        };

        const handleScroll = () => {
            setTransform(mtBack, 0.6);
            setTransform(mtMid, 0.5);
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

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);
    return (
        <div className='mountains'>
            <div className='sky' />
            <img src='images/mountain/back.webp' ref={mtBack} />
            <img src='images/mountain/mid.webp' ref={mtMid} />
            <img src='images/mountain/front.webp' />
        </div>
    );
}
