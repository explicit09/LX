import React, { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/lib/user-context';
import { Course } from '@/lib/types';
import CanvasLayout from '@/components/layout/CanvasLayout';
import ModuleList from '@/components/course/ModuleList';

const CourseModules = () => {
  const { user } = useUser();
  const [, params] = useRoute('/courses/:courseId/modules');
  const [, setLocation] = useLocation();
  const courseId = params?.courseId ? parseInt(params.courseId) : 0;
  
  // Fetch course details
  const { data: course, isLoading: isLoadingCourse } = useQuery<Course>({
    queryKey: [user?.role === 'professor' ? '/api/professor/courses' : '/api/student/courses', courseId],
    enabled: !!user && !!courseId,
  });
  
  // Example modules data (this would normally come from an API)
  const modules = [
    {
      id: 1,
      title: 'START HERE - Orientation to the Course',
      expanded: true,
      sections: [
        {
          title: 'Getting Started',
          items: [
            {
              id: 101,
              title: 'Course Introduction',
              type: 'video' as const,
              status: 'completed' as const
            },
            {
              id: 102,
              title: 'Syllabus & Course Expectations',
              type: 'reading' as const,
              status: 'completed' as const
            },
            {
              id: 103,
              title: 'Introduce Yourself Discussion',
              type: 'assignment' as const,
              dueDate: '2025-05-10T23:59:00',
              points: 5,
              status: 'completed' as const
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: '01 - Introduction and Team Leadership',
      prerequisites: ['START HERE'],
      sections: [
        {
          title: 'Leadership Fundamentals',
          items: [
            {
              id: 201,
              title: 'What is Leadership?',
              type: 'reading' as const,
              status: 'completed' as const
            },
            {
              id: 202,
              title: 'Leadership Styles',
              type: 'video' as const,
              status: 'completed' as const
            },
            {
              id: 203,
              title: 'Leadership Assessment',
              type: 'quiz' as const,
              dueDate: '2025-05-15T23:59:00',
              points: 10,
              status: 'in-progress' as const
            }
          ]
        },
        {
          title: 'Team Dynamics',
          items: [
            {
              id: 204,
              title: 'Building Effective Teams',
              type: 'reading' as const,
              status: 'not-started' as const
            },
            {
              id: 205,
              title: 'Team Performance Factors',
              type: 'video' as const,
              status: 'not-started' as const
            },
            {
              id: 206,
              title: 'Team Analysis Assignment',
              type: 'assignment' as const,
              dueDate: '2025-05-20T23:59:00',
              points: 15,
              status: 'not-started' as const
            }
          ]
        }
      ]
    },

    {
      id: 3,
      title: '02 - Moral Reasoning',
      prerequisites: ['01 - Introduction and Team Leadership'],
      sections: [
        {
          title: 'Prep Work',
          items: [
            {
              id: 301,
              title: 'Reading: Chapter 15 - Leadership Ethics',
              type: 'reading' as const,
              status: 'not-started' as const
            },
            {
              id: 302,
              title: 'Knowledge Check 15.1',
              type: 'quiz' as const,
              dueDate: '2025-05-25T23:59:00',
              points: 10,
              status: 'not-started' as const
            },
            {
              id: 303,
              title: 'Preparation: Moral Vignettes',
              type: 'reading' as const,
              status: 'not-started' as const
            }
          ]
        },
        {
          title: 'Class Material',
          items: [
            {
              id: 304,
              title: 'Study Guide 03 - Moral Reasoning (with video)',
              type: 'video' as const,
              status: 'not-started' as const
            },
            {
              id: 305,
              title: 'Discussion: Ethical Dilemmas in Leadership',
              type: 'assignment' as const,
              dueDate: '2025-05-27T23:59:00',
              points: 15,
              status: 'not-started' as const
            }
          ]
        }
      ]
    }
  ];
  
  // Redirect if no course ID
  useEffect(() => {
    if (!courseId) {
      setLocation(user?.role === 'professor' ? '/professor/dashboard' : '/student/dashboard');
    }
  }, [courseId, setLocation, user]);
  
  if (!courseId || !user) return null;
  
  const breadcrumbs = [
    {
      label: 'Dashboard',
      path: user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard'
    },
    {
      label: course?.name || 'Course',
      path: `/courses/${courseId}`
    }
  ];
  
  return (
    <CanvasLayout 
      title="Modules" 
      breadcrumbs={breadcrumbs}
    >
      {isLoadingCourse ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-300 dark:border-neutral-700 border-t-neutral-600 dark:border-t-neutral-300 rounded-full mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading course...</p>
        </div>
      ) : course ? (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-2">
              {course.name}
            </h1>
            {course.description && (
              <p className="text-neutral-600 dark:text-neutral-400">
                {course.description}
              </p>
            )}
          </div>
          
          <ModuleList modules={modules} courseId={courseId} />
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <h3 className="font-medium text-neutral-800 dark:text-white text-lg mb-2">
            Course not found
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            The course you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      )}
    </CanvasLayout>
  );
};

export default CourseModules;