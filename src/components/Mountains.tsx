import { useState } from 'react';

import mountainsSrc from '../assets/images/mountain/mountains.webp';

import 'components/Mountains.css';

export default function Mountains() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className='mountains'>
            <img
                src={mountainsSrc}
                alt='placeholder mountains'
                className={`placeholder ${loaded ? 'hidden' : ''}`}
            />
            <img
                className='parallax-back'
                src='assets/images/mountain/back.svg'
                alt='a flat-color mountain in the background'
                onLoad={() => setLoaded(true)}
            />
            <img
                className='parallax-mid'
                src='assets/images/mountain/mid.svg'
                alt='a flat-color mountain in the middle'
            />
            <img
                src='assets/images/mountain/front.svg'
                alt='a flat-color mountain in the foreground'
            />
        </div>
    );
}
