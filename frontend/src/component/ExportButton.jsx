import React, { useState } from "react";
import { exportExpensesCSV, exportExpensesPDF } from "../service/api";

const ExportButton = ({ filters = {} }) => {
  const [loading, setLoading] = useState(false);
  const [exportType, setExportType] = useState("csv"); // Default to CSV

  const handleExport = async () => {
    try {
      setLoading(true);

      let response;
      if (exportType === "pdf") {
        response = await exportExpensesPDF(filters);
      } else {
        response = await exportExpensesCSV(filters);
      }

      // Check if the response contains a file_url
      if (response.data.success && response.data.file_url) {
        // Open the file URL in a new tab
        window.open(response.data.file_url, "_blank");
      } else {
        throw new Error(`Export failed: Invalid response format`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Failed to export expenses as ${exportType.toUpperCase()}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm"
        value={exportType}
        onChange={(e) => setExportType(e.target.value)}
      >
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>
      <button
        onClick={handleExport}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
      >
        {loading ? (
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
          `Export ${exportType.toUpperCase()}`
        )}
      </button>
    </div>
  );
};

export default ExportButton;
