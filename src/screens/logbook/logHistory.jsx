
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import LogHistoryTable from '../../components/logbook/logHistoryTable';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './logHistory.scss';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const datePickerRef = useRef(null);

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

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const data = {
    "Window 1": [
      { date: "5-13-24", name: "Mikaelson, Elijah", purpose: "Graduation", priority: "W1001", window: "Window 1"},
      { date: "5-13-24", name: "Garcia, Klaus", purpose: "Transfer", priority: "W1002", window: "Window 1" },
      { date: "5-13-24", name: "Martinez, Rose", purpose: "Enrollment", priority: "W1003", window: "Window 1" },
      { date: "5-13-24", name: "Davis, Hope", purpose: "Transfer", priority: "W1004", window: "Window 1" },
      { date: "5-13-24", name: "Rodriguez, Marcus", purpose: "Graduation", priority: "W1005", window: "Window 1" },
      { date: "5-13-24", name: "Hernandez, Johny", purpose: "Enrollment", priority: "W1006", window: "Window 1" },
      { date: "5-13-24", name: "Lopez, Mark", purpose: "Graduation", priority: "W1007", window: "Window 1" },
      { date: "5-13-24", name: "Gonzales, Mica", purpose: "Completion of INC", priority: "W1008", window: "Window 1" },
      { date: "5-13-24", name: "Martin, Adrian", purpose: "TOR", priority: "W1009", window: "Window 1" },
      { date: "5-13-24", name: "Jackson, Francine", purpose: "Graduation", priority: "W1010", window: "Window 1" },
      
    ],
    "Window 2": [
      { date: "5-14-24", name: "Thompson, Rhea", purpose: "Graduation", priority: "W2001", window: "Window 2" },
      { date: "5-14-24", name: "White, Kent", purpose: "Transfer", priority: "W2002", window: "Window 2" },
      { date: "5-14-24", name: "Harris, Roselyn", purpose: "Certificate", priority: "W2003", window: "Window 2" },
      { date: "5-14-24", name: "Sanchez, Lovely", purpose: "Transfer", priority: "W2004", window: "Window 2" },
      { date: "5-14-24", name: "Clark, Daniel", purpose: "Graduation", priority: "W2005", window: "Window 2" },
      { date: "5-14-24", name: "Ramirez, Precious", purpose: "TOR", priority: "W2006", window: "Window 2" },
      { date: "5-14-24", name: "Lewis, Martin", purpose: "Graduation", priority: "W2007", window: "Window 2" },
      { date: "5-14-24", name: "Robinson, Rico", purpose: "Completion of INC", priority: "W2008", window: "Window 2" },
      { date: "5-14-24", name: "Walker, Peter", purpose: "TOR", priority: "W2009", window: "Window 2" },
      { date: "5-14-24", name: "Young, Luke", purpose: "Graduation", priority: "W2010", window: "Window 2" },
      
    ],
    "Window 3": [
      { date: "5-15-24", name: "Wright, Hansel", purpose: "Graduation", priority: "W3001", window: "Window 3" },
      { date: "5-15-24", name: "Scott, Mercy", purpose: "Transfer", priority: "W3002", window: "Window 3" },
      { date: "5-15-24", name: "Torres, Dave", purpose: "Enrollment", priority: "W3003", window: "Window 3" },
      { date: "5-15-24", name: "Nguyen, Harvey", purpose: "Transfer", priority: "W3004", window: "Window 3" },
      { date: "5-15-24", name: "Hill, Enrique", purpose: "Graduation", priority: "W3005", window: "Window 3" },
      { date: "5-15-24", name: "Flores, Neon", purpose: "TOR", priority: "W3006", window: "Window 3" },
      { date: "5-15-24", name: "Green, Harold", purpose: "Graduation", priority: "W3007", window: "Window 3" },
      { date: "5-15-24", name: "Adams, Samantha", purpose: "Completion of INC", priority: "W3008", window: "Window 3" },
      { date: "5-15-24", name: "Nelson, Kate", purpose: "TOR", priority: "W3009", window: "Window 3" },
      { date: "5-15-24", name: "Baker, Cath", purpose: "Graduation", priority: "W3010", window: "Window 3" },
      
    ],
    "Window 4": [
      { date: "5-16-24", name: "Campbel, Anne", purpose: "Graduation", priority: "W4001", window: "Window 4" },
      { date: "5-16-24", name: "Mitchell, Carlo", purpose: "Transfer", priority: "W4002", window: "Window 4" },
      { date: "5-16-24", name: "Carter, Rey", purpose: "Certificate", priority: "W4003", window: "Window 4" },
      { date: "5-16-24", name: "Roberts, Aldrin", purpose: "Transfer", priority: "W4004", window: "Window 4" },
      { date: "5-16-24", name: "Gomez, Greg", purpose: "Graduation", priority: "W4005", window: "Window 4"},
      { date: "5-16-24", name: "Philips, Juan", purpose: "TOR", priority: "W4006", window: "Window 4" },
      { date: "5-16-24", name: "Evanz, Carl", purpose: "Graduation", priority: "W4007", window: "Window 4" },
      { date: "5-16-24", name: "Turner, Louie", purpose: "Completion of INC", priority: "W4008", window: "Window 4" },
      { date: "5-16-24", name: "Diaz, Abner", purpose: "TOR", priority: "W4009", window: "Window 4" },
      { date: "5-16-24", name: "Parker, Arjay", purpose: "Graduation", priority: "W4010", window: "Window 4" },
      
    ],
    "Window 5": [
      { date: "5-17-24", name: "Collins, Missy", purpose: "Graduation", priority: "W5001", window: "Window 5" },
      { date: "5-17-24", name: "Reyes, Laura", purpose: "Transfer", priority: "W5002", window: "Window 5" },
      { date: "5-17-24", name: "Stewart, Florante", purpose: "Certificate", priority: "W5003", window: "Window 5"},
      { date: "5-17-24", name: "Morris, Ibrahim", purpose: "Transfer", priority: "W5004", window: "Window 5" },
      { date: "5-17-24", name: "Morales, Shakira", purpose: "Graduation", priority: "W5005", window: "Window 5" },
      { date: "5-17-24", name: "Murphy, Shanne", purpose: "TOR", priority: "W5006", window: "Window 5" },
      { date: "5-17-24", name: "Cook, Pauline", purpose: "Graduation", priority: "W5007", window: "Window 5" },
      { date: "5-17-24", name: "Regers, Alex", purpose: "Completion of INC", priority: "W5008", window: "Window 5" },
      { date: "5-17-24", name: "Gutierrez, Reynold", purpose: "TOR", priority: "W5009", window: "Window 5" },
      { date: "5-17-24", name: "Ortiz, Rufa", purpose: "Graduation", priority: "W5010", window: "Window 5" },
      
    ],
    "Window 6": [
      { date: "5-18-24", name: "Bailey, Patrick", purpose: "Graduation", priority: "W6001", window: "Window 6" },
      { date: "5-18-24", name: "Reed, Ronald", purpose: "Transfer", priority: "W6002",window: "Window 6" },
      { date: "5-18-24", name: "Kelly, Josie", purpose: "Certificate", priority: "W6003",window: "Window 6" },
      { date: "5-18-24", name: "Howard, Roel", purpose: "Transfer", priority: "W6004",window: "Window 6" },
      { date: "5-18-24", name: "Ramos, Kathleen", purpose: "Graduation", priority: "W6005",window: "Window 6" },
      { date: "5-18-24", name: "Cooper, Sheldon", purpose: "TOR", priority: "W6006",window: "Window 6" },
      { date: "5-18-24", name: "Peterson, George", purpose: "Graduation", priority: "W6007",window: "Window 6" },
      { date: "5-18-24", name: "Allen, Alice", purpose: "Completion of INC", priority: "W6008",window: "Window 6" },
      { date: "5-18-24", name: "King, James", purpose: "Graduation", priority: "W6009",window: "Window 6" },
      { date: "5-18-24", name: "Rivera, Iris", purpose: "Graduation", priority: "W6010",window: "Window 6" },
     
    ]
  };
  const handleWindowChange = (event) => {
    setSelectedWindow(event.target.value);
  };

  const getFilteredData = () => {
    let filteredData = selectedWindow === 'All Windows' ? Object.values(data).flat() : data[selectedWindow] || [];
    
    return filteredData.filter(log => {
      const purposeMatch = filterPurpose === 'All' || log.purpose === filterPurpose;
      const priorityMatch = log.priority.toLowerCase().includes(searchPriority.toLowerCase());
      const dateMatch = (!startDate || !endDate) || (new Date(log.date) >= startDate && new Date(log.date) <= endDate);
      return purposeMatch && priorityMatch && dateMatch;
    });
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
          <option value="Window 1">Window 1</option>
          <option value="Window 2">Window 2</option>
          <option value="Window 3">Window 3</option>
          <option value="Window 4">Window 4</option>
          <option value="Window 5">Window 5</option>
          <option value="Window 6">Window 6</option>
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
      </div>  
      <LogHistoryTable 
        logData={getFilteredData()} 
        showWindowColumn={selectedWindow === 'All Windows'}
      />
    </div>
  );
};

export default LogHistory;
