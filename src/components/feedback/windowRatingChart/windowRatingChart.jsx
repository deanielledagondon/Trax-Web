import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './windowRatingChart.scss';

const MonthSelectionModal = ({ isOpen, onClose, months, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="month-modal-overlay">
      <div className="month-modal">
        <h2>Select Month</h2>
        <div className="month-options">
          {months.map((month, index) => (
            <button key={index} onClick={() => onSelect(month)}>
              {month}
            </button>
          ))}
        </div>
        <button className="close-modal" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const WindowRatingChart = ({ windowsData }) => {
    const [selectedWindow, setSelectedWindow] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);

    const handleWindowChange = (event) => {
        const selectedWindowData = windowsData.find(window => window.windowName === event.target.value);
        setSelectedWindow(selectedWindowData);
        setSelectedMonth('');
        setIsMonthModalOpen(true);
    };

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        setIsMonthModalOpen(false);
    };

    const filteredData = selectedWindow ? selectedWindow.data.filter(entry => entry.month === selectedMonth) : [];

    return (
        <div className="window-rating-chart-card">
            <div className="window-rating-chart-header">
                <div className="window-rating-chart-title">Ratings Per Window</div>
                <select onChange={handleWindowChange} className="window-select" defaultValue="">
                    <option value="" disabled>Choose Window</option>
                    {windowsData.map((window, index) => (
                        <option key={index} value={window.windowName}>
                            {window.windowName}
                        </option>
                    ))}
                </select>
            </div>

            <MonthSelectionModal
                isOpen={isMonthModalOpen}
                onClose={() => setIsMonthModalOpen(false)}
                months={selectedWindow ? selectedWindow.data.map(entry => entry.month) : []}
                onSelect={handleMonthChange}
            />

            {selectedMonth && (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            layout="vertical"
                            data={filteredData}
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
            )}
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