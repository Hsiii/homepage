import React, { useEffect } from 'react';

import Cover from 'components/Cover.jsx';
import setLinks from 'utils/link.jsx';

import 'components/Main.css';
import 'utils/colorPalette.css';

export default function Main() {
    useEffect(() => {
        setLinks();
    }, []);

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
