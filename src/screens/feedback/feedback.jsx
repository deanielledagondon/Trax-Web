import React, { useState, useEffect } from 'react'; 
import HeaderStats from '../../components/feedback/headerStats/headerStats';
import RatingChart from '../../components/feedback/ratingChart/ratingChart';
import ReviewSummary from '../../components/feedback/reviewSummary/reviewSummary';
import CommentsList from '../../components/feedback/commentsList/commentsList';
import WindowRatingChart from '../../components/feedback/windowRatingChart/windowRatingChart';
import { supabase } from '../../components/helper/supabaseClient';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [feedbackMonthlyCount, setFeedbackMonthlyCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallRating, setOverallRating] = useState(0);
  const [windowsData, setWindowsData] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [comments, setComments] = useState([]);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    average: 0,
    breakdown: [
      { stars: 1, percentage: 0, color: 'red' },
      { stars: 2, percentage: 0, color: 'orange' },
      { stars: 3, percentage: 0, color: 'yellow' },
      { stars: 4, percentage: 0, color: 'light-green' },
      { stars: 5, percentage: 0, color: 'green' }
    ]
  });
  const [reviews, setReviews] = useState({
    overall: 0,
    breakdown: {}
  });
  
  
  


  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        let { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('feedback_date', { ascending: false });
        if (error) {
          console.log(error);
          throw error;
        }
        
        setFeedback(data);
        setFeedbackCount(data.length);
  
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
  
        const filteredFeedbacks = data.filter(feeds => {
          const feedbackDate = new Date(feeds.feedback_date);
          return feedbackDate.getMonth() === currentMonth && feedbackDate.getFullYear() === currentYear;
        });
  
        setFeedbackMonthlyCount(filteredFeedbacks.length);
  
        const totalRating = data.reduce((acc, feedback) => acc + feedback.rating, 0);
        const averageRating = data.length > 0 ? totalRating / data.length : 0;
        

        const monthlyRatings = Array(12).fill(null).map(() => ({
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0
        }));

          // Initialize objects to hold data for each window
          const windows = {
            '1': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 })),
            '2': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 })),
            '3': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 })),
            '4': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 })),
            '5': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 })),
            '6': Array(12).fill(null).map(() => ({ '5 stars': 0, '4 stars': 0, '3 stars': 0, '2 stars': 0, '1 star': 0 }))
          };
        
        
  
        let totalRatings = 0;
        let sumOfRatings = 0;
        const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        const reviewCounts = {
          'Easy Access': 0,
          'Reliable': 0,
          'Responsive': 0,
          'Ease of Use': 0,
          'User-Friendly': 0
        };
  
        data.forEach(feedback => {
          const logDate = new Date(feedback.feedback_date);
          const month = logDate.getMonth(); 
          const rating = feedback.rating;
          const review = feedback.reviews;
          let windowNoNumber;
          
          switch(feedback.window_no) {
            case "W1":
              windowNoNumber = 1;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            case "W2":
              windowNoNumber = 2;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            case "W3":
              windowNoNumber = 3;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            case "W4":
              windowNoNumber = 4;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            case "W5":
              windowNoNumber = 5;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            case "W6":
              windowNoNumber = 6;
              windows[windowNoNumber][month][`${rating} stars`] += 1;
              break;
            default:
              windowNoNumber = 0; 
          }
      
  
          if (rating >= 1 && rating <= 5) {
            monthlyRatings[month][rating] += 1;
            starCounts[rating] += 1;
            totalRatings += 1;
            sumOfRatings += rating;
          }

          if (review && reviewCounts[review] !== undefined) {
            reviewCounts[review] += 1;
          }
        });
        

      const roundTo = (value, decimalPlaces) => {
        const factor = 10 ** decimalPlaces;
        return Math.round(value * factor + Number.EPSILON) / factor;
      };
      setOverallRating(roundTo(averageRating, 2));
  
        const ratingBreakdown = {
          average: roundTo(averageRating, 2),
          breakdown: [
            { stars: 1, percentage: roundTo((starCounts[1] / totalRatings) * 100, 2), color: 'red' },
            { stars: 2, percentage: roundTo((starCounts[2] / totalRatings) * 100, 2), color: 'orange' },
            { stars: 3, percentage: roundTo((starCounts[3] / totalRatings) * 100, 2), color: 'yellow' },
            { stars: 4, percentage: roundTo((starCounts[4] / totalRatings) * 100, 2), color: 'light-green' },
            { stars: 5, percentage: roundTo((starCounts[5] / totalRatings) * 100, 2), color: 'green' }
          ]
        };
  
        setRatingBreakdown(ratingBreakdown);
  
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
  
        const ratingData = monthlyRatings.map((rating, index) => ({
          month: months[index],
          '5 stars': rating[5],
          '4 stars': rating[4],
          '3 stars': rating[3],
          '2 stars': rating[2],
          '1 star': rating[1]
        }));

        const windowsData = Object.keys(windows).map(windowNo => ({
          windowName: `Window ${windowNo}`,
          data: windows[windowNo].map((rating, index) => ({
            month: months[index],
            '5 stars': rating['5 stars'],
            '4 stars': rating['4 stars'],
            '3 stars': rating['3 stars'],
            '2 stars': rating['2 stars'],
            '1 star': rating['1 star']
          }))
        }));
  
        console.log(windowsData);
        setWindowsData(windowsData);
        
      
        setRatingData(ratingData);


        const latestComments = data.slice(0, 6).map(feedback => ({
          rating: feedback.rating,
          text: feedback.comment
        }));

        setComments(latestComments);

        const reviews = {
          overall: roundTo(averageRating, 2),
          breakdown: reviewCounts
        };

        setReviews(reviews);
  
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchFeedbacks();
  
    // const intervalId = setInterval(() => {
    //   fetchFeedbacks();
    // }, 3000);
  
    // return () => clearInterval(intervalId);
  }, []);
  



  const monthStats = { month: feedbackMonthlyCount, overall: overallRating, responses: feedbackCount };
  


  return (
    <div className="container mt-5">
      <HeaderStats {...monthStats} ratingBreakdown={ratingBreakdown} />
      <CommentsList comments={comments} />
      <ReviewSummary reviews={reviews} />
      <RatingChart data={ratingData} />
      <WindowRatingChart windowsData={windowsData} />
    </div>
  );
};

export default Feedback;
