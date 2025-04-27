import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TopNav from "@/components/layout/TopNav";
import SideNav from "@/components/layout/SideNav";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course, ChatStats, MaterialStats, StudentInteraction } from "@/lib/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Reports = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // Fetch courses for the filter dropdown
  const { 
    data: courses = [], 
    isLoading: coursesLoading 
  } = useQuery<Course[]>({
    queryKey: ["/api/professor/courses"],
  });

  // Mock data for various reports
  const chatStats: ChatStats = {
    totalQuestions: 248,
    averageQuestionsPerStudent: 12.4,
    topQuestionsPerDay: 45,
    questionsPerDay: [
      { date: "Apr 10", count: 25 },
      { date: "Apr 11", count: 32 },
      { date: "Apr 12", count: 17 },
      { date: "Apr 13", count: 29 },
      { date: "Apr 14", count: 45 },
      { date: "Apr 15", count: 30 },
      { date: "Apr 16", count: 27 },
    ]
  };

  const materialStats: MaterialStats = {
    totalPdfCount: 15,
    totalAudioCount: 8,
    mostReferencedMaterials: [
      { id: 1, name: "Module 20.pdf", count: 87 },
      { id: 2, name: "Audio recording (Apr 11)", count: 65 },
      { id: 3, name: "Module 21.pdf", count: 42 },
    ]
  };

  const studentInteractions: StudentInteraction[] = [
    {
      studentId: 1,
      studentName: "Alex Johnson",
      questionCount: 24,
      lastInteraction: "2025-04-16T15:32:45Z",
      topics: [
        { topic: "Neural Networks", count: 12 },
        { topic: "Backpropagation", count: 8 },
        { topic: "Activation Functions", count: 4 },
      ]
    },
    {
      studentId: 2,
      studentName: "Maria Garcia",
      questionCount: 18,
      lastInteraction: "2025-04-15T09:14:22Z",
      topics: [
        { topic: "Gradient Descent", count: 10 },
        { topic: "Loss Functions", count: 5 },
        { topic: "Overfitting", count: 3 },
      ]
    },
    {
      studentId: 3,
      studentName: "James Smith",
      questionCount: 31,
      lastInteraction: "2025-04-16T12:45:18Z",
      topics: [
        { topic: "Convolutional Networks", count: 15 },
        { topic: "Pooling Layers", count: 9 },
        { topic: "Image Classification", count: 7 },
      ]
    }
  ];

  const commonTopics = [
    { topic: "Neural Networks", count: 65 },
    { topic: "Backpropagation", count: 48 },
    { topic: "Gradient Descent", count: 42 },
    { topic: "Convolutional Networks", count: 39 },
    { topic: "Activation Functions", count: 34 },
  ];

  // Colors for charts
  const COLORS = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      
      <div className="flex-1 flex dashboard-content">
        <SideNav />
        
        <main className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Reports</h1>
              <p className="text-gray-600">Analyze student interactions with course materials</p>
            </div>
            
            <div className="w-64">
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
                disabled={coursesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={coursesLoading ? "Loading courses..." : "All Courses"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatStats.totalQuestions}</div>
                <p className="text-xs text-muted-foreground">
                  Across all courses and students
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Questions per Student</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatStats.averageQuestionsPerStudent}</div>
                <p className="text-xs text-muted-foreground">
                  Engagement metric
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">PDF Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialStats.totalPdfCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total uploaded PDF documents
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audio Recordings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{materialStats.totalAudioCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total uploaded and transcribed
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different reports */}
          <Tabs defaultValue="chat" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">Chat Activity</TabsTrigger>
              <TabsTrigger value="topics">Common Topics</TabsTrigger>
              <TabsTrigger value="materials">Material Usage</TabsTrigger>
              <TabsTrigger value="students">Student Interactions</TabsTrigger>
            </TabsList>
            
            {/* Chat Activity Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Questions Per Day</CardTitle>
                  <CardDescription>
                    Student question activity over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chatStats.questionsPerDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Common Topics Tab */}
            <TabsContent value="topics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Most Common Topics</CardTitle>
                  <CardDescription>
                    Topics students ask about most frequently
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={commonTopics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="topic"
                        >
                          {commonTopics.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} questions`, 'Frequency']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Material Usage Tab */}
            <TabsContent value="materials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Most Referenced Materials</CardTitle>
                  <CardDescription>
                    Course materials that students refer to most often
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={materialStats.mostReferencedMaterials}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={150} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--chart-2))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Student Interactions Tab */}
            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Activity</CardTitle>
                  <CardDescription>
                    Individual student interaction metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Student</th>
                          <th className="p-3 text-left font-medium">Questions</th>
                          <th className="p-3 text-left font-medium">Last Active</th>
                          <th className="p-3 text-left font-medium">Top Topic</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentInteractions.map((student) => {
                          const lastActive = new Date(student.lastInteraction);
                          const topTopic = student.topics.sort((a, b) => b.count - a.count)[0];
                          
                          return (
                            <tr key={student.studentId} className="border-b">
                              <td className="p-3">{student.studentName}</td>
                              <td className="p-3">{student.questionCount}</td>
                              <td className="p-3">{lastActive.toLocaleDateString()}</td>
                              <td className="p-3">{topTopic?.topic || 'N/A'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Reports;
