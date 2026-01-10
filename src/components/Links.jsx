import React, { useEffect, useMemo } from 'react';
import { linkTree } from 'constants';
import LinkCategory from 'components/LinkCategory';
import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';
import PropTypes from 'prop-types';

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
                <LinkCategory
                    key={node.category}
                    node={node}
                    index={i}
                    selectedIdx={selectedIdx}
                    isMouseNavigating={isMouseNavigating}
                    keyboardNavigationEnabled={keyboardNavidationEnabled}
                    padding={paddings[i]}
                    highlightedLink={highlightedLink}
                />
            ))}
        </section>
    );
}
