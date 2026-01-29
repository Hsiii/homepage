import { footerCredit, footerLink } from '@constants';

import { Cover } from './Cover.js';
import { MobileWarning } from './MobileWarning.js';

import 'components/Main.css';

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
