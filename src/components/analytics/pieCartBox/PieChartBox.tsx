import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import React from "react";

const data = [
  { name: "Window 1", value: 45, color: "#0088FE" },
  { name: "Window 2", value: 32, color: "#00C49F" },
  { name: "Window 3", value: 43, color: "#FFBB28" },
  { name: "Window 4", value: 54, color: "#FF8042" },
  { name: "Window 5", value: 67, color: "#AD1500" },
  { name: "Window 6", value: 98, color: "#E600DD" },
];

const PieChartBox = () => {
  return (
    <div className="pieChartBox">
      <h1>Service Windows Crowd</h1>
      <h2>This Month</h2>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
            />
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
            <div className="title">
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
