import { useMemo } from 'react';
import { getWeatherVisual, VISUALS } from '../../utils/weatherVisualMapper';
import './WeatherIcon.css';

const WeatherIcon = ({ code, isDay = true, size = '100px' }) => {
    const visual = useMemo(() => getWeatherVisual(code, isDay), [code, isDay]);

    const renderIcon = () => {
        switch (visual) {
            case VISUALS.CLEAR_DAY:
                return (
                    <div className="icon sun-icon">
                        <div className="sun-core"></div>
                        <div className="sun-rays"></div>
                    </div>
                );
            case VISUALS.CLEAR_NIGHT:
                return (
                    <div className="icon moon-icon">
                        <div className="moon"></div>
                        <div className="star star-1"></div>
                        <div className="star star-2"></div>
                    </div>
                );
            case VISUALS.PARTLY_CLOUDY_DAY:
                return (
                    <div className="icon partly-cloudy-day">
                        <div className="cloud"></div>
                        <div className="sun-behind"></div>
                    </div>
                );
            case VISUALS.PARTLY_CLOUDY_NIGHT:
                return (
                    <div className="icon partly-cloudy-night">
                        <div className="cloud"></div>
                        <div className="moon-behind"></div>
                    </div>
                );
            case VISUALS.CLOUDY:
                return (
                    <div className="icon cloudy-icon">
                        <div className="cloud"></div>
                        <div className="cloud cloud-small"></div>
                    </div>
                );
            case VISUALS.RAIN:
            case VISUALS.DRIZZLE:
                return (
                    <div className="icon rain-icon">
                        <div className="cloud dark"></div>
                        <div className="rain-drops">
                            <span className="drop"></span>
                            <span className="drop"></span>
                            <span className="drop"></span>
                        </div>
                    </div>
                );
            case VISUALS.THUNDER:
                return (
                    <div className="icon thunder-icon">
                        <div className="cloud dark"></div>
                        <div className="lightning">
                            <svg viewBox="0 0 30 30" fill="none" stroke="currentColor">
                                <path d="M15 0 L5 18 L15 18 L12 30 L25 10 L15 10 L15 0Z" fill="#FFD700" stroke="none" />
                            </svg>
                        </div>
                    </div>
                );
            case VISUALS.SNOW:
                return (
                    <div className="icon snow-icon">
                        <div className="cloud"></div>
                        <div className="snow-flakes">
                            <span className="flake">❄</span>
                            <span className="flake">❄</span>
                            <span className="flake">❄</span>
                        </div>
                    </div>
                );
            case VISUALS.FOG:
                return (
                    <div className="icon fog-icon">
                        <div className="fog-line"></div>
                        <div className="fog-line"></div>
                        <div className="fog-line"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="weather-icon-wrapper" style={{ width: size, height: size }}>
            {renderIcon()}
        </div>
    );
};

export default WeatherIcon;
