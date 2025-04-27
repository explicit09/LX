import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/lib/user-context';
import { Course } from '@/lib/types';
import CanvasLayout from '@/components/layout/CanvasLayout';
import ChatBot from '@/components/course/ChatBot';
import { Printer, Download, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ModuleDetail = () => {
  const { user } = useUser();
  const [, params] = useRoute('/courses/:courseId/modules/:moduleId/items/:itemId');
  const [, setLocation] = useLocation();
  const courseId = params?.courseId ? parseInt(params.courseId) : 0;
  const moduleId = params?.moduleId ? parseInt(params.moduleId) : 0;
  const itemId = params?.itemId ? parseInt(params.itemId) : 0;
  
  // State for chat collapsing
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  
  // Fetch course details
  const { data: course } = useQuery<Course>({
    queryKey: [user?.role === 'professor' ? '/api/professor/courses' : '/api/student/courses', courseId],
    enabled: !!user && !!courseId,
  });
  
  // Example module item data (would come from API)
  const moduleItem = {
    id: itemId,
    title: 'Study Guide 03 - Moral Reasoning (with video)',
    moduleTitle: '02 - Moral Reasoning',
    type: 'video',
    content: 'This is a placeholder for the embedded video content.',
    sources: [
      { title: 'Chapter 15 - Leadership Ethics', page: 267 },
      { title: 'Moral Vignettes', page: 3 }
    ]
  };
  
  // Handle source click from chatbot
  const handleSourceClick = (source: { title: string; page?: number }) => {
    console.log('Navigate to source:', source);
    // In a real app, this would scroll to or highlight the source
  };
  
  if (!courseId || !moduleId || !itemId || !user) return null;
  
  const breadcrumbs = [
    {
      label: 'Dashboard',
      path: user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard'
    },
    {
      label: course?.name || 'Course',
      path: `/courses/${courseId}`
    },
    {
      label: 'Modules',
      path: `/courses/${courseId}/modules`
    }
  ];
  
  return (
    <CanvasLayout 
      title={moduleItem.title}
      breadcrumbs={breadcrumbs}
    >
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Main Content Area - 65% width when chat is open */}
        <div className={`${isChatCollapsed ? 'w-full' : 'w-full lg:w-2/3'} h-full transition-all duration-300 pr-0 lg:pr-4`}>
          {/* Content Header */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-t-lg p-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-neutral-800 dark:text-white">
                {moduleItem.title}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                From: {moduleItem.moduleTitle}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          
          {/* Content Viewer */}
          <div className="bg-white dark:bg-neutral-800 border-x border-b border-neutral-200 dark:border-neutral-700 rounded-b-lg p-6 h-[calc(100%-5rem)] overflow-auto">
            {/* Placeholder for PDF/Video content */}
            <div className="aspect-video bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center mb-6">
              <p className="text-neutral-500 dark:text-neutral-400">Video player would be embedded here</p>
            </div>
            
            {/* Text content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h1>Moral Reasoning in Leadership</h1>
              <p>
                This module explores the ethical dimensions of leadership and the frameworks leaders use to make moral decisions in complex situations. We'll examine several case studies and apply different ethical frameworks to analyze them.
              </p>
              <h2>Key Topics</h2>
              <ul>
                <li>Ethical frameworks: consequentialism, deontology, and virtue ethics</li>
                <li>Moral dilemmas in organizational settings</li>
                <li>Cultural and contextual factors in ethical decision-making</li>
                <li>Personal values vs. organizational demands</li>
              </ul>
              <h2>Learning Objectives</h2>
              <p>After completing this module, you will be able to:</p>
              <ol>
                <li>Identify ethical issues in leadership scenarios</li>
                <li>Apply different ethical frameworks to analyze moral dilemmas</li>
                <li>Develop a personal approach to ethical decision-making</li>
                <li>Articulate the relationship between leadership ethics and organizational culture</li>
              </ol>
            </div>
          </div>
          
          {/* Navigation Footer */}
          <div className="mt-4 flex justify-between">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button variant="outline" onClick={() => setLocation(`/courses/${courseId}/modules`)}>
              <List className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
            <Button variant="outline">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Chat Area - 35% width */}
        <div className={`fixed right-0 top-16 bottom-0 w-full lg:w-1/3 transition-all duration-300 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 z-20 lg:z-0 ${
          isChatCollapsed ? 'translate-x-full lg:translate-x-[calc(100%-3rem)]' : 'translate-x-0'
        }`}>
          <ChatBot 
            moduleTitle={moduleItem.moduleTitle}
            moduleId={moduleId}
            onSourceClick={handleSourceClick}
            collapsed={isChatCollapsed}
            onCollapseChange={setIsChatCollapsed}
          />
        </div>
      </div>
    </CanvasLayout>
  );
};

export default ModuleDetail;