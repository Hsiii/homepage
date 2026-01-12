import React, { Fragment } from 'react';
import { links } from '@constants';
import LinkTreeItem from 'components/LinkTreeItem';
import { CategoryData } from '@constants';

interface LinkCategoryProps {
    categoryData: CategoryData;
    index: number;
    selectedCategory?: number;
    isMouseNav: boolean;
    keyboardNavEnabled: boolean;
    padding: string;
    highlightedLink?: string;
}

export default function LinkCategory({
    categoryData,
    index,
    selectedCategory,
    isMouseNav,
    keyboardNavEnabled,
    padding,
    highlightedLink,
}: LinkCategoryProps) {
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
                isHotkeyHidden={!!isCategoryHotkeyHidden}
                modifiers={categoryModifiers}
            >
                {categoryData.category}
            </LinkTreeItem>
            <div
                className={`links ${isMouseNav ? 'hoverEffective' : ''}`}
                style={{ '--padding': padding } as React.CSSProperties}
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
                            isHotkeyHidden={!!isLinkHotkeyHidden}
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
