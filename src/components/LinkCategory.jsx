import React, { Fragment } from 'react';
import { links } from 'constants';
import LinkTreeItem from 'components/LinkTreeItem';
import PropTypes from 'prop-types';

export default function LinkCategory({
    categoryData,
    index,
    selectedCategory,
    isMouseNav,
    keyboardNavEnabled,
    padding,
    highlightedLink,
}) {
    const isCategorySelected = selectedCategory === index + 1;

    // Hint visibility logic for Category
    const isCategoryHotkeyHidden =
        isMouseNav || selectedCategory || index + 1 > 9 || !keyboardNavEnabled;

    const categoryModifiers = [
        isCategorySelected && 'selected',
        isMouseNav && 'hoverEffective',
    ];

    return (
        <Fragment>
            <LinkTreeItem
                className='category'
                icon={categoryData.icon}
                hotkey={index + 1}
                isHotkeyHidden={isCategoryHotkeyHidden}
                modifiers={categoryModifiers}
            >
                {categoryData.category}
            </LinkTreeItem>
            <div
                className={`links ${isMouseNav ? 'hoverEffective' : ''}`}
                style={{ '--padding': padding }}
            >
                <div className='panel' />
                {categoryData.links.map((link, j) => {
                    const isDisabled = !links[link];
                    const isHighlighted = highlightedLink === link;

                    // Hint visibility logic for Link
                    const isLinkHotkeyHidden =
                        isMouseNav ||
                        !selectedCategory ||
                        j + 1 > 9 ||
                        isDisabled ||
                        !keyboardNavEnabled;

                    const linkModifiers = [
                        isDisabled && 'disabled',
                        isMouseNav && 'hoverEffective',
                        isHighlighted && 'highlighted',
                    ];

                    return (
                        <LinkTreeItem
                            key={link}
                            as='a'
                            id={link}
                            href={links[link]}
                            className='link'
                            hotkey={j + 1}
                            isHotkeyHidden={isLinkHotkeyHidden}
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
    categoryData: PropTypes.shape({
        category: PropTypes.string.isRequired,
        icon: PropTypes.element,
        links: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    selectedCategory: PropTypes.number,
    isMouseNav: PropTypes.bool.isRequired,
    keyboardNavEnabled: PropTypes.bool.isRequired,
    padding: PropTypes.string.isRequired,
    highlightedLink: PropTypes.string,
};
