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
        {/* <nav>
          <ul className="flex space-x-6">
            <li><a href="#" className="hover:text-blue-400">Home</a></li>
            <li><a href="#" className="hover:text-blue-400">Features</a></li>
            <li><a href="#" className="hover:text-blue-400">Docs</a></li>
            <li><a href="#" className="hover:text-blue-400">About</a></li>
          </ul>
        </nav> */}
      </div>
    </div>
  </header>
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mt-4 sm:mt-8 grid grid-cols-1 gap-4 sm:gap-6">
          <div className="grid grid-cols-2 gap-2">
            {/* Issues Chart */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Issues Status
              </h3>
              <div className="h-64 w-full flex justify-center">
                <PieChart
                  width={window.innerWidth < 640 ? 300 : 400}
                  height={250}
                >
                  <Pie
                    data={metrics.issueData}
                    cx="50%"
                    cy={125}
                    innerRadius={window.innerWidth < 640 ? 45 : 60}
                    outerRadius={window.innerWidth < 640 ? 65 : 80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.issueData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>

            {/* Pull Requests Chart */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Pull Requests Status
              </h3>
              <div className="h-64 w-full flex justify-center">
                <PieChart
                  width={window.innerWidth < 640 ? 300 : 400}
                  height={250}
                >
                  <Pie
                    data={metrics.prData}
                    cx="50%"
                    cy={125}
                    innerRadius={window.innerWidth < 640 ? 45 : 60}
                    outerRadius={window.innerWidth < 640 ? 65 : 80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metrics.prData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>

          <div className="">
                    {/* Top Contributors Chart */}
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Top Contributors
            </h3>
            <div className="h-64 w-full overflow-x-auto">
              <BarChart
                width={Math.max(window.innerWidth - 40, 600)}
                height={250}
                data={metrics.contributorData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="contributions" fill="#8884d8" />
              </BarChart>
            </div>
          </div>

          {/* Contributors Grid */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
            <ContributorGrid contributors={repoData?.contributors || []} />
          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
