import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/helper/supabaseClient';
import './CurrentQueue.scss';

const CurrentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState('All Windows');
  const [expandedQueue, setExpandedQueue] = useState(null); // State for tracking expanded queue

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        let query = supabase
          .from('queue')
          .select('id, name, queue_no, status, window_no, purpose, created_at')
          .eq('status', 'Waiting')
          .order('id', { ascending: true });

        if (selectedWindow !== 'All Windows') {
          query = query.eq('window_no', selectedWindow);
        }

        const { data, error } = await query;

        if (error) {
          console.error(error);
          throw error;
        }
        setQueue(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQueues();

    // Set up live polling
    const intervalId = setInterval(() => {
      fetchQueues();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedWindow]);

  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this queue?');
  
      if (confirmed) {
        const { error } = await supabase
          .from('queue')
          .delete()
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setQueue(queue.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const toggleDetails = (id) => {
    if (expandedQueue === id) {
      setExpandedQueue(null); // Collapse the details if clicked again
    } else {
      setExpandedQueue(id); // Expand the details for the clicked queue
    }
  };

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
        <select onChange={(e) => setSelectedWindow(e.target.value)} value={selectedWindow}>
          <option value="All Windows">All Windows</option>
          <option value="W1">Window 1</option>
          <option value="W2">Window 2</option>
          <option value="W3">Window 3</option>
          <option value="W4">Window 4</option>
          <option value="W5">Window 5</option>
          <option value="W6">Window 6</option>
        </select>
      </div>
      <div className="progress-bar-list">
        {queue.map((item) => (
          <div className="progress-bar-item" key={item.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-value">Queue No: {item.queue_no}</p>
              <p className="bar-item-info-name">Name: {item.name}</p>
              <p className="bar-item-info-status">Status: {item.status}</p>
              <p className="bar-item-info-window">Window: {item.window_no}</p>
            </div>
            <div className="bar-item-actions">
              <button onClick={() => console.log('Pending')} className="btn btn-pending">Move</button>
              <button onClick={() => handleDelete(item.id)} className="btn btn-delete">Delete</button>
              <button onClick={() => toggleDetails(item.id)} className="btn btn-details">
                {expandedQueue === item.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
            {expandedQueue === item.id && (
              <div className="bar-item-details">
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Timestamp:</strong> {new Date(item.created_at).toLocaleString()}</p>
                <p><strong>Window:</strong> {item.window_no || 'No window provided'}</p>
                <p><strong>Purpose:</strong> {item.purpose || 'No purpose provided'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentQueue;
