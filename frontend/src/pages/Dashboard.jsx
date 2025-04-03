import React from "react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ContributorGrid from "../components/ContributorGrid";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = ({ repoData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(() => {
    // Default mock data
    const mockData = {
      issueData: [
        { name: "Open", value: 8 },
        { name: "Closed", value: 15 },
      ],
      prData: [
        { name: "Open", value: 4 },
        { name: "Merged", value: 12 },
        { name: "Closed", value: 3 },
      ],
      contributorData: [
        { name: "user1", contributions: 127 },
        { name: "user2", contributions: 85 },
        { name: "user3", contributions: 63 },
        { name: "user4", contributions: 44 },
        { name: "user5", contributions: 29 },
      ],
      repoStats: {
        stars: 245,
        forks: 64,
        watchers: 32,
        size: 1024,
      },
    };
    return mockData;
  });

  useEffect(() => {
    if (!repoData) return;

    try {
      const { repository, issues, pulls, contributors } = repoData;

      // Process data for charts
      const issueData = [
        {
          name: "Open",
          value: issues.filter((i) => i.state === "open").length,
        },
        {
          name: "Closed",
          value: issues.filter((i) => i.state === "closed").length,
        },
      ];

      const prData = [
        { name: "Open", value: pulls.filter((p) => p.state === "open").length },
        { name: "Merged", value: pulls.filter((p) => p.merged_at).length },
        {
          name: "Closed",
          value: pulls.filter((p) => p.state === "closed" && !p.merged_at)
            .length,
        },
      ];

      const contributorData = contributors
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, 5)
        .map((c) => ({
          name: c.login,
          contributions: c.contributions,
        }));

      setMetrics({
        issueData,
        prData,
        contributorData,
        repoStats: {
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          watchers: repository.watchers_count,
          size: repository.size,
        },
      });
    } catch (err) {
      setError("Error processing repository data");
    }
  }, [repoData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
    {/* Header */}
    <header className="bg-gray-900 text-white px-8">
    <div className="container mx-auto px-8 py-6 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <h1 className="text-2xl font-bold">GitInsight</h1>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  </header>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Repository Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(metrics.repoStats).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex flex-col space-y-1 sm:space-y-2">
                <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{key}</h4>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Issues Chart */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Issues Status</h3>
            <div className="h-48 sm:h-64 w-full flex justify-center items-center">
              <PieChart width={window.innerWidth < 640 ? 200 : 400} height={window.innerWidth < 640 ? 180 : 250}>
                <Pie
                  data={metrics.issueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth < 640 ? 35 : 60}
                  outerRadius={window.innerWidth < 640 ? 55 : 80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.issueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '8px' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </div>
          </div>

          {/* Pull Requests Chart */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Pull Requests Status</h3>
            <div className="h-48 sm:h-64 w-full flex justify-center items-center">
              <PieChart width={window.innerWidth < 640 ? 200 : 400} height={window.innerWidth < 640 ? 180 : 250}>
                <Pie
                  data={metrics.prData}
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth < 640 ? 35 : 60}
                  outerRadius={window.innerWidth < 640 ? 55 : 80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.prData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '8px' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </div>
          </div>
        </div>

        {/* Contributors Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Top Contributors</h3>
          <div className="h-48 sm:h-64 w-full overflow-x-auto">
            <BarChart width={window.innerWidth < 640 ? window.innerWidth - 50 : 800} height={window.innerWidth < 640 ? 180 : 250} data={metrics.contributorData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', padding: '8px' }} />
              <Bar dataKey="contributions" fill="#8884d8">
                {metrics.contributorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
a 
        {/* Contributors Grid */}
        {repoData?.contributors && (
          <ContributorGrid contributors={repoData.contributors} />
        )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
