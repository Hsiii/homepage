import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import 'components/MobileWarning.css';

export default function MobileWarning() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if device is mobile (< 600px) on initial mount
        const isMobile = window.innerWidth < 600;
        const dismissed = localStorage.getItem('mobile-warning-dismissed');

        if (isMobile && !dismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDontShowAgain = () => {
        localStorage.setItem('mobile-warning-dismissed', 'true');
        setIsVisible(false);
    };

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
                <div className='mobile-warning-header'>
                    <h3 className='mobile-warning-title'>Work in progress</h3>
                    <button
                        className='mobile-warning-close-btn'
                        onClick={() => setIsVisible(false)}
                        aria-label='Close warning'
                    >
                        <X size={24} />
                    </button>
                </div>
                <p>
                    The mobile version of this site is still under development,
                    please view on desktop for the best experience.
                </p>
                <div className='mobile-warning-actions'>
                    <button
                        className='mobile-warning-action-btn'
                        onClick={() => setIsVisible(false)}
                    >
                        Got it
                    </button>
                    <button
                        className='mobile-warning-action-btn'
                        onClick={handleDontShowAgain}
                    >
                        Don't show again
                    </button>
                </div>
            </div>
        </div>
    );
}
