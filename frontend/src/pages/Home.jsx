import React, { useState, useEffect } from "react";
import { getRepositoryData, calculateRepoHealth } from "../services/github";
import Dashboard from "./Dashboard";
import heroImage from "../assets/image.png";

const HomePage = ({ onAnalyze }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  useEffect(() => {
    const count = localStorage.getItem("analyzedReposCount") || 0;
    setAnalyzedCount(Number(count));
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Parse GitHub URL to extract owner and repo
      const url = new URL(repoUrl);
      const [, owner, repo] = url.pathname.split("/");

      if (!owner || !repo || !repoUrl.includes("github.com")) {
        throw new Error("Please enter a valid GitHub repository URL");
      }

      // Fetch repository data
      const data = await getRepositoryData(owner, repo);
      const healthMetrics = calculateRepoHealth(data);

      // Pass repository data to parent component
      onAnalyze(data);

      // Increment analyzed count
      const newCount = analyzedCount + 1;
      setAnalyzedCount(newCount);
      localStorage.setItem("analyzedReposCount", newCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {repoData ? (
        <Dashboard repoData={repoData} />
      ) : (
        <div>
          {/* Header */}
          <header className="bg-gray-900 bg-opacity-100 text-white px-8">
            <div className="container mx-auto px-8 py-6 ">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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

          {/* Hero Section */}
          <section
            className="px-18 py-15 bg-gray-900 text-white"
            style={{
              backgroundImage:
                "radial-gradient(circle at top, rgba(83, 197, 255, 0.4) 10%, rgba(5, 0, 26, 0.1) 50%)",
              backgroundBlendMode: "normal",
            }}
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center relative">
                <div className="text-center md:text-left max-w-2xl">
                  <h2 className="text-4xl font-bold mb-6">
                    Analyze GitHub Repositories with Ease
                  </h2>
                  <p className="text-xl mb-10">
                    Get comprehensive insights, code quality metrics, and
                    contributor analytics for any public GitHub repository.
                  </p>
                  <form onSubmit={handleAnalyze} className="max-w-xl">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <input
                        type="text"
                        placeholder="Enter GitHub repository URL"
                        className="flex-grow py-3 px-4 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-accent to-accentDark hover:bg-blue-700 py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <svg
                            className="animate-spin h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : null}
                        {isLoading ? "Analyzing..." : "Analyze Repository"}
                      </button>
                    </div>
                    {error && <p className="text-red-400 mt-2">{error}</p>}
                  </form>

                  <div className="mt-6 max-w-[200px] bg-gray-900 border border-accentDark text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium">
                        Repositories Analyzed
                      </p>
                      <p className="text-2xl font-bold">{analyzedCount}</p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img
                    src={heroImage}
                    alt="Repository Analysis"
                    className="w-full h-auto max-w-sm mx-auto dark:opacity-90 transform scale-x-[-1]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-16 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Key Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 mb-4">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Code Analysis</h3>
                  <p className="text-gray-600">
                    Get detailed insights about code quality, complexity, and
                    potential issues.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 mb-4">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Contributor Metrics
                  </h3>
                  <p className="text-gray-600">
                    Analyze contribution patterns, active developers, and team
                    collaboration.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-blue-600 mb-4">
                    <svg
                      className="w-10 h-10"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Data Visualization
                  </h3>
                  <p className="text-gray-600">
                    Visual charts and graphs to better understand repository
                    trends and patterns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="px-16 py-16 bg-gray-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                How It Works
              </h2>

              <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
                <div className="flex-1 order-2 md:order-1">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <ol className="space-y-6">
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          1
                        </span>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">
                            Enter Repository URL
                          </h4>
                          <p className="text-gray-600">
                            Paste the URL of any public GitHub repository you
                            want to analyze.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          2
                        </span>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">
                            Process Analysis
                          </h4>
                          <p className="text-gray-600">
                            Our system scans the repository, collects data, and
                            processes analytics.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          3
                        </span>
                        <div>
                          <h4 className="font-semibold text-lg mb-1">
                            Get Comprehensive Report
                          </h4>
                          <p className="text-gray-600">
                            View detailed insights and download reports for
                            further analysis.
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="flex-1 order-1 md:order-2">
                  <div className="bg-gray-800 rounded-lg shadow-lg p-4 max-w-md mx-auto">
                    <div className="rounded-t-md bg-gray-700 py-2 px-4 flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-b-md text-green-400 font-mono text-sm">
                      <p>&gt; Analyzing repository structure</p>
                      <p>&gt; Processing commit history</p>
                      <p>&gt; Examining code quality</p>
                      <p>&gt; Evaluating contributor data</p>
                      <p className="animate-pulse">
                        &gt; Generating reports...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-blue-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to gain insights into your repositories?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Start analyzing your GitHub repositories today and unlock
                valuable insights.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-blue-600 hover:bg-gray-100 py-3 px-8 rounded-lg font-medium transition duration-200">
                  Get Started
                </button>
                <button className="border-2 border-white hover:bg-blue-700 py-3 px-8 rounded-lg font-medium transition duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <svg
                      className="w-8 h-8 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <h3 className="text-xl font-bold">GitInsight</h3>
                  </div>
                  <p className="text-gray-400">
                    Advanced GitHub repository analytics for developers and
                    teams.
                  </p>
                </div>

                {/* <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
              <p className="text-gray-400">Subscribe to our newsletter</p>
              <form className="mt-2">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="px-4 py-2 rounded-l-lg text-gray-800 w-full focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 rounded-r-lg px-4 transition duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div> */}
              </div>

              {/* <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} GitInsight. All rights reserved.</p>
          </div> */}
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default HomePage;
