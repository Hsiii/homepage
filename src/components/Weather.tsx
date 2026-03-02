import { RefreshCw } from 'lucide-react';

import './Weather.css';

import { useWeather } from '@/hooks/useWeather';

export const Weather: React.FC = () => {
    const {
        weather,
        weatherIcon,
        isLoading,
        isCached,
        fetchWeatherByCurrentLocation,
    } = useWeather();

    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });

    return (
        weather && (
            <div className='weather-container'>
                <span className='weather-date'>{dateStr}</span>
                <span className='weather-info'>
                    {weatherIcon}
                    {Math.round(weather.temp)}°C
                    {!isCached && (
                        <button
                            className={`weather-refresh ${isLoading ? 'loading' : ''}`}
                            onClick={fetchWeatherByCurrentLocation}
                            title='Update with my location'
                        >
                            <RefreshCw size={14} />
                        </button>
                    )}
                </span>
            </div>
        )
    );
};
