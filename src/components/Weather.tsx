import { useEffect, useState } from 'react';
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    RefreshCw,
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

// Taipei Coordinates
const DEFAULT_LAT = '25.0330';
const DEFAULT_LON = '121.5654';

export default function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isLocal, setIsLocal] = useState(false);

    const fetchWeather = async (lat?: string, lon?: string) => {
        setLoading(true);
        try {
            // Use environment variable for API URL (needed for GitHub Pages + Vercel backend)
            // Fallback to local /api/weather for local/Vercel deployments
            let apiUrl = import.meta.env.VITE_WEATHER_API_URL || '/api/weather';

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
                    setIsLocal(true);
                },
                (error) => {
                    console.warn('Geolocation denied or failed:', error);
                    // Fallback to default (Taipei)
                    fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                    setIsLocal(false);
                },
            );
        } else {
            fetchWeather(DEFAULT_LAT, DEFAULT_LON);
            setIsLocal(false);
        }
    };

    useEffect(() => {
        const initWeather = async () => {
            if (navigator.permissions && navigator.permissions.query) {
                try {
                    const result = await navigator.permissions.query({
                        name: 'geolocation',
                    });
                    if (result.state === 'granted') {
                        getCoordinates();
                    } else {
                        // Default to Taipei
                        fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                        setIsLocal(false);
                    }
                } catch (e) {
                    console.error('Error checking permissions:', e);
                    // Default to Taipei
                    fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                    setIsLocal(false);
                }
            } else {
                fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                setIsLocal(false);
            }
        };

        initWeather();
    }, []);

    const handleRefresh = () => {
        getCoordinates();
    };

    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });

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

    return (
        !error &&
        weather && (
            <div className='weather-container'>
                <span className='weather-date'>{dateStr}</span>
                <span className='weather-info'>
                    {getIcon(weather.main)}
                    {Math.round(weather.temp)}°C
                    {!isLocal && (
                        <button
                            className={`weather-refresh ${loading ? 'loading' : ''}`}
                            onClick={handleRefresh}
                            title='Update with my location'
                        >
                            <RefreshCw size={14} />
                        </button>
                    )}
                </span>
            </div>
        )
    );
}
