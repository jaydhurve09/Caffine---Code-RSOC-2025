import { useState } from 'react';
import axios from 'axios';

const ReportGenerator = () => {
  const [repoData, setRepoData] = useState({
    name: '',
    description: '',
    stars: 0,
    forks: 0,
    lastUpdated: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRepoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async (format) => {
    try {
      const endpoint = format === 'pdf' ? '/api/generate-pdf' : '/api/generate-docx';
      const response = await axios({
        url: `http://localhost:3000${endpoint}`,
        method: 'POST',
        data: { repoData },
        responseType: 'blob'
      });

      // Create a blob from the response data
      const blob = new Blob(
        [response.data],
        { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      );

      // Create a link element and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `github-report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">GitHub Repository Report Generator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Repository Name</label>
          <input
            type="text"
            name="name"
            value={repoData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={repoData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stars</label>
            <input
              type="number"
              name="stars"
              value={repoData.stars}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forks</label>
            <input
              type="number"
              name="forks"
              value={repoData.forks}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
          <input
            type="date"
            name="lastUpdated"
            value={repoData.lastUpdated}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => generateReport('pdf')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Generate PDF
          </button>
          <button
            onClick={() => generateReport('docx')}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Generate Word Doc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;