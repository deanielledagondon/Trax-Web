import React, { useState } from 'react';
import HeaderStats3 from '../window33/headerStats3';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
//import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window3 = () => {

  const ratingBreakdown = {
    average: 76.87,
    breakdown: [
      { stars: 1, percentage: 7.54, color: 'red' },
      { stars: 2, percentage: 23.65, color: 'orange' },
      { stars: 3, percentage: 18.6, color: 'yellow' },
      { stars: 4, percentage: 73.6, color: 'light-green' },
      { stars: 5, percentage: 65.87, color: 'green' }
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
    overall: 95.89,
    breakdown: {
      'Easy Access': 96.89,
      'Reliable': 99.99,
      'Responsive': 93.67,
      'Ease of Use': 90.65,
      'User-Friendly': 93.76
    }
  };
  const comments = [
    { rating: 5, text: 'The QR code system is a fantastic upgrade from the traditional book logging method.' },
    { rating: 5, text: 'Im impressed with how the new system reduces errors in data entry' },
    { rating: 5, text: 'The technology upgrade has significantly streamlined our logging processes.' },
    { rating: 5, text: 'I appreciate the improved accuracy in our records since implementing the QR code system.' },
    { rating: 4, text: 'This new system has made administrative tasks much more efficient.' },
    { rating: 5, text: 'The QR code scanning is quick and easy to use.' }
  ];
  const windowsData = [
    {
      windowName: "Window 3",
      data: ratingData
    },

  ];
  const monthStats = { month: 756, overall: 2.2, responses: '6,473', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData };
  return (
    <div className="container mt-5">
      <HeaderStats3 {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
   
    </div>
  );
};

export default Window3;

