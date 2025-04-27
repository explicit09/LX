import React, { ReactNode } from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface CanvasLayoutProps {
  title: string;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  rightSidebar?: ReactNode;
}

const CanvasLayout: React.FC<CanvasLayoutProps> = ({
  title,
  children,
  breadcrumbs,
  rightSidebar
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              <Link href="/">
                <a className="flex items-center hover:text-neutral-800 dark:hover:text-white">
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Home
                </a>
              </Link>
              
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="h-3.5 w-3.5 mx-2" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-neutral-800 dark:text-white font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.path}>
                      <a className="hover:text-neutral-800 dark:hover:text-white">
                        {crumb.label}
                      </a>
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          
          {/* Page Title */}
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">
            {title}
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className={`flex-1 p-4 md:p-6 ${rightSidebar ? 'lg:mr-80' : ''}`}>
          <div className="max-w-screen-xl mx-auto">
            {children}
          </div>
        </div>
        
        {/* Right Sidebar */}
        {rightSidebar && (
          <div className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 overflow-y-auto p-4">
            {rightSidebar}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasLayout;