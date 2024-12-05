import React, { useState, useEffect, useRef } from "react";
import "./formTracker.scss";
import { supabase } from "../../components/helper/supabaseClient";

const FormTracker = () => {
  const [formData, setFormData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const tableRef = useRef(null);

  const handleSearch = (event) => setSearchTerm(event.target.value);
  const handleFormFilter = (event) => setSelectedForm(event.target.value);
  const handleStartDate = (event) => setStartDate(event.target.value);
  const handleEndDate = (event) => setEndDate(event.target.value);

  // Fetch form data from Supabase on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      const { data, error } = await supabase
        .from("grab_form")
        .select("*");
      
      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        setFormData(data);
      }
    };
    fetchFormData();
  }, []);

  // Filter logic based on search and date ranges
const filteredData = formData.filter((item) => {
  const matchesSearch = item.purpose.some((purpose) =>
    purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const matchesForm = selectedForm
    ? item.purpose.some((purpose) => purpose === selectedForm)
    : true;

  const matchesDate =
    (!startDate || new Date(item.transaction_date) >= new Date(startDate)) &&
    (!endDate || new Date(item.transaction_date) <= new Date(endDate));

    

  return matchesSearch && matchesForm && matchesDate;
}
);


// Print functionality
const handlePrint = () => {
  // Calculate total quantity for each specific purpose
  const purposeTotalQuantity = filteredData.reduce((acc, item) => {
    item.purpose.forEach((purpose, index) => {
      // If the purpose doesn't exist in the accumulator, initialize it
      if (!acc[purpose]) {
        acc[purpose] = 0;
      }
      // Add the quantity to the corresponding purpose total
      acc[purpose] += item.quantity[index];
    });
    return acc;
  }, {});

  const printWindow = window.open('', '', 'height=500, width=800');
  printWindow.document.write('<html><head><title>Form Tracker Print</title>');
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
  printWindow.document.write(`
    <div class="print-header">
      <h1>Form Tracker Report</h1>
      ${searchTerm ? `<p>Search Term: ${searchTerm}</p>` : ''}
      ${selectedForm ? `<p>Form Type: ${selectedForm}</p>` : ''}
      ${startDate ? `<p>Start Date: ${startDate}</p>` : ''}
      ${endDate ? `<p>End Date: ${endDate}</p>` : ''}
      
    </div>
  `);

  // Display total quantity for each purpose
  printWindow.document.write('<h3>Total Quantity for Each Purpose</h3>');
  printWindow.document.write('<table>');
  printWindow.document.write('<thead><tr><th>Purpose</th><th>Total Quantity</th></tr></thead>');
  printWindow.document.write('<tbody>');
  for (const [purpose, totalQuantity] of Object.entries(purposeTotalQuantity)) {
    printWindow.document.write(`
      <tr>
        <td>${purpose}</td>
        <td>${totalQuantity}</td>
      </tr>
    `);
  }
  printWindow.document.write('</tbody></table>');
  
  // Now display the detailed records
  printWindow.document.write('<h3>Detailed Records</h3>');
  printWindow.document.write('<table>');
  printWindow.document.write('<thead><tr><th>Date</th><th>Purpose</th><th>Quantity</th></tr></thead>');
  printWindow.document.write('<tbody>');
  filteredData.forEach((item) => {
    item.purpose.forEach((purpose, index) => {
      printWindow.document.write(`
        <tr>
          <td>${item.transaction_date}</td>
          <td>${purpose}</td>
          <td>${item.quantity[index]}</td>
        </tr>
      `);
    });
  });
  printWindow.document.write('</tbody></table>');
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};


  // Delete all records functionality
  const handleDeleteAll = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all records? This action cannot be undone."
    );
    if (confirmDelete) {
      setFormData([]); // Clear all records
    }
  };

  return (
    <div className="form-tracker">
      <h2 className="form-tracker-title">Form Monitoring</h2>
      <div className="form-tracker-filters">
        <div className="form-tracker-input-group">
          <label htmlFor="name-search">Search Form</label>
          <input
            id="name-search"
            type="text"
            placeholder="Enter Form..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="form-tracker-input-group">
          <label htmlFor="form-select">Select Form</label>
          <select id="form-select" value={selectedForm} onChange={handleFormFilter}>
            <option value="">All Forms</option>
            <option value="Leave of Absence">Leave of Absence</option>
            <option value="INC">INC</option>
            <option value="Application for Accreditation">Application for Accreditation</option>
            <option value="Request for Credentials">Request for Credentials</option>
            <option value="Students Clearance">Students Clearance</option>
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
              padding: "10px",
              backgroundColor: "#fff",
              color: "#333",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Print Report
          </button>
        </div>
        <div className="form-tracker-input-group">
          <button
            className="delete-button"
            onClick={handleDeleteAll}
            style={{
              padding: "10px",
              backgroundColor: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete All Records
          </button>
        </div>
      </div>
      <div className="form-tracker-table-container">
        <table className="form-tracker-table" ref={tableRef}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Form</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) =>
              item.purpose.map((purpose, subIndex) => (
                <tr key={`${index}-${subIndex}`}>
                  <td>{item.transaction_date}</td>
                  <td>{purpose}</td>
                  <td>{item.quantity[subIndex]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormTracker;
