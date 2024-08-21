import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './headerStats2.scss';
import { useNavigate } from 'react-router-dom';
import { windowPrintSelection } from '../helper/pdfPrinter'
import window2Proptypes from '../helper/headerPropTypes.js'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
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

const HeaderStats = ({
  month,
  overall,
  responses,
  ratingBreakdown,
  comments,
  reviews,
  ratingsOverTime,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const printDropdownRef = useRef(null);


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
    <div className="header-stats">
      <div className="header-top">
        <div className="header-stats-content"> </div>
        <h2 className="area-top-title">Window 2 | Feedback</h2>
        <div className="button-container"> <div className="dropdown-container" ref={dropdownRef}>
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
          <div className="print-container" ref={printDropdownRef}>
            <button className="print-button" onClick={() => windowPrintSelection('PDF', {
              month,
              overall,
              responses,
              ratingBreakdown,
              comments,
              reviews,
              ratingsOverTime,
              windowName: 'Window 2'
            })}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print
            </button>
          </div></div>

      </div>
      <div className="header-stats-content">
        <div className="stats-summary">
          <div className="stat-card red">
            <div className="stat-title">This Month</div>
            <div className="stat-value">{month}</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-title">Overall Rating</div>
            <div className="stat-value">{overall}%</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-title">Total Feedback Responses</div>
            <div className="stat-value">{responses}</div>
          </div>
        </div>

        <div className="headerBreakdownCard ratingBreakdown">

          <div className="headerTitle">Monthly Rating Breakdown</div>
          <div className="ratingAverage">{ratingBreakdown.average}% Average Rating</div>
          <div className="ratingChartDetails">

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"

                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={starColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="ratingDetails">
              {ratingBreakdown.breakdown.map((segment, index) => (
                <div key={index} className="ratingdetail">
                  <span className="ratingNumber">{segment.stars}</span>
                  <div
                    className="ratingBox"
                    style={{ backgroundColor: starColors[segment.stars] }}
                  ></div>
                  <span className="ratingPercentage">{segment.percentage}%</span>
                  <span className="ratingCount">{segment.count}</span>
                </div>




              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HeaderStats.propTypes = window2Proptypes
export default HeaderStats;