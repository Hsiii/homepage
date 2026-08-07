import type {
    BookmarkCategoryData,
    BookmarkLinkData,
    BookmarkNodeData,
} from '@/types/bookmarks';

export const legacyFeedTitles = [
    'Instagram',
    'Twitter',
    'Facebook',
    'GitHub',
    'YouTube',
    'Anigamer',
    'Crunchyroll',
    'Supercell Store',
] as const;

const legacyFeedTitleSet = new Set<string>(legacyFeedTitles);

export const isLegacyFeedTitle = (title: string): boolean =>
    legacyFeedTitleSet.has(title);

export const hasCustomFeedSelection = (
    bookmarkTree: readonly BookmarkCategoryData[]
): boolean =>
    bookmarkTree.some((category) =>
        category.links.some((bookmark) => bookmark.feed !== undefined)
    );

export const getFeedBookmarks = (
    bookmarkTree: readonly BookmarkCategoryData[]
): BookmarkLinkData[] => {
    const bookmarks = bookmarkTree.flatMap((category) => category.links);

    if (hasCustomFeedSelection(bookmarkTree)) {
        return bookmarks.filter((bookmark) => bookmark.feed === true);
    }

    return legacyFeedTitles.flatMap((title) => {
        const bookmark = bookmarks.find((item) => item.title === title);
        return bookmark === undefined ? [] : [bookmark];
    });
};

const initializeFeedNodes = (
    nodes: readonly BookmarkNodeData[]
): BookmarkNodeData[] =>
    nodes.map((node) =>
        node.type === 'link'
            ? { ...node, feed: isLegacyFeedTitle(node.title) }
            : { ...node, children: initializeFeedNodes(node.children) }
    );

export const initializeFeedSelection = (
    bookmarkTree: readonly BookmarkCategoryData[]
): BookmarkCategoryData[] =>
    bookmarkTree.map((category) => ({
        ...category,
        children: initializeFeedNodes(category.children),
        links: category.links.map((bookmark) => ({
            ...bookmark,
            feed: isLegacyFeedTitle(bookmark.title),
        })),
    }));
