import { useState, useEffect, useCallback } from 'react';
import { getWeather, getForecast, getWeatherByCoords } from '../services/weatherService';

export const useWeather = () => {
    const [data, setData] = useState({ weather: null, forecast: null });
    const [status, setStatus] = useState('loading'); // Start loading immediately
    const [error, setError] = useState(null);
    const [city, setCity] = useState(''); // Init empty

    const fetchWeather = useCallback(async (cityName) => {
        if (!cityName) return;

        setStatus('loading');
        setError(null);

        try {
            const weatherData = await getWeather(cityName);
            const forecastData = await getForecast(cityName);

            setData({ weather: weatherData, forecast: forecastData });
            setStatus('success');
        } catch (err) {
            setError(err.message || 'Failed to fetch weather data.');
            setStatus('error');
        }
    }, []);

    // Initial Load: Geolocation or Default
    useEffect(() => {
        if (!navigator.geolocation) {
            setCity('New York');
            fetchWeather('New York');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const fullData = await getWeatherByCoords(latitude, longitude);

                    // Update State
                    setData({ weather: fullData.current, forecast: fullData.forecast });
                    setCity(fullData.city); // Update city input to match
                    setStatus('success');
                } catch (err) {
                    console.error("Geolocation Weather Error:", err);
                    setCity('New York');
                    fetchWeather('New York'); // Fallback
                }
            },
            (err) => {
                console.warn("Geolocation denied/error:", err);
                setCity('New York');
                fetchWeather('New York'); // Fallback
            }
        );
    }, []); // Run ONCE on mount

    // Standard retry
    const retry = () => {
        if (city) fetchWeather(city);
        else {
            // If retry happens and no city, try default
            setCity('New York');
            fetchWeather('New York');
        }
    };

    return {
        weather: data.weather,
        forecast: data.forecast,
        status,
        error,
        setCity: (newCity) => {
            setCity(newCity);
            fetchWeather(newCity);
        },
        retry,
        isLoading: status === 'loading'
    };
};
