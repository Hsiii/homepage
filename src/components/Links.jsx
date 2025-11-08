import React, { useCallback } from 'react';
import { linkTree } from 'utils/bookmarkLink.jsx';
import { links } from 'utils/links.jsx';
import 'components/Links.css';

export default function Links({ show }) {
    const calcPadding = useCallback(
        (headerIndex, link) => {
            const windowHeight = window.innerHeight;
            const remToPx = 16;
            const linkHeight = 3.5 * remToPx; // rem to px
            const headerPosition =
                windowHeight / 2 + (headerIndex + 1 - linkTree.length / 2 - 0.5) * linkHeight;
            const linksHeight = link.child.length * linkHeight;
            let padding;
            if (headerPosition + linksHeight / 2 <= windowHeight - remToPx)
                padding = headerPosition - linksHeight / 2;
            else padding = windowHeight - linksHeight - remToPx;
            if (padding < remToPx) padding = remToPx;
            return padding + 'px';
        },
        [window.innerHeight],
    );

    return (
        <>
            <section className={`links ${show ? '' : 'hide'}`}>
                <div className='indicator'>
                    <i className='fa-solid fa-bookmark' />
                </div>
                <div className='filler' />
                {linkTree.map((link, i) => (
                    <>
                        <div className='link-header'>
                            <i className={'fa-solid fa-' + link.icon} />
                            <a>{link.class}</a>
                        </div>
                        <div className='sub-links' style={{ '--padding': calcPadding(i, link) }}>
                            <div className='filler' />
                            {link.child.map((sublink) => (
                                <a id={sublink} href={links.sublink}>
                                    {sublink}
                                </a>
                            ))}
                        </div>
                    </>
                ))}
            </section>
        </>
    );
}
