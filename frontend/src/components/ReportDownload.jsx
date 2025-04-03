import axios from 'axios';

const ReportDownload = ({ repoData }) => {
  const handleDownload = async (format) => {
    try {
      const endpoint = format === 'pdf' 
        ? 'http://localhost:3000/api/generate-pdf'
        : 'http://localhost:3000/api/generate-docx';

      const response = await axios({
        url: endpoint,
        method: 'POST',
        data: { repoData },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `github-report.${format}`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading ${format} report:`, error);
      alert(`Failed to download ${format} report. Please try again.`);
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() => handleDownload('pdf')}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PDF
      </button>
      <button
        onClick={() => handleDownload('docx')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Word
      </button>
    </div>
  );
};

export default ReportDownload;