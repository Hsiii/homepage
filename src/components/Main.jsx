import React from 'react';

import Cover from 'components/Cover.jsx';

import 'components/Main.css';
import 'utils/colorPalette.css';

export default function Main() {
    return (
        <>
            <main>
                <Cover />
            </main>
            <footer>
                <a href='http://www.freepik.com'>Cover image designed by pikisuperstar / Freepik</a>
            </footer>
        </>
    );
}
