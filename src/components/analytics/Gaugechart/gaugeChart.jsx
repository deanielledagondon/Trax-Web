import React, { useState, useEffect } from 'react';
import { supabase } from "../../helper/supabaseClient"; 
import './gaugeChart.scss';

const GaugeCharts = () => {
  const [queueData, setQueueData] = useState([]); 

  useEffect(() => {
    const fetchQueueData = async () => {
      const { data, error } = await supabase
        .from('queue')  
        .select('window_no, status')
        .eq('status', 'Waiting'); 

      if (error) {
        console.error('Error fetching queue data:', error);
      } else {
        setQueueData(data); 
      }
    };

    fetchQueueData();
  }, []);


  const groupedByWindow = queueData.reduce((acc, item) => {
    if (!acc[item.window_no]) {
      acc[item.window_no] = [];
    }
    acc[item.window_no].push(item);
    return acc;
  }, {});

  const maxQueue = 100; 

  
  const renderGauges = () => {
    return Object.keys(groupedByWindow).map((windowNo, index) => {
      const waitingCount = groupedByWindow[windowNo].length; 
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
      <h3 className="queue-title">Windows Queue</h3>
      <div className="gauge-charts">
        {renderGauges()}
      </div>
    </div>
  );
};

export default GaugeCharts;
