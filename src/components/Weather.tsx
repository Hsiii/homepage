import { useEffect, useState } from 'react';
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    Sun,
} from 'lucide-react';

import 'components/Weather.css';

enum WeatherType {
    Thunderstorm = 'Thunderstorm',
    Drizzle = 'Drizzle',
    Rain = 'Rain',
    Snow = 'Snow',
    Clear = 'Clear',
    Clouds = 'Clouds',
}

interface WeatherData {
    temp: number;
    description: string;
    icon: string;
    main: string;
    dt: number;
    timezone: number;
    name: string;
}

export default function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async (lat?: string, lon?: string) => {
            try {
                // Use environment variable for API URL (needed for GitHub Pages + Vercel backend)
                // Fallback to local /api/weather for local/Vercel deployments
                let apiUrl =
                    import.meta.env.VITE_WEATHER_API_URL || '/api/weather';

                if (lat && lon) {
                    const separator = apiUrl.includes('?') ? '&' : '?';
                    apiUrl += `${separator}lat=${lat}&lon=${lon}`;
                }

                const res = await fetch(apiUrl);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setWeather(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        const getCoordinates = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude.toString();
                        const lon = position.coords.longitude.toString();
                        fetchWeather(lat, lon);
                    },
                    (error) => {
                        console.warn('Geolocation denied or failed:', error);
                        // Fallback to default (handled by API)
                        fetchWeather();
                    },
                );
            } else {
                fetchWeather();
            }
        };

        getCoordinates();
    }, []);

    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
    const dayStr = date.toLocaleDateString('en-US', { weekday: 'long' });

    const getIcon = (main: string) => {
        switch (main) {
            case WeatherType.Thunderstorm:
                return <CloudLightning size={20} />;
            case WeatherType.Drizzle:
                return <CloudDrizzle size={20} />;
            case WeatherType.Rain:
                return <CloudRain size={20} />;
            case WeatherType.Snow:
                return <CloudSnow size={20} />;
            case WeatherType.Clear:
                return <Sun size={20} />;
            case WeatherType.Clouds:
                return <Cloud size={20} />;
            default:
                return <CloudFog size={20} />; // Atmosphere/Mist/Fog etc
        }
    };

    return error || loading || !weather ? (
        <div className='weather-placeholder'></div>
    ) : (
        <div className='weather-container'>
            <span className='weather-date'>{dateStr}</span>
            <span className='weather-day'>{dayStr}</span>
            <span className='weather-icon'>{getIcon(weather.main)}</span>
            <span className='weather-temp'>{Math.round(weather.temp)}°C</span>
        </div>
    );
}
