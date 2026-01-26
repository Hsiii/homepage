import { useEffect, useState } from 'react';

export const useTime = () => {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        requestAnimationFrame(() => {
            const update = () => {
                const d = new Date();
                const hours = d.getHours().toString().padStart(2, '0');
                const minutes = d.getMinutes().toString().padStart(2, '0');
                setTime(`${hours}:${minutes}`);
                setDate(d.getMonth() + 1 + '/' + d.getDate());
            };
            update();
            const id = setInterval(update, 1000 * 60);
            return () => clearInterval(id);
        });
    }, []);

    return { time, date };
};
