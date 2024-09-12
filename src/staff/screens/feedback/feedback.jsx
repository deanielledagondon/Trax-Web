import React, { useState } from 'react';
import HeaderStats from '../../components/feedback/headerStats/headerStats';
import RatingChart from '../../components/feedback/ratingChart/ratingChart';
import ReviewSummary from '../../components/feedback/reviewSummary/reviewSummary';
import CommentsList from '../../components/feedback/commentsList/commentsList';
//import WindowRatingChart from '../../components/feedback/windowRatingChart/windowRatingChart';


const Feedback = () => {

  const ratingBreakdown = {
    average: 20.41,
    breakdown: [
      { stars: 1, percentage: 8.16, color: 'red' },
      { stars: 2, percentage: 10.20, color: 'orange' },
      { stars: 3, percentage: 14.3, color: 'yellow' },
      { stars: 4, percentage: 26.53, color: 'light-green' },
      { stars: 5, percentage: 40.81, color: 'green' }
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
    overall: 89.5,
    breakdown: {
      'Easy Access': 86.48,
      'Reliable': 84.39,
      'Responsive': 94.46,
      'Ease of Use': 78.41,
      'User-Friendly': 98.42
    }
  };
  const comments = [
    { rating: 5, text: 'This kiosk system is incredibly user-friendly and intuitive!' },
    { rating: 5, text: 'The touchscreen interface is responsive and easy to navigate.' },
    { rating: 4, text: 'I love how the system provides real-time updates on queue status' },
    { rating: 5, text: 'The system is very accessible and user-friendly for people of all ages.' },
    { rating: 4, text: 'This kiosk has significantly reduced wait times and improved service efficiency.' },
    { rating: 5, text: 'Using the kiosk has made my experience much quicker and hassle-free.' },
    { rating: 5, text: 'Using the kiosk has made my experience much quicker and hassle-free.' }
  ];
  const windowsData = [
    {
      windowName: "Window 1",
      data: ratingData
    },
    {
      windowName: "Window 2",
      data: ratingData
    },
    {
      windowName: "Window 3",
      data: ratingData
    },
    {
      windowName: "Window 4",
      data: ratingData
    },
    {
      windowName: "Window 5",
      data: ratingData
    },
    {
      windowName: "Window 6",
      data: ratingData
    }
  ];
  const monthStats = { month: 256, overall: 4.2, responses: '1,254', ratingBreakdown, comments, reviews, ratingsOverTime: ratingData, ratingsPerWindow: windowsData };

  return (
    <div className="container mt-5">
      <HeaderStats {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
     
    </div>
  );
};

export default Feedback;
