import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./bigChartBox.scss";
import React from "react";

const data = [
  {
    name: "January",
    Excellent: 24,
    Good: 35,
    Neutral: 22,
    Bad: 13,
    Worst: 3,

  },
  {
    name: "February",
    Excellent: 34,
    Good: 24,
    Neutral: 14,
    Bad: 5,
    Worst: 5,
  },
  {
    name: "March",
    Excellent: 34,
    Good: 45,
    Neutral: 31,
    Bad: 13,
    Worst: 4,
  },
  {
    name: "April",
    Excellent: 5,
    Good: 28,
    Neutral: 6,
    Bad: 4,
    Worst: 2,
  },
  {
    name: "May",
    Excellent: 5,
    Good: 45,
    Neutral: 21,
    Bad: 3,
    Worst: 1,
  },
  {
    name: "June",
    Excellent: 78,
    Good: 24,
    Neutral: 21,
    Bad: 13,
    Worst: 4,
  },
  {
    name: "July",
    Excellent: 53,
    Good: 23,
    Neutral: 24,
    Bad: 2,
    Worst: 2,
  },
  {
    name: "August",
    Excellent: 52,
    Good: 24,
    Neutral: 25,
    Bad: 7,
    Worst: 2,
  },
 
];

const BigChartBox = () => {
  return (
    <div className="bigChartBox">
      <h1>Service Feedbacks</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Excellent"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="Good"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="Neutral"
              stackId="3"
              stroke="#ffc658"
              fill="#ffc658"
            />
               <Area
              type="monotone"
              dataKey="Bad"
              stackId="2"
              stroke="#ffc658"
              fill="#ffc658"
            />
               <Area
              type="monotone"
              dataKey="Worst"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
