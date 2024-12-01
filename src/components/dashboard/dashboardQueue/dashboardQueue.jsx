import React, { useState, useEffect } from 'react';
import { supabase } from './../../helper/supabaseClient';
import './dashboardQueue.scss';

const DashboardQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the window number
        const { data: windowData, error: windowError } = await supabase
          .from("registrants")
          .select("window_no")
          .eq("id", parsedUser.id)
          .single();

        if (windowError) throw windowError;

        const windowNo = windowData.window_no;

        if (!windowNo || windowNo.length === 0) {
          setQueue([]);
          setLoading(false);
          return;
        }

        // Fetch the registrants for the windows
        const { data: queueData, error: queueError } = await supabase
          .from('queue')
          .select('queue_no, name, status, window_no')
          .eq('status', 'Waiting')
          .in('window_no', windowNo)
          .order('id', { ascending: true });

        if (queueError) throw queueError;

        setQueue(queueData);
        setLoading(false);

        // Set up live polling
        const intervalId = setInterval(async () => {
          try {
            const { data: updatedQueueData, error: updatedQueueError } = await supabase
              .from('queue')
              .select('queue_no, name, status, window_no')
              .eq('status', 'Waiting')
              .in('window_no', windowNo)
              .order('id', { ascending: true });

            if (updatedQueueError) throw updatedQueueError;
            setQueue(updatedQueueData);
          } catch (pollingError) {
            console.error("Polling error:", pollingError);
          }
        }, 3000);

        // Clean up polling on unmount
        return () => clearInterval(intervalId);
      } catch (fetchError) {
        setError(fetchError.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [parsedUser.id]);

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
