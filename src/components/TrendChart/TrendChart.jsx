import { useRef, useEffect, useState } from 'react';
import './TrendChart.css';

const TrendChart = ({ data }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const svgRef = useRef(null);

    if (!data || data.length === 0) return null;

    // Dimensions
    const width = 800;
    const height = 200;
    const padding = 20;

    // Scales
    const temps = data.map(d => d.temp);
    const minTemp = Math.min(...temps) - 2;
    const maxTemp = Math.max(...temps) + 2;

    const getX = (index) => (index / (data.length - 1)) * (width - 2 * padding) + padding;
    const getY = (temp) => height - padding - ((temp - minTemp) / (maxTemp - minTemp)) * (height - 2 * padding);

    // Generate Path
    const points = data.map((d, i) => `${getX(i)},${getY(d.temp)}`).join(' ');

    // Area Path (for gradient fill)
    const areaPoints = `
        ${getX(0)},${height} 
        ${points} 
        ${getX(data.length - 1)},${height}
    `;

    return (
        <div className="trend-chart-container glass-card">
            <h3>24-Hour Trend</h3>
            <div className="chart-wrapper">
                <svg viewBox={`0 0 ${width} ${height}`} className="trend-svg">
                    <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--chart-color)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--chart-color)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Fill Area */}
                    <polygon points={areaPoints} fill="url(#tempGradient)" />

                    {/* Line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="var(--chart-color)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data Points (Interactive) */}
                    {data.map((d, i) => (
                        <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(d.temp)}
                            r="5"
                            className="data-point"
                            onMouseEnter={() => setHoveredPoint({ ...d, x: getX(i), y: getY(d.temp) })}
                            onMouseLeave={() => setHoveredPoint(null)}
                        />
                    ))}

                    {/* Tooltip Overlay (SVG Based) */}
                    {hoveredPoint && (
                        <g>
                            <rect
                                x={hoveredPoint.x - 40}
                                y={hoveredPoint.y - 40}
                                width="80"
                                height="30"
                                rx="5"
                                fill="var(--glass-bg)"
                                stroke="var(--glass-border)"
                            />
                            <text
                                x={hoveredPoint.x}
                                y={hoveredPoint.y - 20}
                                textAnchor="middle"
                                fill="var(--text-main)"
                                fontSize="14"
                                fontWeight="bold"
                            >
                                {hoveredPoint.temp}° ({hoveredPoint.time})
                            </text>
                        </g>
                    )}
                </svg>

                {/* X-Axis Labels (every 4th item) */}
                <div className="chart-labels">
                    {data.map((d, i) => i % 4 === 0 && (
                        <span key={i} style={{ left: `${(i / (data.length - 1)) * 100}%` }}>
                            {d.time}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrendChart;
