import { PDFReportGenerator } from "../helper/pdfPrinter";
import '../feedback/headerStats/headerStats.css';
const monthOrder = {
    January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
    July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
};

const WindowPrintButton = ({ month, overall, responses, ratingBreakdown, comments, reviews, ratingsOverTime }) => {
    const handlePrintSelection = async (format) => {
        if (format === 'PDF') {
            try {
                const pdfGenerator = new PDFReportGenerator();

                // Add sections to the PDF
                pdfGenerator.addSection('1. Feedback Summary', () => {
                    const summaryTable = [
                        { Metric: 'This Month', Value: month || 'N/A' },
                        { Metric: 'Overall Rating', Value: `${overall || 'N/A'}%` },
                        { Metric: 'Total Feedback Responses', Value: responses || 'N/A' },
                    ];
                    pdfGenerator.addTable(summaryTable, ['Metric', 'Value']);
                });

                pdfGenerator.addSection('2. Monthly Rating Breakdown', () => {
                    if (ratingBreakdown && ratingBreakdown.breakdown) {
                        const breakdownTable = [
                            { Metric: 'Average Rating', Percentage: `${ratingBreakdown.average || 'N/A'}%` },
                            ...ratingBreakdown.breakdown.map(segment => ({
                                Metric: `${segment.stars} Stars`,
                                Percentage: `${segment.percentage}%`,
                            })),
                        ];
                        pdfGenerator.addTable(breakdownTable, ['Metric', 'Percentage']);
                    } else {
                        pdfGenerator.addText('No rating breakdown data available.');
                    }
                });

                pdfGenerator.addSection('3. User Feedback', () => {
                    if (comments && comments.length > 0) {
                        const feedbackTable = comments.slice(0, 5).map((comment, index) => ({
                            User: `User ${index + 1}`,
                            Rating: `${comment.rating} Stars`,
                            Comment: comment.text,
                        }));
                        pdfGenerator.addTable(feedbackTable, ['User', 'Rating', 'Comment']);
                    } else {
                        pdfGenerator.addText('No user feedback available.');
                    }
                });

                pdfGenerator.addSection('4. Average User Feedback Ratings', () => {
                    if (reviews) {
                        const averageRatingsTable = [];
                        Object.entries(reviews).forEach(([category, rating]) => {
                            let formattedCategory = category.replace(/breakdown/i, "").trim().replace(/overall/i, " Overall");

                            if (typeof rating === 'object') {
                                Object.entries(rating).forEach(([subCategory, subCatRating]) => {
                                    averageRatingsTable.push({
                                        Category: `${formattedCategory} ${subCategory}`,
                                        Rating: `${subCatRating}%`,
                                    });
                                });
                            } else {
                                averageRatingsTable.push({
                                    Category: formattedCategory,
                                    Rating: `${rating}%`,
                                });
                            }
                        });
                        pdfGenerator.addTable(averageRatingsTable, ['Category', 'Rating']);
                    } else {
                        pdfGenerator.addText('No average ratings data available.');
                    }
                });

                // Ratings Over Time
                pdfGenerator.addSection('5. Ratings Over Time', () => {
                    if (ratingsOverTime && ratingsOverTime.length > 0) {
                        // Sort by month only
                        const sortedRatings = ratingsOverTime.sort((a, b) => {
                            const monthA = monthOrder[a.month]; // Assuming 'month' is the key
                            const monthB = monthOrder[b.month];
                            return monthA - monthB; // Sort by month
                        });

                        const headers = Object.keys(sortedRatings[0] || {});
                        pdfGenerator.addTable(sortedRatings, headers);
                    } else {
                        pdfGenerator.addText('No ratings trend data available.');
                    }
                });

                // Footer
                pdfGenerator.addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, false, 'center');

                // Save the PDF
                pdfGenerator.savePDF('WindowReport.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('There was an error generating the PDF. Please check the console for more details.');
            }
        } else {
            alert(`Printing in ${format} format is not implemented yet.`);
        }
    };

    return (
        <div className="print-container">
            <button className="print-button" onClick={() => handlePrintSelection('PDF')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Print
            </button>
        </div>
    );
};

export default WindowPrintButton;
