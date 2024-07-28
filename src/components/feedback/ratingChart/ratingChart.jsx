import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ratingChart.scss';

const RatingChart = ({ data }) => (
    <div className="rating-chart-card">
        <div className="rating-chart-body">
            <h2 className="rating-chart-title">Ratings Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    layout="horizontal"
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis type="number" />
                    <XAxis dataKey="month" type="category" />
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

RatingChart.propTypes = {
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
    title: PropTypes.string.isRequired,
};

export default RatingChart;
