export type AqiRank =
    | 'good'
    | 'moderate'
    | 'sensitive'
    | 'unhealthy'
    | 'very-unhealthy'
    | 'hazardous'
    | 'unknown';

export const aqiRankLabels = {
    'en': {
        'good': 'Good',
        'moderate': 'Moderate',
        'sensitive': 'Unhealthy for sensitive groups',
        'unhealthy': 'Unhealthy',
        'very-unhealthy': 'Very unhealthy',
        'hazardous': 'Hazardous',
        'unknown': 'Unknown',
    },
    'zh-TW': {
        'good': '良好',
        'moderate': '普通',
        'sensitive': '對敏感族群不健康',
        'unhealthy': '對所有族群不健康',
        'very-unhealthy': '非常不健康',
        'hazardous': '危害',
        'unknown': '未知',
    },
} as const;

export function getAqiRank(aqi: number | undefined): AqiRank {
    if (aqi === undefined) {
        return 'unknown';
    }

    if (aqi <= 50) {
        return 'good';
    }

    if (aqi <= 100) {
        return 'moderate';
    }

    if (aqi <= 150) {
        return 'sensitive';
    }

    if (aqi <= 200) {
        return 'unhealthy';
    }

    if (aqi <= 300) {
        return 'very-unhealthy';
    }

    return 'hazardous';
}
