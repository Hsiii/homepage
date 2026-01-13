import backSrc from '../assets/images/mountain/back.svg';

import 'components/Mountains.css';

export default function Mountains() {
    return (
        <div className='mountains'>
            <img
                className='parallax-back'
                src={backSrc}
                alt='a flat-color mountain in the background'
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
