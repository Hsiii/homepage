import React from 'react';
import { footerCredit, footerLink } from 'constants';
import { Cover } from 'components';

import 'components/Main.css';
import 'constants/colorPalette.css';

export default function Main() {
    return (
        <>
            <main>
                <Cover />
            </main>
            <footer>
                <a href={footerLink}>{footerCredit}</a>
            </footer>
        </>
    );
}
