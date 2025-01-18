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
  const [selectedReason, setSelectedReason] = useState('All');
  const [showWindowDropdown, setShowWindowDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [searchPriority, setSearchPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [logHistory, setLogHistory] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [windowNo, setWindowNo] = useState(null);
  const datePickerRef = useRef(null);
  const windowDropdownRef = useRef(null);
  const purposeDropdownRef = useRef(null);
  const [activeDropdowns, setActiveDropdowns] = useState({
    purposeType: null,
    cavCertType: null,
    CertType: null
  });

  // Define all purpose types
  const CERTIFICATION_TYPES = ['CAR', 'GPA', 'Endorsement', 'Officially enrolled', 'Subjects enrolled', 'USTP Conversion', 'English Medium of Instruction', 'Authorization Letter', 'Letter of No Objection', 'Graduated', 'Earned Units', 'Grading System', 'Subjects w/ grades'];
  const CAV_CERTIFICATION_TYPES = ['DFA', 'PNP', 'BJMP', 'CHED', 'POEA', 'DEP-ED', 'BFP'];
  const OTHER_TYPES = ['Authentication', 'Diploma Replacement', 'Evaluation', 'Honorable Dismissal', 'Correction of Name', 'Transcript of Records', 'Permit to Study', 'Rush Fee', 'Form 137'];
  
  const COMMON_REASONS = ['All', 'For Evaluation', 'For Passport', 'For Employment', 'For Advanced Studies', 'For Scholarship', 'For Board Exam', 'For Personal File', 'For Ranking'];

  const normalizeString = (str) => {
    if (!str) return '';
    // Handle potential non-string inputs
    const stringValue = String(str);
    return stringValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  };

  const normalizeArrayStrings = (input) => {
    if (!input) return [];
    
    // Handle string input that might contain commas
    if (typeof input === 'string') {
      return input.split(',').map(item => normalizeString(item));
    }
    
    // Handle array input
    if (Array.isArray(input)) {
      return input.map(item => normalizeString(item));
    }
    
    // If neither string nor array, convert to string and normalize
    return [normalizeString(String(input))];
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("No user data found in localStorage");
          return;
        }
        
        const parsedUser = JSON.parse(user);
        if (!parsedUser.id) {
          console.error("No user ID found in parsed user data");
          return;
        }

        const { data: adminData, error: adminError } = await supabase
          .from("registrants")
          .select("full_name, window_no")
          .eq("id", parsedUser.id)
          .single();

        if (adminError) throw adminError;

        const firstName = adminData.full_name?.split(" ")[0] || "Admin";
        setAdminName(firstName);
        setWindowNo([adminData.window_no]);

        const { data: logData, error: logError } = await supabase
          .from("log_history")
          .select("*")
          .order('created_at', { ascending: false });

        if (logError) throw logError;
        setLogHistory(logData || []);
        
      } catch (error) {
        console.error("Error:", error);
        setLogHistory([]);
      } finally {
        setIsLoading(false);
      }
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePurposeChange = (purpose, subOption = 'All', reason = 'All') => {
    setSelectedPurposeType(purpose);
    setSelectedSubOption(subOption);
    setSelectedReason(reason);
    setActiveDropdowns({
      purposeType: null,
      cavCertType: null,
      CertType: null
    });
    setShowPurposeDropdown(false);
  };

  const toggleDropdown = (dropdownType, value) => {
    setActiveDropdowns(prev => ({
      ...prev,
      [dropdownType]: prev[dropdownType] === value ? null : value
    }));
  };

  
  const renderGenericReasonSubmenu = (purposeType) => (
    <ul className="reasons-submenu">
      {COMMON_REASONS.map(reason => (
        <li 
          key={reason} 
          onClick={() => handlePurposeChange(purposeType, undefined, reason)}
        >
          {reason}
        </li>
      ))}
      <li 
        key="others-reason" 
        onClick={() => handlePurposeChange(purposeType, undefined, 'Others')}
      >
        Others
      </li>
    </ul>
  );

  
     const renderPurposeDropdown = () => {
        return (
          <ul className="dropdown-menu">
            <li onClick={() => handlePurposeChange('All')}>All</li>
            
            {/* Certification */}
            <li 
            className="certification"
            onMouseEnter={() => toggleDropdown('purposeType', 'Certification')}
            onMouseLeave={() => toggleDropdown('purposeType', null)}
          >
            Certification
            <FontAwesomeIcon 
              icon={activeDropdowns.purposeType === 'Certification' ? faCaretDown : faCaretRight} 
              className="submenu-icon" 
            />
            {activeDropdowns.purposeType === 'Certification' && (
              <div className="submenu-container">
                <ul className="submenu">
                  <li onClick={() => handlePurposeChange('Certification', 'All', 'All')}>All</li>
                  {CERTIFICATION_TYPES.map(type => (
                    <li 
                      key={type}
                      onClick={() => handlePurposeChange('Certification', type, reason)}
                      onMouseEnter={() => toggleDropdown('CertType', type)}
                      onMouseLeave={() => toggleDropdown('CertType', null)}
                    >
                      {type}
                      <FontAwesomeIcon 
                        icon={activeDropdowns.CertType === type ? faCaretDown : faCaretRight} 
                        className="submenu-icon" 
                      />
                      {activeDropdowns.CertType === type && renderGenericReasonSubmenu(type)}
                    </li>
                  ))}
                  <li 
                    key="others-cert"
                    onClick={() => handlePurposeChange('Certification', 'Others', 'All')}
                  >
                    Others
                  </li>
                </ul>
              </div>
            )}
          </li>
            
                    {/* CAV Certification */}
                    
                         <li 
            className="cav-certification"
            onMouseEnter={() => toggleDropdown('purposeType', 'CAV Certification Thru')}
            onMouseLeave={() => toggleDropdown('purposeType', null)}
          >
            CAV Certification Thru
            <FontAwesomeIcon 
              icon={activeDropdowns.purposeType === 'CAV Certification Thru' ? faCaretDown : faCaretRight} 
              className="submenu-icon" 
            />
            {activeDropdowns.purposeType === 'CAV Certification Thru' && (
              <div className="submenu-container">
                <ul className="submenu">
                  <li onClick={() => handlePurposeChange('CAV Certification Thru', 'All', 'All')}>All</li>
                  {CAV_CERTIFICATION_TYPES.map(type => (
                    <li 
                      key={type}
                      onClick={() => handlePurposeChange('CAV Certification Thru', type, reason)}
                      onMouseEnter={() => toggleDropdown('cavCertType', type)}
                      onMouseLeave={() => toggleDropdown('cavCertType', null)}
                    >
                      {type}
                      <FontAwesomeIcon 
                        icon={activeDropdowns.cavCertType === type ? faCaretDown : faCaretRight} 
                        className="submenu-icon" 
                      />
                      {activeDropdowns.cavCertType === type && renderGenericReasonSubmenu(type)}
                    </li>
                  ))}
                  <li 
                    key="others-cav"
                    onClick={() => handlePurposeChange('CAV Certification Thru', 'Others', 'All')}
                  >
                    Others
                  </li>
                </ul>
              </div>
            )}
          </li>
                    
            {/* Other Types */}
            {OTHER_TYPES.map(type => (
              <li 
                key={type}
                className={type.toLowerCase().replace(/\s+/g, '-')}
                onMouseEnter={() => toggleDropdown('purposeType', type)}
                onMouseLeave={() => toggleDropdown('purposeType', null)}
              >
                {type}
                <FontAwesomeIcon 
                  icon={activeDropdowns.purposeType === type ? faCaretDown : faCaretRight} 
                  className="submenu-icon" 
                />
                {activeDropdowns.purposeType === type && renderGenericReasonSubmenu(type)}
              </li>
            ))}
    
            {/* General Inquiries */}
            <li 
              className="general-inquiries"
              onClick={() => handlePurposeChange('General Inquiries')}
            >
              General Inquiries
            </li>
          </ul>
        );
      };

    const handleClearSearch = () => {
    setSearchPriority("");
  };

  const filteredData = useMemo(() => {
  return logHistory.filter(log => {
    try {
      if (!log) return false;

      const purposesArray = normalizeArrayStrings(log.purpose);
      const reasonArray = normalizeArrayStrings(log.reason);
      
      const normalizedSelectedPurpose = normalizeString(selectedPurposeType);
      const normalizedSelectedSubOption = normalizeString(selectedSubOption);
      const normalizedSelectedReason = normalizeString(selectedReason);

      // Normalize type arrays
      const normalizedCertificationTypes = CERTIFICATION_TYPES.map(type => normalizeString(type));
      const normalizedCAVTypes = CAV_CERTIFICATION_TYPES.map(type => normalizeString(type));
      const normalizedOtherTypes = OTHER_TYPES.map(type => normalizeString(type));
      const allNormalizedSpecificPurposes = [
        ...normalizedCertificationTypes,
        ...normalizedCAVTypes,
        ...normalizedOtherTypes
      ];

      let purposeMatch = false;
      let reasonMatch = false;

      // Handle "All" purpose type
      if (normalizedSelectedPurpose === 'all') {
        purposeMatch = true;
        reasonMatch = true;
      }
      // Handle "General Inquiries"
      else if (normalizedSelectedPurpose === 'general inquiries') {
        purposeMatch = purposesArray.every(purpose => 
          !allNormalizedSpecificPurposes.some(specificPurpose => 
            purpose.includes(specificPurpose) || specificPurpose.includes(purpose)
          )
        );
        reasonMatch = true;
      }
      // Handle CAV Certification and regular Certification
      else if (normalizedSelectedPurpose === 'cav certification thru' || 
               normalizedSelectedPurpose === 'certification') {
        const relevantTypes = normalizedSelectedPurpose === 'cav certification thru' 
          ? normalizedCAVTypes 
          : normalizedCertificationTypes;

        if (normalizedSelectedSubOption === 'all') {
          purposeMatch = purposesArray.some(purpose =>
            relevantTypes.some(type => 
              purpose.includes(type) || type.includes(purpose)
            )
          );
        }
        // Handle "Others" sub-option
        else if (normalizedSelectedSubOption === 'others') {
          purposeMatch = purposesArray.some(purpose =>
            !relevantTypes.some(type => 
              purpose.includes(type) || type.includes(purpose)
            ) &&
            purpose.toLowerCase().includes(normalizedSelectedPurpose)
          );
        }
        else {
          purposeMatch = purposesArray.some(purpose =>
            purpose.includes(normalizedSelectedSubOption) || 
            normalizedSelectedSubOption.includes(purpose)
          );
        }

        // Handle reason matching including "Others"
        if (normalizedSelectedReason === 'others') {
          reasonMatch = reasonArray.some(reason =>
            !COMMON_REASONS.map(r => normalizeString(r)).includes(normalizeString(reason))
          );
        } else {
          reasonMatch = normalizedSelectedReason === 'all' || 
            reasonArray.some(reason =>
              reason.includes(normalizedSelectedReason) || 
              normalizedSelectedReason.includes(reason)
            );
        }
      }
      // Handle other purpose types
      else {
        if (normalizedSelectedPurpose === 'others') {
          // Match if the purpose is not in any of the predefined lists
          purposeMatch = purposesArray.some(purpose =>
            !allNormalizedSpecificPurposes.some(specificPurpose =>
              purpose.includes(specificPurpose) || specificPurpose.includes(purpose)
            )
          );
        } else {
          purposeMatch = purposesArray.some(purpose =>
            purpose.includes(normalizedSelectedPurpose) || 
            normalizedSelectedPurpose.includes(purpose)
          );
        }
        
        // Handle reason matching for other purpose types
        if (normalizedSelectedReason === 'others') {
          reasonMatch = reasonArray.some(reason =>
            !COMMON_REASONS.map(r => normalizeString(r)).includes(normalizeString(reason))
          );
        } else {
          reasonMatch = normalizedSelectedReason === 'all' || 
            reasonArray.some(reason =>
              reason.includes(normalizedSelectedReason) || 
              normalizedSelectedReason.includes(reason)
            );
        }
      }

      const windowMatch = selectedWindow === 'All Windows' || 
        `Window ${log.window_no.slice(1)}` === selectedWindow;

      const priorityMatch = log.queue_no
        ? log.queue_no.toString().toLowerCase().includes(searchPriority.toLowerCase())
        : false;

      let dateMatch = true;
      if (startDate && endDate) {
        const logDate = new Date(log.created_at);
        if (isNaN(logDate.getTime())) {
          console.warn('Invalid date found:', log.created_at);
          dateMatch = false;
        } else {
          const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
          const endDateTime = new Date(endDate).setHours(23, 59, 59, 999);
          dateMatch = logDate >= startDateTime && logDate <= endDateTime;
        }
      }

      return purposeMatch && reasonMatch && windowMatch && dateMatch && priorityMatch;
    } catch (error) {
      console.error('Error filtering log entry:', error);
      return false;
    }
  });
}, [
  logHistory,
  selectedWindow,
  selectedPurposeType,
  selectedSubOption,
  selectedReason,
  searchPriority,
  startDate,
  endDate,
]);

  const handleWindowChange = (window) => {
    setSelectedWindow(window);
    setShowWindowDropdown(false);
  };

  

  

  const handlePrint = () => {
    const doc = new jsPDF();
    const windows = ["Window 1", "Window 2", "Window 3", "Window 4", "Window 5", "Window 6"];
    const fileName = selectedWindow === "All Windows" ? "All Windows Log History" : `${selectedWindow} Log History`;
  
    const currentDate = new Date().toISOString().split('T')[0];
    doc.setProperties({ title: fileName });
  
    const columns = ['DATE', 'NAME', 'PURPOSE', 'REASON', 'QUEUE NO.'];
  
    // Format date function
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        
      });
    };
  
    const extractName = (fullName) => {
      const courseIdentifiers = ['BSE', 'BSIT', 'BSCS', 'BS', 'BA', 'BEE', 'BSA', 'BSCE', 'BTLED', 'BTLED', 'BSESM', 'PSDE', 'BSArch','BSCE','BSECE','BSEE','BSME','BSCoE','BSGE','BSDS','BSCS','BSIT','BSTCM','BS Applied Physics','BS Applied Math','BS Chem','BS Env Sci','BS Food Tech','BS Autotronics','BSET',
        'BSESM','BSEMT','BSMET','BSED','BTLED','BTVTED','PhD Math Ed','PhD Tech Ed', 'PhD Sci Ed (Chem)','MEng','MSEE','MSSD','MSAMS','MS Math Ed','MS Sci Ed (Chem)','MS Sci Ed (Physics)','MSTCM','PSM PSEM','MIT'];
      
      let cleanName = fullName.replace(/\s+/g, ' ').trim();
      const parts = cleanName.split(' ');
      let cutoffIndex = parts.length;
      for (let i = 0; i < parts.length; i++) {
        if (courseIdentifiers.some(identifier => 
            parts[i].includes(identifier) || 
            parts[i] === 'F' || 
            parts[i] === '-')) {
          cutoffIndex = i;
          break;
        }
      }
      const nameParts = parts.slice(0, cutoffIndex);
      return nameParts.join(' ').trim();
    };
  
    const renderWindowData = (filteredWindowData, windowTitle) => {
      const rows = filteredWindowData.map(log => {
        // Extract only the name part
        const nameOnly = extractName(log.name);
        
        // Debug log to check the extraction
        console.log('Original name:', log.name);
        console.log('Extracted name:', nameOnly);
        
        return [
          formatDate(log.created_at),  // Use created_at with proper formatting
          nameOnly,
          log.purpose,
          log.reason ? log.reason : 'N/A',  // Add N/A if reason is empty
          log.queue_no,
        ];
      });
  
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 40,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 0, 128],
          textColor: [255, 255, 255],
          halign: 'center',
        },
        bodyStyles: {
          halign: 'center',
        },
      });
    };
  
    if (selectedWindow === "All Windows") {
      windows.forEach((window, index) => {
        const filteredWindowData = filteredData.filter(log => `Window ${log.window_no.slice(1)}` === window);
        
        if (filteredWindowData.length > 0) {
          if (index > 0) doc.addPage();
          
          doc.setFontSize(18);
          doc.text("Log History", 105, 25, null, null, 'center');
  
          doc.setFontSize(13);
          doc.text(window, 105, 35, null, null, 'center');
          
          renderWindowData(filteredWindowData, window);
        }
      });
    } else {
      const filteredWindowData = filteredData.filter(
        log => `Window ${log.window_no.slice(1)}` === selectedWindow
      );
  
      if (filteredWindowData.length > 0) {
        doc.setFontSize(18);
        doc.text("Log History", 105, 25, null, null, 'center');
  
        doc.setFontSize(13);
        doc.text(selectedWindow, 105, 35, null, null, 'center');
  
        renderWindowData(filteredWindowData, selectedWindow);
      } else {
        doc.setFontSize(12);
        doc.text("No data available for the selected window.", 105, 20, null, null, 'center');
      }
    }
  
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.title = fileName;
      const embed = newTab.document.createElement("embed");
      embed.src = pdfUrl;
      embed.width = "100%";
      embed.height = "100%";
      embed.type = "application/pdf";
      newTab.document.body.appendChild(embed);
    }
  
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
  };

  if (isLoading) {
    return <div> Loading... </div>;
  }
  

  return (
    <div className="log-history">
      <div className="greetings">
  <h1>Hello {adminName}!</h1>
  <p className="small-font">
    This is the <span className="bold-text">Log History</span> for{' '}
    {selectedWindow === 'All Windows' ? 'All Windows' : selectedWindow}.
  </p>
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
            ? 'CAV Certification Thru'
            : selectedPurposeType === 'Certification' && selectedSubOption === 'All'
              ? 'Certification'
              : selectedPurposeType !== 'All'
                ? selectedSubOption !== 'All'
                  ? selectedReason !== 'All'
                    ? `${selectedPurposeType} - ${selectedReason}`
                    : `${selectedPurposeType} - ${selectedSubOption} `
                  : selectedPurposeType
                : 'Purpose Type'}
          <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
        </button>
        
        {showPurposeDropdown && renderPurposeDropdown()}
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