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

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
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
  const [selectedPurposeType, setSelectedPurposeType] = useState('All');
  const [selectedSubOption, setSelectedSubOption] = useState('All');
  const [showWindowDropdown, setShowWindowDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showCertificationSubmenu, setShowCertificationSubmenu] = useState(false);
  const [showCavSubmenu, setShowCavSubmenu] = useState(false);
  const [searchPriority, setSearchPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [logHistory, setLogHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const datePickerRef = useRef(null);
  const windowDropdownRef = useRef(null);
  const purposeDropdownRef = useRef(null);

  const CAV_CERTIFICATION_TYPES = ['DFA', 'PNP', 'BJMP', 'CHED', 'POEA', 'DEP-ED', 'BFP'];
  const CERTIFICATION_TYPES = ['CAR', 'GPA', 'Endorsement', 'Officially enrolled', 'Subjects enrolled', 'USTP Conversion', 'English Medium of Instruction', 'Authorization Letter', 'Letter of No Objection', 'Graduated', 'Earned Units', 'Grading System', 'Subjects w/ grades'];

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('log_history')
        .select('*')
        .order('transaction_date', { ascending: true });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setLogHistory(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (windowDropdownRef.current && !windowDropdownRef.current.contains(event.target)) {
        setShowWindowDropdown(false);
      }
      if (purposeDropdownRef.current && !purposeDropdownRef.current.contains(event.target)) {
        setShowPurposeDropdown(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handlePurposeChange = (purpose, subOption = 'All') => {
    console.log('handlePurposeChange called with:', purpose, subOption);
    
    setSelectedPurposeType(purpose);
    setSelectedSubOption(subOption);
    
    setShowCertificationSubmenu(false);
    setShowCavSubmenu(false);
    setShowPurposeDropdown(false);
  };

  
  const handleWindowChange = (window) => {
    console.log('Changing window to:', window);
    setSelectedWindow(window);
    setShowWindowDropdown(false);
  };

  const handleClearSearch = () => {
    setSearchPriority('');
  };


  const filteredData = useMemo(() => {
    console.log("Filtering data...");
    console.log("Selected Purpose:", selectedPurposeType);
    console.log("Selected Submenu:", selectedSubOption);
    
   
  
    return logHistory.filter(log => {
      let purposeMatch = false;
  
      if (selectedPurposeType === 'All') {
        purposeMatch = true;
      } else if (selectedPurposeType === 'CAV Certification Thru') {
        if (selectedSubOption === 'All') {
          purposeMatch = CAV_CERTIFICATION_TYPES.includes(log.purpose);
        } else {
          purposeMatch = log.purpose === selectedSubOption;
        }
      } else if (selectedPurposeType === 'Certification') {
        if (selectedSubOption === 'All') {
          purposeMatch = CERTIFICATION_TYPES.includes(log.purpose);
        } else {
          purposeMatch = log.purpose === selectedSubOption;
        }
      } else {
        purposeMatch = log.purpose === selectedPurposeType;
      }
  
      const windowMatch = selectedWindow === 'All Windows' || `Window ${log.window_no.slice(1)}` === selectedWindow;
      const priorityMatch = log.queue_no.toString().toLowerCase().includes(searchPriority.toLowerCase());
      const dateMatch = (!startDate || !endDate) || 
        (new Date(log.transaction_date) >= startDate && new Date(log.transaction_date) <= endDate);
  
      return purposeMatch && windowMatch && priorityMatch && dateMatch;
    });
  }, [logHistory, selectedWindow, selectedPurposeType, selectedSubOption, searchPriority, startDate, endDate]);

  console.log("Filtered data length:", filteredData.length);


  const handlePrint = () => {
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

  if (isLoading) {
    return <div> Loading... </div>;
  }
  

  return (
    <div className="log-history">
      <div className="greetings">
        <h1>Hello, Ma'am Jonalin!</h1>
        <p className="small-font">This is the <span className="bold-text"> Log History </span> for All Windows.</p>
      </div>
      <div className="filters">
        <span>Filter By:</span>
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
            />
          )}
        </div>

        <div className="dropdown-all-windows" ref={windowDropdownRef}>
          <button
            onClick={() => {
              setShowWindowDropdown(!showWindowDropdown);
              setShowPurposeDropdown(false);
              setIsDatePickerOpen(false);
            }}
            className="dropdown-button"
          >
            {selectedWindow}
            <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
          </button>
          {showWindowDropdown && (
            <ul className="dropdown-menu">
              <li onClick={() => handleWindowChange('All Windows')}>All Windows</li>
              <li onClick={() => handleWindowChange('Window 1')}>Window 1</li>
              <li onClick={() => handleWindowChange('Window 2')}>Window 2</li>
              <li onClick={() => handleWindowChange('Window 3')}>Window 3</li>
              <li onClick={() => handleWindowChange('Window 4')}>Window 4</li>
              <li onClick={() => handleWindowChange('Window 5')}>Window 5</li>
              <li onClick={() => handleWindowChange('Window 6')}>Window 6</li>
            </ul>
          )}
        </div>

        <div className="custom-dropdown" ref={purposeDropdownRef}>
          <button
            onClick={() => {
              setShowPurposeDropdown(!showPurposeDropdown);
              setShowWindowDropdown(false);
              setIsDatePickerOpen(false);
            }}
            className="dropdown-button"
          >
            {selectedPurposeType === 'CAV Certification Thru' && selectedSubOption === 'All'
              ? 'CAV Certification Thru - All'
              : selectedPurposeType === 'Certification' && selectedSubOption === 'All'
                ? 'Certification - All'
                : selectedPurposeType !== 'All'
                  ? selectedSubOption !== 'All'
                    ? `${selectedPurposeType} - ${selectedSubOption}`
                    : selectedPurposeType
                  : 'Purpose Type'}
            <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
          </button>
          {showPurposeDropdown && (
            <ul className="dropdown-menu">
              <li onClick={() => handlePurposeChange('All')}>All</li>
              <li
                className="certification"
                onMouseEnter={() => setShowCertificationSubmenu(true)}
                onMouseLeave={() => setShowCertificationSubmenu(false)}
              >
                Certification
                <FontAwesomeIcon icon={faCaretRight} className="submenu-icon" />
                {showCertificationSubmenu && (
                  <ul className="submenu">
                    <li onClick={() => handlePurposeChange('Certification', 'All')}>All</li>
                    
                    {CERTIFICATION_TYPES.map(type => (
                      <li key={type} onClick={() => handlePurposeChange('Certification', type)}>{type}</li>
                    ))}
                  </ul>
                )}
              </li>
              <li
                className="cav-certification"
                onMouseEnter={() => setShowCavSubmenu(true)}
                onMouseLeave={() => setShowCavSubmenu(false)}
              >
                CAV Certification Thru
                <FontAwesomeIcon icon={faCaretRight} className="submenu-icon" />
                {showCavSubmenu && (
                  <ul className="submenu">
                    <li onClick={() => handlePurposeChange('CAV Certification Thru', 'All')}>All</li>
                    {CAV_CERTIFICATION_TYPES.map(type => (
                      <li key={type} onClick={() => handlePurposeChange('CAV Certification Thru', type)}>{type}</li>
                    ))}
                  </ul>
                )}
              </li>
              <li onClick={() => handlePurposeChange('Authentication')}>Authentication</li>
              <li onClick={() => handlePurposeChange('Diploma Replacement')}>Diploma Replacement</li>
              <li onClick={() => handlePurposeChange('Evaluation')}>Evaluation</li>
              <li onClick={() => handlePurposeChange('Honorable Dismissal')}>Honorable Dismissal</li>
              <li onClick={() => handlePurposeChange('Correction of Name')}>Correction of Name</li>
              <li onClick={() => handlePurposeChange('Transcript of Records')}>Transcript of Records</li>
              <li onClick={() => handlePurposeChange('Permit to Study')}>Permit to Study</li>
              <li onClick={() => handlePurposeChange('Rush Fee')}>Rush Fee</li>
              <li onClick={() => handlePurposeChange('Form 137')}>Form 137</li>
            </ul>
          )}
        </div>

        <div className="search-container">
          <div className="search-queue-wrapper">
            <input
              type="text"
              placeholder="Search Queue No."
              value={searchPriority}
              onChange={(e) => setSearchPriority(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            {searchPriority && (
              <button onClick={handleClearSearch} className="clear-search-btn">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>

        <div className="print-button-container">
          <button onClick={handlePrint} className="print-button">
            <FontAwesomeIcon icon={faPrint} className="print-icon" />
            Print
          </button>
        </div>
      </div>

     <div className="table-container">
        {filteredData.length > 0 ? (
          <LogHistoryTable logData={filteredData} />
        ) : (
          <p>No log history data available.</p>
        )}
      </div>
    </div>
  );
};

export default LogHistory;
