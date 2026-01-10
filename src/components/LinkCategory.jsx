import React, { Fragment } from 'react';

import LinkTreeItem from 'components/LinkTreeItem';
import PropTypes from 'prop-types';

import { links } from 'constants';

export default function LinkCategory({
    node,
    index,
    selectedIdx,
    isMouseNavigating,
    keyboardNavigationEnabled,
    padding,
    highlightedLink,
}) {
    const isCategorySelected = selectedIdx === index + 1;

    // Hint visibility logic for Category
    const hideCategoryHint =
        isMouseNavigating ||
        selectedIdx ||
        index + 1 > 9 ||
        !keyboardNavigationEnabled;

    const categoryModifiers = [
        isCategorySelected && 'selected',
        isMouseNavigating && 'hoverEffective',
    ];

    return (
        <Fragment>
            <LinkTreeItem
                className='category'
                icon={node.icon}
                hint={index + 1}
                hideHint={hideCategoryHint}
                modifiers={categoryModifiers}
            >
                {node.category}
            </LinkTreeItem>
            <div
                className={`links ${isMouseNavigating ? 'hoverEffective' : ''}`}
                style={{ '--padding': padding }}
            >
                <div className='panel' />
                {node.links.map((link, j) => {
                    const isDisabled = !links[link];
                    const isHighlighted = highlightedLink === link;

                    // Hint visibility logic for Link
                    const hideLinkHint =
                        isMouseNavigating ||
                        !selectedIdx ||
                        j + 1 > 9 ||
                        isDisabled ||
                        !keyboardNavigationEnabled;

                    const linkModifiers = [
                        isDisabled && 'disabled',
                        isMouseNavigating && 'hoverEffective',
                        isHighlighted && 'highlighted',
                    ];

                    return (
                        <LinkTreeItem
                            key={link}
                            as='a'
                            id={link}
                            href={links[link]}
                            className='link'
                            hint={j + 1}
                            hideHint={hideLinkHint}
                            modifiers={linkModifiers}
                        >
                            {link}
                        </LinkTreeItem>
                    );
                })}
            </div>
        </Fragment>
    );
}

LinkCategory.propTypes = {
    node: PropTypes.shape({
        category: PropTypes.string.isRequired,
        icon: PropTypes.element,
        links: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    selectedIdx: PropTypes.number,
    isMouseNavigating: PropTypes.bool.isRequired,
    keyboardNavigationEnabled: PropTypes.bool.isRequired,
    padding: PropTypes.string.isRequired,
    highlightedLink: PropTypes.string,
};
