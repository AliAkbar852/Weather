export const formatDate = (timestamp) => {
    // Handles both seconds (unix style) and milliseconds
    const time = timestamp > 10000000000 ? timestamp : timestamp * 1000;
    const date = new Date(time);
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    }).format(date);
};

export const formatDay = (timestamp) => {
    const time = timestamp > 10000000000 ? timestamp : timestamp * 1000;
    const date = new Date(time);
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

export const formatTime = (timestamp) => {
    const time = timestamp > 10000000000 ? timestamp : timestamp * 1000;
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const formatTemp = (temp, unit = 'C') => {
    if (unit === 'F') {
        return Math.round((temp * 9 / 5) + 32);
    }
    return Math.round(temp);
};
