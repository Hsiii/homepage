import React, {useEffect, useState, useRef, useCallback} from 'react';

import Links from 'components/Links.jsx';
import 'components/Cover.css'

export default function Cover(props) {
    const mtMid = useRef(null);
    const mtBack = useRef(null);
    const input = useRef(null);
    
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
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

    const [toggle, setToggle] = useState(false);
    const [showLinks, setShowLinks] = useState(true);

    useEffect(() => {
        let ticking = false;
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
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        handleScroll();
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleScroll = () => {
        setTransform(mtBack, 0.6); 
        setTransform(mtMid, 0.5);
        setShowLinks(window.scrollY == 0);
    }

    const setTransform = (el, tr) => {
        el.current.style.transform = `translateY(${tr * window.scrollY}px)`;
    }

    const handleKeyDown = e => {
        if (e.key == ' ') 
            input.current.focus();
    };

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
                        type="text" name="q" 
                        placeholder="Search..." 
                        autoComplete='off' 
                        class="search-input" 
                        ref={input}
                    />
                    <button><i className="fa fa-search"/></button>
                </form>
            </div>

            <Links show={showLinks}/>
        </section>
    );
}