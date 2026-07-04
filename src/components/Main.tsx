import React from 'react';

import { footerCredit, footerLink } from '@/constants/footer';
import type { AqiData, WeatherData } from '@/types/environment';
import type { InitialAppPreferences } from '@/types/preferences';
import type { WallpaperAsset } from '../../shared/wallpaper';
import { Cover } from './Cover';

interface MainProps {
    initialAqi: AqiData | undefined;
    initialPreferences: InitialAppPreferences;
    initialWallpaper: WallpaperAsset | undefined;
    initialWeather: WeatherData | undefined;
    isClerkEnabled: boolean;
    onWallpaperChange: (wallpaper: WallpaperAsset | undefined) => void;
}

export const Main: React.FC<MainProps> = ({
    initialAqi,
    initialPreferences,
    initialWallpaper,
    initialWeather,
    isClerkEnabled,
    onWallpaperChange,
}) => (
    <>
        <main>
            <Cover
                initialAqi={initialAqi}
                initialPreferences={initialPreferences}
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
