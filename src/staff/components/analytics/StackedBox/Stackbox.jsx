import React, { useState, useEffect, useRef } from 'react';
import { supabase } from "../../helper/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Stackbox.css';

const Stackbox = () => {
  const [data, setData] = useState([]);
  const [windows, setWindows] = useState([]);
  const [purposes, setPurposes] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState('All Windows');
  const [selectedPurpose, setSelectedPurpose] = useState('All Purposes');
  const chartRef = useRef();

  // Define stable colors for each purpose
  const purposeColors = {
   'BFP': '#FF5733', // Red
    'Authentication': '#FF8D1A', // Orange
    'Form 137': '#FFC300', // Yellow
    'Enrollment': '#DAF7A6', // Light Green
    'Graduated': '#33FF57', // Green
    'Diploma': '#33FFBD', // Teal
    'Replacement': '#33CFFF', // Light Blue
    'Rush Fee': '#335BFF', // Blue
    'Completion of INC': '#8D33FF', // Purple
    'Transcript of Records': '#D633FF', // Magenta
    'Graduation': '#FF33A6', // Pink
    'Evaluation': '#FF6F61', // Coral
    'Transfer': '#FFB347', // Light Orange
    'TOR': '#FFF700', // Bright Yellow
    'Honorable Dismissal': '#A6FF4D', // Lime Green
    'Correction of Name': '#4DFFC3', // Aquamarine
    'Permit to Study': '#33AFFF', // Sky Blue
    'Authorization Letter': '#714BFF', // Indigo
    'DEP-ED': '#D46AFF', // Light Purple
    'CHED': '#FF3380', // Hot Pink
    'BJMP': '#FF9966', // Light Coral
    'PNP': '#FFD633', // Light Gold
    'Officially enrolled': '#6AFF33', // Bright Green
    'English Medium of Instruction': '#33FFF7', // Cyan
    'Earned Units': '#3388FF', // Deep Blue
    'Grading System': '#9B33FF', // Violet
    'Subjects w/ grades': '#FF33E1', // Fuchsia
    'Endorsement': '#FF7043', // Deep Orange
    'GPA': '#FFD700', // Gold
    'CAR': '#66FF33', // Neon Green
    'POEA': '#33FFF1', // Light Cyan
    'DFA': '#336BFF', // Medium Blue
  };

  useEffect(() => {
    async function fetchData() {
      const { data: logData, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const uniqueWindows = [...new Set(logData.map(log => log.window_no))];
      const uniquePurposes = [...new Set(logData.map(log => log.purpose))];

      setWindows(['All Windows', ...uniqueWindows]);
      setPurposes(['All Purposes', ...uniquePurposes]);

      const groupedData = logData.reduce((acc, log) => {
        const windowNo = log.window_no;
        const purpose = log.purpose;

        if (!acc[windowNo]) {
          acc[windowNo] = { name: `Window ${windowNo}`, window_no: windowNo };
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
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        return;
      }

      const filteredData = logData.filter(log => {
        const windowMatch = selectedWindow === 'All Windows' || log.window_no === selectedWindow;
        const purposeMatch = selectedPurpose === 'All Purposes' || log.purpose === selectedPurpose;
        return windowMatch && purposeMatch;
      });

      const groupedData = filteredData.reduce((acc, log) => {
        const windowNo = log.window_no;
        const purpose = log.purpose;

        if (!acc[windowNo]) {
          acc[windowNo] = { name: `Window ${windowNo}`, window_no: windowNo };
        }

        acc[windowNo][purpose] = (acc[windowNo][purpose] || 0) + 1;

        return acc;
      }, {});

      const chartData = Object.values(groupedData);
      setData(chartData);
    }

    filterData();
  }, [selectedWindow, selectedPurpose]);

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

  const renderLegend = () => (
    <div className="custom-legend">
      {Object.keys(purposeColors).map((purpose) => (
        <div key={purpose} className="legend-item">
          <span
            className="legend-color"
            style={{ backgroundColor: purposeColors[purpose] }}
          />
          <span>{purpose}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="title">
      </div>
      <div className="filters">
        <select onChange={(e) => setSelectedWindow(e.target.value)} value={selectedWindow}>
          {windows.map((window, index) => (
            <option key={index} value={window}>{window}</option>
          ))}
        </select>

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
            {Object.keys(purposeColors).map((purpose) => (
              <Bar
                key={purpose}
                dataKey={purpose}
                stackId="a"
                fill={purposeColors[purpose]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="legend-bottom">
        {renderLegend()}
      </div>
      <button onClick={handlePrint}>Print Chart</button>
    </div>
  );
};

export default Stackbox;
