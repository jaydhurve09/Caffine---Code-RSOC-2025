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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <main>
        {repoInfo ? (
          <Dashboard repoData={repoInfo} />
        ) : (
          <HomePage onAnalyze={handleAnalyze} />
        )}
      </main>
    </div>
  )
}

export default App
