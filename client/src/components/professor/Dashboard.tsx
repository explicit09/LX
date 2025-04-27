import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: number;
  name: string;
  description?: string;
  accessCode: string;
  studentCount: number;
  lastActivity: Date;
  materialsCount: number;
}

interface DashboardProps {
  professorName: string;
}

const ProfessorDashboard: React.FC<DashboardProps> = ({ professorName }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      description: 'Fundamentals of programming, algorithms, and computational thinking',
      accessCode: 'CS101-XYZ',
      studentCount: 42,
      lastActivity: new Date('2023-06-15T14:48:00'),
      materialsCount: 15
    },
    {
      id: 2,
      name: 'Data Structures',
      description: 'Advanced data organization techniques and algorithm design',
      accessCode: 'CS201-ABC',
      studentCount: 28,
      lastActivity: new Date('2023-06-14T09:23:00'),
      materialsCount: 22
    },
    {
      id: 3,
      name: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning concepts and applications',
      accessCode: 'ML101-DEF',
      studentCount: 35,
      lastActivity: new Date('2023-06-16T11:15:00'),
      materialsCount: 18
    }
  ]);

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {professorName}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your courses and track student progress
            </p>
          </div>
          <Link
            to="/create-course"
            className="btn-primary px-4 py-2 rounded-lg mt-4 md:mt-0 text-center"
          >
            <span className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Course
            </span>
          </Link>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: 'Total Courses',
              value: courses.length,
              icon: (
                <div className="rounded-full p-3 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Total Students',
              value: courses.reduce((sum, course) => sum + course.studentCount, 0),
              icon: (
                <div className="rounded-full p-3 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Materials Uploaded',
              value: courses.reduce((sum, course) => sum + course.materialsCount, 0),
              icon: (
                <div className="rounded-full p-3 bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Student Queries',
              value: 183,
              icon: (
                <div className="rounded-full p-3 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              )
            }
          ].map((stat, i) => (
            <div key={i} className="card p-6">
              <div className="flex items-center">
                {stat.icon}
                <div className="ml-5">
                  <h3 className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
                    {stat.title}
                  </h3>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card overflow-hidden group">
                <div className="h-3 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold mb-1">{course.name}</h3>
                    <div className="flex flex-col items-end">
                      <div className="badge-primary">
                        {course.studentCount} student{course.studentCount !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Activity: {formatRelativeTime(course.lastActivity)}
                      </div>
                    </div>
                  </div>
                  
                  {course.description && (
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                      {course.description}
                    </p>
                  )}
                  
                  <div className="flex items-center mb-5">
                    <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-md text-sm font-medium flex items-center">
                      <span className="text-neutral-500 dark:text-neutral-400 mr-2">Access Code:</span>
                      <span className="font-mono">{course.accessCode}</span>
                      <button 
                        className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700"
                        title="Copy to clipboard"
                        onClick={() => navigator.clipboard.writeText(course.accessCode)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/course/${course.id}`}
                      className="btn-primary px-4 py-2 text-sm rounded-md flex-1"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/course/${course.id}/upload`}
                      className="btn-secondary px-4 py-2 text-sm rounded-md flex items-center justify-center"
                      title="Upload Materials"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </Link>
                    <Link
                      to={`/course/${course.id}/analytics`}
                      className="btn-secondary px-4 py-2 text-sm rounded-md flex items-center justify-center"
                      title="View Analytics"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Create Course Card */}
            <Link 
              to="/create-course"
              className="card group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all border-2 border-dashed border-neutral-200 dark:border-neutral-700 p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px]"
            >
              <div className="rounded-full p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 mb-4 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Create New Course</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Set up a new course and invite students
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard; 