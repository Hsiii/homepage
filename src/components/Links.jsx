import React, { useCallback } from 'react';
import { linkTree } from 'utils/bookmarkLink.jsx';
import { links } from 'utils/links.jsx';
import 'components/Links.css';

export default function Links({ disabled }) {
    const calcPadding = useCallback(
        (headerIndex, links) => {
            const windowHeight = window.innerHeight;
            const remToPx = 16;
            const linkHeight = 3.5 * remToPx; // rem to px
            const headerPosition =
                windowHeight / 2 + (headerIndex + 1 - linkTree.length / 2 - 0.5) * linkHeight;
            const linksHeight = links.length * linkHeight;
            let padding;
            if (headerPosition + linksHeight / 2 <= windowHeight - remToPx)
                padding = headerPosition - linksHeight / 2;
            else padding = windowHeight - linksHeight - remToPx;
            if (padding < remToPx) padding = remToPx;
            return padding + 'px';
        },
        [linkTree, window.innerHeight],
    );

    return (
        <>
            <section className={`link-tree ${disabled && 'hide'}`}>
                <div className='trigger'>
                    <i className='fa-solid fa-bookmark' />
                </div>
                <div className='panel' />
                {linkTree.map((node, i) => (
                    <>
                        <div className='category'>
                            <i className={'fa-solid fa-' + node.icon} />
                            <span>{node.category}</span>
                        </div>
                        <div className='links' style={{ '--padding': calcPadding(i, node.links) }}>
                            <div className='panel' />
                            {node.links.map((link) => (
                                <a id={link} href={links[link]}>
                                    {link}
                                </a>
                            ))}
                        </div>
                    </>
                ))}
            </section>
        </>
    );
}
