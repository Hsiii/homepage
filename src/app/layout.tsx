import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Quicksand as loadQuicksand } from 'next/font/google';

import '@/index.css';
import '@/components/Controls.css';
import '@/components/Cover.css';
import '@/components/LinkPanel.css';
import '@/components/Main.css';
import '@/components/Mountains.css';
import '@/components/Weather.css';

import { AuthProvider } from '@/auth/AuthProvider';
import { defaultInitialAppPreferences } from '@/constants/defaultPreferences';
import {
    defaultLocale,
    localeCookieName,
    localeStorageKey,
} from '@/constants/i18n';
import {
    animationStorageKey,
    defaultThemeColor,
    themeColorStorageKey,
    themePreferenceCookieMaxAgeSeconds,
    themeResolvedStorageKey,
    themeStorageKey,
} from '@/constants/theme';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const quicksand = loadQuicksand({
    display: 'swap',
    subsets: ['latin'],
    variable: '--font-quicksand',
    weight: ['500', '700'],
});

export const metadata: Metadata = {
    description:
        'A fast personal browser homepage for search, bookmarks, weather, and AQI.',
    icons: {
        icon: '/assets/favicon.ico',
    },
    title: 'Homepage',
};

export const viewport: Viewport = {
    themeColor: [
        {
            color: 'hsl(316, 42%, 82%)',
            media: '(prefers-color-scheme: light)',
        },
        {
            color: 'hsl(220, 54%, 18%)',
            media: '(prefers-color-scheme: dark)',
        },
    ],
};

