import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../../helper/supabaseClient";
import './bigChartBox.scss';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 
import dayjs from 'dayjs'; 

const TransactionBarChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowNo, setWindowNo] = useState(null); // State to filter by window_no
  const [windowOptions, setWindowOptions] = useState([]); // To store distinct window_no options
  const chartRef = useRef(null); // Reference to the chart for gradient creation

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

        // Extract unique window_no options for dropdown
        const uniqueWindowOptions = [...new Set(data.map((item) => item.window_no))];
        setWindowOptions(uniqueWindowOptions);

        // Filter data based on selected window_no (if any)
        const filteredData = windowNo
          ? data.filter((item) => item.window_no === windowNo)
          : data;

        // Group transactions by month and count them
        const transactionCounts = filteredData.reduce((acc, item) => {
          const month = dayjs(item.transaction_date).format('MMMM YYYY');
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        // Prepare data for the chart
        const labels = Object.keys(transactionCounts);
        const values = Object.values(transactionCounts);

        // Get the canvas rendering context for the gradient
        const chart = chartRef.current;
        const ctx = chart?.ctx;

        // Create a gradient for the bar background
        let gradient;
        if (ctx) {
          gradient = ctx.createLinearGradient(0, 0, 0, 400); // Adjust as needed
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
          gradient.addColorStop(1, 'rgba(153, 102, 255, 0.8)');
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Number of Transactions',
              data: values,
              backgroundColor: gradient || 'rgba(75, 192, 192, 0.6)', // Use gradient or fallback color
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
  }, [windowNo]); // Re-run the effect when windowNo changes

  const handleWindowNoChange = (e) => {
    setWindowNo(e.target.value || null); // Update the selected window_no
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

      {/* Dropdown to select window_no */}
      <label htmlFor="window-select">Filter by Window Number: </label>
      <select id="window-select" onChange={handleWindowNoChange}>
        <option value="">All</option> {/* Option to show all transactions */}
        {windowOptions.map((window, index) => (
          <option key={index} value={window}>
            {window}
          </option>
        ))}
      </select>

      {/* Chart display */}
      <div style={{ height: '400px', width: '100%' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
          ref={chartRef} // Reference to the chart for gradient
        />
      </div>
    </div>
  );
};

export default TransactionBarChart;
