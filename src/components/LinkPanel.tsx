import { useMemo } from 'react';
import { linkTree } from '@constants';
import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';

import { LinkCategory } from './LinkCategory.js';

import 'components/LinkPanel.css';

interface LinkPanelProps {
    hidden: boolean;
    isSearchNav: boolean;
    highlightedLink?: string;
    highlightedCategory?: number;
    onClearSearch: () => void;
}

export const LinkPanel: React.FC<LinkPanelProps> = ({
    hidden,
    isSearchNav,
    highlightedLink,
    highlightedCategory,
    onClearSearch,
}) => {
    const {
        selectedCategory,
        isKeyboardNav,
        isMouseNav,
        startMouseNav,
        endMouseNav,
    } = useLinkNavigation(isSearchNav, onClearSearch, highlightedCategory);

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
            padding =
                headerPosition + linksHeight / 2 <= windowHeight - remToPx
                    ? headerPosition - linksHeight / 2
                    : windowHeight - linksHeight - remToPx;
            if (padding < remToPx) {
                padding = remToPx;
            }
            return `${padding}px`;
        });
    }, []);

    return (
        <nav
            className={`link-panel ${isMouseNav ? 'hoverEffective' : ''}`}
            onMouseMove={startMouseNav}
            onTouchStart={startMouseNav}
            onMouseOut={endMouseNav}
            aria-hidden={hidden}
            aria-expanded={isKeyboardNav}
        >
            <div className={`trigger ${hidden && 'hidden'}`}>
                <div className='indicator' />
                <Bookmark className='icon' />
            </div>
            <div
                className={`link-tree ${
                    (isKeyboardNav || selectedCategory) && 'expanded'
                }`}
            >
                <div className='panel' />
                {linkTree.map((categoryData, i) => (
                    <LinkCategory
                        key={categoryData.category}
                        categoryData={categoryData}
                        index={i}
                        selectedCategory={selectedCategory}
                        isMouseNav={isMouseNav}
                        keyboardNavEnabled={!isSearchNav}
                        padding={panelPaddings[i]}
                        highlightedLink={highlightedLink}
                    />
                ))}
            </div>
        </nav>
    );
};
