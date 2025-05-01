import React, { useState } from "react";
import { exportExpensesCSV, exportExpensesPDF } from "../service/api";

const ExportButton = ({ filters = {} }) => {
  const [csvLoading, setCsvLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null); // Store PDF URL here

  const handleExportCSV = async () => {
    try {
      setCsvLoading(true);
      const response = await exportExpensesCSV(filters);

      // Check if the response contains a file_url
      if (response.data.success && response.data.file_url) {
        // Open the file URL in a new tab
        window.open(response.data.file_url, "_blank");
      } else {
        throw new Error(`Export failed: Invalid response format`);
      }

      setCsvLoading(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Failed to export expenses as CSV`);
      setCsvLoading(false);
    }
  };

const handleExportPDF = async () => {
  try {
    setPdfLoading(true);
    const response = await exportExpensesPDF(filters);

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "expenses_report.pdf"); // or whatever you want
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);

    setPdfLoading(false);
  } catch (error) {
    console.error("Export failed:", error);
    alert(`Failed to export expenses as PDF`);
    setPdfLoading(false);
  }
};


  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        disabled={csvLoading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
      >
        {csvLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Exporting...
          </>
        ) : (
          "Export CSV"
        )}
      </button>

      <button
        onClick={handleExportPDF}
        disabled={pdfLoading}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
      >
        {pdfLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Exporting...
          </>
        ) : (
          "Export PDF"
        )}
      </button>

      {/* Show a "Download PDF" button if the URL is available */}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download="expenses_report.pdf"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Download PDF
        </a>
      )}
    </div>
  );
};

export default ExportButton;
