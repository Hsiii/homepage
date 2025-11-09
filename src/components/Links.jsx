import React, { useEffect, useCallback } from 'react';
import { linkTree } from 'utils/bookmarkLink.jsx';
import { links } from 'utils/links.jsx';
import 'components/Links.css';
import {
    BookOpenText,
    CodeXml,
    ToolCase,
    Youtube,
    Brush,
    MessageSquare,
    Gamepad2,
    Bookmark,
} from 'lucide-react';

export default function Links({ disabled, isNavigating }) {
    const [selectedIdx, setSelectedIdx] = React.useState(null);
    const icons = [
        <BookOpenText className='icon' />,
        <CodeXml className='icon' />,
        <ToolCase className='icon' />,
        <Youtube className='icon' />,
        <Brush className='icon' />,
        <MessageSquare className='icon' />,
        <Gamepad2 className='icon' />,
    ];
    useEffect(() => {
        const onKeyDown = (e) => {
            if (!/^[0-9]$/.test(e.key)) return;
            const key = parseInt(e.key, 10);
            if (key === 0) {
                setSelectedIdx(null);
                return;
            }
            if (!isNavigating) return;
            const idx = key - 1;
            if (idx >= linkTree.length) return;

            // if nothing selected yet, select category
            if (selectedIdx === null) {
                setSelectedIdx(idx);
                return;
            }

            window.location.href = links[linkTree[selectedIdx].links[idx]];
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isNavigating, selectedIdx, links]);

    useEffect(() => {
        if (!isNavigating) {
            setSelectedIdx(null);
            return;
        }
    }, [isNavigating]);

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
            <section
                className={`link-tree ${disabled && 'hide'} ${isNavigating && 'expanded'}`}
                onMouseEnter={() => setSelectedIdx(null)}
            >
                <div className='trigger'>
                    <Bookmark className='icon' />
                </div>
                <div className='panel' />
                {linkTree.map((node, i) => (
                    <>
                        <div
                            className={`category ${selectedIdx === i && 'selected'}`}
                            onClick={() => setSelectedIdx(i)}
                        >
                            {icons[i]}
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
