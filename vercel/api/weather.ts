import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { WeatherData } from 'components/Weather';

interface WeatherPayload {
    main: {
        temp: number;
    };
    weather: Array<{
        description: string;
        icon: string;
        main: string;
    }>;
    dt: number;
    timezone: number;
    name: string;
}

// eslint-disable-next-line import-x/no-default-export
export default async function handler(
    request: VercelRequest,
    response: VercelResponse
): Promise<VercelResponse> {
    const allowedOrigins = [
        'https://hsiii.github.io',
        'http://localhost:4173',
        'http://localhost:5173',
        'http://127.0.0.1:4173',
        'http://127.0.0.1:5173',
    ];
    const { origin } = request.headers;

    // Critical for Vercel/CDN caching: tell the cache that the response depends on the Origin
    // header.
    response.setHeader('Vary', 'Origin');

    if (origin !== undefined && allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Fallback to primary production domain.
        response.setHeader(
            'Access-Control-Allow-Origin',
            'https://hsiii.github.io'
        );
    }

    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin'
    );

    // Handle OPTIONS request for preflight.
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const { lat = '25.0330', lon = '121.5654' } = request.query;
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
            weather,
            dt,
            timezone,
            name,
        } = (await res.json()) as WeatherPayload;

        // Simplify payload for client.
        const payload: WeatherData = {
            temp,
            description: weather[0].description,
            icon: weather[0].icon,
            main: weather[0].main,
            dt,
            timezone,
            name,
        };

        return response.status(200).json(payload);
    } catch (error) {
        console.error('Weather fetch error:', error);
        return response
            .status(500)
            .json({ error: 'Failed to fetch weather data' });
    }
}
