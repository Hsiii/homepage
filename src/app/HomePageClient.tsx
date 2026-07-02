'use client';

import { useState } from 'react';

import { Main } from '@/components/Main';
import type { AqiData, WeatherData } from '@/types/environment';
import type { WallpaperAsset } from '../../shared/wallpaper';

interface HomePageClientProps {
    hasInitialLocationCookie: boolean;
    initialAqi: AqiData | undefined;
    initialLocationId: string;
    initialWallpaper: WallpaperAsset | undefined;
    initialWeather: WeatherData | undefined;
    isClerkEnabled: boolean;
}

export const HomePageClient: React.FC<HomePageClientProps> = ({
    hasInitialLocationCookie,
    initialAqi,
    initialLocationId,
    initialWallpaper,
    initialWeather,
    isClerkEnabled,
}) => {
    const [wallpaper, setWallpaper] = useState(initialWallpaper);

    return (
        <Main
            hasInitialLocationCookie={hasInitialLocationCookie}
            initialAqi={initialAqi}
            initialLocationId={initialLocationId}
            initialWallpaper={wallpaper}
            initialWeather={initialWeather}
            isClerkEnabled={isClerkEnabled}
            onWallpaperChange={setWallpaper}
        />
    );
};
