import React from 'react';
import { BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const ContinualLearningBanner = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-4 mb-6 border border-blue-100 dark:border-blue-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">Continual Learning</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Review these topics to strengthen your knowledge
            </p>
          </div>
        </div>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center">
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <div className="bg-white dark:bg-neutral-800 rounded-md p-3 shadow-sm border border-blue-100 dark:border-blue-900">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="ml-2">
              <h4 className="font-medium text-sm text-neutral-800 dark:text-white">Leadership Ethics</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Last reviewed 2 weeks ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-md p-3 shadow-sm border border-blue-100 dark:border-blue-900">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="ml-2">
              <h4 className="font-medium text-sm text-neutral-800 dark:text-white">Financial Analysis</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Last reviewed 3 weeks ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-md p-3 shadow-sm border border-blue-100 dark:border-blue-900">
          <div className="flex items-start">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="ml-2">
              <h4 className="font-medium text-sm text-neutral-800 dark:text-white">Constitutional Law</h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Last reviewed 1 month ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinualLearningBanner;