import React, { useEffect, useState } from 'react';
import HeaderStatss from '../window11/headerStatss';
import RatingChart from '../feedback/ratingChart/ratingChart';
import ReviewSummary from '../feedback/reviewSummary/reviewSummary';
import CommentsList from '../feedback/commentsList/commentsList';
import { getTopReviews } from '../utils/feedBackAnalytics/feedBackAnalyticsUtil';
import { supabase } from '../helper/supabaseClient';
//import WindowRatingChart from '../feedback/windowRatingChart/windowRatingChart';

const Window1 = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*').eq('window_no', "W1");

      if (error) {
        console.error('Error fetching feedback data:', error);
      } else {
        setFeedbackData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Calculate Month Stats and Rating Breakdown with Strict Typing
  const calculateMonthStats = (feedbackData) => {
    const totalFeedbacks = feedbackData.length;
    const totalRatings = feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0);
    const overall = (totalRatings / totalFeedbacks).toFixed(2);

    // Strict structure for ratingBreakdown
    const breakdown = [1, 2, 3, 4, 5].map(star => {
      const starCount = feedbackData.filter(fb => Math.floor(fb.rating) === star).length;
      return {
        stars: star,
        percentage: parseFloat(((starCount / totalFeedbacks) * 100).toFixed(2)),
        color: star === 5 ? 'green' : star === 4 ? 'light-green' : star === 3 ? 'yellow' : star === 2 ? 'orange' : 'red'
      };
    });

    return {
      month: totalFeedbacks, // Number of feedbacks in the current month
      overall: parseFloat(overall), // Average rating
      responses: totalFeedbacks.toString(), // Total number of responses as a string
      ratingBreakdown: {
        average: parseFloat((totalRatings / totalFeedbacks).toFixed(2)), // Strict: Match the mock data
        breakdown
      }
    };
  };

  // Aggregate feedback data by month with strict structure
  const aggregateByMonth = (feedbackData) => {
    const months = feedbackData.reduce((acc, feedback) => {
      const month = new Date(feedback.feedback_date).toLocaleString('default', { month: 'long' });
      if (!acc[month]) acc[month] = { '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 };
      const star = Math.floor(feedback.rating);
      acc[month][`${star} star${star > 1 ? 's' : ''}`]++;
      return acc;
    }, {});

    return Object.entries(months).map(([month, stars]) => ({
      month,
      '5 stars': stars['5 stars'],
      '4 stars': stars['4 stars'],
      '3 stars': stars['3 stars'],
      '2 stars': stars['2 stars'],
      '1 star': stars['1 star']
    }));
  };


  // Extract comments with strict typing
  const extractComments = (feedbackData) => {
    return feedbackData.map(fb => ({
      rating: Math.floor(fb.rating),
      text: fb.comment
    }));
  };

  // Group feedback data by window number with strict typing
  const groupByWindow = (feedbackData) => {
    const windows = feedbackData.reduce((acc, feedback) => {
      const window = feedback.window_no;
      if (!acc[window]) acc[window] = [];
      acc[window].push(feedback);
      return acc;
    }, {});

    return Object.entries(windows).map(([windowName, data]) => ({
      windowName,
      data: aggregateByMonth(data) // Month breakdown for each window
    }));
  };

  const topReviews = getTopReviews(feedbackData)
  const reviews = {
    overall: 89.5,
    breakdown: topReviews.reduce((acc, { review, percentage }) => {
      acc[review] = percentage;
      return acc;
    }, {}),
  };

  // Transform feedback data into the necessary structures
  const monthStats = calculateMonthStats(feedbackData);
  const comments = extractComments(feedbackData);
  const ratingsOverTime = aggregateByMonth(feedbackData);



  return (
    <div className="container mt-5">
      <HeaderStatss {...monthStats} comments={comments} reviews={reviews} ratingsOverTime={ratingsOverTime} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingsOverTime} />

    </div>
  );
};

export default Window1;

