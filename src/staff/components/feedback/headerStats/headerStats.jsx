import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './headerStats.scss';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import CommentsList from '../commentsList/commentsList.jsx';
import ReviewSummary from '../reviewSummary/reviewSummary.jsx';
import { ca } from 'date-fns/locale';
import autoTable from 'jspdf-autotable'


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


const HeaderStats = ({
  month,
  overall,
  responses,
  ratingBreakdown,
  comments,
  reviews,
  ratingsOverTime,
  ratingsPerWindow,
  staffName,
  windowNo
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const printDropdownRef = useRef(null);
  const navigate = useNavigate();


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

  const handlePrintSelection = async (format) => {
    if (format === 'PDF') {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

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

        const addLine = () => {
          pdf.setDrawColor(0);
          pdf.line(20, yPosition, pageWidth - 20, yPosition);
          yPosition += 10;
        };

        const addSection = (title, content) => {
          addTextToPDF(title, 14, true);
          content();
          addLine();
        };

        const addAutoTableWithSpacing = (tableContent) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          autoTable(pdf, {
            startY: yPosition,
            theme: 'striped',
            head: [Object.keys(tableContent[0] || {})],
            body: tableContent.map(entry => Object.values(entry)),
            margin: {
              left: 20,
              right: 20
            }
          });

          yPosition = pdf.lastAutoTable.finalY + 10;
        };
        addTextToPDF('Feedback Report', 16, true, 'center');
        addLine();

       // 1. Feedback Summary
           addTextToPDF('• Feedback Summary', 14, true);
           const feedbackSummaryTable = [
               { Metric: 'This Month', Value: month || 'N/A' },
               { Metric: 'Overall Rating', Value: `${overall || 'N/A'}%` },
               { Metric: 'Total Feedback Responses', Value: responses || 'N/A' },
           ];
           addAutoTableWithSpacing(feedbackSummaryTable);
           addLine();

       // 2. Monthly Rating Breakdown
       addTextToPDF('• Monthly Rating Breakdown', 14, true);
      if (ratingBreakdown && ratingBreakdown.breakdown) {
          const breakdownData = [
              { 'Metric': 'Average Rating', 'Percentage': `${ratingBreakdown.average || 'N/A'}%` },
              ...ratingBreakdown.breakdown.map(segment => ({
                  'Metric': `${segment.stars} Stars`,
                  'Percentage': `${segment.percentage}%`,
              })),
          ];

          addAutoTableWithSpacing(breakdownData);
      } else {
          addTextToPDF('No rating breakdown data available.');
      }
      addLine();

       // 3. User Feedback
        addSection('• User Feedback', () => {
          if (comments && comments.length > 0) {
            const tableContent = comments.map((comment, index) => ({
              User: `User ${index + 1}`,
              Rating: `${comment.rating} stars`,
              Comment: comment.text,
             
            }));
            addAutoTableWithSpacing(tableContent);
          } else {
            addTextToPDF('No user feedback available.');
          }
        });

        // 4. Average User Feedback Ratings    
        addSection('• Average User Feedback Ratings', () => {
          if (reviews) {
            const tableContent = [];
            Object.entries(reviews).forEach(([category, rating]) => {
              let formattedCategory = category.replace(/breakdown/i,"").trim();
              formattedCategory = formattedCategory.replace(/overall/i, " Overall");
              
              if (typeof rating === 'object') {
                Object.entries(rating).forEach(([subCategory, subCatRating]) => {
                  tableContent.push({
                    Category: `${formattedCategory} ${subCategory}`,
                    Rating: `${subCatRating}%`
                  });
                });
              } else {
                tableContent.push({
                  Category: formattedCategory,
                  Rating: `${rating}%`
                });
              }
            });
            addAutoTableWithSpacing(tableContent);
          } else {
            addTextToPDF('No average ratings data available.');
          }
        });

       // 5. Ratings Over Time
        addSection('• Ratings Over Time', () => {
          if (ratingsOverTime && ratingsOverTime.length > 0) {
            addAutoTableWithSpacing(ratingsOverTime);
          } else {
            addTextToPDF('No ratings trend data available.');
          }
        });

       // 6. Ratings Per Window
        addSection('• Ratings Per Window', () => {
          if (ratingsPerWindow && Object.keys(ratingsPerWindow).length > 0) {
            ratingsPerWindow.forEach((entry) => {
              addTextToPDF(`${entry.windowName}`);
              addAutoTableWithSpacing(entry.data);
            });
          } else {
            addTextToPDF('No ratings per window data available.');
          }
        });


        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

        pdf.save('FeedbackReport.pdf');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please check the console for more details.');
      }
      setIsPrintDropdownOpen(false);
    } else {
      console.log(`Printing in ${format} format is not implemented yet.`);
      alert(`Printing in ${format} format is not implemented yet.`);
    }
  };

  const data = useMemo(
    () =>
      ratingBreakdown.breakdown.map((segment) => ({
        name: `${segment.stars}`,
        value: segment.percentage,
        count: segment.count,
      })),
    [ratingBreakdown]
  );

  const starColors = {
    1: '#f8696b',
    2: '#ffa65a',
    3: '#ffcd56',
    4: '#9edd72',
    5: '#67b168',
  };

  const formatWindowNumber = (num) => {
    return `Window ${num}`;
  };

  return (
    <div>
      <div className="header-top">
        {staffName && (
          <div className="staff-info">
            <p className="greeting-text">Hello Ma'am {staffName}!</p>
            <p className="small-font">
              This is your <span className="bold-text">Feedback</span> for 
              {windowNo.length > 1 
                ? ` ${windowNo.map(formatWindowNumber).join(', ')}`
                : ` ${formatWindowNumber(windowNo[0])}` || ' N/A'}.
            </p>
          </div>
        )}
        <div className="button-container">
          {/* Dropdown for Window Selection */}
          <div className="dropdownContainer" ref={dropdownRef}>
          
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


HeaderStats.propTypes = {
  staffName: PropTypes.string,
  windowNo: PropTypes.arrayOf(PropTypes.number),
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