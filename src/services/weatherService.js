import { getLocation, getWeatherData, mapOpenMeteoData, getCityFromCoords } from './openMeteoApi';

// Cache to store the last fetched data to avoid double calls for forecast vs current
// Since our new API structure fetches everything in one go.
let weatherCache = {
    city: null,
    data: null,
    timestamp: 0
};

const CACHE_DURATION = 60 * 1000; // 1 minute cache

const fetchCompleteData = async (city) => {
    const now = Date.now();

    // Return cached data if valid
    if (weatherCache.city === city && weatherCache.data && (now - weatherCache.timestamp < CACHE_DURATION)) {
        return weatherCache.data;
    }

    // 1. Get Coordinates
    const location = await getLocation(city);

    // 2. Get Weather Data
    const apiData = await getWeatherData(location.lat, location.lon);

    // 3. Map to our app's format
    const formattedData = mapOpenMeteoData(location, apiData);

    // Update Cache
    weatherCache = {
        city,
        data: formattedData,
        timestamp: now
    };

    return formattedData;
};

// Fetch by coordinates (Geolocation)
export const getWeatherByCoords = async (lat, lon) => {
    // 1. Get City Name (Reverse Geocoding)
    const cityName = await getCityFromCoords(lat, lon);

    // 2. Get Weather Data
    const apiData = await getWeatherData(lat, lon);

    // 3. Map Data
    const location = { name: cityName, country: '', lat, lon };
    const formattedData = mapOpenMeteoData(location, apiData);

    // Update Cache (so subsequent renders use it)
    weatherCache = {
        city: cityName,
        data: formattedData,
        timestamp: Date.now()
    };

    return { ...formattedData, city: cityName }; // Return city name too
};

// Returns current weather data
export const getWeather = async (city) => {
    const data = await fetchCompleteData(city);
    return data.current;
};

// Returns 5-day forecast
export const getForecast = async (city) => {
    const data = await fetchCompleteData(city);
    return data.forecast;
};
