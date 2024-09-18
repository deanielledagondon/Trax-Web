import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "../../helper/supabaseClient";
import "./pieChartBox.scss";


interface LogData {
  window_no: string;
  purpose: string;
  transaction_date: string;  
}


interface ChartData {
  name: string;
  value: number;
  color: string;
}

const PieChartBox: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [purposes, setPurposes] = useState<string[]>(['All Purposes']);
  const [selectedPurpose, setSelectedPurpose] = useState('All Purposes');
  const [windows, setWindows] = useState<string[]>(['All Windows']);
  const [selectedWindow, setSelectedWindow] = useState('All Windows');
  const [startDate, setStartDate] = useState('');  // Start date state
  const [endDate, setEndDate] = useState('');      // End date state

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from Supabase
        const { data: logData, error } = await supabase
          .from('log_history')
          .select('*')
          .order('transaction_date', { ascending: false });

        if (error) {
          console.error('Error fetching data:', error.message);
          return;
        }

        if (!logData || logData.length === 0) {
          console.error('No data returned from Supabase');
          return;
        }

     
        const uniqueWindows = [...new Set(logData.map(log => log.window_no))];
        const uniquePurposes = [...new Set(logData.map(log => log.purpose))];
        setWindows(['All Windows', ...uniqueWindows]);
        setPurposes(['All Purposes', ...uniquePurposes]);

        const filteredByDate = logData.filter(log => {
          const logDate = new Date(log.transaction_date);
          const isAfterStartDate = startDate ? logDate >= new Date(startDate) : true;
          const isBeforeEndDate = endDate ? logDate <= new Date(endDate) : true;
          return isAfterStartDate && isBeforeEndDate;
        });

        
        const filteredData = filteredByDate.filter(log => {
          const matchesWindow = selectedWindow === 'All Windows' || log.window_no === selectedWindow;
          const matchesPurpose = selectedPurpose === 'All Purposes' || log.purpose === selectedPurpose;
          return matchesWindow && matchesPurpose;
        });

     
        const purposeCounts = filteredData.reduce((counts, log) => {
          const purpose = log.purpose;
          if (purpose) {
            counts[purpose] = (counts[purpose] || 0) + 1;
          }
          return counts;
        }, {} as Record<string, number>);  

        const updatedData: ChartData[] = Object.entries(purposeCounts).map(([purpose, count]) => ({
          name: purpose,
          value: count as number,  
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`  
        }));

        setData(updatedData);
      } catch (e) {
        console.error('Error during data fetching or processing:', e);
      }
    }

    fetchData();
  }, [selectedPurpose, selectedWindow, startDate, endDate]);  

  return (
    <div className="pieChartBox">
      <h1>Service Windows Crowd</h1>
      <h2>This Month</h2>

      <div className="filters">
        <label>Start Date: </label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
        />

        <label>End Date: </label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
        />

        <label>Window: </label>
        <select onChange={(e) => setSelectedWindow(e.target.value)} value={selectedWindow}>
          {windows.map((window, index) => (
            <option key={index} value={window}>{window}</option>
          ))}
        </select>

        <label>Purpose: </label>
        <select onChange={(e) => setSelectedPurpose(e.target.value)} value={selectedPurpose}>
          {purposes.map((purpose, index) => (
            <option key={index} value={purpose}>{purpose}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="chart">
        <ResponsiveContainer width="99%" height={400}>
          <PieChart>
            <Tooltip contentStyle={{ background: "white", borderRadius: "5px" }} />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Options */}
      <div className="options">
        {data.map((item) => (
          <div className="option" key={item.name}>
            <div className="titlee">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
