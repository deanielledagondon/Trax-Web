import React, { useEffect, useState, useRef } from 'react';
import { supabase } from "../../helper/supabaseClient";
import './BarChartBox.scss';
import { Chart } from 'chart.js/auto';


const RatingAnalytics = () => {
  const [ratings, setRatings] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Type assertion: UseRef<HTMLCanvasElement | null>
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('rating');
          
        if (error) {
          throw error;
        }

        const ratingsData = data.map((item: { rating: number }) => item.rating);
        setRatings(ratingsData);
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  useEffect(() => {
    if (ratings.length > 0 && !loading && chartRef.current) {
      // Calculate the frequency of each rating (assuming rating is from 1 to 5)
      const ratingCounts = [0, 0, 0, 0, 0];
      ratings.forEach((rating) => {
        if (rating >= 1 && rating <= 5) {
          ratingCounts[rating - 1]++;
        }
      });

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [
              {
                label: 'Number of Ratings',
                data: ratingCounts,
                backgroundColor: ['#ff4d4d', '#ff9933', '#ffff66', '#66cc66', '#3399ff'],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [ratings, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="rating-analytics-container">
      <h2>Rating Analytics</h2>
      {/* Attach the ref here to the canvas */}
      <canvas ref={chartRef} id="ratingChart" />
    </div>
  );
};

export default RatingAnalytics;
