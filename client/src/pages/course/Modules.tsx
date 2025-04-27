import React from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Loader2, Book, FileText, Video, Clock, ArrowLeft } from 'lucide-react';
import ModuleList from '@/components/course/ModuleList';

// Sample course data (would normally come from an API)
const SAMPLE_COURSE = {
  id: 1,
  name: 'Leadership and Management Ethics',
  description: 'This course explores ethical frameworks and decision-making processes in leadership contexts.',
  professorId: 101,
  professorName: 'Dr. Jane Smith',
  startDate: '2025-01-15',
  modules: [
    {
      id: 1,
      title: 'Ethical Frameworks',
      expanded: true,
      sections: [
        {
          title: 'Introduction to Ethics',
          items: [
            {
              id: 1,
              title: 'Understanding Ethical Frameworks',
              type: 'reading' as const,
              status: 'completed' as const
            },
            {
              id: 2,
              title: 'Video: Ethics in Leadership',
              type: 'video' as const,
              status: 'completed' as const
            }
          ]
        },
        {
          title: 'Applied Ethics',
          items: [
            {
              id: 3,
              title: 'Case Study Analysis',
              type: 'assignment' as const,
              status: 'in-progress' as const
            },
            {
              id: 4,
              title: 'Ethics Quiz',
              type: 'quiz' as const,
              dueDate: '2025-05-15',
              points: 20,
              status: 'not-started' as const
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Ethical Decision Making',
      expanded: false,
      prerequisites: ['Ethical Frameworks'],
      sections: [
        {
          title: 'Decision Models',
          items: [
            {
              id: 5,
              title: 'Decision Making Frameworks',
              type: 'reading' as const,
              status: 'not-started' as const
            },
            {
              id: 6,
              title: 'Applying Models to Scenarios',
              type: 'assignment' as const,
              status: 'not-started' as const
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Corporate Social Responsibility',
      expanded: false,
      prerequisites: ['Ethical Decision Making'],
      sections: [
        {
          title: 'CSR Principles',
          items: [
            {
              id: 7,
              title: 'CSR and Business Ethics',
              type: 'reading' as const,
              status: 'not-started' as const
            }
          ]
        }
      ]
    }
  ]
};

export default function ModulesPage() {
  const [match, params] = useRoute('/courses/:courseId/modules');
  
  if (!match) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  const { courseId } = params;
  const course = SAMPLE_COURSE; // Would normally be fetched from API
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      {/* Course Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="mr-1" asChild>
              <a href="/student/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Course
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-1">{course.name}</h1>
          <p className="text-neutral-600 dark:text-neutral-300 mt-1">
            {course.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mt-3">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Start date: {new Date(course.startDate).toLocaleDateString()}
            </span>
            <span className="mx-2">•</span>
            <span>Instructor: {course.professorName}</span>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
            <CardDescription>
              Welcome to {course.name}. This course is structured in modules, each building on previous concepts.
              Complete all activities to master the material.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <ModuleList modules={course.modules} courseId={parseInt(courseId)} />
      </div>
    </div>
  );
}
