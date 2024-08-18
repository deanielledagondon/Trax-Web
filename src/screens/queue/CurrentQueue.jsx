import React, { useState, useEffect } from 'react'; 
import { supabase } from '../../components/helper/supabaseClient';

const CurrentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        let { data, error } = await supabase
          .from('queue')
          .select('id, name, queue_no, status, created_at')
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

    fetchQueues();

    // Set up live polling
    const intervalId = setInterval(() => {
      fetchQueues();
    }, 3000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 

  const handleEdit = (id) => {
    console.log('Edit item with ID:', id);
    // Add your edit logic here
  };
  const handlePending = (id) => {
    console.log('pending item with ID:', id);
    // Add your pending logic here
  };
  const handleDone = (id) => {
    console.log('done item with ID:', id);
    // Add your done logic here
  };

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
  

  const handleViewDetails = (id) => {
    console.log('View details for item with ID:', id);
    // Add your view details logic here
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
      </div>
      <div className="progress-bar-list">
        {queue.map((item) => (
          <div className="progress-bar-item" key={item.id}>
            <div className="bar-item-info">
              <p className="bar-item-info-value">Queue No: {item.queue_no}</p>
              <p className="bar-item-info-name">Name: {item.name}</p>
              <p className="bar-item-info-status">Status: {item.status}</p>
              <p className="bar-item-info-timestamp">Timestamp: {new Date(item.created_at).toLocaleString()}</p>
            </div>
            <div className="bar-item-actions">
              <button onClick={() => handleDone(item.id)} className="btn btn-done">Done</button>
              <button onClick={() => handlePending(item.id)} className="btn btn-pending">Pending</button>
              <button onClick={() => handleDelete(item.id)} className="btn btn-delete">Delete</button>
              <button onClick={() => handleViewDetails(item.id)} className="btn btn-details">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentQueue;
