import React, { useState } from 'react';
import HeaderStats4 from '../window44/headerStats4';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window4 = () => {
  const ratingBreakdown = {
    average: 56.76,
    breakdown: [
      { stars: 1, percentage: 6.77, color: 'red' },
      { stars: 2, percentage: 14.64, color: 'orange' },
      { stars: 3, percentage: 45.83, color: 'yellow' },
      { stars: 4, percentage: 98.65, color: 'light-green' },
      { stars: 5, percentage: 65.74, color: 'green' }
    ]
  };
  const ratingData = [
    { month: 'January', '5 stars': 25, '4 stars': 15, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'February', '5 stars': 30, '4 stars': 10, '3 stars': 5, '2 stars': 3, '1 star': 2 },
    { month: 'March', '5 stars': 20, '4 stars': 18, '3 stars': 7, '2 stars': 4, '1 star': 1 },
    { month: 'April', '5 stars': 28, '4 stars': 14, '3 stars': 8, '2 stars': 3, '1 star': 2 },
    { month: 'May', '5 stars': 25, '4 stars': 15, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'June', '5 stars': 30, '4 stars': 10, '3 stars': 5, '2 stars': 3, '1 star': 2 },
    { month: 'July', '5 stars': 20, '4 stars': 18, '3 stars': 7, '2 stars': 4, '1 star': 1 },
    { month: 'August', '5 stars': 28, '4 stars': 14, '3 stars': 8, '2 stars': 3, '1 star': 2 },
    { month: 'September', '5 stars': 25, '4 stars': 15, '3 stars': 5, '2 stars': 2, '1 star': 1 },
    { month: 'October', '5 stars': 30, '4 stars': 10, '3 stars': 5, '2 stars': 3, '1 star': 2 },
    { month: 'November', '5 stars': 20, '4 stars': 18, '3 stars': 7, '2 stars': 4, '1 star': 1 },
    { month: 'December', '5 stars': 28, '4 stars': 14, '3 stars': 8, '2 stars': 3, '1 star': 2 }
  ];
  const reviews = {
    overall: 88.90,
    breakdown: {
      'Easy Access': 90.87,
      'Reliable': 93.76,
      'Responsive': 94.87,
      'Ease of Use': 90.89,
      'User-Friendly': 97.67
    }
  };
  const comments = [
    { rating: 5, text: 'I love how the new system has reduced the manual workload for staff.' },
    { rating: 5, text: 'The user experience is much better with the QR code kiosks.' },
    { rating: 4, text: 'The transition to electronic logging has been smooth and beneficial.' },
    { rating: 5, text: 'The kiosk system has improved our overall service quality.' },
    { rating: 5, text: 'The QR code scanning system is very user-friendly and intuitive.' },
    { rating: 4, text: 'The QR code kiosks have reduced our wait times significantly.' }
  ];
  const windowsData = [
    {
      windowName: "Window 4",
      data: ratingData
    },

  ];
  const monthStats = { month: 574, overall: 7.6, responses: '8,746', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData };

  return (
    <div className="container mt-5">
      <HeaderStats4 {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      <WindowRatingChart windowsData={windowsData} />
    </div>
  );
};

export default Window4;

