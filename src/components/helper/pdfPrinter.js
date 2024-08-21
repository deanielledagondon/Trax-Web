import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Utility function to handle print selection
export const windowPrintSelection = async (format, data) => {
  if (format === "PDF") {
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      const addTextToPDF = (
        text,
        fontSize = 12,
        isBold = false,
        align = "left"
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, isBold ? "bold" : "normal");
        pdf.setTextColor(0, 0, 0);
        const textLines = pdf.splitTextToSize(text, pageWidth - 40);
        textLines.forEach((line) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, align === "center" ? pageWidth / 2 : 20, yPosition, {
            align: align,
          });
          yPosition += fontSize * 0.5 + 2;
        });
        yPosition += 5;
      };
      const addAutoTableWithSpacing = (tableContent) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        autoTable(pdf, {
          startY: yPosition,
          theme: "striped",
          head: [Object.keys(tableContent[0] || {})],
          body: tableContent.map((entry) => Object.values(entry)),
          margin: {
            left: 20,
            right: 20,
          },
        });

        yPosition = pdf.lastAutoTable.finalY + 10;
      };

      const addLine = () => {
        pdf.setDrawColor(0);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      };

      const addSection = (title, content) => {
        addTextToPDF(title, 18, true);
        content();
        addLine();
      };

      addTextToPDF("Feedback Report", 24, true, "center");
      addLine();

      // 1. Feedback Summary
      addSection("1. Feedback Summary", () => {
        addTextToPDF(`This Month: ${data.month || "N/A"}`);
        addTextToPDF(`Overall Rating: ${data.overall || "N/A"}%`);
        addTextToPDF(`Total Feedback Responses: ${data.responses || "N/A"}`);
      });

      // 2. Monthly Rating Breakdown
      addSection("2. Monthly Rating Breakdown", () => {
        if (data.ratingBreakdown && data.ratingBreakdown.breakdown) {
          addTextToPDF(
            `Average Rating: ${data.ratingBreakdown.average || "N/A"}%`
          );
          data.ratingBreakdown.breakdown.forEach((segment) => {
            addTextToPDF(`${segment.stars} Stars: ${segment.percentage}%`);
          });
        } else {
          addTextToPDF("No rating breakdown data available.");
        }
      });

      // 3. User Feedback
      addSection("3. User Feedback", () => {
        if (data.comments && data.comments.length > 0) {
          data.comments.slice(0, 5).forEach((comments, index) => {
            addTextToPDF(`Feedback ${index + 1}:`, 14, true);
            addTextToPDF(`Rating: ${comments.rating} Stars`);
            addTextToPDF(`Comment: ${comments.text}`);
            if (index < 4) addTextToPDF("---");
          });
        } else {
          addTextToPDF("No user feedback available.");
        }
      });

      // 4. Average User Feedback Ratings
      addSection("4. Average User Feedback Ratings", () => {
        if (data.reviews) {
          Object.entries(data.reviews).forEach(([category, rating]) => {
            if (typeof rating === "object") {
              Object.entries(rating).forEach(([subCategory, subCatRating]) => {
                addTextToPDF(`${subCategory}: ${subCatRating}%`);
              });
            } else {
              addTextToPDF(`${category}: ${rating}%`);
            }
          });
        } else {
          addTextToPDF("No average ratings data available.");
        }
      });

      // 5. Ratings Over Time
      addSection("5. Ratings Over Time", () => {
        if (data.ratingsOverTime && data.ratingsOverTime.length > 0) {
          addAutoTableWithSpacing(data.ratingsOverTime);
        } else {
          addTextToPDF("No ratings trend data available.");
        }
      });
      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      pdf.save(`${data.windowName}FeedbackReport.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "There was an error generating the PDF. Please check the console for more details."
      );
    }
  } else {
    console.log(`Printing in ${format} format is not implemented yet.`);
    alert(`Printing in ${format} format is not implemented yet.`);
  }
};
