import { useCallback, useEffect, useState } from 'react';
import {
    Cloud,
    CloudDrizzle,
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

export interface WeatherData {
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

const CACHE_KEY = 'weather_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CachedWeather {
    data: WeatherData;
    isLocal: boolean;
    timestamp: number;
}

export const Weather: React.FC = () => {
    const [weather, setWeather] = useState<WeatherData | undefined>(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached !== null) {
            try {
                const { data }: CachedWeather = JSON.parse(
                    cached
                ) as CachedWeather;
                return data;
            } catch {
                return undefined;
            }
        }
        return undefined;
    });
    const [loading, setLoading] = useState(false);
    const [isLocal, setIsLocal] = useState(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached !== null) {
            try {
                const { isLocal: _isLocal }: CachedWeather = JSON.parse(
                    cached
                ) as CachedWeather;
                return _isLocal;
            } catch {
                return false;
            }
        }
        return false;
    });

    const fetchWeather = useCallback(async (lat?: string, lon?: string) => {
        setLoading(true);
        try {
            let apiUrl = 'https://hsi-homepage.vercel.app/api/weather';

            if (lat !== undefined && lon !== undefined) {
                const separator = apiUrl.includes('?') ? '&' : '?';
                apiUrl += `${separator}lat=${lat}&lon=${lon}`;
            }

            const res = await fetch(apiUrl);
            if (!res.ok) {
                throw new Error('Failed to fetch');
            }
            const data = (await res.json()) as WeatherData;
            setWeather(data);
            const isLocalUpdate = lat !== undefined && lon !== undefined;
            setIsLocal(isLocalUpdate);

            // Update Cache
            const cache: CachedWeather = {
                data,
                isLocal: isLocalUpdate,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCoordinates = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toString();
                const lon = position.coords.longitude.toString();
                fetchWeather(lat, lon).catch((error: unknown) => {
                    console.warn('Failed to fetch weather:', error);
                });
            },
            (error) => {
                console.warn('Geolocation denied or failed:', error);
                // Fallback to default (Taipei).
                fetchWeather(DEFAULT_LAT, DEFAULT_LON).catch(
                    (error_: unknown) => {
                        console.error('Failed to fetch weather:', error_);
                    }
                );
            }
        );
    }, [fetchWeather]);

    useEffect(() => {
        const initWeather = async () => {
            // Check if cache is still valid.
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached !== null) {
                try {
                    const { timestamp }: CachedWeather = JSON.parse(
                        cached
                    ) as CachedWeather;
                    if (Date.now() - timestamp < CACHE_TTL) {
                        return; // Cache is fresh, skip background update
                    }
                } catch {
                    // Ignore cache error
                }
            }

            try {
                const result = await navigator.permissions.query({
                    name: 'geolocation',
                });
                if (result.state === 'granted') {
                    getCoordinates();
                } else {
                    await fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                }
            } catch {
                await fetchWeather(DEFAULT_LAT, DEFAULT_LON);
            }
        };

        initWeather().catch((error: unknown) => {
            console.error('Failed to fetch weather:', error);
        });
    }, [fetchWeather, getCoordinates]);

    const handleRefresh = () => {
        getCoordinates();
    };

    const date = new Date();
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short',
    });

    const getIcon = (main: WeatherType) => {
        switch (main) {
            case WeatherType.Thunderstorm: {
                return <CloudLightning size={20} />;
            }

            case WeatherType.Drizzle: {
                return <CloudDrizzle size={20} />;
            }

            case WeatherType.Rain: {
                return <CloudRain size={20} />;
            }

            case WeatherType.Snow: {
                return <CloudSnow size={20} />;
            }

            case WeatherType.Clear: {
                return <Sun size={20} />;
            }

            case WeatherType.Clouds: {
                return <Cloud size={20} />;
            }
        }
    };

    return (
        weather && (
            <div className='weather-container'>
                <span className='weather-date'>{dateStr}</span>
                <span className='weather-info'>
                    {getIcon(weather.main as WeatherType)}
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
};
