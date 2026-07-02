export interface AqiData {
    siteName: string;
    county: string;
    aqi: number | undefined;
    status: string;
    pollutant: string | undefined;
    pm25: number | undefined;
    pm10: number | undefined;
    publishTime: string;
}

export interface AqiSiteOption {
    siteName: string;
    county: string;
    siteId: string;
}

export interface WeatherData {
    weatherType: string;
    temp: number;
}
