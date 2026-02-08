import { useEffect, useState } from 'react';

interface Time {
    time: string;
    date: string;
}

export const useTime = (): Time => {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const update = () => {
            const d = new Date();
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            setTime(`${hours}:${minutes}`);
            setDate(`${d.getMonth() + 1}/${d.getDate()}`);
        };

        requestAnimationFrame(update);
        const id = setInterval(update, 1000 * 60);
        return () => {
            clearInterval(id);
        };
    }, []);

    return { time, date };
};
