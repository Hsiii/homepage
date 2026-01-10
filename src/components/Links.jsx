import React, { useEffect, useMemo } from 'react';
import { linkTree } from 'constants';
import LinkCategory from 'components/LinkCategory';
import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';
import PropTypes from 'prop-types';

import 'components/Links.css';

Links.propTypes = {
    hidden: PropTypes.bool,
    keyboardNavEnabled: PropTypes.bool,
    highlightedLink: PropTypes.string,
    highlightedCategoryIdx: PropTypes.number,
    onClearSearch: PropTypes.func.isRequired,
};

export default function Links({
    hidden,
    keyboardNavEnabled,
    highlightedLink,
    highlightedCategoryIdx,
    onClearSearch,
}) {
    const {
        selectedCategory,
        setSelectedCategory,
        isKeyboardNav,
        isMouseNav,
        startMouseNav,
        endMouseNav,
    } = useLinkNavigation(keyboardNavEnabled);

    useEffect(() => {
        if (highlightedCategoryIdx) {
            setSelectedCategory(highlightedCategoryIdx);
        } else {
            setSelectedCategory(0);
        }
    }, [highlightedCategoryIdx, setSelectedCategory]);

    const panelPaddings = useMemo(() => {
        const windowHeight = window.innerHeight;
        const remToPx = 16;
        const linkHeight = 3.5 * remToPx;

        return linkTree.map((categoryData, categoryIndex) => {
            const headerPosition =
                windowHeight / 2 +
                (categoryIndex + 1 - linkTree.length / 2 - 0.5) * linkHeight;
            const linksHeight = categoryData.links.length * linkHeight;
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
                (isKeyboardNav || selectedCategory) && 'expanded'
            } ${isMouseNav ? 'hoverEffective' : ''}`}
            onMouseMove={(e) => {
                startMouseNav(e);
                onClearSearch();
            }}
            onMouseOut={endMouseNav}
            aria-hidden={hidden}
            aria-expanded={isKeyboardNav}
        >
            <div className='trigger'>
                <div className='indicator' />
                <Bookmark className='icon' />
                <p className='hint'>[1]</p>
            </div>
            <div className='panel' />
            {linkTree.map((categoryData, i) => (
                <LinkCategory
                    key={categoryData.category}
                    categoryData={categoryData}
                    index={i}
                    selectedCategory={selectedCategory}
                    isMouseNav={isMouseNav}
                    keyboardNavEnabled={keyboardNavEnabled}
                    padding={panelPaddings[i]}
                    highlightedLink={highlightedLink}
                />
            ))}
        </section>
    );
}
