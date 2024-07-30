import React, { useState, useEffect } from 'react'; 
import "./AreaTable.scss";
import { supabase } from '../../helper/supabaseClient';

const TABLE_HEADS = [
  "Date",
  "Name",
  "Purpose",
  "Status",
  "Window No.",
];

const AreaTable = () => {
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrants = async () => {
      try {
        let { data, error } = await supabase
          .from('log_history')
          .select()
          .order('transaction_date', { ascending: false }); 
        if (error) {
          console.log(error);
          throw error;
        }
        setLogHistory(data);
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

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Transactions</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logHistory.slice(0, 10).map((dataItem) => (
              <tr key={dataItem.id}>
                <td>{dataItem.transaction_date}</td>
                <td>{dataItem.name}</td>
                <td>{dataItem.purpose}</td>
                <td>
                  <div className="dt-status">
                    <span className={`dt-status-dot dot-${dataItem.status.toLowerCase()}`}></span>
                    <span className="dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>{dataItem.window_no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
