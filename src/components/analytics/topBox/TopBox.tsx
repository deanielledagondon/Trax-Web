import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { supabase } from "../../helper/supabaseClient";  
import "./TopBox.scss"; 

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AD1500', '#E600DD']; 


interface QueueData {
  name: string;
  value: number;
  color: string;
}

const QueuePieChart = () => {
 
  const [queueData, setQueueData] = useState<QueueData[]>([]);

  useEffect(() => {
    async function fetchQueueData() {
      const { data, error } = await supabase
        .from('queue')
        .select('window_no')
        .eq('status', 'Waiting'); 

      if (error) {
        console.error('Error fetching queue data:', error);
      } else {
      
        const windowCounts = data.reduce((counts: any, entry: any) => {
          const windowNo = entry.window_no;
          if (windowNo) {
            counts[windowNo] = (counts[windowNo] || 0) + 1;
          }
          return counts;
        }, {});

        const pieData = Object.keys(windowCounts).map((key, index) => ({
          name: `Window ${key}`,
          value: windowCounts[key],
          color: COLORS[index % COLORS.length], 
        }));

       
        setQueueData(pieData);
      }
    }

    fetchQueueData();
  }, []);

  return (
    <div className="queuePieChart">
      <h2>People Waiting in Each Window</h2>
      <ResponsiveContainer width="99%" height={400}>
        <PieChart>
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '5px' }} />
          <Pie
            data={queueData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
          >
            {queueData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QueuePieChart;
