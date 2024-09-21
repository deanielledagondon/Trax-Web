import { PDFReportGenerator } from "../helper/pdfPrinter";
import '../feedback/headerStats/headerStats.css'

const WindowPrintButton = ({ month, overall, responses, ratingBreakdown, comments, reviews, ratingsOverTime }) => {
    const handlePrintSelection = async (format) => {
        if (format === 'PDF') {
            try {
                const pdfGenerator = new PDFReportGenerator();

                // Add sections to the PDF
                pdfGenerator.addSection('1. Feedback Summary', () => {
                    pdfGenerator.addText(`This Month: ${month || 'N/A'}`);
                    pdfGenerator.addText(`Overall Rating: ${overall || 'N/A'}%`);
                    pdfGenerator.addText(`Total Feedback Responses: ${responses || 'N/A'}`);
                });

                pdfGenerator.addSection('2. Monthly Rating Breakdown', () => {
                    if (ratingBreakdown && ratingBreakdown.breakdown) {
                        pdfGenerator.addText(`Average Rating: ${ratingBreakdown.average || 'N/A'}%`);
                        ratingBreakdown.breakdown.forEach(segment => {
                            pdfGenerator.addText(`${segment.stars} Stars: ${segment.percentage}%`);
                        });
                    } else {
                        pdfGenerator.addText('No rating breakdown data available.');
                    }
                });

                pdfGenerator.addSection('3. User Feedback', () => {
                    if (comments && comments.length > 0) {
                        comments.slice(0, 5).forEach((comment, index) => {
                            pdfGenerator.addText(`Feedback ${index + 1}:`, 14, true);
                            pdfGenerator.addText(`Rating: ${comment.rating} Stars`);
                            pdfGenerator.addText(`Comment: ${comment.text}`);
                            if (index < 4) pdfGenerator.addText('---');
                        });
                    } else {
                        pdfGenerator.addText('No user feedback available.');
                    }
                });

                pdfGenerator.addSection('4. Average User Feedback Ratings', () => {
                    if (reviews) {
                        Object.entries(reviews).forEach(([category, rating]) => {
                            if (typeof rating === 'object') {
                                Object.entries(rating).forEach(([subCategory, subCatRating]) => {
                                    pdfGenerator.addText(`${subCategory}: ${subCatRating}%`);
                                });
                            } else {
                                pdfGenerator.addText(`${category}: ${rating}%`);
                            }
                        });
                    } else {
                        pdfGenerator.addText('No average ratings data available.');
                    }
                });

                // Verify ratingsOverTime is an array
                pdfGenerator.addSection('5. Ratings Over Time', () => {
                    if (Array.isArray(ratingsOverTime) && ratingsOverTime.length > 0) {
                        const data = ratingsOverTime.map(entry => [entry.date, `${entry.rating}%`]);
                        pdfGenerator.addTable(data);
                    } else {
                        pdfGenerator.addText('No ratings trend data available.');
                    }
                });


                // Footer
                pdfGenerator.addText(`Generated on: ${new Date().toLocaleDateString()}`, 10, false, 'center');

                // Save the PDF
                pdfGenerator.savePDF('FeedbackReport.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('There was an error generating the PDF. Please check the console for more details.');
            }

        } else {
            alert(`Printing in ${format} format is not implemented yet.`);
        }
    };
    return (<div className="print-container" >
        <button className="print-button" onClick={() => handlePrintSelection('PDF')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print
        </button>
    </div>)
}

export default WindowPrintButton