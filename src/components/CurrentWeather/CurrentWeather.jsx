import { formatTemp, formatDate } from '../../utils/helpers';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './CurrentWeather.css';

const CurrentWeather = ({ data, unit }) => {
    if (!data) return null;
    const { city, temp, condition, dt, weatherCode, isDay } = data;

    return (
        <div className="current-weather glass-card">
            <div className="header">
                <h3>{city}</h3>
                <span className="date">{formatDate(dt)}</span>
            </div>
            <div className="main-info">
                <div className="icon-container">
                    <WeatherIcon code={weatherCode} isDay={isDay} size="160px" />
                </div>
                <div className="temp-container">
                    <h1 className="temp">{formatTemp(temp, unit)}</h1>
                    <p className="condition">{condition}</p>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
