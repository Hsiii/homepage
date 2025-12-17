import React, { useMemo } from 'react';

import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';
import PropTypes from 'prop-types';

import { linkTree, links } from 'constants';

import 'components/Links.css';

Links.propTypes = {
    hidden: PropTypes.bool,
    keyboardNavidationEnabled: PropTypes.bool,
};

export default function Links({ hidden, keyboardNavidationEnabled }) {
    const {
        selectedIdx,
        isKeyboardNavigating,
        isMouseNavigating,
        startMouseNavigation,
        endMouseNavigation,
    } = useLinkNavigation(keyboardNavidationEnabled);

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
            className={`link-tree ${hidden && 'hidden'} ${
                isKeyboardNavigating && 'expanded'
            }`}
            onMouseMove={startMouseNavigation}
            onMouseOut={endMouseNavigation}
        >
            <div className='trigger'>
                <div className='indicator' />
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
                                (isMouseNavigating ||
                                    selectedIdx ||
                                    i + 1 > 9) &&
                                'hidden'
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
                                        (isMouseNavigating ||
                                            !selectedIdx ||
                                            j + 1 > 9 ||
                                            !links[link]) &&
                                        'hidden'
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
