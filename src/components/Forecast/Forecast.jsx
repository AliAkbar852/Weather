import { formatDay, formatTemp } from '../../utils/helpers';
import WeatherIcon from '../WeatherIcon/WeatherIcon';
import './Forecast.css';

const Forecast = ({ data, unit }) => {
    if (!data) return null;

    return (
        <div className="forecast-container glass-card">
            <h3>5-Day Forecast</h3>
            <div className="forecast-list">
                {data.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <span className="day">{day.dayLabel || (index === 0 ? 'Tomorrow' : formatDay(day.dt))}</span>
                        <div className="forecast-condition">
                            <WeatherIcon code={day.weatherCode} isDay={true} size="40px" />
                            <span className="cond-text">{day.condition}</span>
                        </div>
                        <span className="temp">{formatTemp(day.avgTemp || day.temp, unit)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;
