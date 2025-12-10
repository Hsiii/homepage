import React, { useState, useEffect, useMemo } from 'react';

import { Bookmark } from 'lucide-react';
import PropTypes from 'prop-types';

import { linkTree, links } from 'constants';

import 'components/Links.css';

Links.propTypes = {
    disabled: PropTypes.bool,
    isNavigating: PropTypes.bool.isRequired,
    setIsNavigating: PropTypes.func.isRequired,
};

export default function Links({ disabled, isNavigating, setIsNavigating }) {
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [isMouseNavigation, setIsMouseNavigation] = useState(false);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (!isNavigating || isMouseNavigation) return;
            if (e.key === 'Escape') {
                if (selectedIdx) {
                    setSelectedIdx(0);
                    return;
                }
                setIsNavigating(false);
                return;
            }
            if (!/^[1-9]$/.test(e.key)) return;
            const idx = parseInt(e.key, 10);
            if (idx > linkTree.length) return;

            // if nothing selected yet, select category
            if (!selectedIdx) {
                setSelectedIdx(idx);
                return;
            }

            window.location.href =
                links[linkTree[selectedIdx - 1].links[idx - 1]];
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isNavigating, isMouseNavigation, selectedIdx, links]);

    useEffect(() => {
        if (!isNavigating) {
            setSelectedIdx(0);
            return;
        }
    }, [isNavigating]);

    const startMouseNavigation = () => {
        setSelectedIdx(0);
        setIsMouseNavigation(true);
    };

    const endMouseNavigation = () => {
        setIsNavigating(false);
        setIsMouseNavigation(false);
    };

    const paddings = useMemo(() => {
        const windowHeight = window.innerHeight;
        const remToPx = 16;
        const linkHeight = 3.5 * remToPx;

        return linkTree.map((node, headerIndex) => {
            const headerPosition =
                windowHeight / 2 +
                (headerIndex + 1 - linkTree.length / 2 - 0.5) * linkHeight;
            const linksHeight = node.links.length * linkHeight;
            let padding;
            if (headerPosition + linksHeight / 2 <= windowHeight - remToPx)
                padding = headerPosition - linksHeight / 2;
            else padding = windowHeight - linksHeight - remToPx;
            if (padding < remToPx) padding = remToPx;
            return padding + 'px';
        });
    }, [window.innerHeight, linkTree]);

    return (
        <section
            className={`link-tree ${disabled && 'hide'} ${
                isNavigating && 'expanded'
            }`}
            onMouseMove={startMouseNavigation}
            onMouseOut={endMouseNavigation}
        >
            <div className='trigger'>
                <Bookmark className='icon' />
                <p className='hint'>[1]</p>
            </div>
            <div className='panel' />
            {linkTree.map((node, i) => (
                <>
                    <div
                        className={`category ${
                            selectedIdx === i + 1 && 'selected'
                        }`}
                        key={i + '-category'}
                    >
                        {node.icon}
                        <p
                            className={`hint ${
                                (isMouseNavigation ||
                                    selectedIdx ||
                                    i + 1 > 9) &&
                                'hide'
                            }`}
                        >
                            [{i + 1}]
                        </p>
                        <span>{node.category}</span>
                    </div>
                    <div
                        className='links'
                        style={{ '--padding': paddings[i] }}
                        key={i + '-links'}
                    >
                        <div className='panel' />
                        {node.links.map((link, j) => (
                            <a
                                id={link}
                                className={!links[link] && 'disabled'}
                                href={links[link]}
                                key={j}
                            >
                                {link}
                                <p
                                    className={`hint ${
                                        (isMouseNavigation ||
                                            !selectedIdx ||
                                            j + 1 > 9 ||
                                            !links[link]) &&
                                        'hide'
                                    }`}
                                >
                                    [{j + 1}]
                                </p>
                            </a>
                        ))}
                    </div>
                </>
            ))}
        </section>
    );
}
