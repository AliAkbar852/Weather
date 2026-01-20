/**
 * Weather Visual Mapper
 * Maps WMO codes to visual animation types.
 */

export const VISUALS = {
    CLEAR_DAY: 'clear-day',
    CLEAR_NIGHT: 'clear-night',
    CLOUDY: 'cloudy',
    PARTLY_CLOUDY_DAY: 'partly-cloudy-day',
    PARTLY_CLOUDY_NIGHT: 'partly-cloudy-night',
    RAIN: 'rain',
    SNOW: 'snow',
    THUNDER: 'thunder',
    FOG: 'fog',
    DRIZZLE: 'drizzle'
};

/**
 * Get the visual type for a given weather code and time of day.
 * @param {number} code - WMO Weather code
 * @param {boolean} isDay - true if daytime
 * @returns {string} Visual type key
 */
export const getWeatherVisual = (code, isDay = true) => {
    // Clear / Mainly Clear
    if (code === 0 || code === 1) {
        return isDay ? VISUALS.CLEAR_DAY : VISUALS.CLEAR_NIGHT;
    }

    // Partly Cloudy
    if (code === 2) {
        return isDay ? VISUALS.PARTLY_CLOUDY_DAY : VISUALS.PARTLY_CLOUDY_NIGHT;
    }

    // Overcast
    if (code === 3) {
        return VISUALS.CLOUDY;
    }

    // Fog
    if ([45, 48].includes(code)) {
        return VISUALS.FOG;
    }

    // Drizzle
    if ([51, 53, 55].includes(code)) {
        return VISUALS.DRIZZLE;
    }

    // Rain / Showers
    if ([61, 63, 65, 80, 81, 82].includes(code)) {
        return VISUALS.RAIN;
    }

    // Snow
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return VISUALS.SNOW;
    }

    // Thunderstorm
    if ([95, 96, 99].includes(code)) {
        return VISUALS.THUNDER;
    }

    // Default
    return isDay ? VISUALS.PARTLY_CLOUDY_DAY : VISUALS.PARTLY_CLOUDY_NIGHT;
};
