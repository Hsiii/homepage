import React, { useMemo, useEffect, Fragment } from 'react';

import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';
import PropTypes from 'prop-types';

import { linkTree, links } from 'constants';

import 'components/Links.css';

Links.propTypes = {
    hidden: PropTypes.bool,
    keyboardNavidationEnabled: PropTypes.bool,
    highlightedLink: PropTypes.string,
    highlightedCategoryIdx: PropTypes.number,
    onClearSearch: PropTypes.func.isRequired,
};

export default function Links({
    hidden,
    keyboardNavidationEnabled,
    highlightedLink,
    highlightedCategoryIdx,
    onClearSearch,
}) {
    const {
        selectedIdx,
        setSelectedIdx,
        isKeyboardNavigating,
        isMouseNavigating,
        startMouseNavigation,
        endMouseNavigation,
    } = useLinkNavigation(keyboardNavidationEnabled);

    useEffect(() => {
        if (highlightedCategoryIdx) {
            setSelectedIdx(highlightedCategoryIdx);
        } else {
            setSelectedIdx(0);
        }
    }, [highlightedCategoryIdx, setSelectedIdx]);

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
            role='navigation'
            className={`link-tree ${hidden && 'hidden'} ${
                (isKeyboardNavigating || selectedIdx) && 'expanded'
            } ${isMouseNavigating ? 'hoverEffective' : ''}`}
            onMouseMove={(e) => {
                startMouseNavigation(e);
                onClearSearch();
            }}
            onMouseOut={endMouseNavigation}
            aria-hidden={hidden}
            aria-expanded={isKeyboardNavigating}
        >
            <div className='trigger'>
                <div className='indicator' />
                <Bookmark className='icon' />
                <p className='hint'>[1]</p>
            </div>
            <div className='panel' />
            {linkTree.map((node, i) => (
                <Fragment key={node.category}>
                    <div
                        className={`category ${
                            selectedIdx === i + 1 && 'selected'
                        } ${isMouseNavigating ? 'hoverEffective' : ''}`}
                    >
                        {node.icon}
                        <p
                            className={`hint ${
                                (isMouseNavigating ||
                                    selectedIdx ||
                                    i + 1 > 9 ||
                                    !keyboardNavidationEnabled) &&
                                'hidden'
                            }`}
                        >
                            [{i + 1}]
                        </p>
                        <span>{node.category}</span>
                    </div>
                    <div
                        className={`links ${
                            isMouseNavigating ? 'hoverEffective' : ''
                        }`}
                        style={{ '--padding': paddings[i] }}
                    >
                        <div className='panel' />
                        {node.links.map((link, j) => (
                            <a
                                id={link}
                                className={`link ${
                                    !links[link] ? 'disabled' : ''
                                } ${
                                    isMouseNavigating ? 'hoverEffective' : ''
                                } ${
                                    highlightedLink === link
                                        ? 'highlighted'
                                        : ''
                                }`}
                                href={links[link]}
                                key={link}
                            >
                                {link}
                                <p
                                    className={`hint ${
                                        (isMouseNavigating ||
                                            !selectedIdx ||
                                            j + 1 > 9 ||
                                            !links[link] ||
                                            !keyboardNavidationEnabled) &&
                                        'hidden'
                                    }`}
                                >
                                    [{j + 1}]
                                </p>
                            </a>
                        ))}
                    </div>
                </Fragment>
            ))}
        </section>
    );
}
