import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Course {
  id: number;
  name: string;
  description?: string;
  professorName: string;
  lastActivity?: Date;
  materialCount: number;
}

interface DashboardProps {
  studentName: string;
}

const StudentDashboard: React.FC<DashboardProps> = ({ studentName }) => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: 'Introduction to Computer Science',
      description: 'Fundamentals of programming, algorithms, and computational thinking',
      professorName: 'Dr. Sarah Chen',
      lastActivity: new Date('2023-06-15T14:48:00'),
      materialCount: 15
    },
    {
      id: 2,
      name: 'Data Structures',
      description: 'Advanced data organization techniques and algorithm design',
      professorName: 'Dr. James Wilson',
      lastActivity: new Date('2023-06-14T09:23:00'),
      materialCount: 22
    }
  ]);
  
  const [joinCourseCode, setJoinCourseCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  
  // Format relative time
  const formatRelativeTime = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hours ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  // Handle course joining
  const handleJoinCourse = () => {
    if (!joinCourseCode.trim()) {
      setCodeError('Please enter an access code');
      return;
    }
    
    // Mock course joining
    if (joinCourseCode === 'ML101-DEF') {
      const newCourse: Course = {
        id: 3,
        name: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning concepts and applications',
        professorName: 'Dr. Emily Rodriguez',
        lastActivity: new Date(),
        materialCount: 18
      };
      
      setCourses(prev => [...prev, newCourse]);
      setJoinCourseCode('');
      setCodeError(null);
    } else {
      setCodeError('Invalid access code. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {studentName}</h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Access your courses and chat with AI course assistants
            </p>
          </div>
        </div>

        {/* Join Course Section */}
        <div className="card p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Join a New Course</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={joinCourseCode}
                onChange={(e) => {
                  setJoinCourseCode(e.target.value);
                  setCodeError(null);
                }}
                placeholder="Enter course access code"
                className="input w-full"
              />
              {codeError && (
                <p className="text-red-500 text-sm mt-1">{codeError}</p>
              )}
            </div>
            <button 
              onClick={handleJoinCourse}
              className="btn-primary py-2 px-6 rounded-md"
            >
              Join Course
            </button>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
            Access codes are provided by your professor. Format: ABC123-XYZ
          </p>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: 'Enrolled Courses',
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
              title: 'Available Materials',
              value: courses.reduce((sum, course) => sum + course.materialCount, 0),
              icon: (
                <div className="rounded-full p-3 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )
            },
            {
              title: 'Questions Asked',
              value: 47,
              icon: (
                <div className="rounded-full p-3 bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-400">
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

        {/* Your Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          {courses.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="inline-flex h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 items-center justify-center mb-4">
                <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                You aren't enrolled in any courses yet. Use a course access code to join one.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="card overflow-hidden">
                  <div className="h-3 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold">{course.name}</h3>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Last activity: {formatRelativeTime(course.lastActivity)}
                      </div>
                    </div>
                    
                    {course.description && (
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                        {course.description}
                      </p>
                    )}
                    
                    <div className="flex items-center mb-5">
                      <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Professor:
                      </span>
                      <span className="ml-1 text-sm">{course.professorName}</span>
                    </div>
                    
                    <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 mt-2">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/student/course/${course.id}/chat`}
                          className="btn-primary px-4 py-2 text-sm rounded-md flex-1 flex items-center justify-center"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Chat with AI
                        </Link>
                        <Link
                          to={`/student/course/${course.id}/materials`}
                          className="btn-secondary px-4 py-2 text-sm rounded-md flex items-center justify-center flex-1"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Materials
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 