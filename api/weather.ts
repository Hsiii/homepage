import type { VercelRequest, VercelResponse } from '@vercel/node';

export type WeatherData = {
    weatherType: string;
    temp: number;
};

interface WeatherPayload {
    main: {
        temp: number;
    };
    weather: Array<{
        main: string;
    }>;
}

const allowedOrigins = [
    'https://hsi-homepage.vercel.app',
    'http://localhost:4173',
    'http://localhost:5173',
    'http://127.0.0.1:4173',
    'http://127.0.0.1:5173',
];

const defaultCoords = {
    lat: '25.03',
    lon: '121.57',
};

/**
 * Sets CORS headers on the response.
 * Uses the request origin if it's in the allowed list, otherwise defaults to production.
 */
function setCorsHeaders(
    request: VercelRequest,
    response: VercelResponse
): void {
    const { origin } = request.headers;

    // Critical for Vercel/CDN caching: tell the cache that the response depends on the Origin header.
    response.setHeader('Vary', 'Origin');

    response.setHeader(
        'Access-Control-Allow-Origin',
        origin !== undefined && allowedOrigins.includes(origin)
            ? origin
            : 'https://hsi-homepage.vercel.app'
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin');
}

/**
 * Extracts and validates a coordinate query parameter.
 * Handles array case (e.g., ?lat=25&lat=30) and validates numeric format.
 * Returns the coordinate rounded to 2 decimal places for better cache hits.
 */
function parseCoordinate(
    value: string | string[] | undefined,
    defaultValue: string
): string | null {
    const raw = Array.isArray(value) ? value[0] : value;
    const str = raw ?? defaultValue;
    const num = parseFloat(str);

    if (Number.isNaN(num)) {
        return null;
    }

    // Round to 2 decimal places (~1km precision) for better cache hit rate.
    return num.toFixed(2);
}

// eslint-disable-next-line import-x/no-default-export
export default async function handler(
    request: VercelRequest,
    response: VercelResponse
): Promise<VercelResponse> {
    setCorsHeaders(request, response);

    // Handle OPTIONS request for preflight.
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Validate and parse coordinates.
    const lat = parseCoordinate(request.query.lat, defaultCoords.lat);
    const lon = parseCoordinate(request.query.lon, defaultCoords.lon);

    if (lat === null || lon === null) {
        return response.status(400).json({
            error: 'Invalid lat/lon parameters. Must be numeric values.',
        });
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    if (apiKey === undefined) {
        return response.status(500).json({
            error: 'OpenWeatherMap API key not configured',
        });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Weather API responded with status ${res.status}`);
        }

        const {
            main: { temp },
            weather: [{ main: weatherType }],
        } = (await res.json()) as WeatherPayload;

        const payload: WeatherData = {
            weatherType,
            temp,
        };

        // Cache for 5 minutes, serve stale while revalidating for up to 10 minutes.
        // This reduces API calls and speeds up responses for nearby users.
        response.setHeader(
            'Cache-Control',
            's-maxage=300, stale-while-revalidate=600'
        );

        return response.status(200).json(payload);
    } catch (error) {
        console.error('Weather fetch error:', error);
        return response
            .status(500)
            .json({ error: 'Failed to fetch weather data' });
    }
}
