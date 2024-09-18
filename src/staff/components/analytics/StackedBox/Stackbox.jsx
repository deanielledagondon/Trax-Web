import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../../helper/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './Stackbox.css';

const Stackbox = () => {
  const [data, setData] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [selectedPurpose, setSelectedPurpose] = useState('All Purposes');
  const chartRef = useRef();

  useEffect(() => {
    async function fetchData() {
      const { data: logData, error } = await supabase
        .from('log_history')
        .select('*')
        .in('window_no', ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'])  
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const uniquePurposes = [...new Set(logData.map(log => log.purpose))];

      setPurposes(['All Purposes', ...uniquePurposes]);

      const groupedData = logData.reduce((acc, log) => {
        const purpose = log.purpose;
        const windowNo = log.window_no;

        if (!acc[windowNo]) {
          acc[windowNo] = { name: windowNo, window_no: windowNo };
        }

        acc[windowNo][purpose] = (acc[windowNo][purpose] || 0) + 1;

        return acc;
      }, {});

      const chartData = Object.values(groupedData);
      setData(chartData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function filterData() {
      const { data: logData, error } = await supabase
        .from('log_history')
        .select('*')
        .in('window_no', ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'])  // Fetch data for Windows 1 to 6
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const filteredData = logData.filter(log => {
        const purposeMatch = selectedPurpose === 'All Purposes' || log.purpose === selectedPurpose;
        return purposeMatch;
      });

      const groupedData = filteredData.reduce((acc, log) => {
        const purpose = log.purpose;
        const windowNo = log.window_no;

        if (!acc[windowNo]) {
          acc[windowNo] = { name: windowNo, window_no: windowNo };
        }

        acc[windowNo][purpose] = (acc[windowNo][purpose] || 0) + 1;

        return acc;
      }, {});

      const chartData = Object.values(groupedData);
      setData(chartData);
    }

    filterData();
  }, [selectedPurpose]);

  const handlePrint = () => {
    const printContent = chartRef.current;
    const WindowPrint = window.open('', '', 'width=900,height=650');
    WindowPrint.document.write('<html><head><title>Print Chart</title>');
    WindowPrint.document.write('</head><body>');
    WindowPrint.document.write(printContent.innerHTML);
    WindowPrint.document.write('</body></html>');
    WindowPrint.document.close();
    WindowPrint.focus();
    WindowPrint.print();
    WindowPrint.close();
  };

  return (
    <div>
      <div className="filters">
        <select onChange={(e) => setSelectedPurpose(e.target.value)} value={selectedPurpose}>
          {purposes.map((purpose, index) => (
            <option key={index} value={purpose}>{purpose}</option>
          ))}
        </select>
      </div>

      <div ref={chartRef} id="chartToPrint" style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {purposes.slice(1).map((purpose, index) => (
              <Bar key={purpose} dataKey={purpose} fill={`#${((1 << 24) * Math.random() | 0).toString(16)}`} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button onClick={handlePrint}>Print Chart</button>
    </div>
  );
};

export default Stackbox;