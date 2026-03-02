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

const allowedOrigins = new Set([
    'https://hsi-homepage.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]);

const defaultCoords = {
    lat: '25.03',
    lon: '121.57',
};

function setCorsHeaders(request: VercelRequest, response: VercelResponse) {
    const { origin } = request.headers;
    response.setHeader('Vary', 'Origin');

    response.setHeader(
        'Access-Control-Allow-Origin',
        origin !== undefined && allowedOrigins.has(origin)
            ? origin
            : 'https://hsi-homepage.vercel.app'
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin');
}

function parseCoordinate(
    value: string | string[] | undefined,
    defaultValue: string
): string | undefined {
    const raw = Array.isArray(value) ? value[0] : value;
    const str = raw ?? defaultValue;
    const num = Number.parseFloat(str);

    if (Number.isNaN(num)) {
        return undefined;
    }

    return num.toFixed(2);
}

// eslint-disable-next-line import-x/no-default-export
export default async function handler(
    request: VercelRequest,
    response: VercelResponse
): Promise<VercelResponse> {
    setCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const lat = parseCoordinate(request.query.lat, defaultCoords.lat);
    const lon = parseCoordinate(request.query.lon, defaultCoords.lon);

    if (lat === undefined || lon === undefined) {
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
