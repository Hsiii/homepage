import type { InitialAppPreferences } from '@/types/preferences';
import { defaultLocale } from './i18n';
import { defaultThemeColor, normalAnimationMode } from './theme';

export const defaultInitialAppPreferences: InitialAppPreferences = {
    animationMode: normalAnimationMode,
    hasLocationCookie: false,
    locale: defaultLocale,
    locationId: undefined,
    resolvedTheme: 'light',
    themeColor: defaultThemeColor,
    themeMode: 'system',
};
