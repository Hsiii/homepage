import { footerCredit, footerLink } from '@/constants/footer';
import { Cover } from './Cover';
import { MobileWarning } from './MobileWarning';

import './Main.css';

export const Main: React.FC = () => (
    <>
        <MobileWarning />
        <main>
            <Cover />
        </main>
        <footer>
            <a href={footerLink}>{footerCredit}</a>
        </footer>
    </>
);
