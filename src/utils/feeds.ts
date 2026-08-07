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
        return bookmarks
            .filter((bookmark) => bookmark.feed === true)
            .toSorted(
                (left, right) =>
                    (left.feedOrder ?? Number.MAX_SAFE_INTEGER) -
                    (right.feedOrder ?? Number.MAX_SAFE_INTEGER)
            );
    }

    return legacyFeedTitles.flatMap((title) => {
        const bookmark = bookmarks.find((item) => item.title === title);
        return bookmark === undefined ? [] : [bookmark];
    });
};

const updateFeedNodes = (
    nodes: readonly BookmarkNodeData[],
    feedOrderById: ReadonlyMap<string, number>
): BookmarkNodeData[] =>
    nodes.map((node) => {
        if (node.type === 'folder') {
            return {
                ...node,
                children: updateFeedNodes(node.children, feedOrderById),
            };
        }

        const feedOrder = feedOrderById.get(node.id);
        return {
            ...node,
            feed: feedOrder !== undefined,
            ...(feedOrder === undefined
                ? { feedOrder: undefined }
                : { feedOrder }),
        };
    });

export const setFeedBookmarkIds = (
    bookmarkTree: readonly BookmarkCategoryData[],
    bookmarkIds: readonly string[]
): BookmarkCategoryData[] => {
    const feedOrderById = new Map(
        bookmarkIds.map((bookmarkId, index) => [bookmarkId, index])
    );

    return bookmarkTree.map((category) => ({
        ...category,
        children: updateFeedNodes(category.children, feedOrderById),
    }));
};

export const initializeFeedSelection = (
    bookmarkTree: readonly BookmarkCategoryData[]
): BookmarkCategoryData[] =>
    setFeedBookmarkIds(
        bookmarkTree,
        getFeedBookmarks(bookmarkTree).map((bookmark) => bookmark.id)
    );
