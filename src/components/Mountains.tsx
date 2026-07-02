import { getWallpaperStyle } from '@/utils/wallpaperStyle';
import type { WallpaperAsset } from '../../shared/wallpaper';
import backSrc from '../assets/images/mountain/back.svg';
import frontSrc from '../assets/images/mountain/front.svg';
import midSrc from '../assets/images/mountain/mid.svg';

interface MountainsProps {
    initialWallpaper: WallpaperAsset | undefined;
}

export const Mountains: React.FC<MountainsProps> = ({ initialWallpaper }) => (
    <div
        className='mountains'
        data-wallpaper={initialWallpaper === undefined ? undefined : 'custom'}
        style={getWallpaperStyle(initialWallpaper)}
    >
        <img
            className='parallax-back'
            src={backSrc}
            loading='eager'
            decoding='async'
            fetchPriority='low'
            alt='a flat-color mountain in the background'
        />
        <img
            className='parallax-mid'
            src={midSrc}
            loading='eager'
            decoding='async'
            fetchPriority='low'
            alt='a flat-color mountain in the middle'
        />
        <img
            src={frontSrc}
            loading='eager'
            decoding='async'
            fetchPriority='high'
            alt='a flat-color mountain in the foreground'
        />
    </div>
);
