import React, { useState, useRef, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faPrint, faCaretRight, faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import LogHistoryTable from '../../components/logbook/logHistoryTable';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './logHistory.scss';
import { supabase } from "../../components/helper/supabaseClient";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => (
  <div className="date-range-picker">
    <div className="date-inputs">
      <div className="date-input-wrapper">
        <DatePicker
          selected={startDate}
          onChange={onStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          dateFormat="dd MMM yyyy"
        />
        {startDate && (
          <button
            className="clear-date-btn"
            onClick={() => onStartDateChange(null)}
            aria-label="Clear start date"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
      <div className="date-input-wrapper">
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
        {endDate && (
          <button
            className="clear-date-btn"
            onClick={() => onEndDateChange(null)}
            aria-label="Clear end date"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </div>
  </div>
);

const LogHistory = () => {
  const [selectedWindow, setSelectedWindow] = useState('All Windows');
  const [selectedPurposeType, setSelectedPurposeType] = useState('All');
  const [selectedSubOption, setSelectedSubOption] = useState('All');
  const [showDropdown, setShowDropdown] = useState({
    window: false,
    purpose: false,
    certification: false,
    cav: false,
  });
  const [searchPriority, setSearchPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [logHistory, setLogHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dropdownRefs = {
    window: useRef(null),
    purpose: useRef(null),
  };

  const CAV_CERTIFICATION_TYPES = ['DFA', 'PNP', 'BJMP', 'CHED', 'POEA', 'DEP-ED', 'BFP'];
  const CERTIFICATION_TYPES = [
    'CAR', 'GPA', 'Endorsement', 'Officially enrolled', 'Subjects enrolled',
    'USTP Conversion', 'English Medium of Instruction', 'Authorization Letter',
    'Letter of No Objection', 'Graduated', 'Earned Units', 'Grading System', 'Subjects w/ grades',
  ];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: false });
      if (error) console.error('Error fetching data:', error);
      else setLogHistory(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setShowDropdown((prev) => ({ ...prev, [key]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePurposeChange = (purpose, subOption = 'All') => {
    setSelectedPurposeType(purpose);
    setSelectedSubOption(subOption);
    setShowDropdown({ ...showDropdown, purpose: false, certification: false, cav: false });
  };

  const handleWindowChange = (window) => {
    setSelectedWindow(window);
    setShowDropdown({ ...showDropdown, window: false });
  };

  const filteredData = useMemo(() => logHistory.filter(log => {
    const purposeMatch =
      selectedPurposeType === 'All' ||
      (selectedPurposeType === 'CAV Certification Thru' && (
        selectedSubOption === 'All' || log.purpose === selectedSubOption
      )) ||
      (selectedPurposeType === 'Certification' && (
        selectedSubOption === 'All' || log.purpose === selectedSubOption
      )) ||
      log.purpose === selectedPurposeType;

    const windowMatch =
      selectedWindow === 'All Windows' ||
      `Window ${log.window_no.slice(1)}` === selectedWindow;

    const priorityMatch = log.queue_no.toString().toLowerCase().includes(searchPriority.toLowerCase());

    const dateMatch = (!startDate || !endDate) ||
      (new Date(log.transaction_date) >= startDate && new Date(log.transaction_date) <= endDate);

    return purposeMatch && windowMatch && priorityMatch && dateMatch;
  }), [logHistory, selectedWindow, selectedPurposeType, selectedSubOption, searchPriority, startDate, endDate]);

  const handlePrint = () => {
    const doc = new jsPDF();
    const windows = ["Window 1", "Window 2", "Window 3", "Window 4", "Window 5", "Window 6"];
    const fileName = selectedWindow === "All Windows" ? "All Windows Log History" : `${selectedWindow} Log History`;

    const renderWindowData = (data, title) => {
      doc.setFontSize(16);
      doc.text(title, 105, 20, null, null, 'center');
      const rows = data.map(log => [log.transaction_date, log.name, log.purpose, log.queue_no]);
      doc.autoTable({
        head: [['DATE', 'NAME', 'PURPOSE', 'QUEUE NO.']],
        body: rows,
        startY: 30,
        theme: 'striped',
      });
    };

    if (selectedWindow === "All Windows") {
      windows.forEach((window, index) => {
        const data = filteredData.filter(log => `Window ${log.window_no.slice(1)}` === window);
        if (data.length > 0) {
          if (index > 0) doc.addPage();
          renderWindowData(data, window);
        }
      });
    } else {
      renderWindowData(filteredData, selectedWindow);
    }

    doc.save(`${fileName}.pdf`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="log-history">
      <h1>Hello, Ma'am Jonalin!</h1>
      <p>This is the <strong>Log History</strong> for All Windows.</p>

      <div className="filters">
        <span>Filter By:</span>
        <div ref={dropdownRefs.window}>
          <button onClick={() => setShowDropdown((prev) => ({ ...prev, window: !prev.window }))}>
            {selectedWindow} <FontAwesomeIcon icon={faCaretDown} />
          </button>
          {showDropdown.window && (
            <ul>
              <li onClick={() => handleWindowChange('All Windows')}>All Windows</li>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <li key={num} onClick={() => handleWindowChange(`Window ${num}`)}>Window {num}</li>
              ))}
            </ul>
          )}
        </div>
        {/* Purpose Dropdown */}
        <div ref={dropdownRefs.purpose}>
          {/* Render Dropdown */}
        </div>
        <button onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
      </div>

      <LogHistoryTable logData={filteredData} />
    </div>
  );
};

export default LogHistory;
