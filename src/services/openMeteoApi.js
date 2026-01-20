/**
 * Open-Meteo API Service
 * 
 * Why Open-Meteo?
 * - No API key required (easy setup for everyone)
 * - Free for non-commercial use
 * - HTTPS and CORS friendly for frontend-only usage
 */

import { formatDailyForecast, getByWMOCode } from '../utils/forecastFormatter';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Get coordinates for a city name
 * @param {string} city 
 * @returns {Promise<{name, lat, lon, country}>}
 */
export const getLocation = async (city) => {
    try {
        const response = await fetch(`${GEO_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        const result = data.results[0];
        return {
            name: result.name,
            lat: result.latitude,
            lon: result.longitude,
            country: result.country_code
        };
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error;
    }
};

/**
 * Get full weather data (current + forecast)
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<Object>} Formatted weather data
 */
export const getWeatherData = async (lat, lon) => {
    try {
        // Fetching more daily/hourly parameters than strictly needed to be safe for charts/details
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current_weather: true,
            daily: 'temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,uv_index_max,precipitation_sum',
            hourly: 'temperature_2m,relativehumidity_2m,surface_pressure,visibility,apparent_temperature',
            timezone: 'auto'
        });

        const response = await fetch(`${WEATHER_API_URL}?${params.toString()}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.reason || 'Weather data fetch failed');
        }

        return data;
    } catch (error) {
        console.error("Weather API Error:", error);
        throw error;
    }
};

export const mapOpenMeteoData = (location, apiData) => {
    // Current Weather Mapping
    const currentCode = apiData.current_weather.weathercode;
    const currentInfo = getByWMOCode(currentCode);

    // We need current hourly data to get real-time humidity/pressure since current_weather object is limited
    // Finding the closest hour index
    const now = new Date();
    const currentHourIndex = apiData.hourly.time.findIndex(t => new Date(t) >= now) || 0;

    // Extracting hourly details for "Highlights"
    const humidity = apiData.hourly.relativehumidity_2m[currentHourIndex];
    const pressure = apiData.hourly.surface_pressure[currentHourIndex];
    const visibility = apiData.hourly.visibility[currentHourIndex] / 1000; // convert m to km
    const feels_like = apiData.hourly.apparent_temperature[currentHourIndex];

    const currentDetails = {
        city: location.name,
        country: location.country,
        temp: apiData.current_weather.temperature,
        condition: currentInfo.description,
        icon: currentInfo.icon,
        description: currentInfo.description,
        humidity: humidity || 0,
        wind: apiData.current_weather.windspeed,
        pressure: pressure || 1013,
        visibility: visibility || 10,
        feels_like: feels_like || apiData.current_weather.temperature,
        dt: Date.now() / 1000,
        weatherCode: apiData.current_weather.weathercode,
        isDay: apiData.current_weather.is_day === 1
    };

    // Use the new Formatter for Forecast
    const forecast = formatDailyForecast(apiData.daily, apiData.timezone);

    // Hourly Trend (Next 24 Hours)
    // We slice from current hour to +24
    const hourlyTrend = apiData.hourly.time
        .slice(currentHourIndex, currentHourIndex + 24)
        .map((time, i) => {
            return {
                time: new Date(time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                temp: apiData.hourly.temperature_2m[currentHourIndex + i],
            };
        });

    return {
        current: currentDetails,
        forecast: forecast,
        hourly: hourlyTrend
    };
};
