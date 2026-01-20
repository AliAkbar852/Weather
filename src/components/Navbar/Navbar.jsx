import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './Navbar.css';

const Navbar = ({ onSearch, toggleTheme, isDarkMode, toggleUnit, unit, isLoading }) => {
    const [input, setInput] = useState('');
    const debouncedInput = useDebounce(input, 1000); // 1s debounce for auto-search
    const inputRef = useRef(null);

    // Autofocus on mount
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // Auto-search on debounce
    useEffect(() => {
        if (debouncedInput && debouncedInput.trim().length > 2) {
            onSearch(debouncedInput);
        }
    }, [debouncedInput, onSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input);
            // Don't clear input, let user see what they searched
        } else {
            inputRef.current.focus();
        }
    };

    return (
        <nav className="navbar glass-card">
            <div className="brand">
                <h2>WeatherNow</h2>
            </div>

            <form onSubmit={handleSubmit} className="search-form">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search city..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    aria-label="Search"
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.5 : 1 }}
                >
                    {isLoading ? '⏳' : '🔍'}
                </button>
            </form>

            <div className="controls">
                <button
                    className="toggle-btn"
                    onClick={toggleUnit}
                    title="Toggle Unit"
                >
                    °{unit === 'C' ? 'F' : 'C'}
                </button>
                <button
                    className="toggle-btn"
                    onClick={toggleTheme}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    aria-label={`Current theme is ${isDarkMode ? 'Dark' : 'Light'}. Click to switch.`}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
