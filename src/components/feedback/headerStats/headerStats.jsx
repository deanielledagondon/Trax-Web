import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './headerStats.scss';
import { useNavigate } from 'react-router-dom';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="customTooltip">
        {payload.map((entry, index) => (
          <div key={index}>
            {entry.name} stars: {entry.value}%
          </div>
        ))}
      </div>
    );
  }
  return null;
};

  const HeaderStats = ({ month, overall, responses, ratingBreakdown }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

  // Close the dropdown if a click occurs outside of it
  useEffect(() => {
    const closeDropdown = (e) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [isDropdownOpen]);


  const handleWindowSelection = (window) => {
    navigate(`/window${window}`);
    setIsDropdownOpen(false);
  };

  const data = useMemo(
    () =>
      ratingBreakdown.breakdown.map((segment) => ({
        name: `${segment.stars}`,
        value: segment.percentage,
        count: segment.count,
      })),
    [ratingBreakdown]
  );

  const starColors = {
    1: '#f8696b',
    2: '#ffa65a',
    3: '#ffcd56',
    4: '#9edd72',
    5: '#67b168',
  };

  return (
    <div>
      <div className="header-top">
        <h2 className="title">Feedback</h2>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="dropdownButton" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
           Select Window
          </button>
          {isDropdownOpen && (
            <div className="dropdownMenu">
              {[1, 2, 3, 4, 5, 6].map((window) => (
                <button key={window} onClick={() => handleWindowSelection(window)}>
                  Window {window}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="header-stats-wrapper">
        <div className="header-stat-area-card">
          <div className="header-stats-container">
            <div className="colored-card-grid">
              <div className="header-stat-card red">
                <div className="header-stat-body">
                  <div className="header-stat-title">{month}</div>
                  <div className="header-stat-text">This Month</div>
                </div>
              </div>
              <div className="header-stat-card orange">
                <div className="header-stat-body">
                  <div className="header-stat-title">{overall}%</div>
                  <div className="header-stat-text">Overall Rating</div>
                </div>
              </div>
              <div className="header-stat-card blue">
                <div className="header-stat-body">
                  <div className="header-stat-title">{responses}</div>
                  <div className="header-stat-text">Total Feedback Responses</div>
                </div>
              </div>
            </div>
            <div className="header-breakdown-card rating-breakdown">
              <div className="header-stat-body">
                <div className="header-stat-title">Monthly Rating Breakdown</div>
                <div className="rating-average">{ratingBreakdown.average}% Average Rating</div>
                <div className="rating-chart-details">
                  <ResponsiveContainer width="50%" height={370}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={145}
                        fill="#8884d8"
                       // labelLine={false}
                       // label={({ name, value }) => `${value}%`}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={starColors[entry.name.split(' ')[0]]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="rating-details">
                    {ratingBreakdown.breakdown.map((segment, index) => (
                      <div key={index} className="rating-detail">
                        <span className="rating-number">{segment.stars}</span>
                        <div
                          className="rating-box"
                          style={{ backgroundColor: starColors[segment.stars] }}
                        ></div>
                        <span className="rating-percentage">{segment.percentage}%</span>
                        <span className="rating-count">{segment.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeaderStats.propTypes = {
  month: PropTypes.string.isRequired,
  overall: PropTypes.number.isRequired,
  responses: PropTypes.number.isRequired,
  ratingBreakdown: PropTypes.shape({
    average: PropTypes.number.isRequired,
    breakdown: PropTypes.arrayOf(
      PropTypes.shape({
        stars: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default HeaderStats;