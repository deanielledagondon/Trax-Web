import React, { useEffect, useState, useRef } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "../../helper/supabaseClient";
import html2canvas from 'html2canvas'; // Import html2canvas
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

  const chartRef = useRef(null);

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

  // Function to capture and save the chart and legends as PNG
  const saveAsImage = () => {
    const chartContainer = chartRef.current;
    html2canvas(chartContainer, {
      backgroundColor: null,
      scale: 2,
      useCORS: true 
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "piechart_with_legends.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="pieChartBox">
      <h3>Service Windows Crowd</h3>

      {/* Wrapping the chart and legends inside one container */}
      <div className="chart-container" ref={chartRef} style={{ background: 'none' }}> {/* Set background to none */}
        <div className="chart">
          <ResponsiveContainer width="89%" height={250}> {/* Increased width to 100% */}
            <PieChart>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "5px" }}
                formatter={(value, name) => [`${value} transactions`, name]} // Custom tooltip formatter
              />
              <Pie
                data={data}
                innerRadius={"60%"}
                outerRadius={"70%"}
                paddingAngle={5}
                dataKey="value"
                label={(entry) => `${entry.name}: ${entry.value}`} // Show labels for each pie slice
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Save to PNG Button */}
      <button onClick={saveAsImage} className="save-btn">
        Save as PNG
      </button>
    </div>
  );
};

export default PieChartBox;
