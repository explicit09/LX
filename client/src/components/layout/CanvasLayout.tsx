import React from 'react';
import SidebarNav from './SidebarNav';
import TopNav from './TopNav';

interface CanvasLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    path: string;
  }>;
  rightSidebar?: React.ReactNode;
}

const CanvasLayout: React.FC<CanvasLayoutProps> = ({ 
  children, 
  title = 'Dashboard',
  breadcrumbs = [],
  rightSidebar
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Sidebar Navigation */}
      <SidebarNav />
      
      {/* Top Navigation */}
      <TopNav title={title} breadcrumbs={breadcrumbs} />
      
      {/* Main Content */}
      <div className={`pt-16 ${rightSidebar ? 'md:mr-80' : ''} ml-16 md:ml-64`}>
        <main className="p-4 md:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      
      {/* Right Sidebar (optional) */}
      {rightSidebar && (
        <aside className="fixed top-16 right-0 w-full md:w-80 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-[calc(100vh-4rem)] p-4 overflow-auto hidden md:block">
          {rightSidebar}
        </aside>
      )}
    </div>
  );
};

export default CanvasLayout;