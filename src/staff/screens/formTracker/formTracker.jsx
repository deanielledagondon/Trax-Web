import React, { useState, useRef } from "react";
import "./formTracker.scss";

const StaffFormTracker = () => {
  const [formData, setFormData] = useState([
    { date: "2024-12-01", user: "John Doe", form: "INC Form" },
    { date: "2024-12-02", user: "Jane Smith", form: "Request for credentials" },
    { date: "2024-12-03", user: "Michael Johnson", form: "Leave of Absence" },
    { date: "2024-12-04", user: "Emily Brown", form: "Students clearance" },
    { date: "2024-12-05", user: "Chris Lee", form: "INC Form" },
    { date: "2024-12-01", user: "John Doe", form: "INC Form" },
    { date: "2024-12-02", user: "Jane Smith", form: "Request for credentials" },
    { date: "2024-12-03", user: "Michael Johnson", form: "Leave of Absence" },
    { date: "2024-12-04", user: "Emily Brown", form: "Students clearance" },
    { date: "2024-12-05", user: "Chris Lee", form: "INC Form" },
    { date: "2024-12-01", user: "John Doe", form: "INC Form" },
    { date: "2024-12-02", user: "Jane Smith", form: "Request for credentials" },
    { date: "2024-12-03", user: "Michael Johnson", form: "Leave of Absence" },
    { date: "2024-12-04", user: "Emily Brown", form: "Students clearance" },
    { date: "2024-12-05", user: "Chris Lee", form: "INC Form" },
    { date: "2024-12-01", user: "John Doe", form: "INC Form" },
    { date: "2024-12-02", user: "Jane Smith", form: "Request for credentials" },
    { date: "2024-12-03", user: "Michael Johnson", form: "Leave of Absence" },
    { date: "2024-12-04", user: "Emily Brown", form: "Students clearance" },
    { date: "2024-12-05", user: "Chris Lee", form: "INC Form" },
    { date: "2024-12-01", user: "John Doe", form: "INC Form" },
    { date: "2024-12-02", user: "Jane Smith", form: "Request for credentials" },
    { date: "2024-12-03", user: "Michael Johnson", form: "Leave of Absence" },
    { date: "2024-12-04", user: "Emily Brown", form: "Students clearance" },
    { date: "2024-12-10", user: "Chris Lee", form: "INC Form" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const tableRef = useRef(null);

  // Updated to handle case-insensitive search
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleFormFilter = (event) => setSelectedForm(event.target.value);
  const handleStartDate = (event) => setStartDate(event.target.value);
  const handleEndDate = (event) => setEndDate(event.target.value);

  const filteredData = formData.filter((item) => {
    // Case-insensitive search that handles different capitalizations
    const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesForm = selectedForm ? item.form === selectedForm : true;
    const matchesDate =
      (!startDate || new Date(item.date) >= new Date(startDate)) &&
      (!endDate || new Date(item.date) <= new Date(endDate));
    return matchesSearch && matchesForm && matchesDate;
  });

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=500, width=800');
  //  printWindow.document.write('<html><head><title>Form Tracker Print</title>');
    
    // Add some basic styling to make the print view look neat
    printWindow.document.write(`
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .print-header { text-align: center; margin-bottom: 20px; }
      </style>
    `);
    
    printWindow.document.write('</head><body>');
    
    // Add a header with current filter information
    printWindow.document.write(`
      <div class="print-header">
        <h1>Form Tracker Report</h1>
        ${searchTerm ? `<p>Search Term: ${searchTerm}</p>` : ''}
        ${selectedForm ? `<p>Form Type: ${selectedForm}</p>` : ''}
        ${startDate ? `<p>Start Date: ${startDate}</p>` : ''}
        ${endDate ? `<p>End Date: ${endDate}</p>` : ''}
        <p>Total Entries: ${filteredData.length}</p>
      </div>
    `);

    // Create table in print window
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr><th>Date</th><th>Name</th><th>Form</th></tr></thead>');
    printWindow.document.write('<tbody>');
    
    filteredData.forEach(item => {
      printWindow.document.write(`
        <tr>
          <td>${item.date}</td>
          <td>${item.user}</td>
          <td>${item.form}</td>
        </tr>
      `);
    });
    
    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.print();
  };

  return (
    <div className="form-tracker">
      <h2 className="form-tracker-title">Form Monitoring</h2>
      <div className="form-tracker-filters">
        <div className="form-tracker-input-group">
          <label htmlFor="name-search">Search Name</label>
          <input
            id="name-search"
            type="text"
            placeholder="Enter name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="form-tracker-input-group">
          <label htmlFor="form-select">Select Form</label>
          <select 
            id="form-select"
            value={selectedForm} 
            onChange={handleFormFilter}
          >
            <option value="">All Forms</option>
            <option value="Leave of Absence">Leave of Absence</option>
            <option value="INC Form">INC Form</option>
            <option value="Application for accreditation">Application for accreditation</option>
            <option value="Request for credentials">Request for credentials</option>
            <option value="Students clearance">Students clearance</option>
          </select>
        </div>
        <div className="form-tracker-input-group">
  <label htmlFor="start-date">Start Date</label>
  <input 
    id="start-date"
    type="date" 
    className="form-tracker-date-picker"
    value={startDate} 
    onChange={handleStartDate} 
  />
</div>
<div className="form-tracker-input-group">
  <label htmlFor="end-date">End Date</label>
  <input 
    id="end-date"
    type="date" 
    className="form-tracker-date-picker"
    value={endDate} 
    onChange={handleEndDate} 
  />
</div>
        <div className="form-tracker-input-group">
     
          <button 
           className="print-button"
            onClick={handlePrint}
            style={{
              padding: '10px',
              backgroundColor: '#white',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Print Report
          </button>

        </div>
        <div className="table-wrapper"></div>
      </div>
      <div className="form-tracker-table-container">
        <table className="form-tracker-table" ref={tableRef}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.user}</td>
                <td>{item.form}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffFormTracker;