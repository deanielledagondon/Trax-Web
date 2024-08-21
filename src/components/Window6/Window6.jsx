import React, { useState } from 'react';
import HeaderStats6 from '../window66/headerStats6';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window6 = () => {
  const ratingBreakdown = {
    average: 67.49,
    breakdown: [
      { stars: 1, percentage: 30.5, color: 'red' },
      { stars: 2, percentage: 43.6, color: 'orange' },
      { stars: 3, percentage: 89.5, color: 'yellow' },
      { stars: 4, percentage: 78.6, color: 'light-green' },
      { stars: 5, percentage: 98.5, color: 'green' }
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
    overall: 99.99,
    breakdown: {
      'Easy Access': 90.87,
      'Reliable': 96.87,
      'Responsive': 94.76,
      'Ease of Use': 93.87,
      'User-Friendly': 92.67
    }
  };
  const comments = [
    { rating: 5, text: 'The systems interface is clear and easy to navigate.' },
    { rating: 5, text: 'The QR code scanning process is efficient and hassle-free.' },
    { rating: 5, text: 'The systems performance has exceeded my expectations.' },
    { rating: 5, text: 'The QR code kiosks have made logging activities more straightforward.' },
    { rating: 5, text: 'The implementation of this technology has greatly benefited our institution.' },
    { rating: 5, text: 'Using the kiosk has made my experience much quicker and hassle-free.' }
  ];
  const windowsData = [
    {
      windowName: "Window 6",
      data: ratingData
    },

  ];
  const monthStats = { month: 765, overall: 5.6, responses: '9,675', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData };

  return (
    <div className="container mt-5">
      <HeaderStats6 {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      <WindowRatingChart windowsData={windowsData} />
    </div>
  );
};

export default Window6;

