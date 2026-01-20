import { useState, useEffect, useCallback } from 'react';
import { getWeather, getForecast } from '../services/weatherService';

export const useWeather = (initialCity = 'New York') => {
    const [data, setData] = useState({ weather: null, forecast: null });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [error, setError] = useState(null);
    const [city, setCity] = useState(initialCity);

    const fetchWeather = useCallback(async (cityName) => {
        if (!cityName) return;

        setStatus('loading');
        setError(null);

        try {
            // Parallel fetch using the service (which handles caching primarily, but good to be explicit)
            const weatherData = await getWeather(cityName);
            const forecastData = await getForecast(cityName);

            setData({ weather: weatherData, forecast: forecastData });
            setStatus('success');
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data.');
            setStatus('error');
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchWeather(city);
    }, [city, fetchWeather]);

    const retry = () => fetchWeather(city);

    return {
        weather: data.weather,
        forecast: data.forecast,
        status,
        error,
        setCity,
        retry,
        isLoading: status === 'loading'
    };
};