const themeInitScript = `
(function () {
    try {
        var animationStorageKey = ${JSON.stringify(animationStorageKey)};
        var defaultThemeColor = ${JSON.stringify(defaultThemeColor)};
        var defaultLocale = ${JSON.stringify(defaultLocale)};
        var localeCookieName = ${JSON.stringify(localeCookieName)};
        var localeStorageKey = ${JSON.stringify(localeStorageKey)};
        var themeColorStorageKey = ${JSON.stringify(themeColorStorageKey)};
        var themeResolvedStorageKey = ${JSON.stringify(themeResolvedStorageKey)};
        var themeStorageKey = ${JSON.stringify(themeStorageKey)};
        var cookieMaxAge = ${themePreferenceCookieMaxAgeSeconds};
        var root = document.documentElement;
        var secureAttribute =
            location.protocol === 'https:' ? '; Secure' : '';
        var readCookie = function (key) {
            return document.cookie
                .split('; ')
                .reduce(function (value, cookie) {
                    var separatorIndex = cookie.indexOf('=');
                    var cookieKey =
                        separatorIndex === -1
                            ? cookie
                            : cookie.slice(0, separatorIndex);

                    if (value !== null || cookieKey !== key) {
                        return value;
                    }

                    return decodeURIComponent(
                        separatorIndex === -1
                            ? ''
                            : cookie.slice(separatorIndex + 1)
                    );
                }, null);
        };
        var readStorage = function (key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        };
        var writeCookie = function (key, value) {
            document.cookie =
                key +
                '=' +
                encodeURIComponent(value) +
                '; Path=/; Max-Age=' +
                cookieMaxAge +
                '; SameSite=Lax' +
                secureAttribute;
        };
        var clearCookie = function (key) {
            document.cookie =
                key +
                '=; Path=/; Max-Age=0; SameSite=Lax' +
                secureAttribute;
        };
        var writeStorage = function (key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {}
        };
        var removeStorage = function (key) {
            try {
                localStorage.removeItem(key);
            } catch {}
        };
        var isAnimationMode = function (value) {
            return value === 'normal' || value === 'skip';
        };
        var isThemeColor = function (value) {
            return value === 'amethyst' || value === 'azure';
        };
        var isThemeMode = function (value) {
            return value === 'system' || value === 'light' || value === 'dark';
        };
        var isLocale = function (value) {
            return value === 'en' || value === 'zh-TW';
        };
        var storedAnimationMode = readStorage(animationStorageKey);
        var storedLocale = readStorage(localeStorageKey);
        var storedThemeColor = readStorage(themeColorStorageKey);
        var storedThemeMode = readStorage(themeStorageKey);
        var cookieAnimationMode = readCookie(animationStorageKey);
        var cookieLocale = readCookie(localeCookieName);
        var cookieThemeColor = readCookie(themeColorStorageKey);
        var cookieThemeMode = readCookie(themeStorageKey);
        var animationMode = isAnimationMode(storedAnimationMode)
            ? storedAnimationMode
            : isAnimationMode(cookieAnimationMode)
              ? cookieAnimationMode
              : 'normal';
        var themeMode = isThemeMode(storedThemeMode)
            ? storedThemeMode
            : isThemeMode(cookieThemeMode)
              ? cookieThemeMode
              : 'system';
        var themeColor = isThemeColor(storedThemeColor)
            ? storedThemeColor
            : isThemeColor(cookieThemeColor)
              ? cookieThemeColor
              : defaultThemeColor;
        var locale = isLocale(storedLocale)
            ? storedLocale
            : isLocale(cookieLocale)
              ? cookieLocale
              : defaultLocale;
        var systemDark =
            typeof matchMedia === 'function' &&
            matchMedia('(prefers-color-scheme: dark)').matches;
        var resolvedTheme =
            themeMode === 'dark' || (themeMode === 'system' && systemDark)
                ? 'dark'
                : 'light';

        var applyResolvedPreferences = function () {
            root.dataset.animationMode = animationMode;
            root.dataset.theme = resolvedTheme;
            root.dataset.themeMode = themeMode;
            root.lang = locale;
            root.style.colorScheme = resolvedTheme;

            if (themeColor === 'azure') {
                root.dataset.themeColor = 'azure';
            } else {
                delete root.dataset.themeColor;
            }
        };

        applyResolvedPreferences();

        var hydrationObserver = new MutationObserver(function () {
            var hasExpectedThemeColor =
                themeColor === 'azure'
                    ? root.dataset.themeColor === 'azure'
                    : root.dataset.themeColor === undefined;

            if (
                root.dataset.theme !== resolvedTheme ||
                root.dataset.themeMode !== themeMode ||
                root.style.colorScheme !== resolvedTheme ||
                !hasExpectedThemeColor
            ) {
                applyResolvedPreferences();
            }
        });

        hydrationObserver.observe(root, {
            attributeFilter: [
                'data-theme',
                'data-theme-color',
                'data-theme-mode',
                'style',
            ],
            attributes: true,
        });
        root.__homepageThemeHydrationObserver = hydrationObserver;

        setTimeout(function () {
            if (root.__homepageThemeHydrationObserver === hydrationObserver) {
                hydrationObserver.disconnect();
                delete root.__homepageThemeHydrationObserver;
            }
        }, 5000);

        writeStorage(animationStorageKey, animationMode);
        writeStorage(localeStorageKey, locale);
        writeStorage(themeStorageKey, themeMode);
        writeCookie(animationStorageKey, animationMode);
        writeCookie(localeCookieName, locale);
        writeCookie(themeStorageKey, themeMode);
        writeCookie(themeResolvedStorageKey, resolvedTheme);

        if (themeColor === 'azure') {
            writeStorage(themeColorStorageKey, themeColor);
            writeCookie(themeColorStorageKey, themeColor);
        } else {
            removeStorage(themeColorStorageKey);
            clearCookie(themeColorStorageKey);
        }
    } catch {}
})();
`;

const serviceWorkerInitScript = `
if ('serviceWorker' in navigator) {
    addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
}
`;

const serviceWorkerCleanupScript = `
addEventListener('load', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            registrations.forEach(function (registration) {
                registration.unregister();
            });
        }).catch(function () {});
    }

    if ('caches' in globalThis) {
        caches.keys().then(function (names) {
            return Promise.all(
                names
                    .filter(function (name) {
                        return name.startsWith('homepage-shell-');
                    })
                    .map(function (name) {
                        return caches.delete(name);
                    })
            );
        }).catch(function () {});
    }
});
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>): ReactNode {
    const content = isSupabaseConfigured() ? (
        <AuthProvider>{children}</AuthProvider>
    ) : (
        children
    );

    return (
        <html
            lang={defaultInitialAppPreferences.locale}
            className={quicksand.variable}
            data-animation-mode={defaultInitialAppPreferences.animationMode}
            suppressHydrationWarning
        >
            <head>
                <meta name='color-scheme' content='light dark' />
                <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
            </head>
            <body>
                {content}
                <script
                    dangerouslySetInnerHTML={{
                        __html:
                            process.env.NODE_ENV === 'production'
                                ? serviceWorkerInitScript
                                : serviceWorkerCleanupScript,
                    }}
                />
            </body>
        </html>
    );
}
