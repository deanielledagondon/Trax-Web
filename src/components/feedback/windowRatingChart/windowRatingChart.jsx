import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './windowRatingChart.scss';

const WindowRatingChart = ({ windowsData }) => {
    const [selectedWindow, setSelectedWindow] = useState(windowsData[0]);

    // Handle the change event for the dropdown menu
    const handleWindowChange = (event) => {
        const selectedWindowData = windowsData.find(window => window.windowName === event.target.value);
        setSelectedWindow(selectedWindowData);
    };

    return (
        <div className="window-rating-chart-card">
            <div className="window-rating-chart-header">
                <div className="window-rating-chart-title">Ratings Per Window</div>
                {/* Dropdown menu positioned on the right side */}
                <select onChange={handleWindowChange} className="window-select">
                    {windowsData.map((window, index) => (
                        <option key={index} value={window.windowName}>
                            {window.windowName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={1000}>
                    <BarChart
                        layout="vertical"
                        data={selectedWindow.data}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="month" type="category" tick={{ fontSize: 15 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="5 stars" fill="#8884d8" />
                        <Bar dataKey="4 stars" fill="#82ca9d" />
                        <Bar dataKey="3 stars" fill="#ffc658" />
                        <Bar dataKey="2 stars" fill="#ff8042" />
                        <Bar dataKey="1 star" fill="#d0ed57" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

WindowRatingChart.propTypes = {
    windowsData: PropTypes.arrayOf(
        PropTypes.shape({
            windowName: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    month: PropTypes.string.isRequired,
                    '5 stars': PropTypes.number.isRequired,
                    '4 stars': PropTypes.number.isRequired,
                    '3 stars': PropTypes.number.isRequired,
                    '2 stars': PropTypes.number.isRequired,
                    '1 star': PropTypes.number.isRequired,
                }).isRequired
            ).isRequired,
        }).isRequired
    ).isRequired,
};

export default WindowRatingChart;
