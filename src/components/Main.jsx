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
                <a href='https://www.freepik.com/free-vector/welcome-landing-page-with-gradient-landscape_5060698.htm#fromView=search&page=1&position=22&uuid=29afede1-c055-4f7a-82bc-35b5b30e8d44&query=%40pikisuperstar+landscape'>
                    Image designed by pikisuperstar on Freepik
                </a>
            </footer>
        </>
    );
}
