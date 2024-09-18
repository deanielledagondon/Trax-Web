import React, { useState } from 'react';
import HeaderStats5 from '../window55/headerStats5';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
//import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window5 = () => {
  const ratingBreakdown = {
    average: 45.41,
    breakdown: [
      { stars: 1, percentage: 5.65, color: 'red' },
      { stars: 2, percentage: 17.6, color: 'orange' },
      { stars: 3, percentage: 90.5, color: 'yellow' },
      { stars: 4, percentage: 20.6, color: 'light-green' },
      { stars: 5, percentage: 43.57, color: 'green' }
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
    overall: 86.99,
    breakdown: {
      'Easy Access': 90.76,
      'Reliable': 95.75,
      'Responsive': 93.85,
      'Ease of Use': 95.83,
      'User-Friendly': 99.99
    }
  };
  const comments = [
    { rating: 4, text: 'The ease of use of the new system is a big plus for both students and staff' },
    { rating: 5, text: 'I feel more confident in the data accuracy with the electronic logging system.' },
    { rating: 5, text: 'Its great to see the institution keeping up with technological advancements.' },
    { rating: 5, text: 'Im very satisfied with the improved efficiency in our processes.' },
    { rating: 5, text: 'The QR code technology is versatile and works flawlessly.' },
    { rating: 5, text: 'The kiosk system is a great example of how technology can improve administrative functions' }
  ];
  const windowsData = [
    {
      windowName: "Window 5",
      data: ratingData
    },

  ];
  const monthStats = { month: 675, overall: 9.7, responses: '6,675', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData };

  return (
    <div className="container mt-5">
      <HeaderStats5 {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      
    </div>
  );
};

export default Window5;

