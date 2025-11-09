import React, { useEffect, useRef } from 'react';

import 'components/Mountains.css';

export default function Mountains() {
    return (
        <div className='mountains'>
            <img src='images/mountain/back.webp' />
            <img src='images/mountain/mid.webp' />
            <img src='images/mountain/front.webp' />
        </div>
    );
}
