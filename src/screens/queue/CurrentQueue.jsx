import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/helper/supabaseClient';
import Timer from '../../components/Queue/timer';
import './CurrentQueue.scss';

const CurrentQueue = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [expandedQueue, setExpandedQueue] = useState(null);
  const [windowsStatus, setWindowsStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [selectedWindowQueue, setSelectedWindowQueue] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        let query = supabase
          .from('queue')
          .select('id, name, queue_no, status, window_no, purpose, created_at')
          .eq('status', 'Waiting')
          .order('id', { ascending: true });

        if (selectedWindow) {
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

    const fetchWindowsStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('registrants')
          .select('window_no, status');

        if (error) {
          console.error(error);
          throw error;
        }

        const statusMap = {};
        data.forEach((item) => {
          if (Array.isArray(item.window_no)) {
            item.window_no.forEach((window) => {
              statusMap[window] = item.status;
            });
          }
        });
        setWindowsStatus(statusMap);
      } catch (error) {
        console.error('Error fetching windows status:', error.message);
      }
    };

    fetchQueues();
    fetchWindowsStatus();

    const intervalId = setInterval(() => {
      fetchQueues();
      fetchWindowsStatus();
    }, 3000);

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

  const handleViewQueue = (windowNo) => {
    setSelectedWindow(windowNo);

    
    const filteredQueueForWindow = queue.filter(item => item.window_no === windowNo);
    setSelectedWindowQueue(filteredQueueForWindow);
    setCurrentQueueIndex(0); 
  };

  const handleNext = () => {
    setCurrentQueueIndex((prevIndex) => (prevIndex + 1) % selectedWindowQueue.length);
  };

  const handleDone = async (time) => {
    const currentQueueItem = selectedWindowQueue[currentQueueIndex];
    console.log('Done with:', currentQueueItem);

    await supabase
      .from('queue')
      .update({ status: 'Done', time_taken: `${time.hr}:${time.min}:${time.sec}` })
      .eq('id', currentQueueItem.id);

    handleNext();
  };

  const getStatusColor = (status) => {
    return status === 'away' ? 'red' : (status === 'available' ? 'green' : 'black');
  };

  const filteredQueue = queue.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.queue_no.toString().includes(searchTerm)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentQueueItem = selectedWindowQueue[currentQueueIndex];

  return (
    <>
      <div className="window-status">
        <h2>Current Queue</h2>
        <div className="window-status-list">
          {['W1', 'W2', 'W3', 'W4', 'W5', 'W6'].map(window => (
            <div className="window-status-card" key={window}>
              <h3>{`Window ${window}`}</h3>
              <p style={{ color: getStatusColor(windowsStatus[window]) }}>
                {windowsStatus[window] || 'Unknown Status'}
              </p>
              <button onClick={() => handleViewQueue(window)} className="btn btn-view-queue">
                View Queues
              </button>
            </div>
          ))}
        </div>

        
        {currentQueueItem ? (
          <div className="current-queue">
            <h1>Queue No: {currentQueueItem.queue_no}</h1>
            <p>Name: {currentQueueItem.name}</p>
            <Timer onDone={handleDone} />
          </div>
        ) : selectedWindowQueue.length > 0 ? (
          <p><center>No more items in the queue.</center></p>
        ) : (
          <p><center>No queue for this window.</center></p>
        )}

        <div className="status-card">
          <button onClick={() => handleViewQueue(null)} className="btn btn-view-queue">
            View All Queues
          </button>
        </div>
      </div>

      <div className="current-queuee-container">
        <div className="current-queuee">
          <input
            type="text"
            placeholder="Search by name or queue number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="current-queue-list">
        {filteredQueue.length > 0 ? (
          filteredQueue.map((item) => (
            <div className="current-queue-card" key={item.id}>
              <div className="item-info">
              <div className="queue-no"> {item.queue_no}</div>
                <p> {item.name}  </p>
                {/* Apply specific class for "Waiting" status */}
                <p className={item.status === 'Waiting' ? 'status-waiting' : '#e79600'}>
                <div className="status-no"> {item.status}</div>
                </p>
                <div className="item-actions">
                  <button onClick={() => console.log('Pending')} className="btn btn-pending">Move</button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-delete">Delete</button>
                  <button onClick={() => setExpandedQueue(item)} className="btn btn-details">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-queue">No queue at the moment</div>
        )}
</div>

        </div>

        {/* Queue Details Section (Hidden when no queue is selected) */}
        {expandedQueue && (
  <div className="queue-details">
    <h2>Queue Details</h2>
    <div className="details-card grid-layout">
      <div className="left-column">
      {expandedQueue.profile_image ? (
  <img 
    src={expandedQueue.profile_image} 
    alt="Profile" 
    className="profile-image" 
  />
) : (
  <span className="profile-icon">👤</span> // Unicode icon
)}

        <h3>{expandedQueue.name}</h3>
        <div className="appointment-schedule">
          <p>{expandedQueue.queue_no}</p>
        </div>
       
      
      </div>
      <div className="right-column">
      <div className="DetailsQueue">
        <h3>Appointment: </h3><p>{expandedQueue.created_at}</p>
        <h3>Status: </h3><p>{expandedQueue.status}</p>
        <h3>Details</h3>
          <p>Purpose: {expandedQueue.purpose}</p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default CurrentQueue;
