import './Highlights.css';

const HighlightCard = ({ title, value, unit, icon }) => (
    <div className="highlight-card glass-card">
        <div className="hl-header">
            <span>{title}</span>
            <span className="hl-icon">{icon}</span>
        </div>
        <div className="hl-value">
            {value} <span className="hl-unit">{unit}</span>
        </div>
    </div>
);

const Highlights = ({ data }) => {
    if (!data) return null;
    const { humidity, wind, pressure, feels_like } = data;

    return (
        <div className="highlights-wrapper">
            <h3>Today's Highlights</h3>
            <div className="highlights-grid">
                <HighlightCard title="Wind Speed" value={wind} unit="km/h" icon="🍃" />
                <HighlightCard title="Feels Like" value={Math.round(feels_like)} unit="°" icon="🌡️" />
                <HighlightCard title="Humidity" value={humidity} unit="%" icon="💧" />
                <HighlightCard title="Pressure" value={pressure} unit="hPa" icon="⏲️" />
            </div>
        </div>
    );
};

export default Highlights;
