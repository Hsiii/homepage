import React from 'react';

import type { BookmarkControls } from '@/hooks/useBookmarks';
import { useWallpaper } from '@/hooks/useWallpaper';
import type { InitialAppPreferences } from '@/types/preferences';
import type { WallpaperAsset } from '../../shared/wallpaper';
import { SettingsMenu } from './SettingsMenu';

interface WallpaperSettingsMenuProps {
    bookmarkControls: BookmarkControls;
    closeSignal?: number;
    initialPreferences: InitialAppPreferences;
    initialWallpaper: WallpaperAsset | undefined;
    onWallpaperChange?: (wallpaper: WallpaperAsset | undefined) => void;
    placement?: 'above' | 'below';
}

export const WallpaperSettingsMenu: React.FC<WallpaperSettingsMenuProps> = ({
    closeSignal,
    bookmarkControls,
    initialPreferences,
    initialWallpaper,
    onWallpaperChange,
    placement,
}) => {
    const wallpaperControls = useWallpaper(initialWallpaper, onWallpaperChange);

    return (
        <SettingsMenu
            bookmarkControls={bookmarkControls}
            closeSignal={closeSignal}
            initialPreferences={initialPreferences}
            placement={placement}
            wallpaperControls={wallpaperControls}
        />
    );
};
