import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../../helper/supabaseClient";
import './BigchartBox.scss';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import dayjs from 'dayjs'; 

const TransactionBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowNo, setWindowNo] = useState(null); 
  const [windowOptions, setWindowOptions] = useState([]); 
  const chartRef = useRef(null); 

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const { data, error } = await supabase
          .from('log_history')
          .select('transaction_date, window_no')
          .order('transaction_date', { ascending: true });

        if (error) {
          console.error(error);
          throw error;
        }

        if (!data) {
          setError('No data returned from the query');
          setLoading(false);
          return;
        }

      
        const uniqueWindowOptions = [...new Set(data.map((item) => item.window_no))];
        setWindowOptions(uniqueWindowOptions);

       
        const filteredData = windowNo
          ? data.filter((item) => item.window_no === windowNo)
          : data;

     
        const transactionCounts = filteredData.reduce((acc, item) => {
          const month = dayjs(item.transaction_date).format('MMMM YYYY');
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        
        const labels = Object.keys(transactionCounts);
        const values = Object.values(transactionCounts);

      
        const chart = chartRef.current;
        const ctx = chart?.ctx;

    
        let gradient;
        if (ctx) {
          gradient = ctx.createLinearGradient(0, 0, 0, 400); 
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
          gradient.addColorStop(1, 'rgba(153, 102, 255, 0.8)');
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Transactions',
              data: values,
              backgroundColor: gradient || 'rgba(75, 192, 192, 0.6)', 
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTransactionData();
  }, [windowNo]); 

  const handleWindowNoChange = (e) => {
    setWindowNo(e.target.value || null); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Transactions by Month</h2>

     
      <label htmlFor="window-select">Filter by Window Number: </label>
      <select id="window-select" onChange={handleWindowNoChange}>
        <option value="">All</option> 
        {windowOptions.map((window, index) => (
          <option key={index} value={window}>
            {window}
          </option>
        ))}
      </select>

   
      <div style={{ height: '400px', width: '100%' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          ref={chartRef} 
        />
      </div>
    </div>
  );
};

export default TransactionBarChart;
