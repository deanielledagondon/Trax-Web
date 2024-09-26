import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/helper/supabaseClient';
import HeaderStats from '../../components/feedback/headerStats/headerStats';
import RatingChart from '../../components/feedback/ratingChart/ratingChart';
import ReviewSummary from '../../components/feedback/reviewSummary/reviewSummary';
import CommentsList from '../../components/feedback/commentsList/commentsList';
import { calculateMonthStats, aggregateByMonth, extractComments, groupByWindow, getTopReviews } from '../../../components/utils/feedBackAnalytics/feedBackAnalyticsUtil';

const Feedback = () => {
  const [staffName, setStaffName] = useState('');
  const [windowNo, setWindowNo] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);

  const emailToWindowMap = {
    "rizza@gmail.com": "W1",
    "sadicon@gmail.com": "W2",
    "reponte@gmail.com": "W3",
    "falle@gmail.com": "W4",
    "carel@gmail.com": ["W5", "W6"],
  };

  useEffect(() => {
    async function fetchStaffData() {
      const { data: userSession, error: sessionError } = await supabase.auth.getSession();

      const userEmail = userSession?.session?.user?.email;
      console.log('user', await supabase.auth.getSession())
      const windowNo = emailToWindowMap[userEmail];
      setWindowNo(Array.isArray(windowNo) ? windowNo : [windowNo]);
    }

    console.log(windowNo)
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .in('window_no', windowNo);

      if (error) {
        console.error('Error fetching feedback data:', error);
      } else {
        console.log(data);
        setFeedbackData(data);
      }
      setLoading(false);
    };

    fetchStaffData().then(fetchData);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const monthStats = calculateMonthStats(feedbackData);
  const comments = extractComments(feedbackData);
  const ratingsOverTime = aggregateByMonth(feedbackData);
  const topReviews = getTopReviews(feedbackData);
  const reviews = {
    overall: 89.5,
    breakdown: topReviews.reduce((acc, { review, percentage }) => {
      acc[review] = percentage;
      return acc;
    }, {}),
  };

  return (
    <div className="container mt-5">
      <HeaderStats
        {...monthStats}
        reviews={reviews}
        staffName={staffName}
        comments={comments}
        ratingsOverTime={ratingsOverTime}
        windowNo={windowNo}
      />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingsOverTime} />
    </div>
  );
};

export default Feedback;
