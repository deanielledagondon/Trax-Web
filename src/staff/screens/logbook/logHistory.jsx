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
  const [filterPurpose, setFilterPurpose] = useState('All');
  const [searchPriority, setSearchPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [logHistory, setLogs] = useState([]);
  const [staffName, setStaffName] = useState('');
  const [windowNo, setWindowNo] = useState([]);
  const datePickerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);

      const { data: staffData, error: staffError } = await supabase
        .from('registrants')
        .select('full_name, window_no')
        .eq('id', parsedUser.id)
        .single();

      if (staffError) {
        console.error('Error fetching staff information:', staffError);
      } else {
        const firstName = staffData.full_name.split(' ')[0];
        setStaffName(firstName);
        setWindowNo([staffData.window_no]);
      }

      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .in('window_no', [staffData.window_no])
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

  const getFilteredData = () => {
    return logHistory.filter(log => {
      const purposeMatch = filterPurpose === 'All' || log.purpose.toLowerCase() === filterPurpose.toLowerCase();
      const priorityMatch = log.queue_no.toLowerCase().includes(searchPriority.toLowerCase());
      const dateMatch = (!startDate || !endDate) || (
        new Date(log.transaction_date) >= new Date(startDate) &&
        new Date(log.transaction_date) <= new Date(endDate)
      );
      return purposeMatch && priorityMatch && dateMatch;
    });
  };

  const handlePrint = () => {
    const filteredData = getFilteredData();

    const doc = new jsPDF();
    const columns = ['Date', 'Name', 'Purpose', 'Window No.', 'Queue No.'];
    const rows = filteredData.map(log => [
      log.transaction_date,
      log.name,
      log.purpose,
      log.window_no,
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
      <div className="greeting">
        <h1>Hello Ma'am {staffName}!</h1>
        <p className="small-font">This is your <span className="bold-text"> Log History </span> for {windowNo.length > 1 ? `${windowNo.join(', ')}` : ` Window ${windowNo[0]}` || 'N/A'}.</p>
      </div>
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
        <button className="print-btn" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>
      <LogHistoryTable 
        logData={getFilteredData()} 
        showWindowColumn={true}
      />
    </div>
  );
};

export default LogHistory;
