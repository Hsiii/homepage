import type { LinkName } from '@/constants/links';
import { linkTree } from '@/constants/linkTree';

export interface LinkItem {
    category: number;
    link: LinkName;
}

export interface SearchSuggestionsPosition {
    left: number;
    top: number;
    width: number;
}

export interface FeedsLink {
    link: LinkName;
    url: string;
}

export interface SlashCommandItem {
    command: 'feeds';
    label: string;
}

const maxSearchResults = 4;
const bopomofoToLatinKeyMap: Partial<Record<string, string>> = {
    ㄆ: 'q',
    ㄇ: 'a',
    ㄈ: 'z',
    ㄊ: 'w',
    ㄋ: 's',
    ㄌ: 'x',
    ㄍ: 'e',
    ㄎ: 'd',
    ㄏ: 'c',
    ㄐ: 'r',
    ㄑ: 'f',
    ㄒ: 'v',
    ㄔ: 't',
    ㄕ: 'g',
    ㄖ: 'b',
    ㄗ: 'y',
    ㄘ: 'h',
    ㄙ: 'n',
    ㄧ: 'u',
    ㄨ: 'j',
    ㄩ: 'm',
    ㄛ: 'i',
    ㄜ: 'k',
    ㄟ: 'o',
    ㄠ: 'l',
    ㄣ: 'p',
};

export const slashCommands = [
    {
        command: 'feeds',
        label: '/feeds',
    },
] as const satisfies readonly SlashCommandItem[];

export const getSearchItems = (): LinkItem[] =>
    linkTree.flatMap((category, categoryIndex) => {
        const categoryId = categoryIndex + 1;

        return category.links.map((link) => ({
            category: categoryId,
            link,
        }));
    });

export const isFeedsSearch = (value: string): boolean =>
    value.trim().toLowerCase() === '/feeds';

export const isSlashCommandSearch = (value: string): boolean =>
    value.trim().startsWith('/');

export const getSlashCommandResults = (value: string): SlashCommandItem[] => {
    const query = value.trim().toLowerCase();
    if (!isSlashCommandSearch(query)) {
        return [];
    }

    return slashCommands.filter((command) =>
        command.label.toLowerCase().startsWith(query)
    );
};

const getLatinKeySequenceAlias = (query: string): string | undefined => {
    let alias = '';
    let hasBopomofo = false;

    for (const char of query) {
        const latinKey = bopomofoToLatinKeyMap[char];
        if (latinKey === undefined) {
            alias += char;
            continue;
        }

        hasBopomofo = true;
        alias += latinKey;
    }

    return hasBopomofo ? alias : undefined;
};

const getTextSearchScore = (
    source: string,
    query: string
): number | undefined => {
    const includesIndex = source.indexOf(query);

    if (source === query) {
        return 0;
    }

    if (source.startsWith(query)) {
        return 1 + source.length / 100;
    }

    const wordStartIndex = source
        .split(/\s+/)
        .findIndex((word) => word.startsWith(query));

    if (wordStartIndex !== -1) {
        return 2 + wordStartIndex / 100;
    }

    if (includesIndex !== -1) {
        return 3 + includesIndex / 100;
    }

    let queryIndex = 0;
    for (const char of source) {
        if (char === query[queryIndex]) {
            queryIndex++;
        }
    }

    if (queryIndex === query.length) {
        return 4 + source.length / 100;
    }

    return undefined;
};

const getSearchScore = (link: LinkName, query: string): number | undefined => {
    const normalizedLink = link.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const directScore = getTextSearchScore(normalizedLink, normalizedQuery);
    const latinKeySequenceScore = getTextSearchScore(
        normalizedLink,
        getLatinKeySequenceAlias(normalizedQuery) ?? normalizedQuery
    );

    if (directScore === undefined) {
        return latinKeySequenceScore;
    }

    if (latinKeySequenceScore === undefined) {
        return directScore;
    }

    return Math.min(directScore, latinKeySequenceScore);
};

export const getSearchResults = (
    items: readonly LinkItem[],
    query: string
): LinkItem[] => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') {
        return [];
    }

    return items
        .map((item) => ({
            item,
            score: getSearchScore(item.link, trimmedQuery),
        }))
        .filter(
            (result): result is { item: LinkItem; score: number } =>
                result.score !== undefined
        )
        .toSorted(
            (a, b) =>
                a.score - b.score || a.item.link.localeCompare(b.item.link)
        )
        .slice(0, maxSearchResults)
        .map(({ item }) => item);
};

export const getGoogleSearchUrl = (value: string): string =>
    `https://www.google.com/search?q=${encodeURIComponent(value.trim())}`;

export const isSameSearchSuggestionsPosition = (
    a: SearchSuggestionsPosition | undefined,
    b: SearchSuggestionsPosition
): boolean =>
    a !== undefined &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5;
