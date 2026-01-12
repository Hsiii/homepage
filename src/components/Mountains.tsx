import { useState } from 'react';

import 'components/Mountains.css';

export default function Mountains() {
    const [loadedCount, setLoadedCount] = useState(0);
    const handleLoad = () => setLoadedCount((p) => p + 1);

    return (
        <div className='mountains'>
            <div className={`placeholder ${loadedCount > 0 ? 'hidden' : ''}`} />
            <img
                src='assets/images/mountain/back.svg'
                alt='a flat-color mountain in the background'
                onLoad={handleLoad}
            />
            <img
                src='assets/images/mountain/mid.svg'
                alt='a flat-color mountain in the middle'
                onLoad={handleLoad}
            />
            <img
                src='assets/images/mountain/front.svg'
                alt='a flat-color mountain in the foreground'
                onLoad={handleLoad}
            />
        </div>
    );
}
