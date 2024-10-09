import React, { useState, useEffect } from "react";
import './windowsign.scss';
import { BsFillPersonFill } from 'react-icons/bs';
import { supabase } from '../../components/helper/supabaseClient';

const WindowSign = () => {
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch queue data for a specific window
  const fetchQueueData = async (windowId) => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('queue') // Table name
        .select('queue_no')
        .eq('window_no', windowId)
        .eq('status', 'Waiting');
      if (error) {
        throw error;
      }
      setQueueData(data);
      setSelectedWindow(windowId); // Set the current window ID
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      <div className='main-title'>
        <h3>Active Status</h3>
      </div>

      <div className='main-cardss'>
        {/* Service window cards */}
        {[1, 2, 3, 4, 5, 6].map(window => (
          <div className='card' key={window}>
            <BsFillPersonFill className='card_icon' />
            <div className='card-inner'>
              <h3>Window {window}</h3>
            </div>
            <div className='queue-inner'>
              {/* Filter queue number for the selected window */}
              {queueData
                .filter(item => item.window_ === window) // Assuming window_ is the field in your data
                .map(item => (
                  <h1 key={item.id}>{item.queue_no}</h1>
                ))}
            </div>
            <h4>Now Serving</h4>
            <button onClick={() => fetchQueueData(window)} className='view-button'>
              View Queue
            </button>
          </div>
        ))}
      </div>

      {/* Display queue data for the selected window */}
      {selectedWindow && (
        <div className='queue-details'>
          <h3>Queue for Window {selectedWindow}</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : queueData.length ? (
            <ul>
              {queueData.map((item) => (
                <li key={item.id}>
                  {item.queue_no}: {item.name} - {item.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No items in the queue.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WindowSign;
