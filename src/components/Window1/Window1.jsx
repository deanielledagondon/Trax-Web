import React, { useState } from 'react';
import HeaderStatss from '../window11/headerStatss';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window1 = () => {

  const ratingBreakdown = {
    average: 63.76,
    breakdown: [
      { stars: 1, percentage: 9.16, color: 'red' },
      { stars: 2, percentage: 5.20, color: 'orange' },
      { stars: 3, percentage: 23.5, color: 'yellow' },
      { stars: 4, percentage: 15.53, color: 'light-green' },
      { stars: 5, percentage: 45.85, color: 'green' }
    ]
  };
  const ratingData = [
    { month: 'January', '5 stars': 25, '4 stars': 16, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'February', '5 stars': 30, '4 stars': 10, '3 stars': 5, '2 stars': 3, '1 star': 2 },
    { month: 'March', '5 stars': 20, '4 stars': 18, '3 stars': 6, '2 stars': 7, '1 star': 1 },
    { month: 'April', '5 stars': 29, '4 stars': 14, '3 stars': 8, '2 stars': 3, '1 star': 2 },
    { month: 'May', '5 stars': 25, '4 stars': 16, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'June', '5 stars': 30, '4 stars': 10, '3 stars': 5, '2 stars': 9, '1 star': 2 },
    { month: 'July', '5 stars': 25, '4 stars': 18, '3 stars': 8, '2 stars': 4, '1 star': 1 },
    { month: 'August', '5 stars': 28, '4 stars': 24, '3 stars': 8, '2 stars': 3, '1 star': 2 },
    { month: 'September', '5 stars': 25, '4 stars': 15, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'October', '5 stars': 23, '4 stars': 18, '3 stars': 5, '2 stars': 7, '1 star': 2 },
    { month: 'November', '5 stars': 20, '4 stars': 18, '3 stars': 6, '2 stars': 4, '1 star': 1 },
    { month: 'December', '5 stars': 30, '4 stars': 24, '3 stars': 5, '2 stars': 3, '1 star': 2 }
  ];
  const reviews = {
    overall: 99.6,
    breakdown: {
      'Easy Access': 93.48,
      'Reliable': 92.76,
      'Responsive': 94.46,
      'Ease of Use': 80.56,
      'User-Friendly': 98.42
    }
  };
  const comments = [
    { rating: 4, text: 'The kiosk is quick to process transactions, saving me a lot of time.' },
    { rating: 5, text: 'The graphics and animations are visually appealing.' },
    { rating: 4, text: 'I like how the system handles transactions securely.' },
    { rating: 4, text: 'I like that the kiosk offers a feedback option right after the service.' },
    { rating: 5, text: 'The queue management feature is very efficient and organized.' },
    { rating: 4, text: 'I like how the system handles transactions securely.' },
    { rating: 5, text: 'The touchscreen is very responsive,.' }
  ];
  const windowsData = [
    {
      windowName: "Window 1",
      data: ratingData
    },

  ];
  const monthStats = { month: 256, overall: 4.2, responses: '1,254', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData };

  return (
    <div className="container mt-5">
      <HeaderStatss {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      <WindowRatingChart windowsData={windowsData} />
    </div>
  );
};

export default Window1;

