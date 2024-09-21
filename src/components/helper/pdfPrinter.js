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
        fontSize = 10,
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
        addTextToPDF(title, 14, true);
        content();
        addLine();
      };

      addTextToPDF(`${data.windowName} | Feedback Report`, 16, true, "center");
      addLine();

      // 1. Feedback Summary
      addSection("• Feedback Summary", () => {
        const summaryData = [
          { Metric: "This Month", Value: data.month || "N/A" }, // Ensure "Month" is capitalized
          { Metric: "Overall Rating", Value: `${data.overall || "N/A"}%` },
          {
            Metric: "Total Feedback Responses",
            Value: data.responses || "N/A",
          },
        ];

        addAutoTableWithSpacing(summaryData);
      });

      // 2. Monthly Rating Breakdown
      addSection("• Monthly Rating Breakdown", () => {
        if (data.ratingBreakdown && data.ratingBreakdown.breakdown) {
          const breakdownData = [
            {
              Metric: "Average Rating",
              Percentage: `${data.ratingBreakdown.average || "N/A"}%`,
            },
            ...data.ratingBreakdown.breakdown.map((segment) => ({
              Metric: `${segment.stars} Stars`,
              Percentage: `${segment.percentage}%`,
            })),
          ];

          addAutoTableWithSpacing(breakdownData);
        } else {
          addTextToPDF("No rating breakdown data available.");
        }
      });

      // 3. User Feedback
      addSection("• User Feedback", () => {
        if (data.comments && data.comments.length > 0) {
          const tableContent = data.comments.map((comment, index) => ({
            User: `User ${index + 1}`,
            Rating: `${comment.rating} stars`,
            Comment: comment.text,
          }));

          addAutoTableWithSpacing(tableContent);
        } else {
          addTextToPDF("No user feedback available.");
        }
      });

      // 4. Average User Feedback Ratings
      addSection("• Average User Feedback Ratings", () => {
        if (data.reviews) {
          const reviewsData = Object.entries(data.reviews).flatMap(
            ([category, rating]) => {
              // Remove the word "breakdown" and capitalize "overall"
              let formattedCategory = category.replace(/breakdown/i, "").trim();
              formattedCategory = formattedCategory.replace(
                /overall/i,
                "Overall"
              );

              if (typeof rating === "object") {
                return Object.entries(rating).map(
                  ([subCategory, subCatRating]) => ({
                    Category: `${formattedCategory}${subCategory}`,
                    Rating: `${subCatRating}%`,
                  })
                );
              } else {
                return [{ Category: formattedCategory, Rating: `${rating}%` }];
              }
            }
          );

          addAutoTableWithSpacing(reviewsData);
        } else {
          addTextToPDF("No average ratings data available.");
        }
      });

      // 5. Ratings Over Time
      addSection("• Ratings Over Time", () => {
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

      pdf.save(`${data.windowName} FeedbackReport.pdf`);
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

export class PDFReportGenerator {
  constructor() {
    this.pdf = new jsPDF("p", "mm", "a4");
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = 20;
  }

  addText(text, fontSize = 12, isBold = false) {
    if (this.yPosition > this.pageHeight - 20) {
      this.pdf.addPage();
      this.yPosition = 20;
    }
    this.pdf.setFontSize(fontSize);
    if (isBold) {
      this.pdf.setFont("helvetica", "bold");
    } else {
      this.pdf.setFont("helvetica", "normal");
    }
    this.pdf.text(text, 10, this.yPosition);
    this.yPosition += 10; // Move y position down
  }

  addLine() {
    this.pdf.line(10, this.yPosition, this.pageWidth - 10, this.yPosition);
    this.yPosition += 10;
  }

  addSection(title, contentCallback) {
    this.addText(title, 16, true);
    this.addLine();
    contentCallback();
    this.yPosition += 10; // Spacing after the section
  }

  addTable(data, headers = []) {
    autoTable(this.pdf, {
      startY: this.yPosition,
      head: [headers],
      body: data.map((item) => Object.values(item)),
    });
    this.yPosition = this.pdf.lastAutoTable.finalY + 10;
  }

  savePDF(filename = "Report.pdf") {
    this.pdf.save(filename);
  }
}
