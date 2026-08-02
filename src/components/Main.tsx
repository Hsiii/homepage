import React from 'react';

import { footerCredit, footerLink } from '@/constants/footer';
import type {
    BookmarkCategoryData,
    BookmarkTrashItemData,
} from '@/types/bookmarks';
import type { AqiData, WeatherData } from '@/types/environment';
import type { InitialAppPreferences } from '@/types/preferences';
import type { WallpaperAsset } from '../../shared/wallpaper';
import { Cover } from './Cover';

interface MainProps {
    initialAqi: AqiData | undefined;
    initialBookmarkTrash: BookmarkTrashItemData[] | undefined;
    initialBookmarkTree: BookmarkCategoryData[] | undefined;
    initialBookmarkUserId: string | undefined;
    initialPreferences: InitialAppPreferences;
    initialWallpaper: WallpaperAsset | undefined;
    initialWeather: WeatherData | undefined;
    isSupabaseEnabled: boolean;
    onWallpaperChange: (wallpaper: WallpaperAsset | undefined) => void;
}

export const Main: React.FC<MainProps> = ({
    initialAqi,
    initialBookmarkTrash,
    initialBookmarkTree,
    initialBookmarkUserId,
    initialPreferences,
    initialWallpaper,
    initialWeather,
    isSupabaseEnabled,
    onWallpaperChange,
}) => (
    <>
        <main>
            <Cover
                initialAqi={initialAqi}
                initialBookmarkTrash={initialBookmarkTrash}
                initialBookmarkTree={initialBookmarkTree}
                initialBookmarkUserId={initialBookmarkUserId}
                initialPreferences={initialPreferences}
                initialWallpaper={initialWallpaper}
                initialWeather={initialWeather}
                isSupabaseEnabled={isSupabaseEnabled}
                onWallpaperChange={onWallpaperChange}
            />
        </main>
        <footer>
            <a href={footerLink}>{footerCredit}</a>
        </footer>
    </>
);
