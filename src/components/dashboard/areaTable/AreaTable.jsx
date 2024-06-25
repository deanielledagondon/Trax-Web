import React, { useState, useEffect } from 'react'; 
import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";
import { supabase } from '../../helper/supabaseClient';
import ReactPaginate from 'react-paginate';

const TABLE_HEADS = [
  "Date",
  "Name",
  "Purpose",
  "Status",
  "Window No.",
  "Actions",
];


const AreaTable = () => {
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  const pageCount = Math.ceil(logHistory.length / itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayItems = logHistory.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

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
            {displayItems.map((dataItem) => (
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
                <td className="dt-cell-action">
                  <AreaTableAction />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </section>
  );
};

export default AreaTable;
