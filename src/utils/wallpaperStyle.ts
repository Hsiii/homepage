import type { CSSProperties } from 'react';

import type { WallpaperAsset } from '../../shared/wallpaper';

const backslashCharacter = String.fromCodePoint(92);
const escapedBackslash = `${backslashCharacter}${backslashCharacter}`;
const escapedDoubleQuote = `${backslashCharacter}"`;

export const getCssUrlValue = (url: string): string =>
    `url("${url
        .replaceAll(backslashCharacter, escapedBackslash)
        .replaceAll('"', escapedDoubleQuote)}")`;

export const getWallpaperStyle = (
    wallpaper: WallpaperAsset | undefined
): (CSSProperties & Record<'--wallpaper-image', string>) | undefined =>
    wallpaper === undefined
        ? undefined
        : {
              '--wallpaper-image': getCssUrlValue(wallpaper.url),
          };
