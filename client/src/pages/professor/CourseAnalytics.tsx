import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ArrowLeft, Calendar, Users, FileText, MessagesSquare, Loader2 } from 'lucide-react';

import CanvasLayout from '@/components/layout/CanvasLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course, CourseReport, StudentInteraction, ChatStats, MaterialStats } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, getQueryFn } from '@/lib/queryClient';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF6B6B', '#54C8E8'];

const CourseAnalytics: React.FC = () => {
  const [, params] = useRoute<{ courseId: string }>('/professor/courses/:courseId/analytics');
  const courseId = params?.courseId ? parseInt(params.courseId, 10) : 0;
  const { toast } = useToast();

  const {
    data: course,
    isLoading: isLoadingCourse,
    error: courseError,
  } = useQuery<Course>({
    queryKey: [`/api/professor/courses/${courseId}`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!courseId,
  });

  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error: analyticsError,
  } = useQuery<CourseReport>({
    queryKey: [`/api/professor/courses/${courseId}/analytics`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!courseId,
  });

  const {
    data: studentInteractions,
    isLoading: isLoadingStudents,
    error: studentsError,
  } = useQuery<StudentInteraction[]>({
    queryKey: [`/api/professor/courses/${courseId}/students`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!courseId,
  });

  const {
    data: chatStats,
    isLoading: isLoadingChatStats,
    error: chatStatsError,
  } = useQuery<ChatStats>({
    queryKey: [`/api/professor/courses/${courseId}/chat-stats`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!courseId,
  });

  const {
    data: materialStats,
    isLoading: isLoadingMaterialStats,
    error: materialStatsError,
  } = useQuery<MaterialStats>({
    queryKey: [`/api/professor/courses/${courseId}/material-stats`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!courseId,
  });

  // Track if any error occurs
  useEffect(() => {
    const errors = [
      courseError,
      analyticsError,
      studentsError,
      chatStatsError,
      materialStatsError,
    ].filter(Boolean);

    if (errors.length > 0) {
      toast({
        title: 'Error loading analytics',
        description: 'Some data could not be loaded. Please try again later.',
        variant: 'destructive',
      });
    }
  }, [courseError, analyticsError, studentsError, chatStatsError, materialStatsError, toast]);

  // Check if any data is still loading
  const isLoading =
    isLoadingCourse ||
    isLoadingAnalytics ||
    isLoadingStudents ||
    isLoadingChatStats ||
    isLoadingMaterialStats;

  if (isLoading) {
    return (
      <CanvasLayout title="Course Analytics" showBack backTo="/professor/dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">Loading analytics data...</p>
          </div>
        </div>
      </CanvasLayout>
    );
  }

  if (!course || !analytics || !studentInteractions || !chatStats || !materialStats) {
    return (
      <CanvasLayout title="Course Analytics" showBack backTo="/professor/dashboard">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No data available</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Analytics data for this course could not be loaded
          </p>
          <Button asChild>
            <a href="/professor/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </CanvasLayout>
    );
  }

  return (
    <CanvasLayout
      title={`Analytics for ${course.name}`}
      showBack
      backTo="/professor/dashboard"
    >
      {/* Course Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2 text-neutral-500" />
              Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{course.studentCount || 0}</div>
            <p className="text-sm text-neutral-500">Total enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <MessagesSquare className="h-5 w-5 mr-2 text-neutral-500" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalQuestions}</div>
            <p className="text-sm text-neutral-500">
              {chatStats.averageQuestionsPerStudent.toFixed(1)} per student
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <FileText className="h-5 w-5 mr-2 text-neutral-500" />
              Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {materialStats.totalPdfCount + materialStats.totalAudioCount}
            </div>
            <p className="text-sm text-neutral-500">
              {materialStats.totalPdfCount} PDFs, {materialStats.totalAudioCount} Audio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Common Topics & Questions Over Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Common Topics</CardTitle>
            <CardDescription>
              Most frequently discussed topics in student questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.commonTopics}
                    dataKey="count"
                    nameKey="topic"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ topic, count }) => `${topic} (${count})`}
                  >
                    {analytics.commonTopics.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} questions`, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Questions Over Time</CardTitle>
            <CardDescription>Daily question activity over past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chatStats.questionsPerDay}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} questions`]}
                    labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Interactions & Most Referenced Materials */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Activity</CardTitle>
            <CardDescription>Breakdown of student engagement with course materials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="py-3 px-4 text-left font-medium text-neutral-600 dark:text-neutral-300">
                      Student
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-600 dark:text-neutral-300">
                      Questions
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden md:table-cell">
                      Last Interaction
                    </th>
                    <th className="py-3 px-4 text-left font-medium text-neutral-600 dark:text-neutral-300 hidden md:table-cell">
                      Common Topics
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentInteractions.map((student) => (
                    <tr
                      key={student.studentId}
                      className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    >
                      <td className="py-3 px-4">{student.studentName}</td>
                      <td className="py-3 px-4">{student.questionCount}</td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {new Date(student.lastInteraction).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {student.topics.slice(0, 3).map((topic, index) => (
                            <span
                              key={index}
                              className="inline-block px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                            >
                              {topic.topic} ({topic.count})
                            </span>
                          ))}
                          {student.topics.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                              +{student.topics.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {studentInteractions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-neutral-500">
                        No student interactions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Referenced Materials</CardTitle>
            <CardDescription>Materials that students refer to most often in their questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={materialStats.mostReferencedMaterials}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tickFormatter={(name) => 
                      name.length > 20 ? `${name.substring(0, 20)}...` : name
                    }
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} references`]}
                  />
                  <Bar dataKey="count" fill="#8884d8" barSize={30} radius={[0, 4, 4, 0]}>
                    {materialStats.mostReferencedMaterials.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </CanvasLayout>
  );
};

export default CourseAnalytics;