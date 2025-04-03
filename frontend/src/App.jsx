import { useState, useEffect } from 'react';
import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [repoInfo, setRepoInfo] = useState(null);

  // Update dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAnalyze = (info) => {
    setRepoInfo(info);
  };

  return (
    // <QueryClientProvider client={queryClient}>
    //   <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    //     <nav className="bg-white dark:bg-gray-800 shadow">
    //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //         <div className="flex justify-between h-16">
    //           <div className="flex items-center">
    //             <h1 className="text-xl font-bold text-gray-900 dark:text-white">
    //               GitHub Repo Analyzer
    //             </h1>
    //           </div>
    //           <div className="flex items-center">
    //             <button
    //               onClick={() => setDarkMode(!darkMode)}
    //               className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
    //             >
    //               {darkMode ? '🌞' : '🌙'}
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </nav>

        <main>
         
            <HomePage onAnalyze={handleAnalyze} />
            <Dashboard repoData={repoInfo} />
         
        </main>
    //   </div>
    // </QueryClientProvider>
  )
}

export default App
