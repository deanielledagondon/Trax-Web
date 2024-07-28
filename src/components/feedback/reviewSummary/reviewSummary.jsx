import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './reviewSummary.scss';

const ReviewSummary = ({ reviews }) => {
    const breakdownData = Object.entries(reviews.breakdown).map(([category, percentage]) => ({
        category,
        percentage,
    }));

    return (
        <div className="review-summary-container">
            <h3 className="review-summary-title">Average User Comments Ratings</h3>
            <div className="review-summary-body">
                <div className="review-summary-left">
                    <div className="overall-rating">
                        <h3 className="overall-comments-breakdown">Overall Comments Breakdown</h3>
                        <div className="overall-rating-percentage">{reviews.overall}%</div>
                        <div className="overall-rating-text">Overall</div>
                    </div>
                </div>
                <div className="review-summary-right">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            layout="vertical"
                            data={breakdownData}
                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="category" type="category" tick={{ fontSize: 15, width: 150 }} />
                            <Tooltip />
                            <Bar dataKey="percentage" fill="#ffc107" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

ReviewSummary.propTypes = {
    reviews: PropTypes.shape({
        overall: PropTypes.number.isRequired,
        breakdown: PropTypes.objectOf(PropTypes.number).isRequired,
    }).isRequired,
};

export default ReviewSummary;
