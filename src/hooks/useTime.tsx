import { useEffect, useState } from 'react';

interface Time {
    time: string;
}

const defaultTimeZone = 'Asia/Taipei';

const getCurrentTime = (): string =>
    new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        timeZone: defaultTimeZone,
    });

export const useTime = (): Time => {
    const [time, setTime] = useState(getCurrentTime);

    useEffect(() => {
        const update = () => {
            setTime(getCurrentTime());
        };

        const id = setInterval(update, 1000 * 60);
        return () => {
            clearInterval(id);
        };
    }, []);

    return { time };
};
