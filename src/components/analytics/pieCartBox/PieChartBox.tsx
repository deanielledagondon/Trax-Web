import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "../../helper/supabaseClient";
import "./pieChartBox.scss";

const PieChartBox = () => {
  const [data, setData] = useState([
    { name: "Window 1", value: 0, color: "#0088FE" },
    { name: "Window 2", value: 0, color: "#00C49F" },
    { name: "Window 3", value: 0, color: "#FFBB28" },
    { name: "Window 4", value: 0, color: "#FF8042" },
    { name: "Window 5", value: 0, color: "#AD1500" },
    { name: "Window 6", value: 0, color: "#E600DD" },
  ]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        
        const windowCounts = data.reduce((counts, log) => {
          const windowNo = log.window_no;
          if (windowNo) {
            counts[windowNo] = (counts[windowNo] || 0) + 1;
          }
          return counts;
        }, {});
  
        
        const updatedData = [
          { name: "Window 1", value: windowCounts.W1 || 0, color: "#0088FE" },
          { name: "Window 2", value: windowCounts.W2 || 0, color: "#00C49F" },
          { name: "Window 3", value: windowCounts.W3 || 0, color: "#FFBB28" },
          { name: "Window 4", value: windowCounts.W4 || 0, color: "#FF8042" },
          { name: "Window 5", value: windowCounts.W5 || 0, color: "#AD1500" },
          { name: "Window 6", value: windowCounts.W6 || 0, color: "#E600DD" },
        ];
  
        setData(updatedData);
      }
    }
  
    fetchData();
  }, []);

 

  return (
    <div className="pieChartBox">
      <h1>Service Windows Crowd</h1>
      <h2>This Month</h2>
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
