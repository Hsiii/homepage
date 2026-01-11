import { footerCredit, footerLink } from 'constants';
import { Cover, MobileWarning } from 'components';

import 'components/Main.css';

export default function Main() {
    return (
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
}
