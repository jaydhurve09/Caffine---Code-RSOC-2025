import React from 'react';

const ContributorGrid = ({ contributors }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Contributors</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
        {contributors.map((contributor) => (
          <div
            key={contributor.id}
            className="flex flex-col items-center p-2 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <img
              src={contributor.avatar_url}
              alt={`${contributor.login}'s avatar`}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-2"
            />
            <a
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate max-w-full"
            >
              {contributor.login}
            </a>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {contributor.contributions} contributions
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributorGrid;