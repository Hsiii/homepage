import React, {useEffect, useState, useRef, useCallback} from 'react';

import Links from 'components/Links.jsx';
import 'components/Cover.css'

export default function Cover() {
    const mtMid = useRef(null);
    const mtBack = useRef(null);
    const input = useRef(null);
    
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    const [toggle, setToggle] = useState(false);
    const [showLinks, setShowLinks] = useState(true);

    useEffect(() => {
        const update = () => {
            const d = new Date();
            setTime(`${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`);
            setDate(d.getMonth() + 1 + '/' + d.getDate());
        };
        update();
        const id = setInterval(update, 1000 * 60);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        let ticking = false;

        const setTransform = (el, tr) => {
            el.current.style.transform = `translateY(${tr * window.scrollY}px)`;
        }

        const handleScroll = () => {
            setTransform(mtBack, 0.6); 
            setTransform(mtMid, 0.5);
            setShowLinks(window.scrollY == 0);
        }
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

        const handleKeyDown = e => {
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
        }
    }, []);

    const toggleTime = useCallback(() => setToggle(t => !t), []);

    return (
        <section className='cover'>
            <div className="img-wrap">
                <div className='sky'/>
                <img src="images/mountain/back.png" ref={mtBack} loading='lazy'/>
                <img src="images/mountain/mid.png" ref={mtMid} loading='lazy'/>
                <img src="images/mountain/front.png"/>
            </div>

            <div className="title" onClick={toggleTime}>
                {toggle ? date : time}
            </div>
            
            <div className="search">
                <form method="get" action="https://www.google.com/search">
                    <input 
                        className="search-input" 
                        type="text" name="q" 
                        placeholder="Search..." 
                        autoComplete='off' 
                        ref={input}
                    />
                    <button><i className="fa fa-search"/></button>
                </form>
            </div>

            <Links show={showLinks}/>
        </section>
    );
}