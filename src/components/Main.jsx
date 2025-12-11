import React from 'react';

import { Cover } from 'components';

import { footerLink, footerCredit } from 'constants';
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
