import 'server-only';

import { cookies } from 'next/headers';

import { defaultLocale, isAppLocale, localeCookieName } from '@/constants/i18n';
import {
    findTaiwanLocation,
    taiwanLocationCookieName,
} from '@/constants/taiwanLocations';
import type { ResolvedTheme } from '@/constants/theme';
import {
    animationStorageKey,
    defaultThemeColor,
    isAnimationMode,
    isResolvedTheme,
    isThemeColor,
    isThemeMode,
    normalAnimationMode,
    themeColorStorageKey,
    themeResolvedStorageKey,
    themeStorageKey,
} from '@/constants/theme';
import type {
    InitialAppPreferences,
    InitialClientPreferences,
} from '@/types/preferences';

const getInitialResolvedTheme = (
    themeMode: InitialClientPreferences['themeMode'],
    resolvedThemeCookie: string | undefined
): ResolvedTheme => {
    if (isResolvedTheme(themeMode)) {
        return themeMode;
    }

    if (isResolvedTheme(resolvedThemeCookie)) {
        return resolvedThemeCookie;
    }

    return 'light';
};

export const readInitialAppPreferences =
    async (): Promise<InitialAppPreferences> => {
        const cookieStore = await cookies();
        const animationModeCookie = cookieStore.get(animationStorageKey)?.value;
        const localeCookie = cookieStore.get(localeCookieName)?.value;
        const locationCookie = cookieStore.get(taiwanLocationCookieName);
        const resolvedThemeCookie = cookieStore.get(
            themeResolvedStorageKey
        )?.value;
        const themeColorCookie = cookieStore.get(themeColorStorageKey)?.value;
        const themeModeCookie = cookieStore.get(themeStorageKey)?.value;
        const themeMode = isThemeMode(themeModeCookie)
            ? themeModeCookie
            : 'system';
        const initialLocation = findTaiwanLocation(locationCookie?.value);

        return {
            animationMode: isAnimationMode(animationModeCookie)
                ? animationModeCookie
                : normalAnimationMode,
            hasLocationCookie: locationCookie !== undefined,
            locale: isAppLocale(localeCookie) ? localeCookie : defaultLocale,
            locationId: initialLocation.id,
            resolvedTheme: getInitialResolvedTheme(
                themeMode,
                resolvedThemeCookie
            ),
            themeColor: isThemeColor(themeColorCookie)
                ? themeColorCookie
                : defaultThemeColor,
            themeMode,
        };
    };
