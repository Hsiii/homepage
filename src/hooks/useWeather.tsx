import { JSX, useCallback, useEffect, useState } from 'react';
import type { WeatherData } from 'api/types';
import {
    Cloud,
    CloudDrizzle,
    CloudLightning,
    CloudRain,
    CloudSnow,
    Sun,
} from 'lucide-react';

/**
 * The weather type returned by the OpenWeatherMap API.
 */
type CachedWeather = {
    data: WeatherData;
    timestamp: number;
    isDefault?: boolean;
};

enum WeatherType {
    Thunderstorm = 'Thunderstorm',
    Drizzle = 'Drizzle',
    Rain = 'Rain',
    Snow = 'Snow',
    Clear = 'Clear',
    Clouds = 'Clouds',
}

const weatherIcons: Record<WeatherType, JSX.Element> = {
    [WeatherType.Thunderstorm]: <CloudLightning size={20} />,
    [WeatherType.Drizzle]: <CloudDrizzle size={20} />,
    [WeatherType.Rain]: <CloudRain size={20} />,
    [WeatherType.Snow]: <CloudSnow size={20} />,
    [WeatherType.Clear]: <Sun size={20} />,
    [WeatherType.Clouds]: <Cloud size={20} />,
};

export const useWeather = () => {
    // Taipei Coordinates
    const [defaultLat, defaultLon] = [25.033, 121.5654];

    const baseApiUrl = 'https://hsi-homepage.vercel.app/api/weather';

    const cacheKey = 'weather_cache';
    const cacheTTL = 30 * 60 * 1000; // 30 minutes

    // sync with localStorage
    const [cachedWeather, setCachedWeather] = useState<
        CachedWeather | undefined
    >(() => {
        const cached = localStorage.getItem(cacheKey);
        if (cached !== null) {
            try {
                return JSON.parse(cached) as CachedWeather;
            } catch {
                return undefined;
            }
        }
        return undefined;
    });
    const isCached =
        cachedWeather !== undefined && cachedWeather.isDefault !== true;
    const weather = cachedWeather?.data;
    const weatherIcon = weather
        ? (weatherIcons[weather.main as WeatherType] ?? <Cloud size={20} />)
        : undefined;
    const [isLoading, setIsLoading] = useState(false);

    const updateCache = useCallback((data: WeatherData, isDefault: boolean) => {
        const cache: CachedWeather = {
            data,
            timestamp: Date.now(),
            isDefault,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        setCachedWeather(cache);
    }, []);

    const fetchWeather = useCallback(
        async (lat: number, lon: number, isDefault: boolean) => {
            setIsLoading(true);
            try {
                const res = await fetch(`${baseApiUrl}?lat=${lat}&lon=${lon}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = (await res.json()) as WeatherData;
                updateCache(data, isDefault);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        },
        [updateCache]
    );

    const fetchWeatherByDefaultLocation = useCallback(() => {
        fetchWeather(defaultLat, defaultLon, true);
    }, [fetchWeather, defaultLat, defaultLon]);

    const fetchWeatherByCurrentLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude, false);
        }, fetchWeatherByDefaultLocation);
    }, [fetchWeather, fetchWeatherByDefaultLocation]);

    useEffect(() => {
        const initWeather = async () => {
            const isCacheValid =
                cachedWeather !== undefined &&
                Date.now() - cachedWeather.timestamp < cacheTTL;
            if (isCacheValid) {
                return;
            }

            try {
                const result = await navigator.permissions.query({
                    name: 'geolocation',
                });
                if (result.state === 'granted') {
                    fetchWeatherByCurrentLocation();
                } else {
                    fetchWeatherByDefaultLocation();
                }
            } catch {
                fetchWeatherByDefaultLocation();
            }
        };

        initWeather().catch((error: unknown) => {
            console.error('Failed to fetch weather:', error);
        });
    }, [fetchWeather, fetchWeatherByCurrentLocation]);

    return {
        weather,
        weatherIcon,
        isLoading,
        isCached,
        fetchWeatherByCurrentLocation,
    };
};
