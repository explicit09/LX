import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { Loader2, ArrowLeft, Book, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatBot from '@/components/course/ChatBot';
import { useToast } from '@/hooks/use-toast';

// Sample module data (use real API in production)
const SAMPLE_MODULE = {
  id: 1,
  title: 'Leadership Ethics',
  description: 'Understanding ethical frameworks for leadership decision making',
  content: `
  # Leadership Ethics
  
  Ethics are essential to leadership because leaders have power over others, setting the moral tone of an organization. As a leader, your decisions impact many people, and ethical behavior builds trust, credibility, and a positive workplace culture.
  
  ## Key Ethical Frameworks
  
  1. **Consequentialism**: Evaluates actions based on outcomes or consequences. 
  2. **Duty Ethics (Deontology)**: Focuses on following moral rules regardless of consequences.
  3. **Virtue Ethics**: Emphasizes developing good character traits.
  
  ## Ethical Decision Making Process
  
  1. Identify the ethical issue
  2. Consider all stakeholders affected
  3. Evaluate using multiple ethical frameworks
  4. Decide and take action
  5. Reflect and learn
  
  ## Case Studies
  
  Review the reading material for several real-world case studies that demonstrate ethical dilemmas in leadership contexts.
  `,
  type: 'reading' as const,
  instructor: 'Dr. Jane Smith',
  files: [
    { id: 1, name: 'Leadership Ethics Reading.pdf', type: 'pdf' },
    { id: 2, name: 'Case Studies.pdf', type: 'pdf' }
  ],
  items: [
    {
      id: 1, 
      title: 'Understanding Ethical Frameworks', 
      type: 'reading',
      status: 'completed' as const
    },
    {
      id: 2,
      title: 'Case Study Analysis',
      type: 'reading',
      status: 'not-started' as const
    }
  ]
};

export default function ModuleDetail() {
  const [match, params] = useRoute('/courses/:courseId/modules/:moduleId/items/:itemId');
  const [activeTab, setActiveTab] = useState<string>('content');
  const [chatBotCollapsed, setChatBotCollapsed] = useState<boolean>(false);
  const { toast } = useToast();
  
  // This would normally be fetched from an API
  const module = SAMPLE_MODULE;
  
  // Handle source click from the chatbot (would normally open the PDF viewer)
  const handleSourceClick = (source: { title: string; page?: number }) => {
    toast({
      title: 'Source clicked',
      description: `Opening ${source.title}${source.page ? ` at page ${source.page}` : ''}`
    });
  };
  
  // Display loading state while fetching
  if (!match || !module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  // Get the icon for the item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'quiz': return <FileText className="h-5 w-5" />;
      case 'assignment': return <FileText className="h-5 w-5" />;
      case 'reading':
      default: return <Book className="h-5 w-5" />;
    }
  };
  
  const { courseId, moduleId, itemId } = params;
  
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Module Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="mr-1" asChild>
                <a href={`/courses/${courseId}/modules`}>
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </Button>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                Module {moduleId}
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-1">{module.title}</h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm mt-1">
              {module.description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              onClick={() => setChatBotCollapsed(!chatBotCollapsed)}
            >
              {chatBotCollapsed ? 'Expand AI Tutor' : 'Collapse AI Tutor'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* Left side - Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="min-h-[50vh]">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br />').replace(/^##? (.*?)$/gm, '<h3>$1</h3>') }} />
              </div>
            </TabsContent>
            
            <TabsContent value="files">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Materials</h3>
                <div className="grid gap-3">
                  {module.files.map(file => (
                    <div key={file.id} className="flex items-center p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <div className="mr-3 text-blue-500">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {file.type.toUpperCase()} document
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - ChatBot */}
        <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-700">
          <ChatBot 
            moduleTitle={module.title}
            moduleId={parseInt(moduleId as string)}
            onSourceClick={handleSourceClick}
            collapsed={chatBotCollapsed}
            onCollapseChange={setChatBotCollapsed}
          />
        </div>
      </div>
    </div>
  );
}
