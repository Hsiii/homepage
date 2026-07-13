import type { ReactNode } from 'react';

import { readInitialAppPreferences } from '@/server/preferences';
import { HomePageClient } from './HomePageClient';

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled =
    clerkPublishableKey !== undefined && clerkPublishableKey.trim() !== '';

export const dynamic = 'force-dynamic';

export default async function Page(): Promise<ReactNode> {
    const initialPreferences = await readInitialAppPreferences();

    return (
        <HomePageClient
            initialAqi={undefined}
            initialBookmarkTree={undefined}
            initialPreferences={initialPreferences}
            initialWallpaper={undefined}
            initialWeather={undefined}
            isClerkEnabled={isClerkEnabled}
        />
    );
}
