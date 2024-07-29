import React, { useState } from 'react';
import HeaderStats2 from '../window22/headerStats2';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window2 = () => {
  const monthStats = { month: 576, overall: 8.2, responses: '5,294' };
  const ratingBreakdown = {
    average: 73.87,
    breakdown: [
      { stars: 1, percentage: 10.16, color: 'red' },
      { stars: 2, percentage: 17.20, color: 'orange' },
      { stars: 3, percentage: 50.3, color: 'yellow' },
      { stars: 4, percentage: 26.50, color: 'light-green' },
      { stars: 5, percentage: 35.80, color: 'green' }
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
    overall: 92.3,
    breakdown: {
      'Easy Access': 88.43,
      'Reliable': 90.72,
      'Responsive': 91.65,
      'Ease of Use': 87.45,
      'User-Friendly': 99.99
    }
  };
  const comments = [
    { rating: 5, text: 'The interface is simple yet comprehensive.' },
    { rating: 5, text: 'Its nice that the system can handle a high volume of users without slowing down.' },
    { rating: 4, text: 'I love how the system provides real-time updates on queue status' },
    { rating: 5, text: 'The system is very accessible and user-friendly for people of all ages.' },
    { rating: 5, text: 'The user experience is consistently positive each time I use the kiosk.' },
    { rating: 5, text: 'Using the kiosk has made my experience much quicker and hassle-free.' }
  ];
  const windowsData = [
    {
      windowName: "Window 2",
      data: ratingData
    },

  ];

  return (
    <div className="container mt-5">
      <HeaderStats2 {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      <WindowRatingChart windowsData={windowsData} />
    </div>
  );
};

export default Window2;

