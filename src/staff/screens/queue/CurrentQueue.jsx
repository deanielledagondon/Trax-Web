import React, { useState, useEffect } from 'react'; 
import { supabase } from '../../components/helper/supabaseClient';
import { useAuth } from '../../../components/authContext';

const CurrentQueue = () => {
  const { session } = useAuth(); // Assuming session contains user information
  const [queue, setQueue] = useState([]);
  const [window_no, setWindowNo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWindowNo = async () => {
      try {
        let { data, error } = await supabase
          .from('registrants')
          .select('window_no')
          .eq('id', session.user.id)
          .single(); // Using single() to get a single row instead of an array

        if (error) throw error;

        setWindowNo(data.window_no);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWindowNo();
  }, [session.user.id]); // Depend on session.user.id to ensure it runs when the component mounts

  useEffect(() => {
    if (window_no === null) return; // Don't run if window_no is not set yet

    const fetchQueue = async () => {
      try {
        let { data, error } = await supabase
          .from('queue')
          .select('id, name, queue_no')
          .eq('window_no', window_no)
          .order('id', { ascending: true });

        if (error) throw error;

        setQueue(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQueue();
  }, [window_no]); // Depend on window_no to run when it updates

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
          <div className="progress-bar-item" key={item.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-value">{item.queue_no}</p>
              <p className="bar-item-info-name">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentQueue;
