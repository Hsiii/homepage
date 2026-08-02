import type { ReactNode } from 'react';

import { isSupabaseConfigured } from '@/lib/supabase/config';
import { readInitialBookmarkData } from '@/server/initialBookmarks';
import { readInitialAppPreferences } from '@/server/preferences';
import { HomePageClient } from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function Page(): Promise<ReactNode> {
    const [initialBookmarkData, initialPreferences] = await Promise.all([
        readInitialBookmarkData(),
        readInitialAppPreferences(),
    ]);

    return (
        <HomePageClient
            initialAqi={undefined}
            initialBookmarkTrash={initialBookmarkData?.trash}
            initialBookmarkTree={initialBookmarkData?.categories}
            initialBookmarkUserId={initialBookmarkData?.userId}
            initialPreferences={initialPreferences}
            initialWallpaper={undefined}
            initialWeather={undefined}
            isSupabaseEnabled={isSupabaseConfigured()}
        />
    );
}
