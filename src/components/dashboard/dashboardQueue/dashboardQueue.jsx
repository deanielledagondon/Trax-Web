import React, { useState, useEffect } from 'react';
import { supabase } from './../../helper/supabaseClient';
import './dashboardQueue.scss';


const DashboardQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrants = async () => {
      try {
        let { data, error } = await supabase
          .from('queue')
          .select('queue_no, name, status')
          .eq('status', 'Waiting')
          .order('id', { ascending: true });
        if (error) {
          console.log(error);
          throw error;
        }
        setQueue(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRegistrants();

    // Set up live polling
    const intervalId = setInterval(() => {
      fetchRegistrants();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Current Queue</h4>
      </div>
      <div className="progress-bar-list">
        {queue.map((item) => (
          <div className="progress-bar-item" key={item.queue_no}>
            <div className="bar-item-info">
              <p className="bar-item-info-value">{item.queue_no}</p>
              <p className="bar-item-info-name"> {item.name}</p>
              <p className="bar-item-info-status">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardQueue;
