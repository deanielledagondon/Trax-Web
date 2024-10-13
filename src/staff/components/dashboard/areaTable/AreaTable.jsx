import React, { useState, useEffect } from "react";
import "./AreaTable.scss";
import { supabase } from "../../helper/supabaseClient";
import ReactPaginate from "react-paginate";

const TABLE_HEADS = ["Date", "Name", "Purpose", "Status", "Window No."];

const AreaTable = () => {
  const [logHistory, setLogHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [windowNo, setWindowNo] = useState([]);
  const itemsPerPage = 20;
  const pageCount = Math.ceil(logHistory.length / itemsPerPage);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const displayItems = logHistory.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    const fetchWindow = async () => {
      try {
        let { data, error } = await supabase
          .from("registrants")
          .select("window_no")
          .eq("id", parsedUser.id)
          .single();

        if (error) throw error;
        setWindowNo(data.window_no);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWindow();
  }, [parsedUser.id]);

  useEffect(() => {
    const fetchLogHistory = async () => {
      if (windowNo.length === 0) return; // Don't fetch if windowNo is not set yet

      try {
        let { data, error } = await supabase
          .from("log_history")
          .select()
          .in("window_no", windowNo)
          .order("transaction_date", { ascending: false });

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

    fetchLogHistory();
  }, [windowNo]);

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
                    <span
                      className={`dt-status-dot dot-${dataItem.status.toLowerCase()}`}
                    ></span>
                    <span className="dt-status-text">{dataItem.status}</span>
                  </div>
                </td>
                <td>{dataItem.window_no}</td>
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
