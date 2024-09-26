import React, { useState, useEffect } from 'react';
import { supabase } from "../../helper/supabaseClient"; // Adjust this path if necessary
import './gaugeChart.scss'; // Custom CSS for the circles

const GaugeCharts = () => {
  const [queueData, setQueueData] = useState([]); // State to hold queue data

  // Fetch queue data from Supabase
  useEffect(() => {
    const fetchQueueData = async () => {
      const { data, error } = await supabase
        .from('queue')  // Replace with your actual table name
        .select('window_no, status')
        .eq('status', 'Waiting'); // Filter by 'waiting' status

      if (error) {
        console.error('Error fetching queue data:', error);
      } else {
        setQueueData(data); // Store the fetched data
      }
    };

    fetchQueueData();
  }, []);

  // Group queue data by window_no
  const groupedByWindow = queueData.reduce((acc, item) => {
    if (!acc[item.window_no]) {
      acc[item.window_no] = [];
    }
    acc[item.window_no].push(item);
    return acc;
  }, {});

  const maxQueue = 100; // Define the maximum queue for each window

  // Generate progress value for each window
  const renderGauges = () => {
    return Object.keys(groupedByWindow).map((windowNo, index) => {
      const waitingCount = groupedByWindow[windowNo].length; // Count people waiting for this window
      const progressValue = Math.min((waitingCount / maxQueue) * 100, 100); // Calculate percentage

      return (
        <div key={index} className="gauge-container">
          
          <div className="circle">
            <div className="circle-inner" style={{ '--percentage': progressValue }}>
              <div className="circle-fill"></div>
              <div className="circle-cover">
                <span className="progress-value">{Math.round(progressValue)}%</span>
                
              </div>
              
            </div>
          </div>
          <div className="gauge-label">Window {windowNo}</div>
        </div>
      );
    });
  };

  return (
    <div className="gauge-charts-container">
      <h3 className="queue-title">Windows Queue</h3> {/* Add title here */}
      <div className="gauge-charts">
        {renderGauges()}
      </div>
    </div>
  );
};

export default GaugeCharts;
