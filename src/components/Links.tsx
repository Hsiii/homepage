import { useMemo } from 'react';
import { linkTree } from '@constants';
import LinkCategory from 'components/LinkCategory';
import { useLinkNavigation } from 'hooks';
import { Bookmark } from 'lucide-react';

import 'components/Links.css';

interface LinksProps {
    hidden: boolean;
    isSearchNav: boolean;
    highlightedLink?: string;
    highlightedCategory?: number;
    onClearSearch: () => void;
}

export default function Links({
    hidden,
    isSearchNav = false,
    highlightedLink,
    highlightedCategory,
    onClearSearch,
}: LinksProps) {
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
            if (headerPosition + linksHeight / 2 <= windowHeight - remToPx)
                padding = headerPosition - linksHeight / 2;
            else padding = windowHeight - linksHeight - remToPx;
            if (padding < remToPx) padding = remToPx;
            return padding + 'px';
        });
    }, []);

    return (
        <nav
            className={`link-panel ${hidden && 'hidden'} ${isMouseNav ? 'hoverEffective' : ''}`}
            onMouseMove={startMouseNav}
            onTouchStart={startMouseNav}
            onMouseOut={endMouseNav}
            aria-hidden={hidden}
            aria-expanded={isKeyboardNav}
        >
            <div className='trigger'>
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
}
