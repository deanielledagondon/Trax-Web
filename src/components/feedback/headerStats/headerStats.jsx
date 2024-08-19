import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './headerStats.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import CommentsList from '../commentsList/commentsList.jsx';
import ReviewSummary from '../reviewSummary/reviewSummary.jsx';

// Custom Tooltip component for the PieChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="customTooltip">
        {payload.map((entry, index) => (
          <div key={index}>
            {entry.name} stars: {entry.value}%
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Main HeaderStats component
const HeaderStats = ({ 
  month, 
  overall, 
  responses, 
  ratingBreakdown,
  comments,
  reviews,
  ratingsOverTime,
  ratingsPerWindow
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const printDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const closeDropdowns = (e) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (isPrintDropdownOpen && printDropdownRef.current && !printDropdownRef.current.contains(e.target)) {
        setIsPrintDropdownOpen(false);
      }
    };

    document.addEventListener('click', closeDropdowns);
    return () => {
      document.removeEventListener('click', closeDropdowns);
    };
  }, [isDropdownOpen, isPrintDropdownOpen]);

  const commentsList = useMemo(() => <CommentsList comments={comments} />, [comments]);
  
  // Handler for window selection
  const handleWindowSelection = (window) => {
    navigate(`/window${window}`);
    setIsDropdownOpen(false);
  };

  // Handler for print selection
  const handlePrintSelection = async (format) => {
    if (format === 'PDF') {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;
  
        // Helper function to add text to PDF
        const addTextToPDF = (text, fontSize = 12, isBold = false, align = 'left') => {
          pdf.setFontSize(fontSize);
          pdf.setFont(undefined, isBold ? 'bold' : 'normal');
          pdf.setTextColor(0, 0, 0);
          const textLines = pdf.splitTextToSize(text, pageWidth - 40);
          textLines.forEach(line => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, align === 'center' ? pageWidth / 2 : 20, yPosition, { align: align });
            yPosition += fontSize * 0.5 + 2;
          });
          yPosition += 5;
        };
  
        // Helper function to add a line to PDF
        const addLine = () => {
          pdf.setDrawColor(0);
          pdf.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 10; // Increased spacing after line
        };
  
        // Helper function to add a section to PDF
        const addSection = (title, content) => {
          addTextToPDF(title, 18, true);
          content();
          addLine(); // Add line after each section
        };
  
        // Title
        addTextToPDF('Feedback Report', 24, true, 'center');
        addLine();
  
        // 1. Feedback Summary
        addSection('1. Feedback Summary', () => {
          addTextToPDF(`This Month: ${month || 'N/A'}`);
          addTextToPDF(`Overall Rating: ${overall || 'N/A'}%`);
          addTextToPDF(`Total Feedback Responses: ${responses || 'N/A'}`);
        });
  
        // 2. Monthly Rating Breakdown
        addSection('2. Monthly Rating Breakdown', () => {
          if (ratingBreakdown && ratingBreakdown.breakdown) {
            addTextToPDF(`Average Rating: ${ratingBreakdown.average || 'N/A'}%`);
            ratingBreakdown.breakdown.forEach(segment => {
              addTextToPDF(`${segment.stars} Stars: ${segment.percentage}% (${segment.count} responses)`);
            });
          } else {
            addTextToPDF('No rating breakdown data available.');
          }
        });
  
        // 3. User Feedback
        addSection('3. User Feedback', () => {
          if (comments && comments.length > 0) {
            comments.slice(0, 5).forEach((comments, index) => {
              addTextToPDF(`Feedback ${index + 1}:`, 14, true);
              addTextToPDF(`Rating: ${comments.rating} Stars`);
              addTextToPDF(`Comment: ${comments.text}`);
              if (index < 4) addTextToPDF('---');
            });
          } else {
            addTextToPDF('No user feedback available.');
          }
        });
  
        // 4. Average User Feedback Ratings
        addSection('4. Average User Feedback Ratings', () => {
          if (reviews) {
            Object.entries(reviews).forEach(([category, rating]) => {
              addTextToPDF(`${category}: ${rating.toFixed(2)} Stars`);
            });
          } else {
            addTextToPDF('No average ratings data available.');
          }
        });
  
        // 5. Ratings Over Time
        addSection('5. Ratings Over Time', () => {
          if (ratingsOverTime && ratingsOverTime.length > 0) {
            ratingsOverTime.slice(-5).forEach(entry => {
              addTextToPDF(`${entry.date}: ${entry.rating.toFixed(2)} Stars`);
            });
          } else {
            addTextToPDF('No ratings trend data available.');
          }
        });
  
        // 6. Ratings Per Window
        addSection('6. Ratings Per Window', () => {
          if (ratingsPerWindow && Object.keys(ratingsPerWindow).length > 0) {
            Object.entries(ratingsPerWindow).forEach(([window, rating]) => {
              addTextToPDF(`Window ${window}: ${rating.toFixed(2)} Stars`);
            });
          } else {
            addTextToPDF('No ratings per window data available.');
          }
        });
  
        // Footer
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`,  pageWidth / 2, pageHeight - 10, { align: 'center' });

  
        pdf.save('FeedbackReport.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please check the console for more details.');
      }
    } else {
      console.log(`Printing in ${format} format is not implemented yet.`);
      alert(`Printing in ${format} format is not implemented yet.`);
    }
    setIsPrintDropdownOpen(false);
  };

  // Prepare data for the pie chart
  const data = useMemo(
    () =>
      ratingBreakdown.breakdown.map((segment) => ({
        name: `${segment.stars}`,
        value: segment.percentage,
        count: segment.count,
      })),
    [ratingBreakdown]
  );

  // Define colors for each star rating
  const starColors = {
    1: '#f8696b',
    2: '#ffa65a',
    3: '#ffcd56',
    4: '#9edd72',
    5: '#67b168',
  };

  return (
    <div>
      <div className="header-top">
        <h2 className="title">Feedback</h2>

        <div className="button-container">
          {/* Dropdown for Window Selection */}
          <div className="dropdownContainer" ref={dropdownRef}>
            <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              Select Window
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {[1, 2, 3, 4, 5, 6].map((window) => (
                  <button key={window} onClick={() => handleWindowSelection(window)}>
                    Window {window}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Print Button */}
          <div className="print-container" ref={printDropdownRef}>
            <button className="print-button" onClick={() => handlePrintSelection('PDF')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Main content of HeaderStats */}
      <div className="header-stats-wrapper">
        <div className="header-stat-area-card">
          <div className="header-stats-container">
            {/* Colored cards for key metrics */}
            <div className="colored-card-grid">
              <div className="header-stat-card red">
                <div className="header-stat-body">
                  <div className="header-stat-title">{month}</div>
                  <div className="header-stat-text">This Month</div>
                </div>
              </div>
              <div className="header-stat-card orange">
                <div className="header-stat-body">
                  <div className="header-stat-title">{overall}%</div>
                  <div className="header-stat-text">Overall Rating</div>
                </div>
              </div>
              <div className="header-stat-card blue">
                <div className="header-stat-body">
                  <div className="header-stat-title">{responses}</div>
                  <div className="header-stat-text">Total Feedback Responses</div>
                </div>
              </div>
            </div>

            {/* Rating breakdown section */}
            <div className="header-breakdown-card rating-breakdown">
              <div className="header-stat-body">
                <div className="header-stat-title">Monthly Rating Breakdown</div>
                <div className="rating-average">{ratingBreakdown.average}% Average Rating</div>
                <div className="rating-chart-details">
                  {/* Pie chart */}
                  <ResponsiveContainer width="50%" height={370}>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={145}
                        fill="#8884d8"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={starColors[entry.name.split(' ')[0]]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Rating details */}
                  <div className="rating-details">
                    {ratingBreakdown.breakdown.map((segment, index) => (
                      <div key={index} className="rating-detail">
                        <span className="rating-number">{segment.stars}</span>
                        <div
                          className="rating-box"
                          style={{ backgroundColor: starColors[segment.stars] }}
                        ></div>
                        <span className="rating-percentage">{segment.percentage}%</span>
                        <span className="rating-count">{segment.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
HeaderStats.propTypes = {
  month: PropTypes.string.isRequired,
  overall: PropTypes.number.isRequired,
  responses: PropTypes.number.isRequired,
  ratingBreakdown: PropTypes.shape({
    average: PropTypes.number.isRequired,
    breakdown: PropTypes.arrayOf(
      PropTypes.shape({
        stars: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
  reviews: PropTypes.objectOf(PropTypes.number),
  ratingsOverTime: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    })
  ),
  ratingsPerWindow: PropTypes.objectOf(PropTypes.number),
};

export default HeaderStats;