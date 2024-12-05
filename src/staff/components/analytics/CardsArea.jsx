import React from 'react'
import './CardsArea.css'
import BigChartBox from './bigChartBox/BigChartBox'

import PieChartBox from './pieCartBox/PieChartBox'
import { useEffect, useState } from 'react';
import { supabase } from '../helper/supabaseClient';



import Stackbox from './StackedBox/Stackbox'

import GaugeCharts from './Gaugechart/gaugeChart'

const Cards = () => {
    const [logHistory, setLogs] = useState([]);
    const [monthlyLogCount, setMonthlyLogCount] = useState(0);
    const [mostRequestedCredential, setMostRequestedCredential] = useState(null);
    const [cancelledQueueCount, setCancelledQueueCount] = useState(0); 

    useEffect(() => {
        async function fetchData() {
          const { data, error } = await supabase
            .from('log_history')
            .select('*')
            .order('transaction_date', { ascending: false });
          if (error) {
            console.error('Error fetching data:', error);
          } else {
            setLogs(data);

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            const filteredLogs = data.filter(log => {
              const logDate = new Date(log.transaction_date);
              return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
            });

            setMonthlyLogCount(filteredLogs.length);

            const credentialRequestCount = filteredLogs.reduce((acc, log) => {
                const purpose = log.purpose; // Assuming `purpose` specifies the type of credential requested
                acc[purpose] = (acc[purpose] || 0) + 1;
                return acc;
            }, {});

            const mostRequested = Object.entries(credentialRequestCount)
                .sort((a, b) => b[1] - a[1])
                .map(([credential, count]) => ({ credential, count }))[0];

            setMostRequestedCredential(mostRequested);

            
          }
        }
        fetchData();
      }, []);
      
      const fetchCancelledQueueCount = async () => {
        try {
            const { data, error } = await supabase
                .from('queue') // Assuming the table name is 'queue'
                .select('*')
                .eq('status', 'Cancelled'); // Filter by status 'Cancelled'

            if (error) throw error;

            setCancelledQueueCount(data.length); // Set the count of cancelled queues
        } catch (error) {
            console.error('Error fetching cancelled queue count:', error);
        }
    };

    fetchCancelledQueueCount();

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>Overall Analytics</h3>
           
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Total Registrants</h3>
                </div>
                <h1>{monthlyLogCount}</h1>
                <h4>This Month</h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                <h3>Most Requested Credentials</h3>
                    </div>
                    {mostRequestedCredential ? (
                        <ul>
                            <li>
                                <h1><strong>{mostRequestedCredential.credential}</strong></h1> 
                            </li>
                        </ul>
                    ) : (
                        <p>No data available</p>
                    )}
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Window Analysis</h3>
                </div>
                <h1>Window 6</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Cancelled Queue</h3>
                </div>
                <h1>{cancelledQueueCount} Queues </h1>
            </div>
        </div>

        <div className='main-cardss'>
            <div className='card'>
                <div className="box box7">
                    <GaugeCharts/>
                </div>
            </div>
        </div>

        <div className='main-cards'>
            
            <div className= 'main-charts'>
                <div className="box box2">
                    <BigChartBox/>
                </div>
                <div className="box box3">
                    <PieChartBox/>
                </div>
                <div className="box box7">
                <h2>Request Summary</h2>
                    <Stackbox/>
                </div>
            </div>    
        </div>
    </main>
  );
};

export default Cards;
