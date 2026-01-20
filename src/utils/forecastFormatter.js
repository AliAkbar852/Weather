// Data mapping utility

// Let's rely on the service to pass the raw data, and this formatter does the structural transformation.
// But to get "weatherCode" converted to "icon", I need that map. 
// I'll import `getByWMOCode` if I export it, or define it here if I want to be strict about "all transformation logic".

/**
 * Maps WMO Weather Codes to UI friendly objects
 */
export const getByWMOCode = (code) => {
    const table = {
        0: { description: 'Clear Sky', icon: '01d' },
        1: { description: 'Mainly Clear', icon: '02d' },
        2: { description: 'Partly Cloudy', icon: '03d' },
        3: { description: 'Overcast', icon: '04d' },
        45: { description: 'Fog', icon: '50d' },
        48: { description: 'Depositing Rime Fog', icon: '50d' },
        51: { description: 'Light Drizzle', icon: '09d' },
        53: { description: 'Moderate Drizzle', icon: '09d' },
        55: { description: 'Dense Drizzle', icon: '09d' },
        61: { description: 'Slight Rain', icon: '10d' },
        63: { description: 'Moderate Rain', icon: '10d' },
        65: { description: 'Heavy Rain', icon: '10d' },
        71: { description: 'Slight Snow', icon: '13d' },
        73: { description: 'Moderate Snow', icon: '13d' },
        75: { description: 'Heavy Snow', icon: '13d' },
        80: { description: 'Slight Rain Showers', icon: '09d' },
        81: { description: 'Moderate Rain Showers', icon: '09d' },
        82: { description: 'Violent Rain Showers', icon: '09d' },
        95: { description: 'Thunderstorm', icon: '11d' },
        96: { description: 'Thunderstorm with Hail', icon: '11d' },
        99: { description: 'Thunderstorm with Heavy Hail', icon: '11d' },
    };
    return table[code] || { description: 'Unknown', icon: '03d' };
};

/**
 * Transforms raw Open-Meteo daily data into a 5-day forecast array.
 * @param {Object} dailyData - The 'daily' object from Open-Meteo response
 * @param {string} timezone - The timezone string from response
 * @returns {Array} Clean forecast objects
 */
export const formatDailyForecast = (dailyData, timezone) => {
    if (!dailyData || !dailyData.time) {
        console.warn("ForecastFormatter: Invalid daily data received", dailyData);
        return [];
    }

    // We want the next 5 days, so we slice from index 1 (tomorrow) to 6.
    // Index 0 is today.
    const indices = [1, 2, 3, 4, 5];

    const formatted = indices.map(index => {
        // Ensure data exists for this index
        if (!dailyData.time[index]) return null;

        const timeStr = dailyData.time[index];
        const maxTemp = dailyData.temperature_2m_max[index];
        const minTemp = dailyData.temperature_2m_min[index];
        const weatherCode = dailyData.weathercode[index];

        // Create Date object correctly handling timezone if needed, 
        // but the API returns YYYY-MM-DD which is fairly standard.
        // Creating a date object from YYYY-MM-DD is parsed as UTC usually, 
        // but for "Day Label" logic (Mon, Tue), it mostly works out if we just parse it.
        const dateObj = new Date(timeStr);

        // Day Label (e.g., "Mon", "Tue")
        const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);

        // Weather Info (Mapping WMO to UI)
        const { description, icon } = getByWMOCode(weatherCode);

        return {
            date: timeStr,        // YYYY-MM-DD
            dayLabel: dayLabel,   // "Mon"
            minTemp: minTemp,
            maxTemp: maxTemp,
            avgTemp: (minTemp + maxTemp) / 2, // For backward compatibility with existing UI if needed
            weatherCode: weatherCode,

            // UI Compat fields (so we don't strictly break visual components immediately)
            condition: description,
            icon: icon,
            dt: dateObj.getTime() / 1000 // UNIX timestamp for existing helpers if needed
        };
    }).filter(Boolean); // Remove nulls

    console.log(`ForecastFormatter: Transformed ${formatted.length} days.`);
    return formatted;
};
