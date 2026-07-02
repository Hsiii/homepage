import React from 'react';

import { footerCredit, footerLink } from '@/constants/footer';
import type { AqiData, WeatherData } from '@/types/environment';
import type { WallpaperAsset } from '../../shared/wallpaper';
import { Cover } from './Cover';

interface MainProps {
    hasInitialLocationCookie: boolean;
    initialAqi: AqiData | undefined;
    initialLocationId: string;
    initialWallpaper: WallpaperAsset | undefined;
    initialWeather: WeatherData | undefined;
    isClerkEnabled: boolean;
    onWallpaperChange: (wallpaper: WallpaperAsset | undefined) => void;
}

export const Main: React.FC<MainProps> = ({
    hasInitialLocationCookie,
    initialAqi,
    initialLocationId,
    initialWallpaper,
    initialWeather,
    isClerkEnabled,
    onWallpaperChange,
}) => (
    <>
        <main>
            <Cover
                hasInitialLocationCookie={hasInitialLocationCookie}
                initialAqi={initialAqi}
                initialLocationId={initialLocationId}
                initialWallpaper={initialWallpaper}
                initialWeather={initialWeather}
                isClerkEnabled={isClerkEnabled}
                onWallpaperChange={onWallpaperChange}
            />
        </main>
        <footer>
            <a href={footerLink}>{footerCredit}</a>
        </footer>
    </>
);
