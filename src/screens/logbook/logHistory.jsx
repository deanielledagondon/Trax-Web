import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faPrint } from '@fortawesome/free-solid-svg-icons';
import LogHistoryTable from '../../components/logbook/logHistoryTable';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './logHistory.scss';
import { supabase } from "../../components/helper/supabaseClient";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="date-range-picker">
      <div className="date-inputs">
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="dd MMM yyyy"
          
        />
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          dateFormat="dd MMM yyyy"
        />
      </div>
      <div className="calendars">
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          inline
        />
        <DatePicker
          selected={endDate}
          onChange={onEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          inline
        />
      </div>
    </div>
  );
};

const LogHistory = () => {
  const [selectedWindow, setSelectedWindow] = useState('All Windows');
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [searchPriority, setSearchPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [logHistory, setLogs] = useState([]);
  const datePickerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: true });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLogs(data);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  const handleWindowChange = (event) => {
    setSelectedWindow(event.target.value);
  };

  const getFilteredData = () => {
    const filteredData = selectedWindow === 'All Windows'
      ? logHistory
      : logHistory.filter(log => log.window_no === selectedWindow);

    return filteredData.filter(log => {
      const purposeMatch = filterPurpose === 'All' || log.purpose === filterPurpose;
      const priorityMatch = log.queue_no.toLowerCase().includes(searchPriority.toLowerCase());
      const dateMatch = (!startDate || !endDate) || (new Date(log.transaction_date) >= startDate && new Date(log.transaction_date) <= endDate);
      return purposeMatch && priorityMatch && dateMatch;
    });
  };
  const handlePrint = () => {
    const filteredData = getFilteredData();

    const doc = new jsPDF();
    const columns = ['Date', 'Name', 'Window', 'Purpose', 'Queue No.'];
    const rows = filteredData.map(log => [
      log.transaction_date,
      log.name,
      log.window_no,
      log.purpose,
      log.queue_no
    ]);

  
    const header = () => {
        doc.setFontSize(16);
        doc.text("Log History", 105, 20, null, null, 'center');
    };

    doc.autoTable({
      head: [columns],
      body: rows,
      margin: { top: 30 },
      theme: 'striped',
      headStyles: {
        fillColor: [0, 0, 128], 
        textColor: [255, 255, 255], 
        halign: 'center', 
      },
      bodyStyles: {
        halign: 'center', 
      },
      didDrawPage: (data) => {
        header(); 
      },
      startY: 30, 
    });


    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };


  return (
    <div className="log-history"> 
      <h1>Log History</h1>
      <div className="filters">
        <span>Filter by:</span>
        <div className="date-picker-container" ref={datePickerRef}>
          <button className="date-container" onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>   
            <span className="date-text">Date</span>
            <span className="date-icon"><FontAwesomeIcon icon={faCalendarAlt} /></span>
          </button>
          {isDatePickerOpen && (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onClose={() => setIsDatePickerOpen(false)}
            />
          )}
        </div>
        <select onChange={handleWindowChange} value={selectedWindow}>
          <option value="All Windows">All Windows</option>
          <option value="W1">Window 1</option>
          <option value="W2">Window 2</option>
          <option value="W3">Window 3</option>
          <option value="W4">Window 4</option>
          <option value="W5">Window 5</option>
          <option value="W6">Window 6</option>
        </select>
        <select onChange={(e) => setFilterPurpose(e.target.value)} value={filterPurpose}>
          <option value="All">Purpose Type</option>
          <option value="TOR">TOR</option>
          <option value="Certificate">Certificate</option>
          <option value="Graduation">Graduation</option>
          <option value="Transfer">Transfer</option>
          <option value="Enrollment">Enrollment</option>
          <option value="Completion of INC">Completion of INC</option>
        </select>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Priority No."
            value={searchPriority}
            onChange={(e) => setSearchPriority(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>
        <button onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>  
      
      <LogHistoryTable 
        logData={getFilteredData()} 
        showWindowColumn={selectedWindow === 'All Windows'}
      />
    </div>
  );
};

export default LogHistory;