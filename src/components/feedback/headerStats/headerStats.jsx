import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './headerStats.scss';

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

const HeaderStats = ({ month, overall, responses, ratingBreakdown }) => {
    const data = [
        ratingBreakdown.breakdown.reduce((acc, segment) => {
            acc[segment.stars] = segment.percentage;
            return acc;
        }, { name: 'Percentage' })
    ];

    const starColors = {
        1: '#f8696b',
        2: '#ffa65a',
        3: '#ffcd56',
        4: '#9edd72',
        5: '#67b168'
    };

    return (
        <div className='header-stat-area-card'>
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
                    <div className="header-stat-card blue span-two">
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
                        <ResponsiveContainer width="100%" height={100}>
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis type="category" dataKey="name" tick={false} axisLine={false} hide={true} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="1" stackId="a" fill={starColors[1]} />
                                <Bar dataKey="2" stackId="a" fill={starColors[2]} />
                                <Bar dataKey="3" stackId="a" fill={starColors[3]} />
                                <Bar dataKey="4" stackId="a" fill={starColors[4]} />
                                <Bar dataKey="5" stackId="a" fill={starColors[5]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="rating-details">
                            {ratingBreakdown.breakdown.map((segment, index) => (
                                <div key={index} className="rating-detail">
                                    <span className="rating-star">
                                        {segment.stars} <FontAwesomeIcon icon={faStar} style={{ color: starColors[segment.stars] }} />
                                    </span>
                                    <span className="rating-percentage">{segment.percentage}%</span>
                                    <span className="rating-count">{segment.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// PropTypes definitions
HeaderStats.propTypes = {
    month: PropTypes.number.isRequired,
    overall: PropTypes.number.isRequired,
    responses: PropTypes.number.isRequired,
    ratingBreakdown: PropTypes.shape({
        average: PropTypes.number.isRequired,
        breakdown: PropTypes.arrayOf(
            PropTypes.shape({
                stars: PropTypes.number.isRequired,
                percentage: PropTypes.number.isRequired,
                color: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired
            })
        ).isRequired
    }).isRequired
};

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.number
    }))
};

CustomTooltip.defaultProps = {
    active: false,
    payload: []
};

export default HeaderStats;
