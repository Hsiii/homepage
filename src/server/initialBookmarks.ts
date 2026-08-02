import 'server-only';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ApiError } from '@/server/apiError';
import { requireAuthenticatedRequest } from '@/server/auth';
import { getUserBookmarks } from '@/server/bookmarkStore';
import { withServerTimeout } from '@/server/timeout';
import type {
    BookmarkCategoryData,
    BookmarkTrashItemData,
} from '@/types/bookmarks';

export interface InitialBookmarkData {
    categories: BookmarkCategoryData[];
    trash: BookmarkTrashItemData[];
    userId: string;
}

const initialBookmarkTimeoutMs = 500;

const fetchInitialBookmarkData = async (): Promise<
    InitialBookmarkData | undefined
> => {
    const { client, userId } = await requireAuthenticatedRequest();
    const bookmarkData = await getUserBookmarks(client, userId);

    return {
        categories: bookmarkData?.categories ?? [],
        trash: bookmarkData?.trash ?? [],
        userId,
    };
};

export const readInitialBookmarkData = async (): Promise<
    InitialBookmarkData | undefined
> => {
    if (!isSupabaseConfigured()) {
        return undefined;
    }

    try {
        return await withServerTimeout(
            'Initial bookmark request',
            fetchInitialBookmarkData(),
            initialBookmarkTimeoutMs
        );
    } catch (error) {
        if (error instanceof ApiError && error.statusCode === 401) {
            return undefined;
        }

        console.error('Initial bookmarks could not be loaded:', error);
        return undefined;
    }
};
