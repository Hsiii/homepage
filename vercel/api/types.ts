/**
 * The weather data returned by the OpenWeatherMap API and used by both the API and the frontend.
 */
export type WeatherData = {
    temp: number;
    description: string;
    icon: string;
    main: string;
    dt: number;
    timezone: number;
    name: string;
};
