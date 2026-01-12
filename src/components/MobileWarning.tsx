import { useEffect, useState } from 'react';

import 'components/MobileWarning.css';

export default function MobileWarning() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if device is mobile (< 600px) on initial mount
        const isMobile = window.innerWidth < 600;

        if (isMobile) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className='mobile-warning-overlay'
            onClick={() => setIsVisible(false)}
        >
            <div
                className='mobile-warning-dialog'
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
            >
                <p>
                    This site is optimized for a desktop browser homepage. For
                    the best experience, please visit on a computer.
                </p>
                <button
                    className='mobile-warning-action-btn'
                    onClick={() => setIsVisible(false)}
                >
                    Continue anyway
                </button>
            </div>
        </div>
    );
}
