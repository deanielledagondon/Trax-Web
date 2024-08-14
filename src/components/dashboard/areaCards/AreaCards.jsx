import AreaCard from "./AreaCard";
import {React, useEffect, useState} from "react";
import "./AreaCards.scss";
import { supabase } from "../../helper/supabaseClient";
import { format, startOfDay, endOfDay } from 'date-fns';

const AreaCards = () => {
  const [logHistory, setLogs] = useState([]);
  const [logCount, setLogCount] = useState(0);
  const [todayLogCount, setTodayLogCount] = useState(0);
  const [highestWindow, setHighestWindow] = useState({ window_no: '', count: 0 });
  const windowNoDescriptions = {
    W1: 'Window 1',
    W2: 'Window 2',
    W3: 'Window 3',
    W4: 'Window 4',
    W5: 'Window 5',
    W6: 'Window 6'
  };

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: false });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLogs(data);
        setLogCount(data.length);

        
        const todayStart = startOfDay(new Date()).toISOString();
        const todayEnd = endOfDay(new Date()).toISOString();

        
        const todayLogs = data.filter(log => 
          log.transaction_date >= todayStart && log.transaction_date <= todayEnd
        );

        setTodayLogCount(todayLogs.length);

        const counts = { W1: 0, W2: 0, W3: 0, W4: 0, W5: 0, W6: 0 };

        data.forEach(log => {
          const window_no = log.window_no; 
          if (counts[window_no] !== undefined) {
            counts[window_no] += 1;
          }
        });

        let maxCount = 0;
        let maxWindow = '';

        for (const [window_no, count] of Object.entries(counts)) {
          if (count > maxCount) {
            maxCount = count;
            maxWindow = window_no;
          }
        }

        const fullWindowNo = windowNoDescriptions[maxWindow] || maxWindow;

        setHighestWindow({ window_no: fullWindowNo, count: maxCount });
          }
      }

    fetchData();
  }, []);

  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={0}
        cardInfo={{
          title: "Today's Visitors",
          value: todayLogCount,
          text: "",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={100}
        cardInfo={{
          title: "Total Transactions",
          value: logCount,
          text: "",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={40}
        cardInfo={{
          title: "Busiest Window",
          value: `${highestWindow.window_no}: ${highestWindow.count}`, 
          text: "",
        }}
      />
    </section>
  );
};

export default AreaCards;
