import { themePreferenceCookieMaxAgeSeconds } from '@/constants/theme';

const getSecureCookieAttribute = (): string =>
    globalThis.location.protocol === 'https:' ? '; Secure' : '';

export const clearPreferenceCookie = (key: string): void => {
    // eslint-disable-next-line unicorn/no-document-cookie -- Cookie Store API is not available in all target browsers.
    globalThis.document.cookie = `${key}=; Path=/; Max-Age=0; SameSite=Lax${getSecureCookieAttribute()}`;
};

export const writePreferenceCookie = (key: string, value: string): void => {
    // eslint-disable-next-line unicorn/no-document-cookie -- Cookie Store API is not available in all target browsers.
    globalThis.document.cookie = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${themePreferenceCookieMaxAgeSeconds}; SameSite=Lax${getSecureCookieAttribute()}`;
};
