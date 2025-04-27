import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContinualLearningBanner = () => {
  // Calculate randomized progress metrics for display purposes
  const coursesInProgress = Math.floor(Math.random() * 3) + 1; // 1-3 courses
  const completionPercentage = Math.floor(Math.random() * 85) + 10; // 10-95%
  const timeSpentThisWeek = Math.floor(Math.random() * 10) + 2; // 2-12 hours
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Icon */}
        <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-700 dark:text-blue-400" />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
            Continue your learning journey
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            You have {coursesInProgress} course{coursesInProgress !== 1 ? 's' : ''} in progress. 
            Complete the next module to maintain your {completionPercentage}% completion rate.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Courses in progress</p>
              <p className="text-lg font-medium text-neutral-800 dark:text-white">{coursesInProgress}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Completion rate</p>
              <p className="text-lg font-medium text-neutral-800 dark:text-white">{completionPercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Time spent this week</p>
              <p className="text-lg font-medium text-neutral-800 dark:text-white">{timeSpentThisWeek} hours</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="w-full md:w-auto flex">
          <Button 
            className="w-full md:w-auto flex items-center"
            onClick={() => window.location.href = '#resume-learning'}
          >
            Resume Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContinualLearningBanner;