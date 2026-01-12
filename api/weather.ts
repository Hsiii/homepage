import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse,
) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Origin', '*');
    // Note: In production, you might want to replace '*' with your specific GitHub Pages domain
    // e.g., 'https://yourname.github.io' for better security.
    response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    );
    response.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );

    // Handle OPTIONS request for preflight
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    const { lat = '25.0330', lon = '121.5654' } = request.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
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

        const data = await res.json();

        // Simplify payload for client
        const payload = {
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            main: data.weather[0].main,
            dt: data.dt,
            timezone: data.timezone,
            name: data.name,
        };

        return response.status(200).json(payload);
    } catch (error) {
        console.error('Weather fetch error:', error);
        return response
            .status(500)
            .json({ error: 'Failed to fetch weather data' });
    }
}
