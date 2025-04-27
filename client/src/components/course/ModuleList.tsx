import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  BookOpen, 
  CheckCircle,
  PlayCircle,
  Download,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Module types
interface ModuleItem {
  id: number;
  title: string;
  type: 'reading' | 'video' | 'assignment' | 'quiz';
  status?: 'completed' | 'in-progress' | 'not-started';
  dueDate?: string;
  points?: number;
}

interface Module {
  id: number;
  title: string;
  expanded?: boolean;
  prerequisites?: string[];
  sections: {
    title: string;
    items: ModuleItem[];
  }[];
}

interface ModuleListProps {
  modules: Module[];
  courseId: number;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, courseId }) => {
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>(
    modules.reduce((acc, module) => ({ ...acc, [module.id]: module.expanded || false }), {})
  );
  
  // Toggle module expansion
  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  // Expand all modules
  const expandAll = () => {
    const allExpanded = modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {});
    setExpandedModules(allExpanded);
  };
  
  // Collapse all modules
  const collapseAll = () => {
    const allCollapsed = modules.reduce((acc, module) => ({ ...acc, [module.id]: false }), {});
    setExpandedModules(allCollapsed);
  };
  
  // Helper function to get icon for item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'video':
        return <PlayCircle className="h-4 w-4 text-red-500" />;
      case 'assignment':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Helper function to get status icon
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <div className="w-4" />; // Empty placeholder for alignment
    }
  };
  
  return (
    <div>
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <CheckCircle className="h-4 w-4 mr-2" />
          Complete All Items
        </Button>
      </div>
      
      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            {/* Module Header */}
            <div 
              className="bg-neutral-50 dark:bg-neutral-800 p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex items-center">
                {expandedModules[module.id] ? (
                  <ChevronDown className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-neutral-500 dark:text-neutral-400 mr-2" />
                )}
                <h3 className="font-medium text-neutral-800 dark:text-white">{module.title}</h3>
                
                {/* Prerequisites badge */}
                {module.prerequisites && module.prerequisites.length > 0 && (
                  <div className="ml-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs py-0.5 px-2 rounded">
                    Prerequisites: {module.prerequisites.join(', ')}
                  </div>
                )}
              </div>
            </div>
            
            {/* Module Content */}
            {expandedModules[module.id] && (
              <div className="p-4 bg-white dark:bg-neutral-900">
                {module.sections.map((section, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <h4 className="font-medium text-sm text-neutral-700 dark:text-neutral-300 mb-3">{section.title}</h4>
                    
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <Link key={item.id} href={`/courses/${courseId}/modules/${module.id}/items/${item.id}`}>
                          <a className="flex items-center p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                            {/* Type Icon */}
                            <div className="mr-3">
                              {getItemIcon(item.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <span className="font-medium text-sm text-neutral-800 dark:text-white mr-2 truncate">
                                  {item.title}
                                </span>
                                
                                {/* Points */}
                                {item.points && (
                                  <span className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 py-0.5 px-2 rounded-full">
                                    {item.points} pts
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Status & Due Date */}
                            <div className="flex items-center ml-2">
                              {item.dueDate && (
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 mr-3">
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </div>
                              )}
                              {getStatusIcon(item.status)}
                            </div>
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;