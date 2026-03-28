import { lazy, Suspense, useState } from 'react';

import { footerCredit, footerLink } from '@/constants/footer';
import { Cover } from './Cover';

import './Main.css';

const MobileWarning = lazy(
    async () =>
        await import('./MobileWarning').then((module) => ({
            default: module.MobileWarning,
        }))
);

export const Main: React.FC = () => {
    const [isMobileViewport] = useState(() => globalThis.innerWidth < 600);

    return (
        <>
            <Suspense fallback={undefined}>
                {isMobileViewport ? <MobileWarning /> : undefined}
            </Suspense>
            <main>
                <Cover />
            </main>
            <footer>
                <a href={footerLink}>{footerCredit}</a>
            </footer>
        </>
    );
};
