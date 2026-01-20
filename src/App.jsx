import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Highlights from './components/Highlights/Highlights';
import Forecast from './components/Forecast/Forecast';
import SkeletonLoader from './components/SkeletonLoader/SkeletonLoader';
import TrendChart from './components/TrendChart/TrendChart';
import { useWeather } from './hooks/useWeather';

function App() {
  const { weather, forecast, status, error, setCity, retry, isLoading } = useWeather();
  const [unit, setUnit] = useState('C');
  // Theme State with Persistence & System Preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply Theme & Persist
  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');
  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const handleSearch = (city) => setCity(city);

  return (
    <div className="app-container">
      <Navbar
        onSearch={handleSearch}
        toggleTheme={toggleTheme}
        isDarkMode={isDarkMode}
        toggleUnit={toggleUnit}
        unit={unit}
        isLoading={isLoading}
      />

      {status === 'error' && (
        <div className="error-container glass-card shake">
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button onClick={retry} className="retry-btn">Try Again</button>
        </div>
      )}

      {/* Show Skeletons only if we have NO previous data and are loading */}
      {status === 'loading' && !weather && (
        <div className="main-dashboard">
          <div className="left-panel">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <SkeletonLoader type="title" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SkeletonLoader type="icon" />
                <SkeletonLoader type="temp" />
              </div>
              <SkeletonLoader type="text" />
            </div>
            <div className="highlights-wrapper" style={{ marginTop: '2rem' }}>
              <SkeletonLoader type="text" />
              <div className="highlights-grid">
                <SkeletonLoader type="card" style={{ minHeight: '140px' }} />
                <SkeletonLoader type="card" style={{ minHeight: '140px' }} />
                <SkeletonLoader type="card" style={{ minHeight: '140px' }} />
                <SkeletonLoader type="card" style={{ minHeight: '140px' }} />
              </div>
            </div>
            {/* Trend Chart Skeleton */}
            <div className="glass-card" style={{ marginTop: '2rem', height: '200px', padding: '1.5rem' }}>
              <SkeletonLoader type="title" />
              <SkeletonLoader type="text" style={{ height: '100%', marginTop: '1rem' }} />
            </div>
          </div>
          <div className="right-panel">
            <div className="glass-card" style={{ padding: '1.5rem', height: '100%' }}>
              <SkeletonLoader type="title" />
              {Array(5).fill(0).map((_, i) => (
                <SkeletonLoader key={i} type="text" style={{ height: '50px', marginBottom: '1rem' }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Render Content (keep showing if loading new data) */}
      {weather && (
        <div className="main-dashboard" style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s' }}>
          <div className="left-panel">
            <CurrentWeather data={weather} unit={unit} />
            <Highlights data={weather} />
            <TrendChart data={weather.hourly} />
          </div>
          <div className="right-panel">
            <Forecast data={forecast} unit={unit} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
