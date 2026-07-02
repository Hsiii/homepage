import React from 'react';

import { useWallpaper } from '@/hooks/useWallpaper';
import type { WallpaperAsset } from '../../shared/wallpaper';
import { SettingsMenu } from './SettingsMenu';

interface WallpaperSettingsMenuProps {
    closeSignal?: number;
    initialWallpaper: WallpaperAsset | undefined;
    onWallpaperChange?: (wallpaper: WallpaperAsset | undefined) => void;
    placement?: 'above' | 'below';
}

export const WallpaperSettingsMenu: React.FC<WallpaperSettingsMenuProps> = ({
    closeSignal,
    initialWallpaper,
    onWallpaperChange,
    placement,
}) => {
    const wallpaperControls = useWallpaper(initialWallpaper, onWallpaperChange);

    return (
        <SettingsMenu
            closeSignal={closeSignal}
            placement={placement}
            wallpaperControls={wallpaperControls}
        />
    );
};
