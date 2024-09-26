import React from 'react'
import './CardsArea.css'
import BigChartBox from './bigChartBox/BigChartBox'

import PieChartBox from './pieCartBox/PieChartBox'
import { useEffect, useState } from 'react';
import { supabase } from '../helper/supabaseClient';

import {
  barChartBoxRevenue,
  barChartBoxVisit,
  topDealUsers,
} from "../analytics/barChartBox/data";

import Stackbox from './StackedBox/Stackbox'

import GaugeCharts from './Gaugechart/gaugeChart'

const Cards = () => {
    const [logHistory, setLogs] = useState([]);
    const [monthlyLogCount, setMonthlyLogCount] = useState(0);

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
          }
        }
        fetchData();
      }, []);


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
                <h4>this month</h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Average Visit Time</h3>
                </div>
                <h1>4m 5s</h1>
                <h4>higher than yesterday </h4>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Window Analysis</h3>
                </div>
                <h1>All Windows</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Service Comments</h3>
                </div>
                <h1>25</h1>
                <h4>higher than yesterday</h4>
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
