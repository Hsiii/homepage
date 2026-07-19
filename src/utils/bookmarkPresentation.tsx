import type { ReactElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Folder, icons } from 'lucide-react';

import type {
    BookmarkCategoryData,
    BookmarkFolderData,
    BookmarkLinkData,
    BookmarkNodeData,
} from '@/types/bookmarks';

export type CategoryData = {
    category: string;
    children: BookmarkNodeData[];
    icon: ReactElement;
    iconName: string;
    links: BookmarkLinkData[];
};

export interface CategoryIconOption {
    Icon: LucideIcon;
    iconName: string;
    label: string;
    searchText: string;
}

const categoryIcons = icons as Partial<Record<string, LucideIcon>>;
const categoryIconNames = new Set(Object.keys(categoryIcons));

const formatIconName = (iconName: string): string =>
    iconName.replaceAll(/([\da-z])([A-Z])/g, '$1 $2');

const normalizeIconSearchText = (value: string): string =>
    value.toLowerCase().replaceAll(/[^\da-z]+/g, '');

export const categoryIconOptions: CategoryIconOption[] = Object.keys(
    categoryIcons
)
    .flatMap((iconName) => {
        const Icon = categoryIcons[iconName];
        if (Icon === undefined) {
            return [];
        }

        const label = formatIconName(iconName);

        return [
            {
                Icon,
                iconName,
                label,
                searchText: `${normalizeIconSearchText(
                    iconName
                )} ${normalizeIconSearchText(label)}`,
            },
        ];
    })
    .toSorted((a, b) => a.label.localeCompare(b.label));

export const normalizeCategoryIconSearch = (value: string): string =>
    normalizeIconSearchText(value);

export const isCategoryIconName = (
    iconName: string | undefined
): iconName is string =>
    iconName !== undefined && categoryIconNames.has(iconName);

const fallbackCategoryIconName = 'Folder';

export const resolveBookmarkIconName = (
    iconName: string | undefined
): string =>
    isCategoryIconName(iconName) ? iconName : fallbackCategoryIconName;

export const resolveFolderIconName = (
    folderData: BookmarkFolderData | undefined
): string => resolveBookmarkIconName(folderData?.icon);

export const createBookmarkIcon = (
    iconName: string | undefined,
    className = 'icon category-icon-display'
): ReactElement => {
    const Icon = categoryIcons[resolveBookmarkIconName(iconName)] ?? Folder;

    return <Icon className={className} />;
};

export const decorateBookmarkTree = (
    bookmarkTree: readonly BookmarkCategoryData[]
): CategoryData[] =>
    bookmarkTree.map((categoryData) => {
        const iconName = resolveBookmarkIconName(categoryData.icon);

        return {
            category: categoryData.category,
            children: [...categoryData.children],
            icon: createBookmarkIcon(iconName),
            iconName,
            links: [...categoryData.links],
        };
    });
