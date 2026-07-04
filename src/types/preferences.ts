import type { AppLocale } from '@/constants/i18n';
import type {
    AnimationMode,
    ResolvedTheme,
    ThemeColor,
    ThemeMode,
} from '@/constants/theme';

export interface InitialClientPreferences {
    animationMode: AnimationMode;
    locale: AppLocale;
    themeColor: ThemeColor;
    themeMode: ThemeMode;
}

export interface InitialAppPreferences extends InitialClientPreferences {
    hasLocationCookie: boolean;
    locationId: string;
    resolvedTheme: ResolvedTheme;
}
