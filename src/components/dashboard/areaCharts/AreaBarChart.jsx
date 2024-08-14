import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../context/ThemeContext";
import { FaArrowUpLong } from "react-icons/fa6";
import { LIGHT_THEME } from "../../../constants/themeConstants";
import "./AreaCharts.scss";
import { supabase } from "../../helper/supabaseClient";
import { format, parseISO } from 'date-fns'; // Ensure date-fns is installed

const data = [
  {
    month: "Jan",
    completed: 70,
  },
  {
    month: "Feb",
    completed: 55,
  },
  {
    month: "Mar",
    completed: 35,

  },
  {
    month: "April",
    completed: 90,
  },
  {
    month: "May",
    completed: 55,
  },
  {
    month: "Jun",
    completed: 30,
  },
  {
    month: "Jul",
    completed: 32,
  },
  {
    month: "Aug",
    completed: 62,
  },
  {
    month: "Sep",
    completed: 78,
  },
];
const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AreaBarChart = () => {
  const { theme } = useContext(ThemeContext);
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCompleted, setTotalCompleted] = useState(0);

  useEffect(() => {
    const fetchRegistrants = async () => {
      try {
        let { data, error } = await supabase
          .from('log_history')
          .select('transaction_date, status'); // Adjust the column names as per your table
        if (error) {
          console.log(error);
          throw error;
        }

        const aggregatedData = data.reduce((acc, item) => {
          const month = format(parseISO(item.transaction_date), 'MMM');
          if (!acc[month]) {
            acc[month] = { month, completed: 0 };
          }
          if (item.status === 'Completed') {
            acc[month].completed++;
            setTotalCompleted(prevTotal => prevTotal + 1);
          }
          return acc;
        }, {});
  
        const transformedData = Object.values(aggregatedData);
        transformedData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        
        console.log(transformedData);
        setLogHistory(transformedData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRegistrants();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const formatTooltipValue = (value) => {
    return `${value} Transactions`;
  };

  const formatYAxisLabel = (value) => {
    return `${value}`;
  };

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart">
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Transactions</h5>
        <div className="chart-info-data">
          <div className="info-data-value">{totalCompleted} Registrants</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% than last month.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={logHistory}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              axisLine={false}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                fontSize: 14,
              }}
            />
            <YAxis
              padding={{ bottom: 10, top: 10 }}
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
            />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              dataKey="completed"
              fill="#475be8"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
